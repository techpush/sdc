/**
 * server.js
 * app start
**/

var minimist = require('minimist');
var express = require('express');
var app = express();

var compiler = require('./workers/compiler');

var pkg = require('./package');
var bConfig = pkg.builder;
var sourceDir = bConfig.sourceDir;

app.use(compiler.io);
app.use(express.static(sourceDir));
app.use((req, res) => {
  return res.status(404).send('File not found');
});

var argv = minimist(process.argv.slice(2));
var port = argv.port || argv.p;
if (port && port >= 0 && port <= 65536) {
  app.listen(port, () => {
    console.log(`Server started running at ${port}`);
    console.log(`http://localhost:${port}`);
  });
}
