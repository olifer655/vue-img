import getSrc from './get-src.js';

// set img.src or element.style.backgroundImage
const setAttr = (el, src) => {
  if (el.tagName === 'IMG') return el.src = src;
  el.style.backgroundImage = `url(${src})`;
  el.style.backgroundSize = '100%';
};

// Vue directive
const install = (Vue, opt = {}) => {
  const imageSrc = (hash, width, height, suffix) => getSrc({
    hash,
    width,
    height,
    suffix,
    prefix: opt.prefix,
    quality: opt.quality
  });

  Vue.directive('img', {
    params: ['width', 'height', 'suffix', 'loading', 'error'],

    bind() {
      const params = this.params;
      const loadHash = params.loading || opt.loading;

      setAttr(this.el, imageSrc(loadHash, params.width, params.height));
    },

    update(hash) {
      if (!hash) return;

      const params = this.params;
      const img = new Image();
      const src = imageSrc(hash, params.width, params.height, params.suffix);
      const errHash = params.error || opt.error;

      img.onload = setAttr.bind(null, this.el, src);

      if (typeof errHash === 'string' && errHash.length) {
        const errImg = imageSrc(errHash, params.width, params.height);
        img.onerror = setAttr.bind(null, this.el, errImg);
      }

      img.src = src;
    }
  });
};

export default install;
