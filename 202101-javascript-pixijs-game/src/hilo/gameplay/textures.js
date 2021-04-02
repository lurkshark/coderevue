import * as PIXI from 'pixi.js'
import Wheel from './wheel'

function drawWheelSection(graphics, radius, section) {
  const color = Wheel.colorForSection(section)
  const rotation = Wheel.rotationForSection(18 - section)
  const icon = PIXI.Loader.shared.resources[Wheel.iconForSection(section)].texture
  const padding = 2 * Math.PI / 36
  const start = rotation - padding
  const end = rotation + padding
  graphics.beginFill(color, 0.65)
    .drawPolygon([
      new PIXI.Point(radius, radius),
      new PIXI.Point(radius + radius * Math.cos(start) * 1.1,
        radius + radius * Math.sin(start) * 1.1),
      new PIXI.Point(radius + radius * Math.cos(end) * 1.1,
        radius + radius * Math.sin(end) * 1.1)
    ])
  const iconSprite = new PIXI.Sprite(icon)
  iconSprite.anchor.set(0.5)
  iconSprite.rotation = rotation + 0.5 * Math.PI
  iconSprite.x = radius + 0.75 * radius * Math.cos(rotation)
  iconSprite.y = radius + 0.75 * radius * Math.sin(rotation)
  iconSprite.width = radius / 6
  iconSprite.scale.y = iconSprite.scale.x
  graphics.addChild(iconSprite)
  /*
  const label = new PIXI.Text(section, {
    fontFamily: 'Rubik',
    fill: '#000000',
    fontSize: 18
  })
  label.anchor.set(0.5)
  label.rotation = iconSprite.rotation
  label.x = iconSprite.x
  label.y = iconSprite.y
  graphics.addChild(label)
  */
}

export function wheelTexture(renderer, radius) {
  const border = radius / 6
  const wheelGraphics = new PIXI.Graphics()
  drawWheelSection(wheelGraphics, radius,  0)
  drawWheelSection(wheelGraphics, radius,  1)
  drawWheelSection(wheelGraphics, radius,  2)
  drawWheelSection(wheelGraphics, radius,  3)
  drawWheelSection(wheelGraphics, radius,  4)
  drawWheelSection(wheelGraphics, radius,  5)
  drawWheelSection(wheelGraphics, radius,  6)
  drawWheelSection(wheelGraphics, radius,  7)
  drawWheelSection(wheelGraphics, radius,  8)
  drawWheelSection(wheelGraphics, radius,  9)
  drawWheelSection(wheelGraphics, radius, 10)
  drawWheelSection(wheelGraphics, radius, 11)
  drawWheelSection(wheelGraphics, radius, 12)
  drawWheelSection(wheelGraphics, radius, 13)
  drawWheelSection(wheelGraphics, radius, 14)
  drawWheelSection(wheelGraphics, radius, 15)
  drawWheelSection(wheelGraphics, radius, 16)
  drawWheelSection(wheelGraphics, radius, 17)
  wheelGraphics.endFill().lineStyle(border, 0xffffff)
    .drawCircle(radius, radius, radius + border / 2).lineStyle(0)
  wheelGraphics.beginFill(0xffffff).drawCircle(radius, radius, radius / 4)
  return renderer.generateTexture(wheelGraphics)
}

export function indicatorTexture(renderer, radius) {
  const size = radius / 24
  const indicator = new PIXI.Graphics()
    .lineStyle(size, 0xffffff).beginFill(0x824025)
    .drawPolygon([
      new PIXI.Point(0, size * 2),
      new PIXI.Point(-2 * size, -1 * size),
      new PIXI.Point(2 * size, -1 * size)
    ]).endFill()
    .lineStyle(size, 0x824025).endFill().drawCircle(0, radius + size, radius + size * 2)
  return renderer.generateTexture(indicator)
}
