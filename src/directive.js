import getSrc from './get-src.js';

// set img.src or element.style.backgroundImage
const setAttr = (el, src) => {
  if (el.tagName === 'IMG') return el.src = src;
  el.style.backgroundImage = `url(${src})`;
};

// Vue directive
const install = (Vue, opt = {}) => {
  const imageSrc = (hash, width, height) => getSrc({
    hash,
    width,
    height,
    prefix: opt.prefix,
    quality: opt.quality
  });

  Vue.directive('img', {
    params: ['width', 'height', 'loading', 'error'],

    bind() {
      const loadHash = this.params.loading || opt.loading;

      if (typeof loadHash === 'string' && loadHash.length) {
        setAttr(this.el, imageSrc(loadHash, this.params.width, this.params.height));
      }
    },

    update(hash) {
      if (!hash) return;

      const img = new Image();
      const src = imageSrc(hash, this.params.width, this.params.height);
      const errHash = this.params.error || opt.error;

      img.onload = setAttr.bind(null, this.el, src);

      if (typeof errHash === 'string' && errHash.length) {
        const errImg = imageSrc(errHash, this.params.width, this.params.height);
        img.onerror = setAttr.bind(null, this.el, errImg);
      }

      img.src = src;
    }
  });
};

export default install;
