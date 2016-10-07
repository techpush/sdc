#!/usr/bin/env node

/**
 * release
 * @ndaidong
 **/

var pkg = require('../../package');
var builder = require('../builder');
var copyDir = builder.copyDir;
var copyFile = builder.copyFile;

var compiler = require('../compiler');
var iminify = compiler.iminify;

var fs = require('fs');
var path = require('path');
var fixPath = builder.fixPath;

var bConfig = pkg.builder;
var sourceDir = fixPath(bConfig.sourceDir);
var distDir = fixPath(bConfig.distDir);

var compileHTML = () => {
  copyDir(sourceDir, distDir);
  copyFile(`${sourceDir}/images/brand/favicon.ico`, `${distDir}/favicon.ico`);
  let buildOne = (file) => {

    let input = sourceDir + file;
    let output = distDir + file;

    let basename = path.basename(file);
    let extname = path.extname(file);
    let pagename = basename.replace(extname, '');
    if (extname !== '.html' && extname !== '.htm') {
      output = distDir + basename.replace(extname, '') + '.html';
    }

    compiler.build(input, true).then((result) => {
      if (result.css) {
        let dcss = distDir + 'css';
        fs.writeFileSync(dcss + `/${pagename}.min.css`, result.css, 'utf8');
      }
      if (result.js) {
        let djs = distDir + 'js';
        fs.writeFileSync(djs + `/${pagename}.min.js`, result.js, 'utf8');
      }

      if (result.html) {
        fs.writeFileSync(output, result.html, 'utf8');
      }
    });
  };

  let files = fs.readdirSync(sourceDir, 'utf8');
  if (files && files.length) {
    files.forEach((f) => {
      if (f.match(/([a-zA-Z-0-9]+)\.(html?|jade|pug|hbs)$/)) {
        buildOne(f);
      }
    });
  }
};

compileHTML();
iminify(distDir);
console.log(`Website has been released at ${distDir}`);
