'use strict';

const webpack = require('webpack');
const babelConfig = require('../utils/babelConfig');
const paths = require('./paths');
const getEntry = require('../utils/getEntry');
const getHtmlPlugins = require('../utils/getHtmlPlugins');

module.exports = function (config) {
  const entryFiles = getEntry(config.entry, paths.appSrc, false);
  const devServer = config.server;
  const entry = Object.assign({
    devServerClient: `${require.resolve('webpack-dev-server/client')}?http://${devServer.host}:${devServer.port}`,
  }, entryFiles);
  console.log('entry', entry);

  const htmlPlugins = getHtmlPlugins(entryFiles, config.html, false);
  const plugins = [
    new webpack.HotModuleReplacementPlugin(),
  ].concat(htmlPlugins);
  if (config.commonChunks) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin(config.commonChunks));
  }

  return {
    context: paths.appSrc,
    devtool: 'inline-source-map',
    entry,
    output: {
      path: paths.appBuild,
      filename: '[name].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous',
    },
    resolve: {
      modules: [
        'node_modules',
        paths.appNodeModules,
        paths.appSrc,
      ],
      extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    },
    externals: config.externals || {},
    plugins,
    module: {
      rules: [{
        test: /\.css$/,
        use: ['style-loader', {
          loader: 'css-loader',
          options: {
            modules: false,
          },
        }, {
          loader: 'postcss-loader',
        }],
      }, {
        test: /\.scss$/,
        use: [{
          loader: 'style-loader',
        }, {
          loader: 'css-loader',
          options: {
            modules: !config.disableCSSModules,
            importLoaders: 1,
            localIdentName: '[name]__[local]___[hash:base64:5]',
          },
        }, {
          loader: 'postcss-loader',
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'file-loader',
      }, {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/font-woff',
      }, {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=application/octet-stream',
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader?limit=10000&minetype=image/svg+xml',
      }, {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        include: paths.appSrc,
      }, {
        test: /\.jsx?$/,
        use: {
          loader: 'babel-loader',
          options: babelConfig,
        },
        include: paths.appSrc,
      }, {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loaders: ['url-loader?limit=8192'],
        exclude: /node_modules/,
      }],
    },
    resolveLoader: {
      modules: [paths.ownNodeModules],
    },
  };
}
