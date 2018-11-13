const ps = require('ps-node')
module.exports = (processName, allowSuicide = false) => new Promise((resolve, reject) => {
  ps.lookup({ command: processName }, (err, processes) => {
    if (err) reject(err)

    if (!processes || processes.length === 0) resolve()

    const processesToKill = processes.filter(({ pid }) => !(!allowSuicide && pid == process.pid)) // // eslint-disable-line eqeqeq
    if (!processesToKill.length) resolve()

    processesToKill.forEach(({ pid }) => {
      ps.kill(pid, 'SIGKILL', err => {
        if (err) reject(err)
        resolve()
      })
    })
  })
})
