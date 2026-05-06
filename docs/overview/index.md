Dubbo Inherent Mesh 是 2025 年推出的 Proxyless 模式，源自 [Istio Proxyless](https://istio.io/latest/blog/2021/proxyless-grpc/)，同属 gRPC xDS Proxyless 体系。
与原版的区别在于：xDS 接入被下沉至运行时与控制平面的注入层，从而实现对业务代码的零侵入。

## 快速入门
转到 Dubbo 发布页面，自动下载适用于您操作系统的安装文件并获取最新版本（Linux 或 macOS）：

```bash
curl -L https://dubbo.apache.org/downloadDubbo | sh -
```

转到 Dubbo 包目录：

```bash
cd dubbo-0.4.0
```

使用 default 配置文件安装 Dubbo：

```bash
dubboctl install --set profile=default
```