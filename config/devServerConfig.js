'use strict';

const paths = require('./paths');
module.exports = {
  disableHostCheck: true,
  compress: true,
  clientLogLevel: 'none',
  contentBase: paths.appPublic,
  watchContentBase: true,
  hot: true,
  stats: {
    colors: true
  },
  publicPath: '/',
  watchOptions: {
    ignored: /node_modules/,
  },
  proxy: {},
  historyApiFallback: true,
};
