---
title:  Indoctrinated AWS Keys in AWS CLI
published: 2024-07-01
description: My effort to doctrine people to not only implement AWS Keys Authentication inside their IAM Users in favor more secure ways using IAM Roles with MFA
tags: [AWS, ]
category: Guide
draft: false
---

# Overview

AWS CLI is awesome tools. However, many people not using the best practice. There is way for making sure your credentials is secure without using AWS SSO if your organization don't have or not implemented SSO yet. 

## Steps

Here are the simple steps how to do it :

- AWS IAM User Permission Pointed to AWS IAM Roles (Example)

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": "sts:AssumeRole",
            "Resource": "arn:aws:iam::000000000000:role/example"
        }
    ]
}
```

- AWS IAM Role Trusted Policy Using MFA (Example)

```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::000000000000:user/example"
            },
            "Action": "sts:AssumeRole",
            "Condition": {
                "Bool": {
                    "aws:multifactorAuthPresent": "true"
                }
            }
        }
    ]
}
```

- Login to AWS CLI

```
➜  ~ aws configure
AWS Access Key ID [None]: <your-access-key-id>
AWS Secret Access Key [None]: <your-secret-key-id>
Default region name [None]: 
Default output format [None]: 
```

- Configure your ~/.aws/config

```
[profile example] 
role_arn = arn:aws:iam::000000000000:role/example
source_profile = default 
mfa_serial = arn:aws:iam::000000000000:mfa/example
```

- Configure your ~/.aws/credentials

```
[default] 
aws_access_key_id = YOUR_ACCESS_KEY_ID 
aws_secret_access_key = YOUR_SECRET_ACCESS_KEY
```

- Done, now test your AWS CLI using profile from the <example>

- Enjoy the best security experience!