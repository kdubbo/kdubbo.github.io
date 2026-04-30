# 流量切分
本示例演示如何使用应用程序进行流量切分。

## 前提条件

1. 已安装 Dubbo 控制平面的 Kubernetes 集群
2. 已配置 kubectl 以访问集群

## 部署

### 1. 创建命名空间

```bash
kubectl create ns app
kubectl label namespace app dubbo-injection=enabled
```

### 2. 部署服务

```bash
kubectl apply -f grpc-app.yaml
```

### 3. 测试服务

```bash
kubectl port-forward -n grpc-app $(kubectl get pod -l app=consumer -n grpc-app -o jsonpath='{.items[0].metadata.name}') 17171:17171
```

```bash
grpcurl -plaintext -d '{"url": "xds:///provider.grpc-app.svc.cluster.local:7070","count": 5}' localhost:17171 echo.EchoTestService/ForwardEcho
```

```json
{
  "output": [
    "[0 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070",
    "[1 body] Hostname=provider-v1-fbb7b9bd9-l8frj ServiceVersion=v1 Namespace=grpc-app IP=192.168.219.119 ServicePort=17070",
    "[2 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070",
    "[3 body] Hostname=provider-v1-fbb7b9bd9-l8frj ServiceVersion=v1 Namespace=grpc-app IP=192.168.219.119 ServicePort=17070",
    "[4 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070"
  ]
}
```

### 使用目标规则创建子集

首先，为工作负载的每个版本创建一个子集，以启用流量拆分：

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: DestinationRule
metadata:
  name: provider-versions
  namespace: grpc-app
spec:
  host: provider.grpc-app.svc.cluster.local
  subsets:
  - name: v1
    labels:
      version: v1
  - name: v2
    labels:
      version: v2
EOF
```

### 流量切分

利用上述定义的子集，您可以将不同权重的流量分配到不同的版本。以下示例将 10% 的流量分配到 v1，90% 的流量分配到 v2：

```bash
cat <<EOF | kubectl apply -f -
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: VirtualService
metadata:
  name: provider-weights
  namespace: grpc-app
spec:
  hosts:
  - provider.grpc-app.svc.cluster.local
  http:
  - route:
    - destination:
        host: provider.grpc-app.svc.cluster.local
        subset: v1
      weight: 10
    - destination:
        host: provider.grpc-app.svc.cluster.local
        subset: v2
      weight: 90
EOF
```

现在，发送一组 5 个请求来验证流量分布情况：

```bash
grpcurl -plaintext -d '{"url": "xds:///provider.grpc-app.svc.cluster.local:7070","count": 5}' localhost:17171 echo.EchoTestService/ForwardEcho
```

响应应主要包含 v2 响应，以体现加权流量拆分：
```json
{
  "output": [
    "[0 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070",
    "[1 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070",
    "[2 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070",
    "[3 body] Hostname=provider-v1-fbb7b9bd9-l8frj ServiceVersion=v1 Namespace=grpc-app IP=192.168.219.119 ServicePort=17070",
    "[4 body] Hostname=provider-v2-594b6977c8-5gw2z ServiceVersion=v2 Namespace=grpc-app IP=192.168.219.88 ServicePort=17070"
  ]
}
```

## 清理

```bash
kubectl delete -f grpc-app.yaml
kubectl delete ns grpc-app
```
