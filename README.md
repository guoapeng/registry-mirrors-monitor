# 国内 docker registry 镜像状态监测

## 测试国内 docker registry 镜像 | 测试结果请到 Actions 标签详情页查看

通过上述几种方法，我们可以全面地测试 Docker Hub 镜像源的速度，选择最优的镜像源，以显著提升镜像拉取速度和开发效率。无论是直接拉取镜像、使用 curl 或 wget 测试响应时间和下载速度，还是编写脚本进行多次测试，这些方法都能帮助你做出最明智的选择

## 开发指南

本地测试

```bash

node test_registries.js

```
