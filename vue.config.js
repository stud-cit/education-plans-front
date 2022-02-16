const path = require('path');

module.exports = {
  transpileDependencies: [
    'vuetify'
  ],
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@c': path.resolve(__dirname, 'src/components'),
      },
    },
  },
}
