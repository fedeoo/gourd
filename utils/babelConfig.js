'use strict';

const path = require('path');

module.exports = {
  babelrc: false,
  presets: [
    require.resolve('babel-preset-react'),
    [require.resolve('babel-preset-es2015'), { modules: false }],
    require.resolve('babel-preset-stage-0'),
  ],
  plugins: [
    require.resolve('react-hot-loader/babel'),
    require.resolve('babel-plugin-transform-decorators-legacy'),
    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      // Resolve the Babel runtime relative to the config.
      moduleName: path.dirname(require.resolve('babel-runtime/package')),
    }],
  ],
};
