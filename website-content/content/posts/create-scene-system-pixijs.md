---
title: Create a scene system for PixiJS
date: 2021-03-31
tags:
  - 202101-javascript-pixijs-game
  - javascript
  - game-dev
---

![PixiJS scene system](/202101-create-scene-system-pixijs/header.png)

You've just made a great game demo with PixiJS but now you need some more screens to make it feel like a real game. You don't want to just dump players right into the gameplay, you want a menu, maybe a high-score list, and so-on. Full-featured game engines like Phaser have a built-in scene system that you don't get with PixiJS, but sometimes you just want to build something simple. What we need is a basic scene-management system for our PixiJS project.

## Why not just use a full game engine?

You can! Full-featured game engines often include a scene system along with a ton of other features, which can be super helpful. But let's say you're building a simple dice game that doesn't need any fancy physics, particles, tilemaps, etc. In these situations it's often easier to just fill-in the missing parts rather than take on a whole suite of functionality. Plus you can often get your game's bundle size down which helps with performance.

## A scene management system

We're going to create a scene management system for PixiJS that loosely follows the pattern of Android activities. If you haven't done any Android development don't worry, the pattern will make sense on its own. Were going ot call this scene manager the "coordinator" and it's going to be in charge of loading scenes in, updating the active scene, and removing old scenes.

## What is a scene?

For this project we're going to say a scene is a collection of sprites on the screen. Things like a menu, a game level, a high-score list. Basically each distinct screen in your game is going to be a scene.

In order for our coordinator to be able to manage each different scene we're going to need a common "scene" interface that it can work with. The scene needs to initialize things when created, update things each tick, and destroy things when being unloaded. Those three stages are going to be the key to our scene implementation.

## Implementation

You can find the [final project on GitHub](https://github.com/lurkshark/coderevue/tree/main/202101-javascript-pixijs-game) or follow along below.

### Menu Scene

This is the initial scene of our game. It's going to have a basic title and a button to go to the gameplay screen.

```js
import * as PIXI from 'pixi.js';
import Gameplay from './gameplay';

export default class Menu {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        // Game title text
        const titleText = new PIXI.Text('Hilow', {
          fontFamily: 'Roboto Mono',
          fill: 0x000000,
          fontSize: 62
        });
        titleText.x = 35;
        titleText.y = 90;

        // Text button to go to gameplay screen
        const gameplayText = new PIXI.Text('Start a new game', {
          fontFamily: 'Roboto Mono',
          fill: 0x000000,
          fontSize: 24
        });
        gameplayText.x = 35;
        gameplayText.y = 320;
        // These options make the text clickable
        gameplayText.buttonMode = true;
        gameplayText.interactive = true;
        // Go to the gameplay scene when clicked
        gameplayText.on('pointerup', () => {
          this.coordinator.gotoScene(new Gameplay(this.coordinator));
        });

        // Finally we add these elements to the new
        // container provided by the coordinator
        container.addChild(titleText);
        container.addChild(gameplayText);
        // Resolving the promise signals to the coordinator
        // that this scene is all done with setup
        resolve();
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup);
    });
  }

  // The menu is static so there's not
  // any need for changes on update
  onUpdate(delta) {}

  // There isn't anything to teardown
  // when the menu exits
  onFinish() {}
}
```

### Gameplay Scene

The gamplay scene contains our actual game, which in this project is just going to be a demonstration of a rotating sprite along with a back button to get back to the menu.

```js
import * as PIXI from 'pixi.js';
import Menu from './menu'
// We're going to be using the asset loader to load this
import hilowArrowsAsset from './assets/sprites/hilow-arrows.png';

export default class Gameplay {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        // Text button to go back to menu screen
        const exitText = new PIXI.Text('Exit to menu', {
          fontFamily: 'Roboto Mono',
          fill: 0x000000,
          fontSize: 16
        });
        exitText.x = 35;
        exitText.y = 35;
        // These options make the text clickable
        exitText.buttonMode = true;
        exitText.interactive = true;
        // Go to the menu scene when clicked
        exitText.on('pointerup', () => {
          this.coordinator.gotoScene(new Menu(this.coordinator));
        });

        // Game icon sprite gets a this reference because we
        // need to be able to modify it in the onUpdate function
        this.arrowsSprite = new PIXI.Sprite(resources[hilowArrowsAsset].texture);
        this.arrowsSprite.width = 120
        // Scale the height to match the width
        this.arrowsSprite.scale.y = this.arrowsSprite.scale.x;
        // Set the anchor to the center so rotation makes sense
        this.arrowsSprite.anchor.set(0.5)
        this.arrowsSprite.x = 185;
        this.arrowsSprite.y = 300;

        container.addChild(exitText);
        container.addChild(this.arrowsSprite);
        resolve();
      }

      // The loader raises an exception if you try to load the same
      // resource twice, and since this loader instance is shared,
      // we need to confirm that the asset isn't already loaded
      if (!PIXI.Loader.shared.resources[hilowArrowsAsset]) {
        PIXI.Loader.shared.add(hilowArrowsAsset);
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup);
    });
  }

  // We're just going to slowly rotate the icon
  // on every update tick
  onUpdate(delta) {
    this.arrowsSprite.rotation += delta / 100
  }

  onFinish() {}
}
```

### Coordinator

The coordinator is what actually does the scene management. It's the entrypoint of our game and loads the first scene.

```js
import * as PIXI from 'pixi.js';
import Menu from './menu';

export default class Hilo {

  constructor(window, body) {
    // Adjust the resolution for retina screens; along with
    // the autoDensity this transparently handles high resolutions
    PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

    // The PixiJS application instance
    this.app = new PIXI.Application({
      resizeTo: window, // Auto fill the screen
      autoDensity: true, // Handles high DPI screens
      backgroundColor: 0xffffff
    });

    // Add application canvas to body
    body.appendChild(this.app.view);

    // Add a handler for the updates
    this.app.ticker.add((delta) => {
      this.update(delta)
    });

    // Load the menu scene initially; scenes get a reference
    // back to the coordinator so they can trigger transitions
    this.gotoScene(new Menu(this))
  }

  // Replace the current scene with the new one
  async gotoScene(newScene) {
    if (this.currentScene !== undefined) {
      await this.currentScene.onFinish();
      this.app.stage.removeChildren();
    }

    // This is the stage for the new scene
    const container = new PIXI.Container();
    container.width = this.WIDTH;
    container.height = this.HEIGHT;
    container.scale.x = this.actualWidth() / this.WIDTH;
    container.scale.y = this.actualHeight() / this.HEIGHT;
    container.x = this.app.screen.width / 2 - this.actualWidth() / 2;
    container.y = this.app.screen.height / 2 - this.actualHeight() / 2;

    // Start the new scene and add it to the stage
    await newScene.onStart(container);
    this.app.stage.addChild(container);
    this.currentScene = newScene;
  }

  // This allows us to pass the PixiJS ticks
  // down to the currently active scene
  update(delta) {
    if (this.currentScene !== undefined) {
      this.currentScene.onUpdate(delta);
    }
  }

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
