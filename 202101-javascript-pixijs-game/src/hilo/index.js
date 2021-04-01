import * as PIXI from 'pixi.js';
import localforage from 'localforage';
import WebFont from 'webfontloader';
import Gameplay from './gameplay';
import './assets/fonts';

export default class Hilo {

  constructor(window, body) {
    // Adjust the resolution for retina screens; along with
    // the autoDensity this transparently handles high resolutions
    PIXI.settings.RESOLUTION = window.devicePixelRatio || 1;

    // The PixiJS application instance
    this.app = new PIXI.Application({
      resizeTo: window, // Auto fill the screen
      autoDensity: true // Handles high DPI screens
    });

    // Add application canvas to body
    body.appendChild(this.app.view);

    // Add a handler for the paint updates
    this.app.ticker.add((delta) => {
      this.update(delta);
    });

    // Initialize instance of localforage
    this.localforage = localforage.createInstance({
      name: 'Hilo-v1'
    });

    WebFont.load({
      // Load the game when fonts are ready
      active: () => this.gotoScene(new Gameplay(this)),
      custom: {
        families: ['Rubik', 'WorkSans']
      }
    });
  }

  // Destroy current scene and load new
  async gotoScene(newScene) {
    if (this.currentScene !== undefined) {
      await this.currentScene.onFinish();
      // This is a hacky inline fadeout
      await new Promise((resolve) => {
        let start;
        const fadeOut = (timestamp) => {
          if (start === undefined) start = timestamp
          const elapsed = timestamp - start;
          const alpha = Math.max(0, 1 - elapsed / 100);
          this.app.stage.alpha = alpha;
          if (elapsed < 100) {
            requestAnimationFrame(fadeOut);
          } else {
            resolve();
          }
        }
        requestAnimationFrame(fadeOut);
      });
      this.app.stage.removeChildren();
    }

    const container = new PIXI.Container();
    container.x = this.app.screen.width / 2 - this.width / 2;
    container.y = this.app.screen.height / 2 - this.height / 2;

    await newScene.onStart(container);
    this.app.stage.addChild(container);
    this.currentScene = newScene;
    // This is a hacky inline fadein
    await new Promise((resolve) => {
      let start;
      const fadeIn = (timestamp) => {
        if (start === undefined) start = timestamp;
        const elapsed = timestamp - start;
        const alpha = Math.min(1, elapsed / 100);
        this.app.stage.alpha = alpha;
        if (elapsed < 100) {
          requestAnimationFrame(fadeIn);
        } else {
          resolve();
        }
      }
      requestAnimationFrame(fadeIn);
    })
  }

  update(delta) {
    if (this.currentScene === undefined) return;
    this.currentScene.onUpdate(delta);
  }

  get width() {
    const { width, height } = this.app.screen;
    const isWidthConstrained = width < height * 9 / 16;
    return isWidthConstrained ? width - 40 : height * 9 / 16 - 40;
  }

  get height() {
    const { width, height } = this.app.screen;
    const isHeightConstrained = height < width * 16 / 9;
    return isHeightConstrained ? height - 40 : width * 16 / 9 - 40;
  }
}
