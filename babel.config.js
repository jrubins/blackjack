module.exports = {
  env: {
    development: {
      plugins: ['react-refresh/babel'],
    },
  },
  plugins: ['@babel/plugin-proposal-class-properties', 'lodash'],
  presets: [
    [
      '@babel/preset-react',
      {
        runtime: 'automatic',
      },
    ],
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
