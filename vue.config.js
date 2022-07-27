const path = require('path');

module.exports = {
  pages: {
    index: {
      entry: 'src/main.js',
      title: 'Каталог навчальних планів',
    },
  },
  transpileDependencies: [
    'vuetify'
  ],
  lintOnSave: false,

  chainWebpack: config => {
    config.performance
      .maxEntrypointSize(10000000)
      .maxAssetSize(10000000)
  },
  publicPath: process.env.NODE_ENV === 'production'
    ? ''
    : '/',

  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@c': path.resolve(__dirname, 'src/components'),
      },
    },
  },
}
