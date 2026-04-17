
## 客户端

引入 xds 包：
```go
// Importing resolver registers the xds:/// scheme, the xds_weighted balancer,
	// and automatic per-connection mTLS via xDS CDS — zero TLS code in the app.
	_ "github.com/kdubbo/xds-api/grpc/xds"
```

Dial 使用 `xds:/// scheme：`
```go
// conn, err := grpc.DialContext(ctx, "xds:///foo.ns.svc.cluster.local:7070")
conn, dialErr := grpc.DialContext(dialCtx, req.Url)
```

```go
	// DialOptions() injects the xDS transport credentials transparently.
xdscreds "github.com/kdubbo/xds-api/grpc/xds/credentials"

creds, err := xdscreds.NewClientCredentials(xds.ClientOptions{FallbackCreds: insecure.NewCredentials()})
// handle err
// conn, dialErr := grpc.DialContext(ctx, "xds:///foo.ns.svc.cluster.local:7070", grpc.WithTransportCredentials(creds))
conn, dialErr := grpc.DialContext(ctx, req.Url, grpc.WithTransportCredentials(creds))
```



## 服务器端
用 xDS 管理的 Server：
```
srv := xdscreds.NewGRPCServer()
RegisterFooServer(srv, &fooServerImpl)
```

通过 protoc 生成的 Go 代码已过期，可能需要重新生成来与 xDS 服务器兼容。
```go
func RegisterFooServer(s grpc.ServiceRegistrar, srv FooServer) {
    s.RegisterService(&FooServer_ServiceDesc, srv)
}
```

启用安全支持
```go
creds, err := xds.NewServerCredentials(xdscreds.ServerOptions{FallbackCreds: insecure.NewCredentials()})
// handle err
server = xds.NewGRPCServer(grpc.Creds(creds))
```