'use strict';

const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const AssetsPlugin = require('assets-webpack-plugin');
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const babelConfig = require('../utils/babelConfig');
const getEntry = require('../utils/getEntry');
const getHtmlPlugins = require('../utils/getHtmlPlugins');
const paths = require('./paths');

const isBuild = true;
module.exports = function (config) {

  const entryFiles = getEntry(config.entry, paths.appSrc, isBuild);
  const htmlPlugins = getHtmlPlugins(entryFiles, config.html, isBuild);

  let plugins = [
    new ExtractTextPlugin('[name].[contenthash:12].css'),
    new AssetsPlugin({ filename: `${paths.realativeBuild}/assets.json`, update: true }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new ParallelUglifyPlugin({
      uglifyJS: {
        sourceMap: false,
        compressor: {
          warnings: false,
        },
      },
    }),
  ];
  if (config.commonChunks) {
    plugins.push(new webpack.optimize.CommonsChunkPlugin(config.commonChunks));
  }
  plugins = plugins.concat(htmlPlugins);

  return {
    context: paths.appSrc,
    devtool: false,
    entry: entryFiles,
    output: {
      path: paths.appBuild,
      filename: '[name].[chunkhash:12].js',
      chunkFilename: '[name].[chunkhash:12].js',
      publicPath: '/',
      crossOriginLoading: 'anonymous', // lazy loaded script cross origin
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
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      }, {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
            query: {
              modules: !config.disableCssModule,
              importLoaders: 1,
              localIdentName: '[name]__[local]___[hash:base64:5]',
            },
          }, {
            loader: 'postcss-loader',
            query: {
              config: paths.ownPostCSSConfig,
            },
          }, {
            loader: 'sass-loader',
            query: {
              sourceMap: true,
            },
          }],
        }),
      }, {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        use: 'file-loader',
      }, {
        test: /\.woff2?(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&minetype=application/font-woff',
      }, {
        test: /\.(ttf|otf)(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&minetype=application/octet-stream',
      }, {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        use: 'url-loader?limit=10000&minetype=image/svg+xml',
      }, {
        test: /\.tsx?$/,
        use: 'ts-loader',
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
        use: ['url-loader?limit=8192&name=[path][name].[hash:12].[ext]'],
        exclude: /node_modules/,
      }, {
        test: /\.swf$/,
        use: 'file-loader?name=[name].[ext]',
      }],
    },
    // 注意这一步，构建器目录与仓库目录是分离的，你需要额外配置 loader 的位置
    resolveLoader: {
      modules: [paths.ownNodeModules],
    },
  };
}
