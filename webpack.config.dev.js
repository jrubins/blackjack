const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

const buildConfig = require('./buildConfig')

module.exports = {
  context: __dirname,
  devServer: {
    clientLogLevel: 'error', // The default value for this outputs too much in DevTools.
    contentBase: buildConfig.paths.src,
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    hot: true,
    port: buildConfig.webpackDevServerPort,
  },
  devtool: 'eval-cheap-module-source-map',
  entry: [
    'react-hot-loader/patch',
    `webpack-dev-server/client?http://localhost:${buildConfig.webpackDevServerPort}`,
    'webpack/hot/only-dev-server',
    buildConfig.paths.entry,
  ],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [buildConfig.paths.src],
        loader: 'babel-loader',
        options: {
          cacheDirectory: buildConfig.caches.babel,
        },
      },
      {
        test: /\.css$/,
        include: [buildConfig.paths.src],
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  output: {
    chunkFilename: 'js/[name].js',
    filename: 'js/[name].js',
    path: buildConfig.paths.dist,
    publicPath: '/',
  },
  plugins: [
    new Dotenv(),

    new HtmlWebpackPlugin({
      favicon: buildConfig.paths.public.favicon,
      // "inject: true" places all JavaScript resources at the bottom of the body element.
      inject: true,
      template: buildConfig.paths.public.html,
    }),

    new webpack.HotModuleReplacementPlugin(),
  ],
  resolve: {
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', buildConfig.paths.src],
  },
}
