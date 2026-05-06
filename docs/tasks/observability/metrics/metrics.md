# 指标

## 部署服务
```bash
kubectl apply -f samples/addons
```

## 启动 Grafana
```bash
kubectl -n dubbo-system port-forward svc/grafana 3000:3000
```
浏览器打开 `http://127.0.0.1:3000`，进入 `Dubbo / Dubbo control plane Observability` 仪表盘。

## 启动 Prometheus
```bash
kubectl -n dubbo-system port-forward svc/prometheus 9090:9090
```

## 清理
```bash
kubectl delete -f samples/addons
```