> This project is in the early design and experimental phase. Standard capabilities will continue to be refined and supported.

# Introduction
Dubbo Inherent Mesh is a proxyless model introduced in 2025. In this model, the control plane sends policies directly to gRPC services through xDS, enabling direct communication with gRPC services.

The Dubbo agent initializes communication with the control plane. The agent does not receive application traffic as a data-plane proxy; it retrieves and rotates the certificates used by data-plane traffic.

## Architecture Overview

<p align="center">
  <img src="../static/architecture.svg" width="400">
</p>

## Quick Start
Go to the Dubbo release page, download the installation package for your operating system, and get the latest version for Linux or macOS:

```bash
curl -L https://dubbo.apache.org/downloadDubbo | sh -
```

Go to the Dubbo package directory:

```bash
cd dubbo-0.3.6
```

Install Dubbo with the default profile:

```bash
dubboctl install --set profile=default
```
