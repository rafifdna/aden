---
title:  The Magic Nebula Mesh VPN
published: 2025-01-07
description: Simple guide how to implement Nebula
tags: [VPN, ]
category: Guide
draft: false
---

# Overview

Nebula is an overlay networking tool designed to be fast, secure, and scalable. Connect any number of hosts with on-demand, encrypted tunnels that work across any IP networks and without opening firewall ports.

::github{repo="slackhq/nebula"}

## Steps

Here are the simple steps how to use Nebula :

:::important
You need Install the Nebula Binary before start the configuration
:::

- Install Nebula Binary [Here](https://github.com/slackhq/nebula)

- Create Lighthouse and Host Client file

```
# Create a directory
mkdir -p /etc/nebula 
cd /etc/nebula
nano lighthouse.yaml
nano host.yaml
```

- Refer to the sample configuration ligthouse.yaml below

```
pki:
  ca: /etc/nebula/certs/ca.crt
  cert: /etc/nebula/certs/lighthouse.crt
  key: /etc/nebula/certs/lighthouse.key

static_host_map:
  "10.10.0.1": ["example.elb.ap-southeast-3.amazonaws.com:808"]

lighthouse:
  am_lighthouse: true
  interval: 60

listen:
  host: "::"
  port: 808

tun:
  dev: nebula1
  drop_local_broadcast: false
  drop_multicast: false
  tx_queue: 500
  mtu: 1300

routes:
  - prefix: "172.25.0.0/24"
    via: "10.10.0.1"
  - prefix: "172.25.0.0/16"
    via: "10.10.0.1"

firewall:
  conntrack:
    tcp_timeout: 12h
    udp_timeout: 3m
    default_timeout: 10m
  
  outbound:
    - port: any
      proto: any
      host: any
  
  inbound:
    - port: any
      proto: any
      host: any
```

- Refer to the sample configuration host.yaml below

```
Host/Client Configuration => this configuration are in host.yaml
pki:
  ca: /etc/nebula/certs/ca.crt
  cert: /etc/nebula/certs/client.crt
  key: /etc/nebula/certs/client.key

static_host_map:
  "10.10.0.1": ["example.elb.ap-southeast-3.amazonaws.com:808"]

lighthouse:
  am_lighthouse: false
  interval: 60
  hosts:
    - "10.10.0.1"

listen:
  host: "::"
  port: 808

tun:
  dev: nebula1
  drop_local_broadcast: false
  drop_multicast: false
  tx_queue: 500
  mtu: 1300

routes:
  - prefix: "172.25.0.0/24"
    via: "10.10.0.1"
  - prefix: "172.25.0.0/16"
    via: "10.10.0.1"

firewall:
  conntrack:
    tcp_timeout: 12h
    udp_timeout: 3m
    default_timeout: 10m
  
  outbound:
    - port: any
      proto: any
      host: any
  
  inbound:
    - port: any
      proto: any
      host: any
```

- Configure Certificate

```
# Create a directory to store certificates 
mkdir -p /etc/nebula/certs 
cd /etc/nebula/certs
 ```

- Generate CA Certificate

 ```
# Generate CA certificate 
nebula-cert ca -name "Your-Organization-Name"
```

:::note
1. Each command creates :
    
    ca.key (keep this secure and private)
    
    ca.crt (will be distributed to all nodes)
:::

- Sign Lighthouse Certificate

```
# Generate Lighthouse certificate:
nebula-cert sign -name "lighthouse" -ip "10.10.0.1/24"
```

:::note
1. Each command creates :

    lighthouse.crt

    lighthouse.key
:::

- Sign Host/Client Certificate

```
# Client 1 
nebula-cert sign -name "client1" -ip "10.10.0.2/24"
 ```

 ```
# Client 2 
nebula-cert sign -name "client2" -ip "10.10.0.3/24"
```

:::note
1. Each command creates :
    
    client1.crt and client1.key

    client2.crt and client2.key

2. Important notes :

    Keep the CA key (ca.key) secure - it can generate new certificates

3. Each node needs :

    Its own .crt and .key files

    A copy of ca.crt

    The IP must be unique within your nebula network

    Use a consistent IP scheme (e.g., 10.10.0.x/24)
:::


- Running Nebula​

With the configuration, certificate, and key files created, the last step is copying the appropriate files to each host and starting your Nebula network.

:::note
- Lighthouse​

    1.  Copy the lighthouse.yaml, ca.crt, lighthouse.crt, and lighthouse.key to your lighthouse. DO NOT COPY ca.key TO YOUR LIGHTHOUSE.

    2. SSH to your lighthouse.

    3. Create a directory named /etc/nebula on your lighthouse host.

    ```
    mkdir /etc/nebula
    ```

    4. Move the configuration, certificates, and key into the appropriate directory.
    Note: The example configuration assumes your host certificate and key are named host.crt and host.key, so you'll need to rename some of the files when you move them to the appropriate directory.
   
    ```
    mv lighthouse.yaml /etc/nebula/lighthouse.yaml
    mv ca.crt /etc/nebula/ca.crt
    mv lighthouse.crt /etc/nebula/lighthouse.crt
    mv lighthouse.key /etc/nebula/lighthouse.key
    ```

    5. Start Nebula

    ```
    ./nebula -config /etc/nebula/lighthouse.yaml
    ```
:::

:::note
- Hosts​

    1. Copy the config.yaml, ca.crt, server.crt, and server.key to the host named server. DO NOT COPY THE ca.key FILE.

    2. SSH to the host you've named server.

    3. Create a directory named /etc/nebula on the Nebula host.

    ```
    mkdir /etc/nebula
    ```

    4. Move the configuration, certificates, and key into the appropriate directory.
    Note: The example configuration assumes your host certificate and key are named host.crt and host.key, so you'll need to rename some of the files when you move them to the appropriate directory.

    ```
    mv host.yaml /etc/nebula/host.yaml
    mv ca.crt /etc/nebula/ca.crt
    mv host.crt /etc/nebula/host.crt
    mv host.key /etc/nebula/host.key
    ```

    5. Start Nebula

    ```
    ./nebula -config /etc/nebula/host.yaml
    ```
:::