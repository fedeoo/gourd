'use strict';

const path = require('path');
const fs = require('fs');
const merge = require('lodash.merge');

const appDirectory = fs.realpathSync(process.cwd());
function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}
function resolveOwn(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

const config = {
  src: 'src',
  build: 'build',
  public: 'public',
};

function setPath(paths) {
  merge(config, paths);
}

module.exports = {
  setPath,
  appSrc: resolveApp(config.src),
  appBuild: resolveApp(config.build),
  appPublic: resolveApp(config.public),
  appNodeModules: resolveApp('node_modules'),
  ownPath: resolveOwn('.'),
  ownNodeModules: resolveOwn('node_modules'),
}
