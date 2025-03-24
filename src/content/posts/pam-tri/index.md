---
title:  Developing Secure Privilege Access Management with Zero Trust
published: 2025-02-12
description: Guide to implement Jumpserver with Zero Trust integration using Netbird and Cloudflare
tags: [Zero Trust, PAM, ]
category: Guide
draft: false
---


## Overview

::github{repo="rafifdna/pam-tri"}

PAM-TRI is an Open Source Implementation of Privilege Access Management (PAM) base on JumpServer with network integration from Netbird.

It enhances features that jumpserver don't include in it's open source such as peer-to-peer connection with CGNAT endpoint, site-to-site connection to other vpc or router, and integration with single-sign-on from identity provider (OIDC, OAuth 2.0, SAML 2.0, Google, Github, Azure, and Apple).

It added features with Zero Trust from Zitadel for the peer-to-peer connection to the users. This solution specifically addresses the challenges of securing servers behind NAT that cannot be exposed publicly without port forwarding and expose the private resource using reverse proxy and eliminate the compromise of security when expose to the internet.

Regular Users only got access to the terminal, nothing else.


## Project Background

![Image](src/content/posts/pam-tri/image03.png)


All of this personal project is to create an environment where NAT resources can still be managed outside without compromising it's security. This idea come back when i work as Site Reliability Engineer.

In the future, i may add feature for this project with fully open source without SaaS. Also, this is still concept that i create that you can implement. It still base mostly on Jumpserver and Netbird stack.


## How-to-deploy

There are two methods for this deployment. Choose that are suitable for you.


- **Quick deployment**
> Quick deployment will install all the stack that are require to run the PAM and peer-to-peer integration with Netbird. It can be use for dev or staging environment.

- **Production deployment**
> Production deployment will be the next step of integrating our stack with Cloudflare. It gives our jumpserver secure access without the need of exposing it's public IP address with just the help of Cloudflare Access.

### Prerequisites

- Latest Docker Engine
- Recommended Linux-based Operating System
- Recommended using two servers (Using one server might need to configure docker config manually)
- Valid public domain with DNS pointed to it's server public IP for Netbird setup


### Quick Deployment

The will install Jumpserver + Zitadel stack with this script.

:::important
Make sure all prerequisites are already fulfilled before start following the deployment guide.
:::

- Clone this repo

    ```
    git clone https://github.com/rafifdna/pam-tri.git
    ```

- Install stack

    ```
    # Go to the file directory
    cd pam-tri

    # Execute bash command
    sudo bash start.sh
    sudo bash integration.sh
    ```

And that's it, quick deployment will install stack include JumpServer, Netbird, and Zitadel. How about more?

Yes, we can do more!

Now all we need to do is make sure all the traffic encrypted from server to the end users and so on. 

Don't forget we also need to configure Zero Trust so the server able to communicate to each other.

### Production Deployment (Recommended)


<iframe width="660" height="315" src="https://www.youtube.com/embed/PAs9ehGb-DY?si=QUzA4oKlAKMyIiz4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>


Here the overview for the production deployment. The different will be the Cloudflare Tunnel (cloudflared) that will be installed to Jumpserver, so the Cloudflare Access will be able to working properly.


:::important
Make sure all prerequisites are already fulfilled before start following the deployment guide.
:::

- Go to Cloudflare Zero Trust.

![Image](src/content/posts/pam-tri/image05.png)


- Go to Cloudflare Tunnels and choose cloudflared as it's tunnels client.

![Image](src/content/posts/pam-tri/image04.png)

- Name the tunnel client.

![Image](src/content/posts/pam-tri/image06.png)


- Install the tunnel client.

![Image](src/content/posts/pam-tri/image07.png)


- Add public hostnames and point the service with it's private IP address and port.

![Image](src/content/posts/pam-tri/image08.png)

- Go to Settings > Authentication.

![Image](src/content/posts/pam-tri/image13.png)

- Then in Authentication, add new login method.

![Image](src/content/posts/pam-tri/image14.png)

- In here, you can choose any login method you want. In this guide, i add new google login method. 

![Image](src/content/posts/pam-tri/image15.png)

- To get the login method, follow the guide from the Cloudflare. Then, after that enter done.

![Image](src/content/posts/pam-tri/image16.png)

- Go to Cloudflare Access > Applications.

![Image](src/content/posts/pam-tri/image09.png)

- Set the public hostname.

![Image](src/content/posts/pam-tri/image10.png)

- Set the policies.

![Image](src/content/posts/pam-tri/image11.png)

Make sure to add the policies, you can use the example of the policies below :

> 1. example-block-policy
>
>       a. include ::        everyone
>
>       b. exclude ::       emails ::      me@example.com

> 2. example-allow-policy
>
>       a. include ::        me@example.com
>
>       b. require ::       login method ::      google


- Set the the login methods and save.

![Image](src/content/posts/pam-tri/image12.png)

All set and done!


### About Project


This stack is need to be run by 2 servers, one for the Jumpserver and the other for the Netbird stack.

Also, i added the lab for the peer testing connection of the Netbird.

- **Concern**

    Why not making it into 1 servers?
    
    > Technically, you can do it into 1 server by separating the port from the Caddy inside Netbird stack with different port from the Jumpserver. 
    >
    > Jumpserver have core service for the web that has Nginx as it's web server. It technically work the same like Caddy. You can choose to use Caddy and configure into one. However, in this project i just keep it default. 


- **Future project**

    > In the next project, i plan to update the project into one unified docker container so PAM-TRI will be able to be hosted only in one server and it will open source without the need of third party SaaS or tools. 


### Special Thanks

Thank you for my mom and to you guys for supporting my project! You guys are amazing!


