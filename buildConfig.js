const path = require('path')

module.exports = {
  caches: {
    babel: path.resolve(__dirname, '.babel-cache'),
  },
  paths: {
    dist: path.resolve(__dirname, 'dist'),
    entry: path.resolve(__dirname, 'src/main.tsx'),
    public: {
      favicon: path.resolve(__dirname, 'public/img/favicon.ico'),
      html: path.resolve(__dirname, 'public/index.html'),
    },
    src: path.resolve(__dirname, 'src'),
  },
  webpackDevServerPort: 9005,
}
