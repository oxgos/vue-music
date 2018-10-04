<template>
  <div class="slider" ref="slider">
      <div class="slider-group" ref="sliderGroup">
          <slot></slot>
      </div>
      <div class="dots">
        <span class="dot" v-for="(item, index) in dots" :key="index" :class="{ 'active': currentPageIndex === index}"></span>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll'
import { addClass } from 'common/js/dom'

export default {
  data () {
    return {
      dots: [],
      currentPageIndex: 0
    }
  },
  props: {
    loop: {
      type: Boolean,
      default: true
    },
    autoPlay: {
      type: Boolean,
      default: true
    },
    interval: {
      type: Number,
      default: 4000
    }
  },
  mounted () {
    // 保证dom渲染完成,为什么设置20毫秒,浏览器刷新机制是17毫秒(推荐兼容性好)
    // 也可以用this.$nextTick
    setTimeout(() => {
      this._setSlideWidth()
      this._initDots()
      this._initSlider()

      if (this.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider) {
        return
      }
      this._setSlideWidth(true)
      this.slider.refresh()
    }, false)
  },
  destroyed () {
    clearTimeout(this.timer)
  },
  methods: {
    _setSlideWidth(isResize) {
      this.children = this.$refs.sliderGroup.children

      let width = 0
      let sliderWidth = this.$refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        addClass(child, 'slider-item')
        child.style.width = `${sliderWidth}px`
        width += sliderWidth
      }

      // 如果要无缝轮播，前后2个要clone,所以要增加2个宽度
      if (this.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.$refs.sliderGroup.style.width = `${width}px`
    },
    _initDots() {
      this.dots = new Array(this.children.length)
    },
    _initSlider () {
      this.slider = new BScroll(this.$refs.slider, {
        scrollX: true,
        scrollY: false,
        momentum: false, // 惯性
        snap: {
          loop: this.loop,
          threshold: 0.3,
          speed: 400
        }
      })
      this.slider.on('scrollEnd', () => {
        this.currentPageIndex = this.slider.getCurrentPage().pageX
        if (this.autoPlay) {
          clearTimeout(this.timer)
          this._play()
        }
      })
    },
    _play () {
      this.timer = setTimeout(() => {
        this.slider.next()
      }, this.interval)
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>
