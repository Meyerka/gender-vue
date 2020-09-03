var path = require('path')

function resolve(dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  publicPath: '/gender-vue/',//process.env.NODE_ENV === 'production' ? '/gender-vue' : '/',

  configureWebpack: {
    resolve: {
      alias: {
        img: resolve('public/images')
      }
    },
    output: {
      libraryExport: 'default'
    }
  },
  css: {
    extract: false
  }
}
