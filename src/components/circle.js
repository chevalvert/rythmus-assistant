import bel from 'bel'

import C from 'components/default'
import Point from 'components/point'
import { norm } from 'missing-math'

export default class Circle extends C {
  constructor (length, { radius = 250 } = {}) {
    super()

    this.length = length
    this.width = radius * 2
    this.height = radius * 2

    this.boxes = []
    const that = this
    for (let index = 0; index < length; index++) {
      const theta = norm(index, 0, length) * Math.PI * 2
      const x = radius + Math.sin(theta) * radius
      const y = radius + Math.cos(theta) * radius
      const position = this.coordToPercent(x, y)
      const box = new Point(index, position, {
        diamond: index % (length / 2) === 0,
        onclick: function (e) {
          if (!this.disabled) return that.emit('click', this)
          e.preventDefault()
        }
      })
      this.boxes.push(box)
    }

    this.el = bel`
    <svg class='circle' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${this.width} ${this.height}'>
      ${this.boxes.map(b => b.el)}
    </svg>`
  }

  coordToPercent (x, y) {
    const margin = 20
    return [
      norm(x, -margin, this.width + margin) * 100,
      norm(y, -margin, this.height + margin) * 100
    ]
  }
}
