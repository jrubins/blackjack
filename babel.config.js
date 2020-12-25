module.exports = {
  plugins: [
    '@babel/plugin-proposal-class-properties',
    'lodash',
    'react-hot-loader/babel',
  ],
  presets: [
    '@babel/react',
    [
      '@babel/env',
      {
        corejs: 3,
        modules: false,
        useBuiltIns: 'usage',
      },
    ],
    '@babel/typescript',
  ],
}
