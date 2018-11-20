const fs = require('fs')
const path = require('path')
const pckg = require('package')(module)

const appname = pckg.name
process.title = appname

const defaultConfigPath = path.join(__dirname, '..', '.apprc')
const defaultConfig = JSON.parse(fs.readFileSync(defaultConfigPath, 'utf-8'))
const configuration = require('rc')(appname, defaultConfig)

configuration.output = path.resolve(configuration.output)
configuration['web-server'].public = path.isAbsolute(configuration['web-server'].public)
  ? configuration['web-server'].public
  : path.resolve(__dirname, '..', configuration['web-server'].public)
configuration.appname = appname
configuration.package = pckg
configuration.help = configuration.help || configuration.h
configuration.version = configuration.version || configuration.v

// Show help
if (configuration.help) {
  console.log(fs.readFileSync(path.join(__dirname, 'USAGE'), 'utf-8'))
  process.exit(0)
}

// Show version
if (configuration.version) {
  console.log(configuration.package.version)
  process.exit(0)
}

module.exports = configuration
