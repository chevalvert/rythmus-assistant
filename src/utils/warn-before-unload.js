export default {
  enable: () => {
    window.onbeforeunload = function () {
      return 'Are you sure you want to leave ? You will need to restart Rythmus manually'
    }
  },

  disable: () => {
    window.onbeforeunload = undefined
  }
}
