---
title: Scale a PixiJS game to fit the screen
date: 2021-04-04
tags:
  - 202101-javascript-pixijs-game
  - javascript
  - game-dev
---

![PixiJS game scaling](/scale-to-fit-screen-pixijs/header.png)

There's no "one size fits all" option when it comes to the dimensions of HTML5 mobile games. The wide variety of screen sizes means you'll need to scale your game to fit more than just a single configuration. We need to build a system that lets us scale our playable area to fit the device's size and shape.

## Defining a playable area

Your game has a core area that contains everything needed to play the game. This is going to include things like a view of the play-field, on-screen controls, nearby enemies, and more. In order for us to decide how to scale to the player's screen size, we're going to need to define the playable area for the game.

In our [example game Hilo](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game), there's an area for showing the past values, the current value, and buttons to let the user choose their next action. Those components are our playable area that need to fit within the player's screen. Regardless of the size or dimension of the player's screen, these elements need to be visible in order for the game to work.

## Fixed-ratio scaling

The simplest way to handle different screen sizes is to make a fixed-size stage to put all our game elements on and then scale that stage proportionally to fit the screen space. For example, let's say our fixed-size is 375x667, giving a 9:16 aspect ratio. If the user's screen is also a 9:16 aspect ration then it's just a matter of scaling the stage to fit. When the user's screen is a different ratio though, we need to leave some dead space. Screens that are wider than 9:16 will have dead space on the left and right, and screens that are narrower than 9:16 will have dead space on the top and bottom.

Fixed-ratio scaling can be a good option when having some dead space is OK and you don't want to sink too much time onto making the layout dynamic. Our Hilo game for example has a pretty basic layout with a plain white background. It's not a big deal if we're not using the screen space as efficiently as possible and the ability to just use absolute positioning makes it simpler. On the other hand, if a game has a layout that looks weird with dead space, or you just want to make more efficient use of the screen, then a dynamic scaling approach is probably the better option.

## Dynamic scaling

By figuring-out the minimum space needed to fit your playable area, you can create a stage that's sized to fit the screen. The layout design needs to be based on this size so placement can be a bit more complex. For example, with fixed-ratio scaling we can just say our stage is 375x667 so the title text should be located at the coordinates (100, 200), but in a dynamic-scaling setup this would need to be placed by calculating a position relative to the stage size. The simple fixed positioning turns into a calculation to find half the width and a quarter of the height to place the title, and similar calculations for any other on-screen elements.

Although it can be a bit more work to implement dynamic scaling the payoff is a game that looks more polished and professional. It's nice to play a game that feels like it was designed for your device and not just included as an afterthought.

## Redraw on resize

Another consideration for our scaling logic is whether or not we want to re-calculate and draw the layout when the screen space is resized. This can happen in cases where the browser window gets resized after the initial loading. I often ignore resizing because it adds a little extra complexity and the use-case I target doesn't usually involve resizing. Usually the games I'm making are targeted to mobile devices where the size is going to stay the same once the initial load is complete. Even if you're making a game targeting desktop browsers the publishers often load your game in an iFrame so window resizes may not even impact the size of your game.

## Implementation

You can find the [final project on GitHub](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game) or follow along below; we're going to implement fixed-ratio scaling here. This scaling functionality fits well with the scene switching system we implemented for [creating a scene system for PixiJS]({{< ref "posts/create-scene-system-pixijs" >}}).

### Fixed Scaling

In this example we're going to do a fixed scaling ratio of a portrait 9:16 aspect. The application is going to scale to fit the entire screen, but the `createScaledContainer` function is going to create an inner PixiJS container for us to add DisplayObjects to. The container is going to have a 9:16 aspect ratio and fit the screen depending on if its width or height constrained.

```js
import * as PIXI from 'pixi.js';

export default class Hilo {

  constructor(window, body) {
    // Adjust the resolution for retina screens; along with
    // the autoDensity this transparently handles high resolutions
    PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;
    this.window = window;

    // The PixiJS application instance
    this.app = new PIXI.Application({
      resizeTo: window, // Auto fill the screen
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0xffffff
    });

    // Add application canvas to body
    body.appendChild(this.app.view);

    // Create the scaled stage and then add stuff to it
    this.createScaledContainer((container) => {
    });
  }

  // Clear the stage and create a new scaled container; the
  // provided callback will be called with the new container
  createScaledContainer(callback) {
    this.app.stage.removeChildren();

    // This is the stage for the new scene
    const container = new PIXI.Container();
    container.width = this.WIDTH;
    container.height = this.HEIGHT;
    container.scale.x = this.actualWidth() / this.WIDTH;
    container.scale.y = this.actualHeight() / this.HEIGHT;
    container.x = this.app.screen.width / 2 - this.actualWidth() / 2;
    container.y = this.app.screen.height / 2 - this.actualHeight() / 2;

    // Add the container to the stage and call the callback
    this.app.stage.addChild(container);
    callback(container);
  }

  // These functions are using getters to
  // simulate constant class variables

  get WIDTH() {
    return 375;
  }

  get HEIGHT() {
    return 667;
  }

  // The dynamic width and height lets us do some smart
  // scaling of the main game content; here we're just
  // using it to maintain a 9:16 aspect ratio and giving
  // our scenes a 375x667 stage to work with

  actualWidth() {
    const { width, height } = this.app.screen;
    const isWidthConstrained = width < height * 9 / 16;
    return isWidthConstrained ? width : height * 9 / 16;
  }

  actualHeight() {
    const { width, height } = this.app.screen;
    const isHeightConstrained = width * 16 / 9 > height;
    return isHeightConstrained ? height : width * 16 / 9;
  }
}
```
