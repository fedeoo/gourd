'use strict';

const autoprefixer = require('autoprefixer');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const babelConfig = require('../utils/babelConfig');
const paths = require('./paths');

module.exports = function (config) {
  const devServer = config.server;
  const entry = Object.assign({
    devServerClient: `${require.resolve('webpack-dev-server/client')}?http://${devServer.host}:${devServer.port}`,
  }, config.entry);

  const htmlPlugins = (config.htmlChunks || []).map((htmlChunkConfig) => {
    const newConfig = Object.assign(htmlChunkConfig, {
      chunks: [].concat(htmlChunkConfig.chunks).concat('devServerClient'),
    });
    return new HtmlWebpackPlugin(newConfig);
  });
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
          options: {
            plugins: [autoprefixer({
              remove: false,
              browsers: ['last 2 versions', 'ie > 8', 'safari > 7'],
            })],
          },
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
          options: {
            plugins: [autoprefixer({
              remove: false,
              browsers: ['last 2 versions', 'ie > 8', 'safari > 7'],
            })],
          },
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
