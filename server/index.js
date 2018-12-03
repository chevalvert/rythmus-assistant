#!/usr/bin/env node
require('module-alias/register')

const configuration = require('@server/configuration')
const fs = require('fs-extra')
const kill = require('@server-utils/kill')
const reboot = require('@server-utils/reboot')
const WebServer = require('@server-utils/web-server')

let standbyMode = configuration.standby

kill(process.title).then(() => {
  const web = WebServer(configuration['web-server'])
  const hnode = require('hnode')(configuration.hnode)
  const hnodeServer = new hnode.Server()

  // Make sure that web client as always all nodes informations
  hnodeServer.on('newnode', reconnect)

  // RX
  // NOTE: reboot callback is called only when reboot as failed
  web.on('reboot', () => reboot(err => { if (err) throw err }))
  web.on('blackout', () => hnodeServer.blackout())
  web.on('light:all', () => hnodeServer.setAll([255, 255, 255]))
  web.on('light', data => {
    const node = hnodeServer.getNodeByName(data.name)
    if (!node) return
    node.setStrip(data.index, new Array(configuration.hnode.NLEDS_STRIPS).fill(data.color || [255, 255, 255]))
  })

  web.on('save', data => {
    fs.outputJson(configuration.output, { nodes: data }, { spaces: 2 }, err => {
      web.broadcast('saved', { err, filename: configuration.output })
    })
  })

  // Connect web-client to rythmus
  web.on('client', () => {
    Promise.resolve()
      .then(resolveStandby)
      .then(() => kill('rythmus'))
      // NOTE: this is only call when --viewer=<PATH> is set
      .then(() => configuration.viewer && require('@server-utils/viewer')(configuration.viewer))
      .then(() => !hnodeServer.isRunning ? connect() : reconnect())
      .catch(err => console.log(err))
  })

  function resolveStandby () {
    // NOTE: with --standby, the web client will emit 'end-standby' when user
    // decides so. Without --standby, the web client will emits 'end-standby'
    // automatically on loading.
    web.broadcast('standby', standbyMode)
    return web.waitFor('end-standby').then(() => {
      // NOTE: once standby mode is deactivated, the only way to reactivate it is
      // by re-running rythmus-assistant, usually by rebooting the whole computer
      standbyMode = false
    })
  }

  function connect () {
    hnodeServer.start()
  }

  function reconnect () {
    web.broadcast('connected', getNodes())
  }

  function getNodes () {
    return hnodeServer.getAllNodes().map(node => ({
      ip: node.ip,
      name: node.name
    }))
  }
})
