---
title: Make your PixiJS game an installable app
date: 2021-05-18
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

The "Add to Home Screen" option doesn't show up for every website. There are a couple features that a web application needs to implement that'll hint to the browser that it should allow installation. These requirements aren't in a formal specification and can vary from browser to browser, but the following three items should enable installation on the major browsers:

1. Serve your application over HTTPS.
2. Include a Web App Manifest that includes the required parameters.
3. Register a service worker that handles `fetch` requests.

## Implementation

You can find the [final project on GitHub](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game). The pieces specific to making the game installable are described in more detail below. This example isn't necessarily exlusive to a PixiJS game, but the implementation shown is pretty specific to the Parcel build setup we use for this project.

### Web App Manifest

The web app manifest contains metadata used by your phone for things like the home screen icon and label. There are a ton of available options. You can learn more about all the options available at the [MDN page on manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest) but for this project we're just going to focus on a few basic ones.

First let's create the manifest file itself. Most of the options here are pretty self explanitory. One quirk to mention is that some platforms will "mask" the icon, cropping it into a circle. I like to use an image with a bit of extra border space to deal with this (compare the [regular icon](https://github.com/lurkshark/coderevue/blob/main/202101-javascript-pixijs-game/src/hilo/assets/icons/icon-512x512.png) to the [maskable icon](https://github.com/lurkshark/coderevue/blob/main/202101-javascript-pixijs-game/src/hilo/assets/icons/icon-maskable-512x512.png)).

This file is going to have a `.manifest` extension so the Parcel bundler can understand its type.

```json
{
  "name": "Hilo Guessing Game",
  "short_name": "Hilo",
  "start_url": "/",
  "display": "fullscreen",
  "orientation": "portrait",
  "icons": [
    {
      "src": "hilo/assets/icons/icon-maskable-512x512.png",
      "type": "image/png",
      "purpose": "maskable",
      "sizes": "512x512"
    },
    {
      "src": "hilo/assets/icons/icon-512x512.png",
      "type": "image/png",
      "sizes": "512x512"
    }
  ]
}
```

For the user's browser to find the web app manifest we need to add a meta tag to the `<head>` of our main `index.html` file.

```html
<link rel="manifest" href="manifest.webmanifest">
```

### Service Worker

Service workers are JavaScript modules that run in the background of the user's browser. They have some special capabilities available to them but we're just going to be talking about `fetch` handling because that's the basic requirement for making your PWA installable. MDN has a ton of [great information on service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers) if you're interested in their other capabilities.

For our purposes we're not actually going to write our own service worker but instead use an existing Parcel plugin called `parcel-plugin-sw-precache` that will auto-generate a precaching service worker for us. Basically it's going to register a `fetch` handler that caches all our assets. This both satisfies our requirement of registering a `fetch` handler and allows our PWA to work even offline.

First we need to add the plugin as a development dependency and then all we need is an empty `service-worker.js` file for the plugin to target. I like to leave a [comment in the file](https://github.com/lurkshark/coderevue/blob/main/202101-javascript-pixijs-game/src/service-worker.js) to explain why it's there.

Finally we need to register the service worker in the root `app.js` file.

```js
// We skip the service worker for localhost so we don't need
// to worry about clearing the cache during local development
if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  // Once the caching service worker is installed the application
  // can be loaded offline; files are served from the worker
  navigator.serviceWorker.register('service-worker.js');
}
```
