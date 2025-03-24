---
title:  Monitoring with Grafana using Prometheus
published: 2024-11-15
description: Simple guide to implement Grafana Monitoring using Prometheus with Node Exporter Integration
tags: [Monitoring, ]
category: Guide
draft: false
---

# Overview

Prometheus collects and stores system metrics automatically, while Grafana creates beautiful dashboards to visualize your infrastructure's performance data. This two tools is very powerful for any monitoring inside services. Let's implement it together!

::github{repo="grafana/grafana"}

::github{repo="prometheus/prometheus"}

::github{repo="prometheus/node_exporter"}



## Steps

Here are the simple steps how to do it :

## Grafana

- Wget & Install Grafana File

> [!TIP]
> For latest guide installation, you can always refer to grafana [documentation](https://grafana.com/docs/grafana/latest/setup-grafana/start-restart-grafana/)


```
sudo apt-get install -y apt-transport-https software-properties-common wget
sudo mkdir -p /etc/apt/keyrings/
wget -q -O - https://apt.grafana.com/gpg.key | gpg --dearmor | sudo tee /etc/apt/keyrings/grafana.gpg > /dev/null
echo "deb [signed-by=/etc/apt/keyrings/grafana.gpg] https://apt.grafana.com stable main" | sudo tee -a /etc/apt/sources.list.d/grafana.list
sudo apt-get update
sudo apt-get install grafana
```
- Start your Grafana service

> [!TIP]
> Keep in mind grafana by default is using port 3000

```
sudo systemctl daemon-reload
sudo systemctl start grafana-server
sudo systemctl status grafana-server
```

Your grafana service will show running in systemctl. When running, your installation is successfull. Now, onto the next step.


## Prometheus

- Grab prometheus file

> [!TIP]
> For the latest version, you can always refer to prometheus [repo](https://github.com/prometheus/prometheus/releases)

```
sudo wget https://github.com/prometheus/prometheus/releases/download/v3.1.0/prometheus-3.1.0.linux-amd64.tar.gz
```

- Unpack the file

```
sudo tar vxf prometheus*.tar.gz
```

- Add new user for prometheus

```
sudo groupadd --system prometheus
sudo useradd -s /sbin/nologin --system -g prometheus prometheus
```

- Add new directory for prometheus

```
sudo mkdir /etc/prometheus
sudo mkdir /var/lib/prometheus
cd prometheus*/
```

- Add new directory for prometheus

```
sudo mv prometheus /usr/local/bin
sudo mv promtool /usr/local/bin
sudo mv console* /etc/prometheus
sudo mv prometheus.yml /etc/prometheus
```

- Change the ownerships

```
sudo chown prometheus:prometheus /usr/local/bin/prometheus
sudo chown prometheus:prometheus /usr/local/bin/promtool
sudo chown prometheus:prometheus /etc/prometheus
sudo chown -R prometheus:prometheus /etc/prometheus/consoles
sudo chown -R prometheus:prometheus /etc/prometheus/console_libraries
sudo chown -R prometheus:prometheus /var/lib/prometheus
```

- Edit prometheus.yml using nano

```
sudo nano /etc/prometheus/prometheus.yml
```

- Add this configuration to prometheus.yml


```
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  - job_name: 'node_exporter'
    static_configs:
      - targets: ['localhost:9100']
```

- Add systemd service for prometheus using nano

```
sudo nano /etc/systemd/system/prometheus.service
```

- Add systemd configuration below for prometheus.service

```
[Unit]
Description=Prometheus
Wants=network-online.target
After=network-online.target

[Service]
User=prometheus
Group=prometheus
Type=simple
ExecStart=/usr/local/bin/prometheus \
 --config.file /etc/prometheus/prometheus.yml \
 --storage.tsdb.path /var/lib/prometheus/ \
 --web.console.templates=/etc/prometheus/consoles \
 --web.console.libraries=/etc/prometheus/console_libraries

[Install]
WantedBy=multi-user.target
```

- Start Prometheus Service

```
sudo systemctl daemon-reload
sudo systemctl enable prometheus
sudo systemctl start prometheus
sudo systemctl status prometheus
```


## Node Exporter

Node Exporter is part of Prometheus. It use for export machine metrics such as CPU, Memory, Disk, and more.

- Execute this command

```
sudo wget https://github.com/prometheus/node_exporter/releases/download/v1.8.2/node_exporter-1.8.2.linux-amd64.tar.gz
sudo tar xzf node_exporter-1.8.2.linux-amd64.tar.gz
sudo rm -rf node_exporter-1.8.2.linux-amd64.tar.gz
sudo mv node_exporter-1.8.2.linux-amd64 /etc/node_exporter
```

- Create systemd service for node exporter

```
sudo nano /etc/systemd/system/node_exporter.service
```

- Add this config to node_exporter.service

```
[Unit]
Description=Node Exporter
Wants=network-online.target
After=network-online.target

[Service]
ExecStart=/etc/node_exporter/node_exporter
Restart=always

[Install]
WantedBy=multi-user.target
```

- Start Node Exporter service

```
sudo systemctl daemon-reload
sudo systemctl enable node_exporter
sudo systemctl restart node_exporter
sudo systemctl status node_exporter
```

## Just Last Step

- For the next step, just make sure you pointing the prometheus service inside your data source grafana. Usually, it's on port 9090.
- After that, add new dashboard using new data source and here you go. You able to start monitor your system
- Enjoy!