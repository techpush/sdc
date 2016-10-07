/**
 * For handling assets
 * @ndaidong
 **/

var path = require('path');
var fs = require('fs');
var readdir = require('recursive-readdir');

var bella = require('bellajs');
var Promise = require('promise-wtf');

var pkg = require('../package');
var bConfig = pkg.builder;
var sourceDir = bConfig.sourceDir;

var pug = require('pug');

var Handlebars = require('handlebars');
Handlebars.registerHelper({
  eq: (v1, v2) => {
    return v1 === v2;
  },
  ne: (v1, v2) => {
    return v1 !== v2;
  },
  lt: (v1, v2) => {
    return v1 < v2;
  },
  gt: (v1, v2) => {
    return v1 > v2;
  },
  lte: (v1, v2) => {
    return v1 <= v2;
  },
  gte: (v1, v2) => {
    return v1 >= v2;
  },
  and: (v1, v2) => {
    return v1 && v2;
  },
  or: (v1, v2) => {
    return v1 || v2;
  }
});

var postcss = require('postcss');
var postcssFilter = require('postcss-filter-plugins');
var cssnano = require('cssnano');
var cssnext = require('postcss-cssnext');
var precss = require('precss');
var scss = require('postcss-scss');
var rucksack = require('rucksack-css');
var mqpacker = require('css-mqpacker');

const POSTCSS_PLUGINS = [
  postcssFilter({
    silent: true
  }),
  mqpacker({
    sort: true
  }),
  precss,
  cssnext,
  rucksack
];

var parser = require('shift-parser');
var codegen = require('shift-codegen').default;
var babel = require('babel-core');

var SVGO = require('svgo');
var imagemin = require('imagemin');
var imageminMozjpeg = require('imagemin-mozjpeg');
var imageminPngquant = require('imagemin-pngquant');

var cheerio = require('cheerio');
var htmlmin = require('html-minifier').minify;

var fixPath = (p) => {
  if (!p) {
    return '';
  }
  p = p.replace(/\/([\/]+)/, '/');
  if (p.endsWith('/')) {
    return p;
  }
  return p + '/';
};

var isAbsolute = (url) => {
  return url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//'));
};

var transpile = (code) => {
  return babel.transform(code, {
    presets: ['es2015'],
    plugins: [
      'transform-remove-strict-mode'
    ]
  });
};

var jsminify = (code) => {
  let ast = parser.parseScript(code);
  return codegen(ast);
};

var postProcess = (css, minifying = true) => {
  let plugins = POSTCSS_PLUGINS.slice(0);
  if (minifying) {
    plugins.push(cssnano);
  }
  return new Promise((resolve, reject) => {
    return postcss(plugins)
      .process(css, {parser: scss})
      .then((result) => {
        return resolve(result.css);
      }).catch((err) => {
        return reject(err);
      });
  });
};

var compileCSS = (files) => {

  return new Promise((resolve, reject) => {
    let s = '';
    let as = [];
    let vs = [];
    if (bella.isString(files)) {
      files = [files];
    }
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        let x = fs.readFileSync(file, 'utf8');
        as.push(x);
      }
    });

    s = as.join('\n');

    if (s.length > 0) {
      let ps = vs.join('\n');
      return postProcess(s).then((rs) => {
        return resolve(ps + rs);
      }).catch((err) => {
        return reject(err);
      });
    }
    return reject(new Error('No CSS data'));
  });
};

var compileJS = (files) => {

  return new Promise((resolve, reject) => {
    let s = '';
    let as = [];
    if (bella.isString(files)) {
      files = [files];
    }
    files.forEach((file) => {
      if (fs.existsSync(file)) {
        let x = fs.readFileSync(file, 'utf8');
        if (!file.includes('vendor/')) {
          let r = transpile(x);
          x = r.code;
        }
        x = jsminify(x);
        if (!x.startsWith(';')) {
          x = ';' + x;
        }
        if (!x.endsWith(';')) {
          x += ';';
        }
        as.push(x);
      }
    });

    s = as.join('\n');

    if (s.length > 0) {
      return resolve(s);
    }
    return reject(new Error('No JavaScript data'));
  });
};

