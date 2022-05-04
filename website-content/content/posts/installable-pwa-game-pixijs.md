---
title: Make your PixiJS game an installable app
date: 2021-05-19
tags:
  - 202101-javascript-pixijs-game
  - progressive-web-app
  - javascript
  - game-dev
---

![Header image for installable PWA post](/installable-pwa-game-pixijs/header.png)

HTML5 game development has come a long way over the past few years, but the lack of installability is one area that holds it back. Luckily Chrome on Android and Safari on iOS both allow users to install web applications so they show up alongside your standard mobile applications. With the use of JavaScript service workers, manifests, and recent Web APIs, your game can be installed to work offline just like any other app. This is what makes your game into a "progressive web app" or PWA.

## Installing a PWA

A typical app is installed from the App Store or Google Play. PWAs work a bit differently though. Since a PWA is really just a web application, "installing" it is done directly from the browser. The experience is a bit different between iOS and Android, but the result is basically the same. The web app is installed right next to the rest of your apps.

To install a PWA on iOS you need to use Safari. Chrome and Firefox on iOS don't support installing PWAs. Once you've loaded an installable web app in Safari, click the sharing icon and then "Add to Home Screen". On Android you can use Chrome or Firefox and similar to iOS, all you need to do is navigate to the web app and then tap "Add to Home Screen". An installed PWA can be uninstalled the same way as a regular app.

## Making your game installable

The "Add to Home Screen" option mentioned above doesn't show up for every website. There are a few features that a web application are required to implement that'll hint to the browser that it should allow installation. These requirements aren't in a formal specification and can vary from browser to browser, but the following three items should enable installation on the major browsers:

1. Serve your application over HTTPS.
2. Include a Web App Manifest that includes the required parameters.
3. Register a service worker that handles `fetch` requests.

## Implementation

You can find the [final project on GitHub](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game). The pieces specific to making the game installable are described in more detail below. This example isn't necessarily exlusive to a PixiJS game, but the implementation shown is pretty specific to the Parcel build we use for this project.

### Web App Manifest

### Service Worker
