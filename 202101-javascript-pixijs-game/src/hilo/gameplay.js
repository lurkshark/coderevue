import * as PIXI from 'pixi.js';

export default class Gameplay {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        resolve();
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup);
    })
  }

  onUpdate(delta) {
  }

  onFinish() {}
}
