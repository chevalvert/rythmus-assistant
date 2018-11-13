import Alert from 'components/alert'
import Button from 'components/button'
import ws from 'utils/websocket'

const message = [
  `Rythmus-assistant is in standby mode: it usually means that <i>Rythmus</i> is currently running.`,
  `To stop <i>Rythmus</i> and proceed to the mapping setup, click <b data-color="red">leave&nbsp;standby&nbsp;mode</b>.`,
  `<b data-color="red">Please note that leaving the standby mode will ultimately result in <i>Rythmus</i> rebooting.</b>`
]

export default next => {
  ws.once('standby', isStandby => {
    if (!isStandby) {
      ws.send('end-standby')
      return next()
    }

    const alert = new Alert(message, {
      color: 'red',
      buttons: [
        new Button('leave standby mode', {
          color: 'red',
          onclick: e => {
            e.preventDefault()
            alert.destroy()
            ws.send('end-standby')
            next()
          }
        })
      ]
    }).spawn()
  })
}
