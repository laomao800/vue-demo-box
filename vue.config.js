module.exports = {
  publicPath: '',

  pages: {
    index: {
      entry: 'dev'
    }
  },

  productionSourceMap: false,

  css: {
    extract: false
  },

  configureWebpack: config => {
    const webpack = require('webpack')
    const version = process.env.VERSION || require('./package.json').version
    const banner = `@laomao800/vue-demo-box v${version}`
    config.plugins.push(new webpack.BannerPlugin(banner))
  }
}
