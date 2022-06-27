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
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src/'),
        '@c': path.resolve(__dirname, 'src/components'),
      },
    },
  },
}
