#!/usr/bin/env node

/**
 * setup
 * @ndaidong
 **/

var pkg = require('../../package');
var builder = require('../builder');
var createDir = builder.createDir;

var bella = require('bellajs');

var fs = require('fs');
var fixPath = builder.fixPath;

var bConfig = pkg.builder;
var sourceDir = fixPath(bConfig.sourceDir);
var distDir = fixPath(bConfig.distDir);

var getResources = () => {
  let download = builder.download;
  let jsFiles = bConfig.javascript || {};
  let cssFiles = bConfig.css || {};
  if (bella.isObject(jsFiles)) {
    let js3rdDir = fixPath(sourceDir + '/js/vendor');
    let rd = fixPath(js3rdDir);
    if (!fs.existsSync(rd)) {
      createDir(rd);
    }
    for (let alias in jsFiles) {
      if (bella.hasProperty(jsFiles, alias)) {
        let src = jsFiles[alias];
        let dest = rd + alias + '.js';
        if (!fs.existsSync(dest)) {
          download(src, dest);
        }
      }
    }
  }
  if (bella.isObject(cssFiles)) {
    let css3rdDir = fixPath(sourceDir + '/css/vendor');
    let rd = fixPath(css3rdDir);
    if (!fs.existsSync(rd)) {
      createDir(rd);
    }
    for (let alias in cssFiles) {
      if (bella.hasProperty(cssFiles, alias)) {
        let src = cssFiles[alias];
        let dest = rd + alias + '.css';
        if (!fs.existsSync(dest)) {
          download(src, dest);
        }
      }
    }
  }
};

createDir([
  distDir
]);
getResources();
