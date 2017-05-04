#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');
const latestVersion = require('latest-version');
const chalk = require('chalk');
const packageJson = require('../package.json');

const script = process.argv[2];
const args = process.argv.slice(3);

const runScript = (script) => {
  const result = spawn.sync('node', [require.resolve('../scripts/' + script)].concat(args), {stdio: 'inherit'});
  if (result.signal) {
    if (result.signal === 'SIGKILL') {
      console.log('The build failed because the process exited too early.');
    } else if (result.signal === 'SIGTERM') {
      console.log('The build failed because the process exited too early.');
    }
    process.exit(1);
  }
  process.exit(result.status);
};

function execute() {
  switch (script) {
    case 'start':
    case 'build':
    runScript(script);
    break;
    default:
    console.log(`Unkown script ${script}.`);
  }
}

latestVersion('gourd').then(version => {
  if (packageJson.version !== version) {
    console.log(chalk.yellow('检测到 @ali/santa-cli 有新版本，建议及时更新！'), version);
  }
  execute();
}).catch((err) => {
  console.log('检测新版本失败', err);
  execute();
});
