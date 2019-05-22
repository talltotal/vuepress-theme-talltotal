const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const rootPackage = require('../package.json')

const { version } = rootPackage

cp.exec(`cd ./packages && npm version ${version}`)
fs.copyFile(path.join(__dirname, '../README.md'), path.join(__dirname, '../packages/README.md'), (err) => {
  if (err) throw err
})