var iminify = (dir) => {
  let svgo = new SVGO();
  let minsvg = (file) => {
    let s = fs.readFileSync(file, 'utf8');
    svgo.optimize(s, (result) => {
      fs.writeFile(file, result.data, (er) => {
        if (er) {
          console.log(er);
        } else {
          console.log(`Minified SVG ${file}`);
        }
      });
    });
  };

  let minimg = (file) => {
    imagemin([file], {
      plugins: [
        imageminMozjpeg({targa: false}),
        imageminPngquant({quality: '65-80'})
      ]
    }).then((ls) => {
      ls.forEach((item) => {
        if (item && item.data) {
          fs.writeFile(file, item.data, (er) => {
            if (er) {
              console.log(er);
            } else {
              console.log(`Minified image ${file}`);
            }
          });
        }
      });
    }).catch((e) => {
      console.log(e);
    });
  };

  let rdir = fixPath(dir + 'images');
  readdir(rdir, (err, files) => {
    if (err) {
      console.trace(err);
    }
    if (files && files.length) {
      files.forEach((f) => {
        let b = path.extname(f);
        if (b === '.svg') {
          minsvg(f);
        } else if (b === '.jpg' || b === '.jpeg' || b === '.png') {
          minimg(f);
        }
      });
    }
  });
};


var build = (layout, isRelease = false) => {

  let file = path.normalize(layout);
  let dir = path.dirname(file);
  let basename = path.basename(file);
  let extname = path.extname(file);
  let pagename = basename.replace(extname, '');

  let c = fs.readFileSync(`./${sourceDir}/config.json`, 'utf8');
  let data = JSON.parse(c) || {};

  let getPartial = (ss, dd) => {
    let getPlaceHolders = (_s) => {
      let reg = /\{@includes\s+('?([A-Za-z0-9-.\/]+)'?|"?([A-Za-z0-9-.\/]+)"?)\}/;
      return _s.match(reg);
    };

    let a = ss.split('\n');
    let matches = [];
    if (a.length > 0) {
      a.forEach((line) => {
        if (line.includes('@includes')) {
          let m = getPlaceHolders(line);
          if (m && m.length > 2) {
            matches.push({
              place: m[0],
              name: m[2]
            });
          }
        }
      });
    }

    if (matches.length > 0) {
      matches.forEach((m) => {
        let place = m.place;
        let f = path.normalize(dd + '/' + m.name);
        if (fs.existsSync(f + '.html')) {
          f += '.html';
        } else if (fs.existsSync(f + '.htm')) {
          f += '.htm';
        } else if (fs.existsSync(f + '.hbs')) {
          f += '.hbs';
        }
        if (fs.existsSync(f)) {
          let cs = fs.readFileSync(f, 'utf8');
          if (cs) {
            let ps = path.dirname(f);
            cs = getPartial(cs, ps);
            ss = ss.replace(place, cs);
          }
        }
      });
    }
    return '\n' + ss;
  };

  let getContainer = (ss, dd) => {
    let reg = /\{@extends\s+('?([A-Za-z0-9-.\/]+)'?|"?([A-Za-z0-9-.\/]+)"?)\}/i;
    let matches = ss.match(reg);
    if (matches && matches.length > 2) {
      let place = matches[0];
      ss = ss.replace(place, '');
      let f = path.normalize(dd + '/' + matches[2]);
      if (fs.existsSync(f + '.html')) {
        f += '.html';
      } else if (fs.existsSync(f + '.htm')) {
        f += '.htm';
      } else if (fs.existsSync(f + '.hbs')) {
        f += '.hbs';
      }
      if (fs.existsSync(f)) {
        let cs = fs.readFileSync(f, 'utf8');
        if (cs) {
          ss = cs.replace('{@content}', ss);
        }
      }
    }
    return ss;
  };

  let continuable = true;
  let sHtml = '';
  let $;

  let html = '';
  let css = '';
  let js = '';

  let cssFiles = [];
  let jsFiles = [];

  let revision = bella.id;

  let isJade = file.match(/\.(jade|pug)$/) !== null;

  if (!data || !bella.isObject(data)) {
    data = {
      meta: {}
    };
  }

  return new Promise((resolve, reject) => {
    return Promise.series([
      (next) => {
        if (!fs.existsSync(file)) {
          console.log('Layout missing: %s', file);
          continuable = false;
        }
        next();
      },
      (next) => {
        if (!continuable) {
          return next();
        }
        return fs.readFile(file, 'utf8', (err, s) => {
          if (err) {
            console.trace(err);
          }
          sHtml = s;
          return next();
        });
      },
      (next) => {
        if (!continuable || !sHtml || isJade) {
          return next();
        }
        sHtml = getContainer(sHtml, dir);
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || isJade) {
          return next();
        }
        sHtml = getPartial(sHtml, dir);
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || isJade) {
          return next();
        }
        let template = Handlebars.compile(sHtml);
        sHtml = template(data);
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || !isJade) {
          return next();
        }
        let template = pug.compile(sHtml, {
          filename: basename,
          pretty: isRelease
        });
        sHtml = template(data);
        return next();
      },
      (next) => {
        if (!continuable || !sHtml) {
          return next();
        }
        $ = cheerio.load(sHtml, {
          normalizeWhitespace: true
        });
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || !$ || !isRelease) {
          return next();
        }
        $('link[rel="stylesheet"]').each((i, elem) => {
          let ofile = $(elem).attr('href');
          if (!isAbsolute(ofile)) {
            cssFiles.push(dir + '/' + ofile);
            $(elem).remove();
          }
        });
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || !$ || !isRelease) {
          return next();
        }
        $('script[type="text/javascript"]').each((i, elem) => {
          let ofile = $(elem).attr('src');
          if (!isAbsolute(ofile)) {
            jsFiles.push(dir + '/' + ofile);
            $(elem).remove();
          }
        });
        return next();
      },
      (next) => {
        if (!continuable || !sHtml || !$ || !isRelease) {
          return next();
        }
        console.log('Compiling CSS...');
        return compileCSS(cssFiles).then((content) => {
          css = content;
          let styleTag = `<link rel="stylesheet" type="text/css" href="css/${pagename}.min.css?rev=${revision}" />`;
          $('head').append(styleTag);
          return content;
        }).finally(next);
      },
      (next) => {
        if (!continuable || !sHtml || !$ || !isRelease) {
          return next();
        }
        console.log('Compiling JS...');
        return compileJS(jsFiles).then((content) => {
          js = content;
          let scriptTag = `<script type="text/javascript" src="js/${pagename}.min.js?rev=${revision}"></script>`;
          $('body').append(scriptTag);
          return content;
        }).finally(next);
      },
      (next) => {
        if (!continuable || !sHtml || !$ || !isRelease) {
          return next();
        }
        console.log('Cleaning HTML...');
        let s = $.html();
        html = htmlmin(s, {
          collapseWhitespace: true,
          preserveLineBreaks: true,
          quoteCharacter: '"',
          removeComments: true,
          removeEmptyAttributes: true,
          useShortDoctype: true
        });
        return next();
      }
    ]).then(() => {
      if (!html) {
        html = bella.trim(sHtml);
      }
      return resolve({
        html,
        css,
        js
      });
    }).catch((err) => {
      console.trace(err);
      return reject(err);
    });
  });
};

