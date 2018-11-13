const configuration = require('@server/configuration')
const { exec } = require('child_process')

const isRoot = process.getuid && process.getuid() === 0
const isDarwin = process.platform === 'darwin'
const rebootCmd = isDarwin
  ? `osascript -e 'tell application "System Events" to restart'`
  : 'shutdown -r now'

if (!isDarwin && !isRoot) {
  console.log(`WARNING: ${configuration.appname} will need root privileges to reboot the system.`)
  console.log(`Read ${configuration.package.homepage.replace('#readme', '#allowing-rythmus-assistant-to-reboot-system')} for more details.`)
}

// NOTE: because system is rebooting, callback should run only when exec fails
module.exports = callback => exec(rebootCmd, callback)
