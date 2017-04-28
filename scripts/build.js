'use strict';

process.env.NODE_ENV = 'production';

const fs = require('fs-extra');
const chalk = require('chalk');
const webpack = require('webpack');
const FileSizeReporter = require('react-dev-utils/FileSizeReporter');
const gourdConfig = require('../utils/gourdConfig')();
const webpackConfig = require('../config/webpack.config.prod')(gourdConfig);
const paths = require('../config/paths');

const measureFileSizesBeforeBuild = FileSizeReporter.measureFileSizesBeforeBuild;
const printFileSizesAfterBuild = FileSizeReporter.printFileSizesAfterBuild;

function printErrors(summary, errors) {
  console.log(chalk.red(summary));
  console.log();
  errors.forEach(err => {
    console.log(err.message || err);
    console.log();
  });
}

function build(previousFileSizes) {
  let compiler;
  try {
    compiler = webpack(webpackConfig);
  } catch(err) {
    printErrors('Failed to compile.', [err]);
    process.exit(1);
  }

  compiler.run((err, stats) => {
    if (err) {
      printErrors('Failed to compile.', [err]);
    }

    if (stats.compilation.errors.length) {
      printErrors('Failed to compile.', stats.compilation.errors);
      process.exit(1);
    }

    if (process.env.CI && stats.compilation.warnings.length) {
      printErrors(
        'Failed to compile. When process.env.CI = true, warnings are treated as failures. Most CI servers set this automatically.',
        stats.compilation.warnings
      );
      process.exit(1);
    }

    console.log(chalk.green('Compiled successfully.'));
    console.log();

    console.log('File sizes after gzip:');
    console.log();
    printFileSizesAfterBuild(stats, previousFileSizes);
    console.log();
  });

}

measureFileSizesBeforeBuild(paths.appBuild).then(previousFileSizes => {
  // Remove all content but keep the directory so that
  // if you're in it, you don't end up in Trash
  fs.emptyDirSync(paths.appBuild);

  // Start the webpack build
  build(previousFileSizes);

  if (fs.existsSync(paths.appPublic)) {
    fs.copySync(paths.appPublic, paths.appBuild);
  }
});
