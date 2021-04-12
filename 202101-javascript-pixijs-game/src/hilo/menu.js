import * as PIXI from 'pixi.js';
import Gameplay from './gameplay';
// We're going to be using the asset loader to load this
import hiloArrowsAsset from './assets/sprites/hilo-arrows.png';
import codeRevueAsset from './assets/sprites/code-revue-text.png';

export default class Menu {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        // Game icon sprite
        const arrowsSprite = new PIXI.Sprite(resources[hiloArrowsAsset].texture);
        arrowsSprite.width = 46
        // Scale the height to match the width
        arrowsSprite.scale.y = arrowsSprite.scale.x;
        arrowsSprite.x = 30;
        arrowsSprite.y = 98;

        // Game title text next to the icon
        const titleText = new PIXI.Text('Hilo', {
          fontFamily: ['Roboto Mono', 'monospace'],
          fill: 0x000000,
          fontSize: 62
        });
        titleText.x = 86;
        titleText.y = 90;

        // Game instructions text
        const description = 'Try to predict if the next value is going to be'
          + ' higher or lower. You get points for each correct guess, with more'
          + ' points for tricky guesses. Don\'t get too greedy though, choose'
          + ' incorrectly and you\'ll lose all the points you\'ve earned!';
        const descriptionText = new PIXI.Text(description, {
          fontFamily: ['Atkinson Hyperlegible', 'sans-serif'],
          fill: 0x666666,
          fontSize: 14,
          wordWrap: true,
          wordWrapWidth: 320,
          lineHeight: 20
        });
        descriptionText.x = 35;
        descriptionText.y = 190;

        // Text button to go to gameplay screen
        const gameplayText = new PIXI.Text('Start a new game', {
          fontFamily: ['Roboto Mono', 'monospace'],
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

        // Text button to go to game history screen
        const historyText = new PIXI.Text('Game history', {
          fontFamily: ['Roboto Mono', 'monospace'],
          fill: 0xcccccc,
          fontSize: 24
        });
        historyText.x = 35;
        historyText.y = 370;
        // Also a clickable button
        historyText.buttonMode = true;
        historyText.interactive = true;
        historyText.on('pointerup', () => {
          // TODO: Implement history scene
        });

        // Little CodeREVUE.net link at the bottom
        const codeRevueSprite = new PIXI.Sprite(resources[codeRevueAsset].texture);
        codeRevueSprite.width = 100
        codeRevueSprite.scale.y = codeRevueSprite.scale.x;
        codeRevueSprite.x = 35;
        codeRevueSprite.y = 620;
        codeRevueSprite.buttonMode = true;
        codeRevueSprite.interactive = true;
        codeRevueSprite.on('pointerup', () => {
          this.coordinator.window.location = 'https://coderevue.net';
        });

        // Finally we add all these elements to the new
        // container provided by the coordinator
        container.addChild(arrowsSprite);
        container.addChild(titleText);
        container.addChild(descriptionText);
        container.addChild(gameplayText);
        container.addChild(historyText);
        container.addChild(codeRevueSprite);
        // Resolving the promise signals to the coordinator
        // that this scene is all done with setup
        resolve();
      }

      // The loader raises an exception if you try to load the same
      // resource twice, and since this loader instance is shared,
      // we need to confirm that the asset isn't already loaded
      const assets = [hiloArrowsAsset, codeRevueAsset];
      for (const asset of assets) {
        if (!PIXI.Loader.shared.resources[asset]) {
          PIXI.Loader.shared.add(asset);
        }
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
