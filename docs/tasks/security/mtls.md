# 双向 TLS

本示例说明如何让 proxyless gRPC 工作负载通过 Dubbo 控制面获得 mTLS 安全能力。xDS 是控制面向数据面下发服务发现、路由和安全策略的协议；mTLS 由 `grpc-engine` 注入、proxyless controller 和 xDS 进程接管，不在业务代码里写证书加载、TLS 握手或策略切换。

## 前提条件

1. 已安装 Dubbo 控制平面的 Kubernetes 集群
2. 已配置 `kubectl` 访问集群
3. 已安装 `MeshService` 和 `PeerAuthentication` CRD
4. 工作负载开启 `grpc-engine` 注入模板

## 0 侵入接入方式

业务代码不需要 import `xds-api`、不需要把 Server 或 Dial 改成 xDS API。Pod 被注入后，proxyless controller 会为每个工作负载生成 Secret，里面包含：

- `/etc/dubbo/proxy/grpc-bootstrap.json`
- `/etc/dubbo/proxy/dubbo-grpc-xds.json`
- `/etc/dubbo/proxy/cert-chain.pem`
- `/etc/dubbo/proxy/key.pem`
- `/etc/dubbo/proxy/root-cert.pem`

同一个 runtime 配置文件里会带上控制面计算后的路由和安全信息。权重来自 `MeshService`，客户端出站 TLS 来自 `MeshService.trafficPolicy.tls.mode`，服务端入站 mTLS 来自 `PeerAuthentication`。

## 部署要求

Pod 所在命名空间需要开启注入：

```bash
kubectl create ns grpc-app --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace grpc-app dubbo-injection=enabled --overwrite
```

注入后，业务容器会获得 xDS 和证书配置：

- `GRPC_XDS_BOOTSTRAP`
- `XDS_ADDRESS`
- `CA_ADDRESS`
- `DUBBO_GRPC_XDS_CONFIG`
- `GRPC_XDS_EXPERIMENTAL_SECURITY_SUPPORT`
- `DUBBO_GRPC_XDS_CREDENTIALS`
- `/etc/dubbo/proxy` 证书挂载

## 下发 mTLS 策略

`MeshService` 负责客户端出站 TLS 策略，`PeerAuthentication` 负责服务端入站 mTLS 策略。两者同时存在后，客户端和服务端都由 controller 生成的 runtime config 和 xDS CDS/LDS 配置驱动。

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: MeshService
metadata:
  name: provider-mtls
  namespace: grpc-app
spec:
  hosts:
  - provider.grpc-app.svc.cluster.local
  trafficPolicy:
    tls:
      mode: DUBBO_MUTUAL
  routes:
  - service:
    - name: v1
      host: provider.grpc-app.svc.cluster.local
      labels:
        version: v1
      port:
        number: 17070
      weight: 50
    - name: v2
      host: provider.grpc-app.svc.cluster.local
      labels:
        version: v2
      port:
        number: 17070
      weight: 50
---
apiVersion: security.dubbo.apache.org/v1alpha3
kind: PeerAuthentication
metadata:
  name: grpc-app-strict-mtls
  namespace: grpc-app
spec:
  mtls:
    mode: STRICT
EOF
```

## 验证

确认注入后的 runtime config 已经包含权重和安全策略：

```bash
kubectl -n grpc-app exec deploy/consumer -- cat /etc/dubbo/proxy/dubbo-grpc-xds.json
```

关键字段应包含：

- `routes[].destinations[].weight=50`
- `routes[].destinations[].tlsMode=DUBBO_MUTUAL`
- `services[].ports[].mtlsMode=STRICT`

确认 xDS 进程已经连接控制面，并且请求仍然成功：

```bash
kubectl -n grpc-app logs deploy/consumer
```

确认控制面已经生成安全 xDS 配置：

- CDS 中的目标 cluster 带 `UpstreamTlsContext`
- LDS 中的入站 listener 带 `DownstreamTlsContext`
- `DownstreamTlsContext.requireClientCertificate=true`

只有连接 Dubbo xDS 的 proxyless gRPC 进程可以验证这条安全链路。普通 HTTP 示例只能验证连通性，不能证明实际 mTLS 握手。

## 清理

```bash
kubectl -n grpc-app delete meshservice provider-mtls --ignore-not-found=true
kubectl -n grpc-app delete peerauthentication grpc-app-strict-mtls --ignore-not-found=true
kubectl delete ns grpc-app
```
