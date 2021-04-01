import * as PIXI from 'pixi.js'
import GameplayManager from './manager'
import { slotIconSprites } from './assets'
import * as textures from './textures'

export default class Gameplay {

  constructor(coordinator, options) {
    this.app = coordinator.app
    this.coordinator = coordinator
    this.manager = new GameplayManager(coordinator, this, options)
  }

  onStart(container) {
    return new Promise((resolve) => {
      const setup = async (loader, resources) => {
        const radius = (this.coordinator.width - 20) / 2
        const wheelTexture = textures.wheelTexture(this.app.renderer, radius)
        this.wheelSprite = new PIXI.Sprite(wheelTexture)
        this.wheelSprite.y = this.coordinator.height / 2
        this.wheelSprite.x = this.coordinator.width / 2
        this.wheelSprite.anchor.set(0.5)

        const indicatorTexture = textures.indicatorTexture(this.app.renderer, radius)
        this.indicatorSprite = new PIXI.Sprite(indicatorTexture)
        this.indicatorSprite.y = this.coordinator.height / 2
        this.indicatorSprite.x = this.coordinator.width / 2
        this.indicatorSprite.anchor.set(0.5)

        container.addChild(this.wheelSprite)
        container.addChild(this.indicatorSprite)
        await this.manager.start()
        resolve()
      }

      for (const icon of slotIconSprites) {
        if (!PIXI.Loader.shared.resources[icon]) {
          PIXI.Loader.shared.add(icon)
        }
      }
      // Load any assets and setup
      PIXI.Loader.shared.load(setup)
    })
  }

  updateWheelSpriteRotation(rotation) {
    this.wheelSprite.rotation = rotation
  }

  onUpdate(delta) {
    this.wheelSprite.rotation = this.manager.wheelRotation()
  }

  onFinish() {}
}
