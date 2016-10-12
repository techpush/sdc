/**
 * start.js
 * Init app
 * @ndaidong
 */

/* global Bella doc Diagram svgPanZoom saveAs draggable */

(() => {

  var elInput = doc.get('elInput');
  var elOutput = doc.get('elOutput');
  var elBox = doc.get('elBox');
  var btnDownload = doc.get('btnDownload');

  var lastData = '';

  var Event = doc.Event;

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

  var getWindowSize = () => {
    let width = 0;
    let height = 0;
    if (window.innerWidth) {
      width = window.innerWidth;
      height = window.innerHeight;
    } else if (document.documentElement && document.documentElement.clientWidth) {
      width = document.documentElement.clientWidth;
      height = document.documentElement.clientHeight;
    } else if (document.body) {
      width = document.body.clientWidth;
      height = document.body.clientHeight;
    }
    return {
      width,
      height
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

  var updateDownloadLink = (svg) => {

    let xml = [
      `<?xml version="1.0" encoding="utf-8" standalone="no"?>`,
      `<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 20010904//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">`,
      `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">`,
      svg.innerHTML,
      `</svg>`
    ].join('');

    let title = 'Untitled Sequence Diagram';

    let a = lastData.split('\n');
    let m = a[0];
    let n = m.toLowerCase();
    if (n.startsWith('title') && n.includes(':')) {
      let b = m.indexOf(':');
      title = Bella.trim(m.substr(b + 1, m.length));
    }

    let fname = Bella.createAlias(title);

    btnDownload.onclick = () => {
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

  var updatePosition = (svg) => {
    let w = parseInt(svg.getAttribute('width'), 10);
    let h = parseInt(svg.getAttribute('height'), 10);

    let ws = getWindowSize();
    let ww = ws.width;
    let wh = ws.height - 70;
    let sw = Math.max(ww, w);
    let sh = Math.max(wh, h);
    svg.setAttribute('width', sw);
    svg.setAttribute('height', sh);
  };

  var updateDragger = () => {

    let svg = elOutput.querySelector('svg');

    svgPanZoom(svg, {
      viewportSelector: '#elOutput',
      zoomEnabled: true,
      controlIconsEnabled: false,
      dblClickZoomEnabled: false,
      contain: false,
      fit: false,
      center: true
    });

    updatePosition(svg);
    updateDownloadLink(svg);
  };

  var renderOutput = (v) => {
    try {
      let diagram = Diagram.parse(v);
      elOutput.empty();
      diagram.drawSVG(elOutput);
      lastData = v;
      updateDragger();
      return diagram;
    } catch (e) {
      return e;
    }
  };

  var debouncedRenderOutput = debounce(renderOutput, 1000);

  Event.on(elInput, 'keyup', () => {
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
    let handler = elBox.querySelector('.drag-handler');
    draggable(elBox, handler);
  };

  initSample();
})();
