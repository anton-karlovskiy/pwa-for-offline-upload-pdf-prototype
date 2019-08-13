
const fs = require('fs');
const util = require('util');

exports.createFolder = async path => {
  const promisedMkDir = util.promisify(fs.mkdir);
  try {
      await promisedMkDir(path, { recursive: true });
  } catch (error) {
      console.log('[server utils createFolder] error => ', error);
  }
};
