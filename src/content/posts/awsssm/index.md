---
title: Starting AWS Session Manager in AWS CLI
published: 2023-11-27
description: A simple guide how to elevate the use of AWS SSM in AWS CLI
tags: [AWS, SSH, ]
category: Guide
draft: false
---

# Overview

This is simple guide how to connect AWS SSM via AWS CLI using specific user.

::github{repo="aws/aws-cli"}

## Steps

Here are the simple steps how to do it :

- You want to connect to the AWS EC2 using AWS CLI Session Manager

```
aws ssm start-session \
    --profile <your-profile-access> \
    --region <your-aws-region> \
    --target <your-ec2-instance-id>
```

- You want to port forwarding inside the AWS EC2 using AWS CLI Session Manager

```
aws ssm start-session \
    --profile <your-profile-acccess> \
    --region <your-aws-region> \
    --target <your-ec2-instance-id> \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters portNumber="<your-aws-port>",localPortNumber="<your-local-port>"
```

- You want to port forwarding inside the AWS EC2 to AWS RDS using AWS CLI Session Manager

```
aws ssm start-session \
    --profile <your-profile-acccess> \
    --region <your-aws-region> \
    --target <your-ec2-instance-id> \
    --document-name AWS-StartPortForwardingSessionToRemoteHost \
    --parameters host="<your-rds-endpoint>",portNumber="<your-aws-port>",localPortNumber="<your-local-port>"
```

For more information, refer to the documentation below :)

## Reference

> - [Installing or updating to the latest version of the AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
> - [How to Install and Configure AWS CLI on Linux](https://devopscube.com/install-configure-aws-cli-linux/)
> - [How To Use and Install AWS CLI On Windows (The Perfect Way!)](https://adamtheautomator.com/install-aws-cli-on-windows/)
> - [How to Install & Configure AWS CLI command line tool](https://www.devopsschool.com/tutorial/aws/how-to-do/install-and-configure-aws-cli.html)
> - [Install the Session Manager plugin for the AWS CLI](https://docs.aws.amazon.com/systems-manager/latest/userguide/session-manager-working-with-install-plugin.html)