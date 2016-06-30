(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define('VueImg', ['exports'], factory) :
  (factory((global.VueImg = global.VueImg || {})));
}(this, function (exports) { 'use strict';

  exports.canWebp = false;

  var img = new Image();
  img.onload = function () {
    exports.canWebp = true;
  };
  img.src = 'data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAsAAAABBxAREYiI/gcAAABWUDggGAAAADABAJ0BKgEAAQABABwlpAADcAD+/gbQAA==';

  // default cdn prefix
  var protocol = location.protocol === 'https:' ? 'https://' : 'http://';
  var pathname = document.domain.match('alpha.elenet.me') ? 'fuss.alpha.elenet.me' : 'fuss10.elemecdn.com';
  var cdn = protocol + pathname;

  // image hash to patch
  var hashToPath = function hashToPath(hash) {
    return hash.replace(/^(\w)(\w\w)(\w{29}(\w*))$/, '/$1/$2/$3.$4');
  };

  // image size
  var getSize = function getSize(width, height) {
    var sizeParam = 'thumbnail/';
    var cover = width + 'x' + height;

    if (width && height) return sizeParam + ('!' + cover + 'r/gravity/Center/crop/' + cover + '/');
    if (width) return sizeParam + (width + 'x/');
    if (height) return sizeParam + ('x' + height + '/');
    return '';
  };

  // image src
  var getSrc = function getSrc(opt) {
    if (!opt || typeof opt.hash !== 'string' || !opt.hash.length) return '';

    var prefix = typeof opt.prefix === 'string' ? opt.prefix : cdn;
    var quality = typeof opt.quality === 'number' ? 'quality/' + opt.quality + '/' : '';
    var format = exports.canWebp ? 'format/webp/' : '';
    var params = '' + quality + format + getSize(opt.width, opt.height);
    var suffix = params ? '?imageMogr/' + params : '';

    return prefix + hashToPath(opt.hash) + suffix;
  };

  // set img.src or element.style.backgroundImage
  var setAttr = function setAttr(el, src) {
    if (el.tagName === 'IMG') return el.src = src;
    el.style.backgroundImage = 'url(' + src + ')';
  };

  // Vue directive
  var install = function install(Vue) {
    var opt = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var imageSrc = function imageSrc(hash, width, height) {
      return getSrc({
        hash: hash,
        width: width,
        height: height,
        prefix: opt.prefix,
        quality: opt.quality
      });
    };

    Vue.directive('img', {
      params: ['width', 'height', 'loading', 'error'],

      bind: function bind() {
        var loadHash = this.params.loading || opt.loading;

        if (typeof loadHash === 'string' && loadHash.length) {
          setAttr(this.el, imageSrc(loadHash, this.params.width, this.params.height));
        }
      },
      update: function update(hash) {
        if (!hash) return;

        var img = new Image();
        var src = imageSrc(hash, this.params.width, this.params.height);
        var errHash = this.params.error || opt.error;

        img.onload = setAttr.bind(null, this.el, src);

        if (typeof errHash === 'string' && errHash.length) {
          var errImg = imageSrc(errHash, this.params.width, this.params.height);
          img.onerror = setAttr.bind(null, this.el, errImg);
        }

        img.src = src;
      }
    });
  };

  exports.getSrc = getSrc;
  exports.install = install;

  Object.defineProperty(exports, '__esModule', { value: true });

}));