const Emitter = require('tiny-emitter')
const express = require('express')
const opn = require('opn')
const os = require('os')
const path = require('path')
const websocket = require('ws')

const app = express()

const defaultOpts = {
  'auto-open': false,
  port: 8888,
  public: path.join(__dirname, '..', '..', 'build')
}

module.exports = options => {
  options = Object.assign({}, defaultOpts, options || {})

  app.use(express.static(options.public))
  const server = app.listen(options.port, () => {
    const address = findFirstAvailableAddress()
    const url = `http://${address}:${options.port}`

    if (options['auto-open']) opn(url)
    console.log(`listenning to ${url}`)
  })

  const em = new Emitter()
  const wss = new websocket.Server({ server })

  wss.on('connection', client => {
    client.on('message', message => {
      const json = JSON.parse(message)
      em.emit(json.event, json.data)
    })
    em.emit('client', client)
  })

  const api = {
    emit: em.emit.bind(em),
    on: em.on.bind(em),
    once: em.once.bind(em),
    off: em.off.bind(em),
    waitFor: event => new Promise((resolve, reject) => em.once(event, resolve)),
    get server () { return server },
    get wss () { return wss },
    broadcast: (event, data) => wss.clients.forEach(client => client.send(JSON.stringify({ event, data })))
  }

  return api
}

function findFirstAvailableAddress () {
  let interfaces = os.networkInterfaces()
  let addresses = []
  for (let k in interfaces) {
    for (let k2 in interfaces[k]) {
      let address = interfaces[k][k2]
      if (address.family === 'IPv4' && !address.internal) {
        addresses.push(address.address)
      }
    }
  }
  return addresses[0]
}
