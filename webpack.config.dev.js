const Dotenv = require('dotenv-webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const buildConfig = require('./buildConfig')

module.exports = {
  context: __dirname,
  devServer: {
    client: {
      logging: 'error', // The default value for this outputs too much in DevTools.
    },
    historyApiFallback: {
      disableDotRule: true,
    },
    host: '0.0.0.0',
    hot: true,
    port: buildConfig.webpackDevServerPort,
  },
  devtool: 'eval-cheap-module-source-map',
  entry: { main: buildConfig.paths.entry },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        include: [buildConfig.paths.src],
        loader: 'babel-loader',
        options: {
          cacheDirectory: buildConfig.paths.babelCache,
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

    new ReactRefreshWebpackPlugin(),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', buildConfig.paths.src],
  },
}
