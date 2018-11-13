import warnBeforeUnload from 'utils/warn-before-unload'

export default () => {
  warnBeforeUnload.disable()
  window.location.reload()
}
