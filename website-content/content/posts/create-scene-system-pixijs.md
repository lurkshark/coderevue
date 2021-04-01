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
class MenuScene {

  constructor(coordinator) {
    this.coordinator = coordinator;
  }
}
```

### Gameplay Scene

The gamplay scene contains our actual game, which in this project is just going to be a demonstration along with a back button to get back to the menu.

### Coordinator

The coordinator is what actually does the scene management. It's the entrypoint of our game and loads the first scene.
