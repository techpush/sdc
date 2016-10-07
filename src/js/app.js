/**
 * start.js
 * Init app
 * @ndaidong
 */

/* global Vue */

(() => {

  var createVueInstance = (el, data) => {
    return new Vue({
      el,
      data
    });
  };

  createVueInstance('#app', {
    message: 'Hello Vue!'
  });


})();
