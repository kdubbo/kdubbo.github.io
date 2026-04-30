> 目前处于初步设计阶段。后续标准功能会逐步完善和支持。

Dubbo Inherent Mesh 是 2025 年推出的 Proxyless 模式。参考 [Istio Proxyless](https://istio.io/latest/blog/2021/proxyless-grpc/) 博客，
概念同属 gRPC xDS proxyless；区别在于原本的 xDS 将 xDS 接入下沉到运行时和控制平面的注入层，目的是业务代码零侵入，只保留部署层注入约定。

## 快速入门
转到 Dubbo 发布页面，自动下载适用于您操作系统的安装文件并获取最新版本（Linux 或 macOS）：

```bash
curl -L https://dubbo.apache.org/downloadDubbo | sh -
```

转到 Dubbo 包目录：

```bash
cd dubbo-0.3.7
```

使用 default 配置文件安装 Dubbo：

```bash
dubboctl install --set profile=default
```