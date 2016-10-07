/**
 * start.js
 * Init app
 * @ndaidong
 */

/* global Bella doc Diagram svgPanZoom saveAs */

(() => {

  var elInput = doc.get('elInput');
  var elOutput = doc.get('elOutput');
  var elShadowInput = doc.get('elShadowInput');

  var lastData = '';

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

  doc.Event.on(elInput, 'keyup', (evt) => {
    let ev = evt || window.event;
    let kc = ev.keyCode;
    if (kc !== 8 && kc !== 13) {
      return false;
    }
    let v = check(elInput.value);
    if (!v.length) {
      return false;
    }
    if (v === lastData) {
      return false;
    }
    return renderOutput(v);
  });


  var initSample = () => {
    let statements = [
      'Title: The process of service',
      'Bob -> Alice : request service',
      'Alice -> John : ask for help',
      'Alice -> Nina : verify',
      'John -> Tom : ask key',
      'Nina --> Alice : return result',
      'Tom --> Alice : share key',
      'Alice -->> Bob : reply'
    ];

    let v = statements.join('\n');
    elInput.value = v;
    renderOutput(v);
  };

  doc.ready(initSample);
})();
