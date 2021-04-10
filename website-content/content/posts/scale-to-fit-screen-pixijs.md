---
title: Scale a PixiJS game to fit the screen
date: 2021-04-04
draft: true
tags:
  - 202101-javascript-pixijs-game
  - javascript
  - game-dev
---

![PixiJS game scaling](/scale-to-fit-screen-pixijs/header.png)

There's no "one size fits all" option when it comes to the dimensions of HTML5 games, especially if you're targeting mobile devices. The wide array of screen sizes means you'll need to scale your game to fit more than just a single dimension. We need a system that lets us scale our playable area to fit the device's size and shape.

## Defining a playable area

Your game has a core area that contains everything needed to play the game. This is going to include things like a view of the play-field, on-screen controls, nearby enemies, and more. Without a clear view of the playable area your game isn't going to work. In order for us to decide how to scale to the player's screen size, we're going to need to define this playable area.

In our [example game Hilo](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game), there's an area for showing the past values, the current value, and buttons to let the user choose their next action. Those components are our playable area that need to fit within the player's screen. Regardless of the size or dimension of the player's screen, these elements need to be visible.

## Fixed ratio scaling
## Dynamic scaling
## Redraw on resize
## Implementation
