# 版本更新

## 0.3.6

发布日期：2026-03-21

移除 Envoy go-control-plane 依赖，改用 xDS API（控制面向数据面下发服务发现和路由配置的接口），降低控制面实现耦合。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.6)

## 0.3.5

发布日期：2026-02-11

修复流量网关请求中的 502 错误，提升入口流量路径稳定性。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.5)

## 0.3.4

发布日期：2026-02-03

清理冗余代码逻辑，压缩控制面维护成本。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.4)

## 0.3.3

发布日期：2026-01-24

迁移 Zookeeper、Nacos 和 Admin Helm Chart（Helm 安装包定义）到目标仓库，整理组件归属。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.3)

## 0.3.2

发布日期：2026-01-19

将 Istio API 库替换为 Dubbo API 库，推进控制面 API 归一化。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.2)

## 0.3.1

发布日期：2025-12-21

dubbo-agent 增加基于 Gateway API（Kubernetes 标准入口流量 API）的南北向流量支持。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.1)

## 0.3.0

发布日期：2025-12-01

新增 Dubbo daemon，为后续控制面运行时能力打底。

[查看 GitHub Release](https://github.com/apache/dubbo-kubernetes/releases/tag/0.3.0)