var io = (req, res, next) => {
  let p = req.path;
  if (p === '/') {
    p = '/index.html';
  }
  let f = `./${sourceDir}${p}`;

  if (!path.extname(f)) {
    if (fs.existsSync(f + '.jade')) {
      f += '.jade';
    } else if (fs.existsSync(f + '.pug')) {
      f += '.pug';
    } else if (fs.existsSync(f + '.htm')) {
      f += '.htm';
    } else if (fs.existsSync(f + '.html')) {
      f += '.html';
    } else if (fs.existsSync(f + '.hbs')) {
      f += '.hbs';
    }
    p += path.extname(f);
  }

  if (p.match(/^\/([a-zA-Z-0-9]+)\.(html?|jade|pug|hbs)$/)) {
    if (fs.existsSync(f)) {
      console.log(`Compiling with template engine: ${f}`);
      return build(f).then((data) => {
        return res.status(200).send(data.html);
      });
    }
  } else if (p.match(/\/([a-zA-Z-0-9]+)\.(css|sass|scss)$/)) {
    if (fs.existsSync(f) && !p.includes('vendor/')) {
      console.log(`Processing with PostCSS: ${f}`);
      let s = fs.readFileSync(f, 'utf8');
      return postProcess(s, false).then((css) => {
        return res.status(200).type('text/css').send(css);
      });
    }
  } else if (p.match(/\/([a-zA-Z-0-9]+)\.(js|es6)$/)) {
    if (fs.existsSync(f) && !p.includes('vendor/')) {
      console.log(`Transpiling with Babel: ${f}`);
      let s = fs.readFileSync(f, 'utf8');
      let r = transpile(s);
      let js = r.code || '';
      return res.status(200).type('text/javascript').send(js);
    }
  }
  return next();
};

module.exports = {
  fixPath,
  isAbsolute,
  transpile,
  postProcess,
  jsminify,
  iminify,
  build,
  io
};
