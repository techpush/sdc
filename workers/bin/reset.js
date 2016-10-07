#!/usr/bin/env node

/**
 * reset
 * @ndaidong
 **/

var pkg = require('../../package');
var builder = require('../builder');
var removeDir = builder.removeDir;

var fixPath = builder.fixPath;

var bConfig = pkg.builder;
var sourceDir = fixPath(bConfig.sourceDir);
var distDir = fixPath(bConfig.distDir);

removeDir([
  distDir,
  `${sourceDir}/js/vendor`,
  `${sourceDir}/css/vendor`
]);
