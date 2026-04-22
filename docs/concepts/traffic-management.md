> 当前处于设计阶段
## 虚拟拓扑

**虚拟拓扑**是用于定义微服务集群物理与逻辑边界的分级模型。从宏观到微观的四层维度，描述服务在分布式系统中的空间位置，为流量路由、近端访问及容灾调度提供决策依据，从一个大的范围逐渐缩小范围定位具体的服务，有以下四个字段：

- `region` 代表最高层级的地理区域（如 cn-hangzhou）。主要用于跨地域的流量分发与容灾策略。
- `zone` 代表地域内的独立基础设施（如可用区 A/B）。通过将流量限制在同一可用区内，可有效降低网络延迟并提升可用性。
- `cluster` 在多集群（Multi-cluster）架构中定义的逻辑边界。用于区分不同的 Kubernetes 集群或 Dubbo 逻辑集群。
- `node` 最细粒度的计算单元。指代具体的物理机或虚拟机，是服务的最终承载点。

```yaml
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: VitrualTopology 
metadata:
  name: topology-defaults
spec:
  sources:
    region:
    - key: topology.kubernetes.io/region
      from: node.label
    zone:
    - key: topology.kubernetes.io/zone
      from: node.label
    cluster:
    - key: topology.remote.dubbo.apache.org/cluster
      from: node.label
    node:
    - from: node.name
```

## 虚拟路由

```yaml
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: VirtualRoute
metadata:
  name: order-service-routing
  namespace: default
spec:
  targetRef:
    kind: Service
    name: order-service
    port: 8080
  topologyRef:
    Kind: VitrualTopology
    name: topology-defaults
  # TODO route
  fallback:
  - topology:
      region: ["cn-hangzhou","cn-beijing"]
  - topology:
      zone: 
      - same
      - vip
  - topology:
      global: true
```


## 网关

```yaml
apiVersion: gateway.networking.k8s.io/v1
kind: HTTPRoute
metadata:
  name: order-gateway-route
spec:
  parentRefs:
    - kind: Gateway
      name: main-gateway
  rules:
    - matches:
        - path:
            type: PathPrefix
            value: /api/v1
      filters:
        - type: RequestHeaderModifier
          requestHeaderModifier:
            add:
              - name: x-traffic-class
                value: api-v1
      backendRefs:
        - name: order-service
          port: 8080
```

## 流量策略

###  负载均衡
```yaml
trafficPolicy:
  loadBalancer:
  algorithm: CONSISTENT_HASH
  consistentHash:
    hashOn:
      header: x-user-id
    minimumRingSize: 1024
```

## 流量弹性与测试

### 超时
```yaml
timeout: 30s
```

### 重试
```yaml
retry:
  maxRetries: 3
  retryOn: 
  - connect-failure
  - refused-stream
  - 502
  - 503
  - 504
  perRetryTimeout: 8s
  backoff:
    baseInterval: 500ms
    maxInterval: 10s
```

### 断路器
```yaml
circuitBreaker:
  maxConnections: 512
  maxPendingRequests: 256
```
```
