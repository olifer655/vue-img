const rollup = require('rollup').rollup;
const babel = require('rollup-plugin-babel');

rollup({
  entry: 'src/index.js',
  plugins: [babel({
    presets: ['es2015-rollup']
  })]
}).then(bundle => {
  bundle.write({
    format: 'umd',
    moduleId: 'VueImg',
    moduleName: 'VueImg',
    dest: 'vue-img.js'
  });
});
