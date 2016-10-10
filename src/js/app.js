/**
 * start.js
 * Init app
 * @ndaidong
 */

/* global Bella doc Diagram svgPanZoom saveAs Headroom */

(() => {

  var elInput = doc.get('elInput');
  var elOutput = doc.get('elOutput');
  var elShadowInput = doc.get('elShadowInput');

  var lastData = '';

  var debounce = (func, wait) => {

    let timeout, args, context, timestamp;

    return function _(..._args) {

      context = this; // eslint-disable-line
      args = _args;
      timestamp = Date.now();

      let later = function _later() {

        let last = Date.now() - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          func.apply(context, args);
        }
      };

      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
    };
  };

  var addColon = (s) => {
    if (s.includes(':')) {
      return s;
    }
    return s + ' : ';
  };

  var check = (s) => {
    let x = Bella.trim(s);
    if (!x.length) {
      return '';
    }
    let a = x.split(/\n/);
    if (!a.length) {
      return '';
    }
    let b = a.map(addColon);
    x = b.join('\n');
    return x;
  };

  var updateDownloadLink = () => {
    let svg = elOutput.querySelector('svg');
    let w = parseInt(svg.width.baseVal, 10);
    let h = parseInt(svg.height.baseVal, 10);
    let xml = [
      `<?xml version="1.0" encoding="utf-8" standalone="no"?>`,
      `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">`,
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" xmlns:xlink="http://www.w3.org/1999/xlink">`,
      svg.innerHTML,
      `</svg>`
    ].join('');

    let title = 'Sequence Diagram';

    let a = lastData.split('\n');
    let m = a[0];
    let n = m.toLowerCase();
    if (n.startsWith('title') && n.includes(':')) {
      let b = m.indexOf(':');
      title = Bella.trim(m.substr(b + 1, m.length));
    }

    let fname = Bella.createAlias(title);

    let lnk = doc.add('SPAN', elOutput);
    lnk.addClass('link-download');
    lnk.html('Download');
    lnk.onclick = () => {
      svg.focus();
      saveAs(
        new Blob(
          [xml],
          {type: 'application/image/svg+xml;charset=utf-8'}
        ),
        `${fname}.svg`
      );
    };
  };

  var updateDragger = () => {
    svgPanZoom('#elOutput svg', {
      viewportSelector: '#elOutput',
      zoomEnabled: true,
      controlIconsEnabled: false,
      dblClickZoomEnabled: false,
      contain: true,
      fit: true,
      center: true
    });

    setTimeout(updateDownloadLink, 100);
  };

  var renderOutput = (v) => {
    try {
      let diagram = Diagram.parse(v);
      elOutput.empty();
      diagram.drawSVG(elOutput);
      elShadowInput.html(v);
      updateDragger();
      lastData = v;
      return diagram;
    } catch (e) {
      return e;
    }
  };

  var debouncedRenderOutput = debounce(renderOutput, 1000);

  doc.Event.on(elInput, 'keyup', () => {
    let v = check(elInput.value);
    if (!v.length || v === lastData) {
      return false;
    }
    return debouncedRenderOutput(v);
  });


  var initSample = () => {
    let v = [
      'Title: The process of service',
      'Bob -> Alice : request service',
      'Alice -> John : ask for help',
      'Alice -> Nina : verify',
      'John -> Tom : ask key',
      'Nina -> Alice : return result',
      'Note right of Tom : Tom does not remember',
      'Tom --> Tom : ask himself',
      'Tom --> Nina : ask for a hint',
      'Note left of Nina : Nina forgot too',
      'Nina --> Tom : reject',
      'Tom --> Kelly : ask for a hint',
      'Kelly -->> Tom : hint',
      'Tom --> Alice : share key',
      'Alice -->> Bob : reply'
    ].join('\n');

    elInput.value = v;

    renderOutput(v);
  };

  doc.ready(() => {
    initSample();
    let header = doc.one('.headroom');
    let headroom = new Headroom(header);
    headroom.init();
  });
})();
