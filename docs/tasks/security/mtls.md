# 双向 TLS

本示例演示如何通过 Pod 内的 xDS 驱动进程保证服务间通信安全。xDS 是控制面向数据面下发服务发现、路由和安全策略的协议；业务容器只接收注入的 bootstrap、证书目录和环境变量，不再手写 TLS 逻辑。

## 前提条件

1. 已安装 Dubbo 控制平面的 Kubernetes 集群
2. 已配置 `kubectl` 访问集群
3. 已安装 `MeshService` 和 `PeerAuthentication` CRD

## 部署示例

```bash
kubectl create ns app --dry-run=client -o yaml | kubectl apply -f -
kubectl label namespace app dubbo-injection=enabled --overwrite
kubectl apply -f samples/app/deployment.yaml
kubectl -n app rollout status deploy/nginx-v1 --timeout=180s
kubectl -n app rollout status deploy/nginx-v2 --timeout=180s
kubectl -n app rollout status deploy/nginx-consumer --timeout=180s
```

`dubbo-injection=enabled` 会注入 xDS 运行所需配置。`nginx-consumer` 使用 `kdubbo/dubbod` 镜像时会启动 `xclient --watch`，并持续保持 xDS stream。

关键注入内容：

- `GRPC_XDS_BOOTSTRAP`
- `XDS_ADDRESS`
- `CA_ADDRESS`
- `GRPC_XDS_EXPERIMENTAL_SECURITY_SUPPORT`
- `DUBBO_GRPC_XDS_CREDENTIALS`
- `/etc/dubbo/proxy` 证书挂载

## 开启 mTLS

`MeshService` 负责把出站路由和客户端 TLS 策略下发给 xDS 进程，`PeerAuthentication` 负责把服务端入站监听器切到严格 mTLS。两者同时存在后，客户端和服务端都由 xDS 配置驱动，不需要改业务代码。

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: MeshService
metadata:
  name: nginx-mtls
  namespace: app
spec:
  hosts:
  - nginx.app.svc.cluster.local
  trafficPolicy:
    tls:
      mode: DUBBO_MUTUAL
  routes:
  - service:
    - name: v1
      host: nginx.app.svc.cluster.local
      labels:
        version: v1
      port:
        number: 80
      weight: 50
    - name: v2
      host: nginx.app.svc.cluster.local
      labels:
        version: v2
      port:
        number: 80
      weight: 50
---
apiVersion: security.dubbo.apache.org/v1alpha3
kind: PeerAuthentication
metadata:
  name: app-strict-mtls
  namespace: app
spec:
  mtls:
    mode: STRICT
EOF
```

## 验证

查看消费者是否已经连接 xDS：

```bash
kubectl -n app logs deploy/nginx-consumer
```

日志中应能看到 `xclient` 输出目标服务和端点信息。发起请求：

```bash
kubectl -n app exec deploy/nginx-consumer -- dubbod xclient 20 | sort | uniq -c
```

请求成功说明策略已经通过 xDS 生效：出站集群使用 `DUBBO_MUTUAL`，入站监听器使用 `STRICT` mTLS 并验证客户端证书。

## 清理

```bash
kubectl -n app delete meshservice nginx-mtls --ignore-not-found=true
kubectl -n app delete peerauthentication app-strict-mtls --ignore-not-found=true
kubectl delete -f samples/app/deployment.yaml --ignore-not-found=true
kubectl delete ns app
```
