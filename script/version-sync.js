const cp = require('child_process')
const rootPackage = require('../package.json')

const { version } = rootPackage

cp.exec(`cd ./packages && npm version ${version}`)
