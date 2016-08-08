'use strice';

describe('Vue', function () {
  it('should be installed', function () {
    expect(Vue).to.exist;
  })
})

describe('VueImg', function () {
  it('should exist', function () {
    expect(VueImg).to.be.an('object')
  })

  describe('getSrc()', function () {
    let hash = '1fa68b8d589078c3d44e3ae3d7dac9fejpeg'

    it('should parse hash to a URL', function () {
      let arg = { hash }
      expect(VueImg.getSrc(arg))
        .to.contain('/1/fa/68b8d589078c3d44e3ae3d7dac9fejpeg.jpeg')
    })

    it('should use default cdn if prefix is not specified', function () {
      let arg = { hash }
      expect(VueImg.getSrc(arg))
        .to.startsWith('http://fuss10.elemecdn.com/')
    })

    it('should use specified prefix', function () {
      let arg = { hash, prefix: 'prefix' }
      expect(VueImg.getSrc(arg))
        .to.startsWith('prefix/')
    })

    it('should use specified suffix', function () {
      let arg = { hash, suffix: 'suffix' }
      expect(VueImg.getSrc(arg))
        .to.endsWith('suffix')
    })

    it('should handle size correctly', function () {
      let arg = { hash, width: 100, height: 50 }
      expect(VueImg.getSrc(arg))
        .to.contain('/thumbnail/!100x50r/')
        .and.contain('/gravity/Center/')
        .and.contain('/crop/100x50')

      arg = { hash, width: 100 }
      expect(VueImg.getSrc(arg))
        .to.contain('/thumbnail/100x/')

      arg = { hash, width: 50 }
      expect(VueImg.getSrc(arg))
        .to.contain('/thumbnail/50x/')
    })

    it('should handle quality correctly', function () {
      let arg = { hash, quality: 70 }
      expect(VueImg.getSrc(arg))
        .to.contain('/quality/70/')
    })
  })
})

describe('v-img', function () {
  const createVueObject = html => {
    let div = document.createElement('div')
    div.innerHTML = html
    let el = div.firstChild
    return new Vue({ el })
  }
  let hash = '1fa68b8d589078c3d44e3ae3d7dac9fejpeg'
  let vm = null

  before(function () {
    Vue.use(VueImg)
  })

  describe('v-img="hash"', function () {
    before(function (done) {
      vm = createVueObject(`<img v-img="'${hash}'">`)
      setTimeout(done, 1000)
    })
    it('should set src correctly', function () {
      expect(vm.$el.getAttribute('v-img')).to.not.exist
      expect(vm.$el.src).to.equal(VueImg.getSrc({ hash }))
    })
  })

  describe('loading="hash"', function () {
    before(function () {
      vm = createVueObject(`<img v-img="" loading="${hash}">`)
    })
    it('should set loading src', function () {
      expect(vm.$el.getAttribute('loading')).to.not.exist
      expect(vm.$el.src).to.equal(VueImg.getSrc({ hash }))
    })
  })

  describe('loading="hash"', function () {
    before(function () {
      vm = createVueObject(`<img v-img="" loading="${hash}">`)
    })
    it('should set loading src', function () {
      expect(vm.$el.getAttribute('loading')).to.not.exist
      expect(vm.$el.src).to.equal(VueImg.getSrc({ hash }))
    })
  })

  describe('error="hash"', function () {
    before(function (done) {
      let wrongHash = '1f888888888888888888888888888888jpeg'
      vm = createVueObject(`<img v-img="'${wrongHash}'" error="${hash}">`)
      setTimeout(done, 1000)
    })
    it('should display the specified error image', function () {
      expect(vm.$el.getAttribute('error')).to.not.exist
      expect(vm.$el.src).to.equal(VueImg.getSrc({ hash }))
    })
  })

  describe('when width is set', function () {
    before(function (done) {
      vm = createVueObject(`<img v-img="'${hash}'" width="50">`)
      setTimeout(done, 1000)
    })
    it('should have the specified width', function () {
      expect(vm.$el.getAttribute('width')).to.not.exist
      expect(vm.$el.width).to.equal(50)
    })
  })

  describe('when height is set', function () {
    before(function (done) {
      vm = createVueObject(`<img v-img="'${hash}'" height="50">`)
      setTimeout(done, 1000)
    })
    it('should have the specified height', function () {
      expect(vm.$el.getAttribute('height')).to.not.exist
      expect(vm.$el.height).to.equal(50)
    })
  })

  describe('when width and height are both set', function () {
    before(function (done) {
      vm = createVueObject(`<img v-img="'${hash}'" width="40" height="50">`)
      setTimeout(done, 1000)
    })
    it('should have the specified size', function () {
      expect(vm.$el.getAttribute('width')).to.not.exist
      expect(vm.$el.getAttribute('height')).to.not.exist
      expect(vm.$el.width).to.equal(40)
      expect(vm.$el.height).to.equal(50)
    })
  })

  describe('when suffix is set', function () {
    before(function (done) {
      vm = createVueObject(`<img v-img="'${hash}'" suffix="blur/3x5">`)
      setTimeout(done, 1000)
    })
    it('should load image src with specified suffix', function () {
      expect(vm.$el.getAttribute('suffix')).to.not.exist
      expect(vm.$el.src).endsWith("blur/3x5")
    })
  })

  describe('when use on a <div>', function () {
    before(function (done) {
      vm = createVueObject(`<div v-img="'${hash}'">`)
      setTimeout(done, 1000)
    })
    it('should set background-image', function () {
      expect(vm.$el.getAttribute('v-img')).to.not.exist
      let src = VueImg.getSrc({ hash })
      expect(vm.$el.style.backgroundImage).to.equal(`url("${src}")`)
    })
  })
})
