---
title: Using Node-RED as an open-source alternative to Zapier for workflow automation
date: 2022-05-18
draft: true
tags:
  - 202201-node-red-automation
  - javascript
  - automation
---

![Header image for Node-RED as an alternative to Zapier post](/zapier-alternative-node-red/header.png)

[Zapier](https://zapier.com/) is a great tool for automating busywork but it can get expensive quickly. Billing is based on the number of steps in a workflow that get executed, so adding just a few extra tasks like parsing or formatting text can inflate your costs. [Node-RED](https://nodered.org/) is an open-source project for low-code event-driven programming, very similar to Zapier but a bit more technical. It's built on NodeJS and allows you to define automation flows with [pre-made](https://flows.nodered.org/search?type=node&sort=downloads) or [custom-made](https://nodered.org/docs/creating-nodes/) nodes as well as [inline JavaScript functions](https://nodered.org/docs/user-guide/writing-functions).

Node-RED is usually mentioned in the context of connected devices and home automation because that's the use-case that the project was originally built for, but with all the functionality that has been added over the years it's grown to be capable of almost any workflow you could want.

## Collaboration and version control

One area where a Node-RED deployment shines in comparison to Zapier is in versioning of workflows. Zapier doesn't keep previous versions of your Zaps so if a workflow change doesn't work the way you expected you need to manually undo your changes. Flows in Node-RED are defined with a flat JSON file which makes it really easy to manage in Git.

Getting this setup right does take a bit of work, which you can read about in this article on [managing Node-RED configuration in Git]({{< relref "/posts/node-red-configuration-git.md" >}}). Basically you need to install Node-RED to a local npm project instead of the standard global install. Editing flows is done on your local machine and can be deployed to a production host like Google App Engine, which we'll get to.

With this in place you get both version control and collaboration for free. If you wanted to take it a step further, you could even write integration tests for your flows and have them automatically run in GitHub Actions.

Now you _could_ deploy Node-RED normally to a server, setup user accounts for the editor, and let it be. But keeping the configuration in Git gives you the benefit of having backups and versioning. The local-editing workflow also lets you sleep a little easier knowing you don't have another administrative UI exposed to the internet.

## Deploying to Google App Engine

## Chatops as an example

![Screenshot of a flow in Node-RED](/zapier-alternative-node-red/node-red-datadog-slack.png)
