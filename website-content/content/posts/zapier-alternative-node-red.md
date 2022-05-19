---
title: Using Node-RED as an open-source alternative to Zapier for workflow automation
date: 2022-05-18
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

![Diagram of editing flows then deploying](/zapier-alternative-node-red/overview.png)

With this in place you get both version control and collaboration for free. If you wanted to take it a step further, you could even write integration tests for your flows and have them automatically run in GitHub Actions.

Now you _could_ deploy Node-RED normally to a server, setup user accounts for the editor, and let it be. But keeping the configuration in Git gives you the benefit of having backups and versioning. The local-editing workflow also lets you sleep a little easier knowing you don't have another administrative UI exposed to the internet.

## Deploying to Google App Engine

With the configuration contained within a local project you can deploy pretty much anywhere you can run a Node.js service. Here we setup a deployment to [Google App Engine](https://cloud.google.com/appengine) because their [forever-free-tier quota](https://cloud.google.com/appengine/quotas) meets our needs and makes it simple to continuously deploy changes with a GitHub Actions workflow.

There's also a lot of flexibility with a deployment to App Engine. If your Node-RED workflows are all push-based - they are triggered by HTTP requests - then you can setup automatic scaling to handle pretty much any amount of load. There's a caveat though, where pull-based workflows like incoming email triggers don't have a way to coordinate amongst a horizontally scaled fleet, so you'll have race conditions unless scaling is limited to keeping a single host. In practice this isn't a huge problem, the purpose of this kind of deployment isn't to have a massively scalable email processor and almost all workflows should be handled fine by a single server.

You can read about setting up you project for prime time in this article on [deploying Node-RED to Google App Engine]({{< relref "/posts/deploy-node-red-gcp.md" >}}). Although the instructions are somewhat specific to App Engine, the general setup should carry-over to most other environments.

## Sending a Slack notification

Let's look at a quick example of a workflow that works really well with this kind of setup. We're going to use the example of notifying a Slack channel when something happens with your team's main service. In this scenario we've got a web service with logs going into Datadog, where we've setup a log-scanning monitor to watch for this specific event. Datadog offers a direct integration with Slack, but it's built more for the use-case of incident management and gives you an extremely verbose dump of information. For a lot of use-cases we just want a little note that says something like "A new customer just onboarded!". Here you don't care about an extra message when the monitor resolves, the specific log line in breach, and so on.

![Screenshot of a flow in Node-RED](/zapier-alternative-node-red/node-red-datadog-slack.png)

In Zapier and Node-RED you can create a webhook trigger and use it as a notification channel for Datadog monitors. First thing we want to do after receiving the payload from Datadog is look at the `alert_trigger` field and only use messages where it's "Triggered". This prevents double-firing our workflow when the monitor switches back to a "Resolved" state. In Zapier this filtering is done with a "Filter" step, and a "Switch" node in Node-RED.

The payload from Datadog is very verbose, and includes a bunch of boilerplate. To get a cleaner message we're going to craft our own text with any values we want to include in the template. Unfortunately with Zapier's billing model, this simple task adds to the cost of executing our workflow. Node-RED's "Template" node lets us define a text payload with [mustache templating](https://mustache.github.io/). Finally we output the message to a Slack channel. The Node-RED plugin `node-red-contrib-chatbot` can connect to Slack as well as almost every other messaging service.

There are tons of different ways you can mix and match integrations with Node-RED; this example only begins to scratch the surface.
