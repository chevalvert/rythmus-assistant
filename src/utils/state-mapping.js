import Alert from 'components/alert'
import Button from 'components/button'
import breadcrumb from 'components/breadcrumb'
import keyboard from 'utils/keyboard'
import ws from 'utils/websocket'

function speak () {
  return new Promise((resolve, reject) => {
    const message = [
      `Rythmus will now switch on each strip individually.`,
      `For each one, set its position by clicking on the circle. Note that the squares indicate sensors strips.`,
      `If a strip is not present in the circle, click the <i class="fa fa-trash" data-color="red"></i> button.`
    ]

    const alert = new Alert(message, {
      color: 'yellow',
      buttons: [
        new Button('ok', {
          color: 'green',
          onclick: e => {
            e.preventDefault()
            alert.destroy()
            keyboard.off('enter')
            resolve()
          }
        })
      ]
    }).spawn()

    keyboard.once('enter', () => {
      alert.destroy()
      resolve()
    })
  })
}

export default function (state) {
  return new Promise((resolve, reject) => {
    ws.send('blackout')
    breadcrumb.select(1)
    speak().then(() => {
      let current = state.mappable.shift()
      ws.send('blackout')
      ws.send('light', {name: current.node.name, index: current.index})

      breadcrumb.setText(`<${current.node.ip}> ${current.node.name}#${current.index}`)
      breadcrumb.setButtons([
        new Button(`<i class='fa fa-trash'></i>`, {
          color: 'red',
          onclick: e => {
            e.preventDefault()
            state.trashed.push(current)
            validate()
          }
        })
      ])

      state.circle.on('click', box => {
        if (box.mapped) {
          // move node from state.mapped to state.mappable
          const index = state.mapped.findIndex(n => n.box.index === box.index)
          const removedNotes = state.mapped.splice(index, 1)
          removedNotes.forEach(n => state.mappable.push(n))
        }

        // NOTE .was-not-validated comes from steps/map-until-check recursion
        box.removeClass('was-not-validated')
        box.setMapping(true)
        current.box = box

        state.mapped.push(current)
        validate()
      })

      function validate () {
        if (state.mappable.length) {
          current = state.mappable.shift()
          ws.send('blackout')
          state.mapped.forEach(n => ws.send('light', {name: n.node.name, index: n.index, color: [50, 50, 0]}))
          ws.send('light', {name: current.node.name, index: current.index})
          breadcrumb.setText(`<${current.node.ip}> ${current.node.name}#${current.index}`)
        } else {
          state.circle.off('click')
          resolve(state)
        }
      }
    }).catch(err => reject(err))
  })
}
