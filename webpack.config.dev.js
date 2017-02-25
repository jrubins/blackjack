const DotenvPlugin = require('webpack-dotenv-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const buildConfig = require('./buildConfig');

module.exports = {
  context: __dirname,
  entry: [
    'react-hot-loader/patch',
    'webpack-dev-server/client?http://localhost:9005',
    'webpack/hot/only-dev-server',
    buildConfig.paths.app.mainJs,
  ],
  output: {
    filename: 'js/[name].js',
    path: buildConfig.paths.dist,
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: [
          buildConfig.paths.app.base,
        ],
        loader: 'babel-loader',
        options: {
          cacheDirectory: buildConfig.paths.cache,
        },
      },
      {
        test: /\.scss$/,
        include: [
          buildConfig.paths.app.base,
        ],
        use: [
          'style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    new DotenvPlugin({
      sample: '.env',
      path: '.env',
    }),
    new HtmlWebpackPlugin({
      favicon: buildConfig.paths.app.favicon,
      template: buildConfig.paths.app.html,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(),
  ],
  resolve: {
    modules: [
      'node_modules',
      buildConfig.paths.base,
    ],
    extensions: [
      '.js',
      '.jsx',
    ],
  },
  devServer: {
    historyApiFallback: true,
    hot: true,
    port: buildConfig.serverPort,
  },
};
