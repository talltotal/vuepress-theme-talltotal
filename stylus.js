const path = require('path')
const stylus = require('stylus')
const parse = require('postcss/lib/parse')

module.exports = function (css, processOptions) {
  const preVisit = stylus.Evaluator.prototype.visitImport
  stylus.Evaluator.prototype.visitImport = function (node) {
    if (node.path.first.string) {
      node.path.first.string = node.path.first.string.replace('~@temp', 'vuepress/lib/app/.temp')
    }

    return preVisit.call(this, node)
  }

  return parse(stylus.render(css || '', {
    preferPathResolver: 'webpack',
    filename: processOptions.from,
    paths: [path.resolve(__dirname, './node_modules/')],
  }), processOptions)
}
