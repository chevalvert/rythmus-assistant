const { exec } = require('child_process')

// NOTE: callback should executes only when exec fails
module.exports = callback => exec('shutdown -r now', callback)
