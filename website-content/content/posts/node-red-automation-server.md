---
title: Node-RED as an open-source alternative to Zapier for workflow automation
date: 2022-05-09
draft: true
tags:
  - 202201-node-red-automation
  - javascript
  - automation
---

![Header image for Node-RED automation post](/node-red-automation/header.png)

[Zapier](https://zapier.com/) is a great tool for automating busywork but it can get expensive quickly. Billing is based on the number of steps in a workflow that get executed, so adding just a few extra tasks like parsing or formatting text can inflate your costs. [Node-RED](https://nodered.org/) is an open-source project for low-code event-driven programming, very similar to Zapier but a bit more technical. It's built on NodeJS and allows you to define automation flows with [pre-made](https://flows.nodered.org/search?type=node&sort=downloads) or [custom-made](https://nodered.org/docs/creating-nodes/) nodes as well as [inline JavaScript functions](https://nodered.org/docs/user-guide/writing-functions).

Node-RED is usually mentioned in the context of connected devices and home automation because that's the use-case that the project was originally built for, but with all the functionality that has been added over the years it's grown to be capable of almost any workflow you could want. This makes it a great candidate as an open-source alternative to Zapier.

## Setting-up your environment

The only dependencies you'll need to have before playing with Node-RED are [Node.js and npm](https://nodejs.org/en/download/). As of writing time, the current LTS release of Node.js is v16 so that's what we'll be using. Installing Node-RED can be done either as their [documentation](https://nodered.org/docs/getting-started/local) suggests, with a global npm install, or as we're going to be doing in this project, within a specific Node.js project. If you'd like to keep your Node-RED configuration in a Git repository, now would be a good time to set that up.

First let's create a new `package.json` file with npm.

```sh
npm init
```

Now we'll install the `node-red` dependency to our project.

```sh
npm install node-red
```

At this point if you're just itching to try out Node-RED you can launch it with `npm exec` which will run it the same way it would if you installed it globally. This stores all your settings and configuration in a `.node-red` directory in your user home. But to make our deployment reproducible we want all those files within our local project. To do that we're going to first launch Node-RED with a commandline argument pointing to the current directory.

```sh
npm exec -- node-red --userDir=./
```

Feel free to poke around the editor before killing the process, it should be running on your [local machine](http://localhost:1880/). You'll notice some new files in your project directory, some of these are cache files we don't care about, and one will be the `settings.js` file which we're going to edit.

Before moving on though let's create a `.gitignore` file to exclude all the files we don't want in Git.

```sh
# Dependency code
node_modules/

# Editor temp files
.config.*.json
*.json.backup

# Credential file key
.env
```

## Editing the settings file

When you launched Node-RED it created a file called `settings.js` in your project directory. This file is prepopulated with default values for the configurable options. We're going to edit the `userDir` setting first to point to our current directory.

```js
/** By default, all user data is stored in a directory called `.node-red` under
 * the user's home directory. To use a different location, the following
 * property can be used
 */
userDir: './',
```

We'll continue to tweak this file in order to lock-down our Node-RED deployment. First let's test out the change to the `userDir` setting by adding an `editor` npm script to our `package.json` for executing Node-RED with the settings file.

```json
{
  // ...
  "scripts": {
    "editor": "node-red --settings=./settings.js",
  },
  // ...
}
```

## Using dotenv to store the credential key

## Creating a flow

## Running flows without the editor UI

## Deploying your flows
