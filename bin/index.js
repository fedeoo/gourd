#!/usr/bin/env node

'use strict';

const spawn = require('cross-spawn');
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

switch (script) {
  case 'start':
  case 'build':
    runScript(script);
    break;
  default:
    console.log(`Unkown script ${script}.`);
}
