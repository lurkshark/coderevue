import speakeasy from 'speakeasy'
import { slotIconSprites } from './assets'

const SEED = 'KRDDIQ2RPVIVAJJFNY7GGN3HHFHSQ6SPMQYC4Y2YJAXDIMDLEY4Q'
//speakeasy.generateSecret().base32
const TOTAL_WHEEL_SECTIONS = 18
//const TIME_STEP_MS = 120000
const TIME_STEP_MS = 60000

export default class Wheel {

  constructor(
      seed = SEED, // Probably doesn't need obfuscation
      // Allow passing-in a now function for testing
      now = function actualTime() {
        return new Date().getTime()
      }) {
    this.sections = {}
    this.seed = seed
    this.now = now
  }

  section(timeStepOffset = 0) {
    // The memoization in here leaks but I don't think it matters
    const counter = Math.floor(this.now() / TIME_STEP_MS) + timeStepOffset
    const cached = this.sections[counter]
    if (cached !== undefined) return cached
    const section = +speakeasy.hotp({
      secret: this.seed,
      counter
    }) % TOTAL_WHEEL_SECTIONS
    this.sections[counter] = section
    return section
  }

  static rotationForSection(section) {
    const radiansPerSection = 2 * Math.PI / TOTAL_WHEEL_SECTIONS
    const centeringOffset = 0.75 * Math.PI
    return section * radiansPerSection + centeringOffset
  }

  static colorForSection(section) {
    return [
      0xe76bbc, 0xf25934, 0xf4e10f,
      0xf78f1e, 0x9ed73d, 0xf4c111
    ][section % 6]
  }

  static iconForSection(section) {
    return slotIconSprites[section % 6]
  }

  rotation() {
    //return this.constructor.rotationForSection(this.customSection)
    const accelerationTime = 4 // Seconds
    const accelerationDistance = 2 * 2 * Math.PI // Two full rotations
    const acceleration = 2 * accelerationDistance / accelerationTime ** 2
    const velocity = acceleration * accelerationTime // Radians per second
    const decelerationTime = 8 // Seconds
    const decelerationDistance = 4 * 2 * Math.PI // Four full rotations
    const deceleration = 2 * (decelerationDistance - velocity * decelerationTime) / decelerationTime ** 2
    const intraStepTime = (this.now() % TIME_STEP_MS) / 1000
    const spinStartTime = TIME_STEP_MS / 1000 - accelerationTime - decelerationTime - 3
    // console.log(`${intraStepTime} / 120`)
    if (intraStepTime < spinStartTime) {
      // The wheel is stationary for the bulk of the step
      return this.constructor.rotationForSection(this.section())
    } else if (intraStepTime >= spinStartTime && intraStepTime < spinStartTime + 4) {
      // The first 4 seconds of the spin cycle are accelerating
      const starting = this.constructor.rotationForSection(this.section())
      return starting + 0.5 * acceleration * (intraStepTime - spinStartTime) ** 2
    } else {
      // We're in a segment where we need to know the alignment time
      const alignmentDistance = this.constructor.rotationForSection(this.section(1))
        - this.constructor.rotationForSection(this.section())
        + 2 * Math.PI
      const alignmentTime = spinStartTime + 4 + alignmentDistance / velocity
      if (intraStepTime < alignmentTime) {
        // Spin at a constant speed until the winner is in place
        const starting = this.constructor.rotationForSection(this.section())
        return velocity * (intraStepTime - spinStartTime - 4) + starting
      } else if (intraStepTime >= alignmentTime && intraStepTime < alignmentTime + 8) {
        // Finally decelerate for 8 seconds to the next winner
        const newStarting = this.constructor.rotationForSection(this.section(1))
        const localTime = (intraStepTime - alignmentTime)
        return velocity * localTime + 0.5 * deceleration * localTime ** 2 + newStarting
      } else {
        // Fill in the gap time at the next step
        return this.constructor.rotationForSection(this.section(1))
      }
    }
  }
}
