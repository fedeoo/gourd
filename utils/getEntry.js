'use strict';

const path = require('path');
const assert = require('assert');
const glob = require('glob');

const DEFAULT_ENTRY = './src/index.js';

function getFiles(entry, cwd) {
  if (Array.isArray(entry)) {
    return entry.reduce((memo, entryItem) => {
      return memo.concat(getFiles(entryItem, cwd));
    }, []);
  } else {
    assert(
      typeof entry === 'string',
      `getEntry/getFiles: entry type should be string, but got ${typeof entry}`
    );
    const files = glob.sync(entry, { cwd });
    return files.map((file) => {
      return (file.charAt(0) === '.') ? file : `.${path.sep}${file}`;
    });
  }
}

function getEntries(files, isBuild) {
  return files.reduce((entryObj, entryFile) => {
    const chunkName = entryFile;
    entryObj[chunkName] = isBuild ? [entryFile] :
      [require.resolve('react-hot-loader/patch'), require.resolve('webpack/hot/only-dev-server'), entryFile];
    return entryObj;
  }, {});
}

/**
 * [查找src下所有的 匹配, 生成 entry Map]
 * @return {[Object]}  形如 :
 * {
 * 'pages/data/ListView/entry.js': ['react-hot-loader/patch',  'webpack/hot/only-dev-server', './src/pages/data/ListView/entry.js'],
 * 	....
 * }
 */
module.exports = function (entry, appDirectory, isBuild) {
  const files = entry ? getFiles(entry, appDirectory) : [DEFAULT_ENTRY];
  return getEntries(files, isBuild);
}
