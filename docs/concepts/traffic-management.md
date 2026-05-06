Dubbo 的流量路由规则以 `MeshService` 资源对象为核心，可将其理解为 Mesh 层面的 Kubernetes Service。它在服务级别提供熔断、限流、超时、重试等治理能力，支持金丝雀发布和基于流量比例的分阶段发布，并内置故障恢复机制，用于应对服务或网络异常。

## 网格服务

### hosts 字段

`hosts` 字段指定目标主机，可以是用户直接设定，也可以由路由规则决定，代表客户端发请求时使用的一个或多个地址。主机名可以是 IP 地址、DNS 名称，或平台相关的简称（例如 Kubernetes 服务的短名称），无论哪种形式，最终都会隐式或显式地解析为一个完全限定域名（FQDN）。也可以使用通配符（*）前缀，匹配一批服务并统一设置路由规则。

`hosts` 字段不必是 Dubbo 服务注册表中的真实条目，它只是虚拟的目标地址，因此也可以用来定义不在网格内部的虚拟主机。
```yaml
apiVersion: networking.dubbo.apache.org/v1alpha3
kind: MeshService
metadata:
  name: foo-service-routing
  namespace: default
spec:
  hosts:
    - foo.default.svc.cluster.local
  routes:
  - service:
      - name: foo-1
        host: foo.default.svc.cluster.local
        port:
          number: 9080
```

### match 字段
敬请期待

### trafficPolicy 字段
<details>
  <summary>服务级别</summary>
```yaml

```
</details>
<details>
  <summary>全局级别</summary>
```yaml

```
</details>


### 负载均衡
敬请期待

### 超时
敬请期待

### 重试
敬请期待

### 限流
敬请期待

### 熔断器
敬请期待

### 故障注入
敬请期待

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


