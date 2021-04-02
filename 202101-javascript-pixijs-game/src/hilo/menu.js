import * as PIXI from 'pixi.js';
// We're going to be using the asset loader to load this
import hilowArrowsAsset from './assets/sprites/hilow-arrows.png';

export default class Menu {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        const arrowsSprite = new PIXI.Sprite(resources[hilowArrowsAsset].texture);
        arrowsSprite.width = 46
        arrowsSprite.scale.y = arrowsSprite.scale.x;
        arrowsSprite.x = 40;
        arrowsSprite.y = 98;

        const titleText = new PIXI.Text('Hilow', {
          fontFamily: 'Roboto Mono',
          fill: 0x000000,
          fontSize: 62
        });
        titleText.x = 96;
        titleText.y = 90;

        container.addChild(arrowsSprite);
        container.addChild(titleText);
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
    })
  }

  onUpdate(delta) {
  }

  onFinish() {}
}
