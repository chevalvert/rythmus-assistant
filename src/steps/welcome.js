import Alert from 'components/alert'
import breadcrumb from 'components/breadcrumb'
import Button from 'components/button'
import keyboard from 'utils/keyboard'
import reload from 'utils/reload'
import ws from 'utils/websocket'

export default (state, next) => {
  breadcrumb.select(0)
  breadcrumb.setText(`${state.mappable.length} possible strips connected`)

  ws.on('connected', reload)

  const message = [
    'All strips should have turned on. Check for connectivity if not.',
    'Once all strips are properly switched on, click <b data-color="green">start mapping</b>.'
  ]

  const alert = new Alert(message, {
    color: 'green',
    buttons: [
      new Button('cancel and reboot', {
        color: 'yellow',
        onclick: e => {
          alert.destroy()
          window.close()
          ws.send('reboot')
        }
      }),
      new Button('start mapping', {
        color: 'green',
        onclick: e => {
          e.preventDefault()
          alert.destroy()
          keyboard.off('enter')
          next(null, state)
        }
      })
    ]
  }).spawn()

  keyboard.once('enter', () => {
    alert.destroy()
    ws.off('connected', reload)
    next(null, state)
  })
}
