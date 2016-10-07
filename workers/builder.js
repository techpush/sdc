/**
 * Common scenario for setting up and optimizing system
 * @ndaidong
 **/

var fs = require('fs');
var path = require('path');
var exec = require('child_process').execSync;

var bella = require('bellajs');
var mkdirp = require('mkdirp').sync;
var cpdir = require('copy-dir').sync;
var readdir = require('recursive-readdir');

var compiler = require('./compiler');
var fixPath = compiler.fixPath;

var download = (src, saveas) => {
  if (fs.existsSync(saveas)) {
    fs.unlink(saveas);
  }
  console.log('Downloading %s ...', src);
  exec('wget -O ' + saveas + ' ' + src);
  console.log('Downloaded %s', saveas);
};

var createDir = (ls) => {
  if (bella.isArray(ls)) {
    ls.forEach((d) => {
      d = path.normalize(d);
      if (!fs.existsSync(d)) {
        mkdirp(d);
        console.log('Created dir "%s"... ', d);
      }
    });
  } else {
    ls = path.normalize(ls);
    if (!fs.existsSync(ls)) {
      mkdirp(ls);
    }
  }
};

var removeDir = (ls) => {
  if (bella.isArray(ls)) {
    let k = 0;
    ls.forEach((d) => {
      d = path.normalize(d);
      exec('rm -rf ' + d);
      ++k;
      console.log('%s, removed dir "%s"... ', k, d);
    });
  } else {
    ls = path.normalize(ls);
    exec('rm -rf ' + ls);
  }
  console.log('Done.');
};

var copyDir = (from, to) => {
  if (!fs.existsSync(from)) {
    return false;
  }
  if (fs.existsSync(to)) {
    exec('rm -rf ' + to);
  }
  mkdirp(to);
  cpdir(from, to);
  return false;
};

var copyFile = (source, target) => {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(target)) {
      fs.unlinkSync(target);
    }
    let rd = fs.createReadStream(source);
    rd.on('error', reject);
    let wr = fs.createWriteStream(target);
    wr.on('error', reject);
    wr.on('finish', resolve);
    rd.pipe(wr);
  });
};

var createEmptyFile = (dest) => {
  let ext = path.extname(dest);
  let fname = path.basename(dest);
  let content = '';
  if (ext === '.js') {
    content = '/**' + fname + '*/';
  } else if (ext === '.css' || ext === '.less') {
    content = '/*' + fname + '*/';
  }
  fs.writeFileSync(dest, content, {
    encoding: 'utf8'
  });
};

module.exports = {
  fixPath,
  download,
  readdir,
  createDir,
  removeDir,
  copyDir,
  copyFile,
  removeFile: (f) => {
    return exec('rm -rf ' + f);
  },
  createEmptyFile
};
