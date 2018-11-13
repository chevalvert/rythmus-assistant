import Alert from 'components/alert'
import breadcrumb from 'components/breadcrumb'
import Button from 'components/button'
import reload from 'utils/reload'
import ws from 'utils/websocket'

function say (nodes) {
  return new Promise((resolve, reject) => {
    const message = [
      `The mapping is done.`,
      `Click on <b data-color="red">reject</b> to start the mapping all-over again.`,
      `Click on <b data-color="green">validate</b> to save the mapping and reboot <i>Rythmus</i>.`
    ]

    const alert = new Alert(message, {
      color: 'green',
      buttons: [
        new Button('reject', {
          color: 'red',
          onclick: reload
        }),
        new Button('validate', {
          color: 'green',
          onclick: e => {
            e.preventDefault()
            ws.on('saved', ({ err, filename }) => {
              if (err) reject(err)
              else {
                alert.destroy()
                resolve(filename)
              }
            })
            ws.send('save', nodes)
          }
        })
      ]
    }).spawn()
  })
}

export default (state, next) => {
  breadcrumb.disable()

  /**
   * @NOTE: mapping.json is formatted as below:
   * "nodes": {
   *   "NodeName0": [index, index, index, index],
   *   ...
   *   "NodeNameN": [index, index, index, index]
   * }
  **/
  const nodes = {}
  state.validated.forEach(strip => {
    const name = strip.node.name
    if (!nodes[name]) nodes[name] = Array(4)
    nodes[name][strip.index] = strip.box.index
  })

  say(nodes).then(filename => {
    next(null, Object.assign({}, state, { success: filename }))
  })
  .catch(err => next(err, state))
}
