import Alert from 'components/alert'
import Button from 'components/button'

import breadcrumb from 'components/breadcrumb'
import ws from 'utils/websocket'
import warnBeforeUnload from 'utils/warn-before-unload'

export default state => {
  breadcrumb.disable()
  warnBeforeUnload.disable()

  const message = [
    `The mapping has been saved to: <code>${state.success}</code>`,
    `In order to activate this configuration, you will now need to reboot <i>Rythmus</i>.`
  ]

  const alert = new Alert(message, {
    color: 'green',
    buttons: [
      new Button('reboot manually', {
        color: 'yellow',
        onclick: () => {
          alert.destroy()
          window.close()
          ws.send('quit')
        }
      }),
      new Button('reboot', {
        color: 'green',
        onclick: () => {
          alert.destroy()
          window.close()
          ws.send('reboot')
        }
      })
    ]
  }).spawn()
}
