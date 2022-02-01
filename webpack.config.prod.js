const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

const buildConfig = require('./buildConfig')

module.exports = {
  bail: true,
  context: __dirname,
  devtool: 'source-map',
  entry: {
    main: buildConfig.paths.entry,
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        include: [buildConfig.paths.src],
        use: ['babel-loader'],
      },
      {
        test: /\.css$/,
        include: [buildConfig.paths.src],
        use: [
          MiniCssExtractPlugin.loader,
          {
            // Applies postcss-loader to @imported resources.
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: false,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },
  output: {
    chunkFilename: 'js/[name].[chunkhash].js',
    filename: 'js/[name].[chunkhash].js',
    path: buildConfig.paths.dist,
    publicPath: '/',
  },
  plugins: [
    new webpack.EnvironmentPlugin(['NODE_ENV', 'SEGMENT_KEY', 'SENTRY_DSN']),

    new HtmlWebpackPlugin({
      favicon: buildConfig.paths.public.favicon,
      // "inject: true" places all JavaScript resources at the bottom of the body element.
      inject: true,
      template: buildConfig.paths.public.html,
    }),

    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),

    new CopyWebpackPlugin({
      patterns: [
        {
          from: './_redirects',
        },
      ],
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
    modules: ['node_modules', buildConfig.paths.src],
  },
}
