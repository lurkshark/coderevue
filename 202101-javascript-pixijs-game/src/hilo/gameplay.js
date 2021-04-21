import * as PIXI from 'pixi.js';
import Archive from './data/archive';
import Game from './data/game';
import Menu from './menu';
// We're going to be using the asset loader to load this
import hiloArrowsAsset from './assets/sprites/hilo-arrows.png';

export default class Gameplay {

  constructor(coordinator) {
    this.app = coordinator.app;
    this.coordinator = coordinator;
    this.localforage = coordinator.localforage;
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        // Text button to go back to menu screen
        const exitText = new PIXI.Text('← Exit to menu', {
          fontFamily: ['Roboto Mono', 'monospace'],
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
        this.arrowsSprite = new PIXI.Sprite(resources[hiloArrowsAsset].texture);
        this.arrowsSprite.width = 120
        // Scale the height to match the width
        this.arrowsSprite.scale.y = this.arrowsSprite.scale.x;
        // Set the anchor to the center so rotation makes sense
        this.arrowsSprite.anchor.set(0.5)
        this.arrowsSprite.x = 185;
        this.arrowsSprite.y = 300;

        container.addChild(exitText);
        container.addChild(this.arrowsSprite);

        // Load the locally saved games and see if one is currently in play
        const archive = await Archive.Repository(this.localforage).load();
        const currentGame = archive.currentGame();
        if (!currentGame) {
          // No currently active game so generate a new one and save it
          this.game = await Game.Repository(this.localforage).save(new Game());
          const updatedArchive = archive.registerGame(this.game);
          // Save the archive after the newly generate game data is registered with it
          await Archive.Repository(this.localforage).save(updatedArchive);
        } else {
          // There is a currently active game so just use that
          this.game = currentGame;
        }

        window.game = this.game;
        // Now the game is loaded so update the view
        this.updateGameState();
        resolve();
      }

      // The loader raises an exception if you try to load the same
      // resource twice, and since this loader instance is shared,
      // we need to confirm that the asset isn't already loaded
      if (!PIXI.Loader.shared.resources[hiloArrowsAsset]) {
        PIXI.Loader.shared.add(hiloArrowsAsset);
      }

      // Load any assets and setup
      PIXI.Loader.shared.load(setup);
    });
  }

  updateGameState() {
    console.log(this.game);
  }

  // We're just going to slowly rotate the icon
  // on every update tick
  onUpdate(delta) {
    this.arrowsSprite.rotation += delta / 100
  }

  onFinish() {}
}
