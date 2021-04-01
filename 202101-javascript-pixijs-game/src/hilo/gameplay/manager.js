import Wheel from './wheel'

export default class GameplayManager {

  constructor(coordinator, view, options) {
    this.coordinator = coordinator
    this.localforage = coordinator.localforage
    this.view = view
  }

  async start() {
    this.wheel = new Wheel()
    window.WHEEL = this.wheel
  }

  wheelRotation() {
    return this.wheel.rotation()
  }
}
