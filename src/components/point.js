import bel from 'bel'
import C from 'components/default'

const defaultOpts = {
  onclick: function () {}
}

export default class Point extends C {
  constructor (index, position, opts) {
    super()
    this.opts = Object.assign({}, defaultOpts, opts || {})
    this.index = index
    this.el = opts.diamond
      ? bel`<rect class='circle-point' x='${position[0].toFixed(2)}%' y='${position[1].toFixed(2)}%' width='27px' height='27px' onclick=${this.opts.onclick.bind(this)} />`
      : bel`<circle class='circle-point' cx='${position[0].toFixed(2)}%' cy='${position[1].toFixed(2)}%' r='15px' onclick=${this.opts.onclick.bind(this)} />`
  }

  disable () {
    this.disabled = true
    this.addClass('is-disabled')
  }

  enable () {
    this.disabled = false
    this.removeClass('is-disabled')
  }

  setMapping (success) {
    this.mapped = success
    if (success) this.addClass('is-mapped')
    else this.removeClass('is-mapped')
  }
}
