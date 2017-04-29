'use strict';

const chalk = require('chalk');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const paths = require('../config/paths');

/**
 * [genarateHtmlPlugins 根据入口文件 build htmlplugin数组]
 * @param  {[String]} entryFiles [filePath]
 * @return {[Array]}
 * chunksName 形如： 'pages/data/ListView/entry'
 * htmlPath 形如 'pages/data/ListView/index.html',
 */
module.exports = function getHtmlPlugins(entryFiles, htmlConfig, isBuild) {
  const htmlPlugins = [];
  if (!htmlConfig) {
    htmlConfig = {
      filename: 'index.html',
      template: './index.html',
    }
  }
  if (!fs.existsSync(path.join(paths.appSrc, htmlConfig.template))) {
    console.log(chalk.red(`Template file is not exist!`));
    return [];
  }
  for (let chunkName in entryFiles) {
    if (entryFiles.hasOwnProperty(chunkName)) {
      const chunks = [chunkName];
      if (!isBuild) {
        chunks.push('devServerClient');
      }
      const entryFile = chunkName;
      htmlPlugins.push(new HtmlWebpackPlugin({
        chunks: chunks,
        filename: path.join(path.dirname(entryFile), htmlConfig.filename),
        template: htmlConfig.template,
      }));
    }
  }

  return htmlPlugins;
}
