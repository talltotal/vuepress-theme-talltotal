const path = require('path')
module.exports = (options, context) => {
  return {
    chainWebpack (config) {
      // alias按order匹配，‘@temp/override.styl’需排在‘@temp’前面
      config.resolve.alias
        .delete('@temp')
        .set(
          '@temp/override.styl',
          path.resolve(context.tempPath, './palette.styl'),
        )
        .set('@temp', context.tempPath)
    },
  }
}
