import * as PIXI from 'pixi.js';
import localforage from 'localforage';
import WebFont from 'webfontloader';
import './assets/fonts/index';
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
    this.app.ticker.add(this.update);

    // Initialize instance of localforage
    this.localforage = localforage.createInstance({
      name: 'Hilo-v1'
    });

    WebFont.load({
      // Load the menu scene when fonts are ready
      active: () => this.gotoScene(new Menu(this)),
      custom: {
        families: ['Roboto Mono', 'Atkinson Hyperlegible']
      }
    });
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
  // using it to maintain a 9:16 aspect ratio

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
