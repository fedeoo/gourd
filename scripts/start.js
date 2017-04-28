'use strict';

process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const merge = require('lodash.merge');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const formatWebpackMessages = require('react-dev-utils/formatWebpackMessages');
const devServerConfig = require('../config/devServerConfig');
const gourdConfig = require('../utils/gourdConfig')();
const webpackConfig = require('../config/webpack.config.dev')(gourdConfig);

const serverConfig = merge({}, devServerConfig, gourdConfig.server);

function setupCompiler () {
  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch(err) {
    console.log(chalk.red('Failed to compile.'));
    console.log();
    console.log(err.message || err);
    console.log();
    process.exit(1);
  }

  let isFirstCompile = true;
  compiler.plugin('done', stats => {
    const messages = formatWebpackMessages(stats.toJson({}, true));
    const isSuccessful = !messages.errors.length && !messages.warnings.length;

    if (isSuccessful) {
      console.log(chalk.green('Compiled successfully!'));
    }
    if (isFirstCompile) {
      console.log(`The app is running at: ${chalk.cyan(`http://${serverConfig.host}:${serverConfig.port}/`)}`);
      isFirstCompile = false;
    }
    if (messages.errors.length) {
      console.log(chalk.red('Failed to compile.'));
      console.log();
      messages.errors.forEach((message) => {
        console.log(message);
        console.log();
      });
    }
  });
  return compiler;
}

function run() {
  const compiler = setupCompiler();
  const devServer = new WebpackDevServer(compiler, serverConfig);
  devServer.listen(serverConfig.port, serverConfig.port, (err) => {
    if (err) {
      return console.log(err);
    }
    console.log(chalk.cyan('Starting the development server...'));
  });
}

run();
