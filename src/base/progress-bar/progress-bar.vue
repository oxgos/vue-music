<template>
  <div class="progress-bar" ref="progressBar" @click="progressClick">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import { prefixStyle } from 'common/js/dom'

  const progressBtnWidth = 16
  const transform = prefixStyle('transform')
  
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created () {
      // 传递整个touch事件的数据
      this.touch = {}
    },
    methods: {
      progressTouchStart (e) {
        // touch事件触发的flag标志
        this.touch.initiated = true
        // touch事件触发时按钮的初始位置
        this.touch.startX = e.touches[0].pageX
        // touch事件触发时的progress初始位置(不能在move事件时取this.$refs.progress.clientWidth,因为move时不断在改变)
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        // touch事件移动距离
        const deltaX = e.touches[0].pageX - this.touch.startX
        // Math.max用于排除小于0情况, Math.min用于排除超出进度条范围情况
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._offset(offsetWidth)
      },
      progressTouchEnd () {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressClick(e) {
        const rect = this.$refs.progressBar.getBoundingClientRect()
        const offsetWidth = e.pageX - rect.left
        this._offset(offsetWidth)
        this._triggerPercent()
        /* 点击按钮的时候会不正常
        this._offset(e.offsetX)
        this._triggerPercent() */
      },
      // 简单封闭dom元素偏移动作
      _offset(offsetWidth) {
        this.$refs.progress.style.width = `${offsetWidth}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
      },
      _triggerPercent() {
        const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
        const percent = this.$refs.progress.clientWidth / barWidth
        // 派发changePercent事件(用于touch事件完后改变歌曲进度)
        this.$emit('changePercent', percent)
      }
    },
    watch: {
      percent(newPercent) {
        // touch事件时不触发改变
        if (newPercent >= 0 && !this.touch.initiated) {
          // 因为圆形按钮不超出进度条，所以最长移动距离需减去按钮长度
          const barWidth = this.$refs.progressBar.clientWidth - progressBtnWidth
          const offsetWidth = barWidth * newPercent
          this._offset(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>