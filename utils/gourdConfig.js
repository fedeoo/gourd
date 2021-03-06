'use strict';

const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const merge = require('lodash.merge');
const paths = require('../config/paths');

const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

const baseConfig = {
  entry: './index.js',
  publicPath: '/',
  externals: {
  },
  disableCSSModules: false,
  server: {
    host: '127.0.0.1',
    port: 8080,
    proxy: {},
  },
};

module.exports = (configPath) => {
  if (!configPath) {
    configPath = resolveApp('gourd.config.js');
  }

  let customConfig = {};
  if (fs.existsSync(configPath)) {
    customConfig = require(configPath);
    console.log(chalk.cyan(`Using config at ${configPath}`));

    if (customConfig.env) {
      const env = process.env.NODE_ENV;
      if (customConfig.env[env]) {
        merge(customConfig, customConfig.env[env]);
      }
      delete customConfig.env;
    }
    paths.setPath(customConfig.paths);
  }

  return merge({}, baseConfig, customConfig);
};
