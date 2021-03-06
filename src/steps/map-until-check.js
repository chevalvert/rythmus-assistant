import Alert from 'components/alert'
import Button from 'components/button'
import check from 'utils/state-checking'
import keyboard from 'utils/keyboard'
import map from 'utils/state-mapping'
import warnBeforeUnload from 'utils/warn-before-unload'

function speak (len) {
  return new Promise((resolve, reject) => {
    const message = [
      `${len} strip${len > 1 ? 's have' : ' has'} been flagged as incorrectly positionned.
      You will now have to remap ${len > 1 ? 'those strips' : 'this strip'}.`
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

export default (state, next) => {
  warnBeforeUnload.enable()

  ;(function run () {
    map(state)
      .then(state => check(state))
      .then(state => {
        const len = state.mappable.length
        if (len) {
          state.mappable.forEach(strip => {
            strip.box.setMapping(false)
            strip.box.enable()
            strip.box.removeClass('is-not-validated')
            strip.box.addClass('was-not-validated')
          })
          return speak(len).then(() => run())
        }
        next(null, state)
      })
      .catch(err => next(err, state))
  })()
}
