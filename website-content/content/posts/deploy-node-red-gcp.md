---
title: Deploy Node-RED to Google App Engine
date: 2022-05-12
draft: true
tags:
  - 202201-node-red-automation
  - javascript
  - automation
---

![Header image for Node-RED GCP deployment post](/deploy-node-red-gcp/header.png)

## Locking-down the configuration

When we deploy Node-RED to our production server we want to completely disable editing functionality. There are a couple benefits to this: all changes will go through version-control and we don't need to worry about securing the editor. Plus since we want to use the cheaper App Engine standard environment instead of the flexible environment, the service will be deployed on a read-only filesystem.

The two settings we want to change are `httpAdminRoot` which when set to `false` will disable the editor, and `readOnly` which will prevent Node-RED from trying to create any config files on the host. These are configured in the `settings.js` file.

```js
// ...
module.exports = {
    // ...
    /** By default, the Node-RED UI is available at http://localhost:1880/
     * The following property can be used to specify a different root path.
     * If set to false, this is disabled.
     */
    httpAdminRoot: false,
    // ...
    /** Prevent the storage module from trying to write files */
    readOnly: true,
    // ...
}
```

Since our default `settings.js` file will lock-down the editor, we're going to need to add another npm script to override those settings for when we want to run the editor locally to make changes to the flows. The `node-red` command accepts setting overrides with the `-D` flag which we'll use to revert the changes we just made when running an `editor` command.

```json
{
  // ...
  "scripts": {
    // Override the locked-down settings for local editing
    "editor": "node-red --settings=./settings.js -D httpAdminRoot=/ -D readOnly=false",
    "start": "node-red --settings=./settings.js"
  },
  // ...
}
```

Now when you want to change any flows you'll use the `npm run editor` command to launch the editing UI locally. After making changes and saving them with the "Deploy" button you'll commit your changed `flows.json` file to Git.

## Setting-up Google App Engine

Our Node-RED production service is going to run on Google App Engine which is a managed environment for running your application. The main benefits to this are that we don't need to worry about any boilerplate configuration of the hosts, and with the right configuration we can actually keep everything within the forever free-tier.

For the following steps I just used the Google Cloud web console, but these steps can also be accomplished with the `gcloud` CLI tool if you're more comfortable with that. First create a new project and then create an App Engine application for that project.

Now we need to setup a service account that we'll use later to automatically update our service with GitHub Actions. Go to IAM & Admin then Service Accounts. Click on the Create Service Account button at the top and name it "GitHub Actions". Next go to the Manage Permissions page for the service account you just created. We need to grant the account [some permissions](https://github.com/google-github-actions/deploy-appengine#via-google-github-actionsauth) to allow it to deploy to App Engine.

- **App Engine Admin** (roles/appengine.appAdmin): can manage all App Engine resources
- **Service Account User** (roles/iam.serviceAccountUser): to deploy as the service account
- **Storage Admin** (roles/compute.storageAdmin): to upload files
- **Cloud Build Editor** (roles/cloudbuild.builds.editor): to build the application

Finally you'll need to enable the [App Engine Admin API](https://console.developers.google.com/apis/api/appengine.googleapis.com/overview) and [Cloud Build Admin API](https://console.developers.google.com/apis/api/cloudbuild.googleapis.com/overview). This will require attaching a billing account to the project so go ahead and set that up if you need to.

## Automatic deployment with GitHub Actions

```yaml
runtime: nodejs16
instance_class: F1
automatic_scaling:
  min_instances: 1
  max_instances: 1
```

```gitignore
#!include:.gitignore
!.env
```

```yaml
name: Deploy Node-RED to Google App Engine
on:
  push:
    branches:
      - main
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Create .env file for deployment
        run: |
          echo "CREDENTIAL_FILE_KEY=${{ secrets.NODE_RED_CREDENTIAL_FILE_KEY }}" >> .env
      - name: Authenticate to Google Cloud Platform
        uses: google-github-actions/auth@v0.7.1
        with:
          credentials_json: ${{ secrets.GCP_CREDENTIALS }}
      - name: Deploy to Google App Engine
        uses: google-github-actions/deploy-appengine@v0.8.0
        with:
          deliverables: app.yaml
          project_id: ${{ secrets.GCP_PROJECT }}
```

