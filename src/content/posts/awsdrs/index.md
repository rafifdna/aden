---
title:  Install Replication Agent in Linux for AWS Elastic Disaster Recovery 
published: 2024-02-10
description: A simple guide how to Install Replication Agent for AWS AWS Elastic Disaster Recovery
tags: [AWS, Disaster Recovery,]
category: Guide
draft: false
---

# Overview

This document help provide guides of how to install replication agent in Linux for AWS Elastic Disaster Recovery.


## Requirement

- AWS IAM with access key id & secret key


## Steps

Here are the simple steps how to do it :

- Download the agent installer aws-replication-installer-init onto your Linux source server.

```
wget -O ./aws-replication-installer-init https://aws-elastic-disaster-recovery-<region>.s3.<region>.amazonaws.com/latest/linux/aws-replication-installer-init
```

![Image](src/content/posts/awsdrs/image01.jpeg)


- Use the following command on your source server in order to run the installation script.

```
chmod +x aws-replication-installer-init
```
```
sudo ./aws-replication-installer-init /
    --region ap-southeast-3 /
    --aws-access-key-id <ENTER-ACCESS-KEY> /
    --aws-secret-access-key <ENTER-SECRET-KEY>
```

- After installation, there will be this messages indicate the installation is successfull.

![Image](src/content/posts/awsdrs/image02.jpeg)

For more information, refer to the documentation below :)

## Reference

> - [Installing the AWS Replication Agent - AWS Elastic Disaster Recovery](https://docs.aws.amazon.com/drs/latest/userguide/agent-installation.html) 
> - [Supported operating systems - AWS Elastic Disaster Recovery](https://docs.aws.amazon.com/drs/latest/userguide/Supported-Operating-Systems.html)