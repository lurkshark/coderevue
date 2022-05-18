# Node-RED on Google App Engine

A Node-RED project that's version-controlled and continuously deployed to Google App Engine. Follow along with the tutorials on CodeREVUE.net to learn more about how this all fits together. Feel free to open an issue if you run into any issues.

- [Using Node-RED as an open-source alternative to Zapier for workflow automation](https://coderevue.net/posts/zapier-alternative-node-red/)
- [Manage your Node-RED configuration in Git](https://coderevue.net/posts/node-red-configuration-git/)
- [Deploy Node-RED to Google App Engine](https://coderevue.net/posts/deploy-node-red-gcp/)

## Editing Flows

To make any edits to the flows in this project, including installing new node types, you need to clone the repository and run the editor locally. After you've clicked the "Deploy" button your changes will be saved to your `flows.json` file locally and can then be submitted as a pull request.

```bash
npm install
npm run editor
```
