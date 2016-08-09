import babel from 'rollup-plugin-babel';

export default {
  entry: 'src/index.js',
  format: 'umd',
  plugins: [babel({
    presets: ['es2015-rollup']
  })],
  moduleName: 'VueImg',
  dest: 'vue-img.js'
};