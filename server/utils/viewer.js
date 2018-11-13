const { spawn } = require('child_process')

let viewerHasBeenCalled = false

module.exports = appletPath => {
  // NOTE: due to how poorly Processing handles UDP connection, make sure the
  // viewer applet can only be called once by node session
  if (viewerHasBeenCalled) return

  viewerHasBeenCalled = true

  const applet = ['--sketch=' + appletPath, '--run']
  const spawnOptions = { detached: true }
  const viewer = spawn('processing-java', applet, spawnOptions)
  const killViewer = () => process.kill(-viewer.pid)

  viewer.stderr.on('data', data => console.log(`[viewer] ${data}`))
  viewer.stdout.on('data', data => console.log(`[viewer] ${data}`))

  viewer.on('close', process.exit)

  process.on('uncaughtException', err => {
    console.log(err)
    killViewer()
    process.exit(1)
  })

  process.on('SIGINT', killViewer)
  process.on('SIGTERM', killViewer)
}
