# 双向 TLS

本示例说明如何让 xDS-aware gRPC 进程通过 Dubbo 控制面获得 mTLS 安全能力。xDS 是控制面向数据面下发服务发现、路由和安全策略的协议；业务进程只接入 xDS 运行时，不在业务代码里手写证书加载、TLS 握手和策略切换。

## 前提条件

1. 已安装 Dubbo 控制平面的 Kubernetes 集群
2. 已配置 `kubectl` 访问集群
3. 已安装 `MeshService` 和 `PeerAuthentication` CRD
4. 服务进程使用 `github.com/kdubbo/xds-api` 的 xDS gRPC 运行时

## 应用接入方式

服务端使用 xDS 托管的 gRPC Server。`PeerAuthentication` 切到 `STRICT` 后，Server 会根据 xDS 入站 listener 切换到 mTLS。

```go
package main

import (
	"log"

	xdsserver "github.com/kdubbo/xds-api/grpc/server"
)

func main() {
	server := xdsserver.NewGRPCServer("0.0.0.0:17070", "")
	// pb.RegisterEchoTestServiceServer(server, &echoServer{})
	if err := server.Serve(); err != nil {
		log.Fatal(err)
	}
}
```

客户端使用 xDS target 发起调用。`MeshService` 下发 `DUBBO_MUTUAL` 后，Dial 会从 xDS CDS 中读取 `UpstreamTlsContext`，并通过注入的 bootstrap 证书完成 mTLS。

```go
package client

import (
	"context"

	xdsserver "github.com/kdubbo/xds-api/grpc/server"
)

func dial(ctx context.Context) error {
	conn, err := xdsserver.DialContext(ctx, "xds:///provider.grpc-app.svc.cluster.local:17070")
	if err != nil {
		return err
	}
	defer conn.Close()
	return nil
}
```

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
- `GRPC_XDS_EXPERIMENTAL_SECURITY_SUPPORT`
- `DUBBO_GRPC_XDS_CREDENTIALS`
- `/etc/dubbo/proxy` 证书挂载

## 下发 mTLS 策略

`MeshService` 负责客户端出站 TLS 策略，`PeerAuthentication` 负责服务端入站 mTLS 策略。两者同时存在后，客户端和服务端都由 xDS 配置驱动。

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

确认客户端进程已经连接 xDS，并且请求仍然成功：

```bash
kubectl -n grpc-app logs deploy/consumer
```

确认控制面已经生成安全 xDS 配置：

- CDS 中的目标 cluster 带 `UpstreamTlsContext`
- LDS 中的入站 listener 带 `DownstreamTlsContext`
- `DownstreamTlsContext.requireClientCertificate=true`

只有 xDS-aware gRPC 进程可以验证这条安全链路。普通 HTTP 示例或只订阅 ADS 的调试客户端只能验证路由配置，不能证明实际 mTLS 握手。

## 清理

```bash
kubectl -n grpc-app delete meshservice provider-mtls --ignore-not-found=true
kubectl -n grpc-app delete peerauthentication grpc-app-strict-mtls --ignore-not-found=true
kubectl delete ns grpc-app
```
