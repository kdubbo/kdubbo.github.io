> 目前处于初步设计阶段。后续标准功能会逐步完善和支持。
## Dubbo 身份

## 认证

认证解决 "你是谁" 的问题。分两层：传输层（mTLS）和请求层（Token）。

### 对等认证

mTLS 是安全基线，全网格默认启用，逐步收紧，渐进式 mTLS 路径

- `PERMISSIVE` 没有走明文 
- `STRICT` 核心业务域强制 mTLS，未接入服务被拒绝 

```yaml
apiVersion: security.dubbo.apache.org/v1alpha3
kind: PeerAuthentication
metadata:
  name: mesh-default
  namespace: dubbo-system
spec:
  mtls:
    mode: PERMISSIVE
```

## 授权

授权解决 "你能做什么" 的问题。这是当前安全架构最大的缺口。

```

```