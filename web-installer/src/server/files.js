const { readdir } = require('fs').promises;
const { resolve } = require('path');
const fs = require('fs');
const errors = require('./errors');

module.exports = {
  readFile: (filePath) => {
    let file;
    try {
      file = fs.readFileSync(filePath);
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new errors.MissingFile(filePath);
      } else {
        throw err;
      }
    }
    return file;
  },
  getFiles: async (dir) => {
    let dirents;
    let foundFiles;
    try {
      dirents = await readdir(dir, { withFileTypes: true });
      foundFiles = await Promise.all(
        dirents.map((dirent) => {
          const res = resolve(dir, dirent.name);
          return dirent.isDirectory() ? module.exports.getFiles(res) : res;
        }),
      );
    } catch (err) {
      if (err.code === 'ENOENT') {
        throw new errors.MissingFile(dir);
      } else {
        throw err;
      }
    }
    return Array.prototype.concat(...foundFiles);
  },
};
