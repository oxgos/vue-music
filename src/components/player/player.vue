<template>
  <div class="player" v-show="playlist.length > 0">
      <transition name="normal"
                  @enter="enter"
                  @after-enter="afterEnter"
                  @leave="leave"
                  @after-leave="afterLeave"
      >
        <div class="normal-player" v-show="fullScreen">
            <div class="background">
                <img width="100%" height="100%" :src="currentSong.image">
            </div>
            <div class="top">
                <div class="back" @click="back">
                    <i class="icon-back"></i>
                </div>
                <h1 class="title" v-html="currentSong.name"></h1>
                <h1 class="subtitle" v-html="currentSong.singer"></h1>
            </div>
            <div class="middle">
                <div class="middle-l">
                    <div class="cd-wrapper" ref="cdWrapper">
                        <div class="cd" :class="cdCls">
                            <img class="image" :src="currentSong.image">
                        </div>
                    </div>
                </div>
            </div>
            <div class="bottom">
                <div class="progress-wrapper">
                  <span class="time time-l">{{ format(currentTime) }}</span>
                  <div class="progress-bar-wrapper">
                    <progress-bar :percent="percent" @changePercent="changePercent"></progress-bar>
                  </div>
                  <span class="time time-r">{{ format(currentSong.duration) }}</span>
                </div>
                <div class="operators">
                    <div class="icon i-left">
                        <i class="icon-sequence"></i>
                    </div>
                    <div class="icon i-left" :class="disableCls">
                        <i class="icon-prev" @click="prevSong"></i>
                    </div>
                    <div class="icon i-center" :class="disableCls">
                        <i :class="playIcon" @click="togglePlaying"></i>
                    </div>
                    <div class="icon i-right" :class="disableCls">
                        <i class="icon-next" @click="nextSong"></i>
                    </div>
                    <div class="icon i-right">
                        <i class="icon icon-not-favorite"></i>
                    </div>
                </div>
            </div>
        </div>
      </transition>
      <transition name="mini">
        <div class="mini-player" v-show="!fullScreen" @click="open">
            <div class="icon">
                <img :class="cdCls" width="40" height="40" :src="currentSong.image">
            </div>
            <div class="text">
                <h2 class="name" v-html="currentSong.name"></h2>
                <p class="desc" v-html="currentSong.singer"></p>
            </div>
            <div class="control">
              <progress-circle :radius="radius" :percent="percent">
                <i :class="playMiniIcon" class="icon-mini" @click.stop.prevent="togglePlaying"></i>
              </progress-circle>
            </div>
            <div class="control">
                <i class="icon-playlist"></i>
            </div>
        </div>
      </transition>
      <!-- canplay是在歌曲已经加载完毕后触发, error在歌曲请求错误或者网络不通时触发, timeupdate监听歌曲播放时间 -->
      <audio :src="currentSong.url" ref="audio" @canplay="ready" @error="error" @timeupdate="updateTime"></audio>
  </div>
</template>

<script type="text/ecmascript-6">
import ProgressBar from 'base/progress-bar/progress-bar'
import ProgressCircle from 'base/progress-circle/progress-circle'
import animations from 'create-keyframe-animation'
import { prefixStyle } from 'common/js/dom'
import { mapGetters, mapMutations } from 'vuex'

const transform = prefixStyle('transform')

export default {
  data() {
    return {
      songReady: false,
      currentTime: 0,
      radius: 32
    }
  },
  methods: {
    // 变为全屏播放器
    open() {
      this.setFullScreen(true)
    },
    // 变为mini播放器
    back() {
      this.setFullScreen(false)
    },
    // 改变播放状态
    togglePlaying() {
      if (!this.songReady) {
        return
      }
      this.setPlayingState(!this.playing)
    },
    // 下一首歌
    nextSong() {
      // 如果歌曲没加载完毕,不能触发此按钮,避免用户切换歌曲过快
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex + 1
      if (index === this.playlist.length) {
        index = 0
      }
      this.setCurrentIndex(index)
      // 暂停后切换歌曲,歌曲播放了,但图标不对,所以先判断播放状态,更正播放状态
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    // 上一首歌
    prevSong() {
      if (!this.songReady) {
        return
      }
      let index = this.currentIndex - 1
      if (index === -1) {
        index = this.playlist.length - 1
      }
      this.setCurrentIndex(index)
      if (!this.playing) {
        this.togglePlaying()
      }
      this.songReady = false
    },
    ready() {
      this.songReady = true
    },
    error() {
      // 歌曲请求错误,就不会触发canplay,要使按钮有效,songReady也要改为true
      this.songReady = true
    },
    // 播放时间
    updateTime(e) {
      // 当前播放时间e.target.currentTime,单位为秒
      this.currentTime = e.target.currentTime
    },
    // progressBar派发的事件，监听touch事件改变的进度
    changePercent(percent) {
      this.$refs.audio.currentTime = percent * this.currentSong.duration
      // 暂停时，拖动进度条后，重新播放歌曲
      if (!this.playing) {
        this.togglePlaying()
      }
    },
    // 格式化播放时间
    format(interval) {
      // 向下取整数, 相当于Math.floor
      interval = interval | 0
      // 变为分钟数
      const min = interval / 60 | 0
      // 变为秒数
      const sec = this._pad(interval % 60)
      return `${min}:${sec}`
    },
    // 补零, n为补完零后多少位数
    _pad(num, n = 2) {
      let len = num.toString().length
      while (len < n) {
        num = '0' + num
        len++
      }
      return num
    },
    enter(el, done) {
      // 获取x,y移动距离和scale比例
      const { x, y, scale } = this._getPosAndScale()
      let animation = {
        0: {
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
        },
        60: {
          transform: `translate3d(0, 0, 0) scale(1.1)`
        },
        100: {
          transform: `translate3d(0, 0, 0) scale(1)`
        }
      }
      // 执行create-keyframe-animation库registerAnimation方法
      animations.registerAnimation({
        name: 'move',
        animation,
        presets: {
          duration: 500,
          easing: 'linear'
        }
      })
      // 执行create-keyframe-animation库runAnimation方法
      animations.runAnimation(this.$refs.cdWrapper, 'move', done)
    },
    afterEnter() {
      // 注销create-keyframe-animation库registerAnimation方法
      animations.unregisterAnimation('move')
      // 清除元素的animation style
      this.$refs.cdWrapper.style.animation = ''
    },
    leave(el, done) {
      const { x, y, scale } = this._getPosAndScale()
      // 缩小可不需写动画，直接transition即可
      this.$refs.cdWrapper.style.transition = 'all 0.4s linear'
      this.$refs.cdWrapper.style[transform] = `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      // 监听transitionend事件，完成后done
      this.$refs.cdWrapper.addEventListener('transitionend', done)
    },
    afterLeave() {
      // 清除样式
      this.$refs.cdWrapper.style.transition = ''
      this.$refs.cdWrapper.style[transform] = ''
    },
    /*
      **@获取计算缩小后的位置和缩放比例
    */
    _getPosAndScale() {
      // 缩小的图标宽度
      const targetWidth = 40
      // 缩小的图标中心点到屏幕左边的距离
      const paddingLeft = 40
      // 缩小的图标中心点到屏幕底部的距离
      const paddingBottom = 30
      // 大图标到屏幕顶部的距离
      const top = 80
      // 图标的宽度/高度(正方形)
      const originWidth = window.innerWidth * 0.8
      // 计算缩放比例
      const scale = targetWidth / originWidth
      // 大图标中心点移动到小图标中心点 x轴的距离
      const x = -(window.innerWidth / 2 - paddingLeft)
      // 大图标中心点移动到小图标中心点 y轴的距离
      const y = window.innerHeight - top - originWidth / 2 - paddingBottom
      return {
        x: x,
        y: y,
        scale: scale
      }
    },
    ...mapMutations({
      setFullScreen: 'SET_FULL_SCREEN',
      setPlayingState: 'SET_PLAYING_STATE',
      setCurrentIndex: 'SET_CURRENT_INDEX'
    })
  },
  computed: {
    // 计算进度条百分比
    percent() {
      return this.currentTime / this.currentSong.duration
    },
    cdCls() {
      return this.playing ? 'play' : 'play pause'
    },
    disableCls() {
      return this.songReady ? '' : 'disable'
    },
    // 大播放器暂停开始按钮图标
    playIcon() {
      return this.playing ? 'icon-pause' : 'icon-play'
    },
    // mini播放器暂停开始按钮图标
    playMiniIcon() {
      return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
    },
    ...mapGetters([
      'fullScreen',
      'playlist',
      'currentSong',
      'playing',
      'currentIndex'
      ])
  },
  components: {
    ProgressBar,
    ProgressCircle
  },
  watch: {
    currentSong () {
      this.$nextTick(() => {
        this.$refs.audio.play()
      })
    },
    playing (newVal) {
      const audio = this.$refs.audio
      this.$nextTick(() => {
        newVal ? audio.play() : audio.pause()
      })
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import '~common/stylus/variable'
@import '~common/stylus/mixin'

.player {
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;

    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);
    }

    .top {
      position: relative;
      margin-bottom: 25px;

      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;

        .icon-back {
          display: block;
          padding: 9px;
          font-size: $font-size-large-x;
          color: $color-theme;
          transform: rotate(-90deg);
        }
      }

      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }

      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }

    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;

      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;

        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          height: 100%;

          .cd {
            width: 100%;
            height: 100%;
            box-sizing: border-box;
            border: 10px solid rgba(255, 255, 255, 0.1);
            border-radius: 50%;

            &.play {
              animation: rotate 20s linear infinite;
            }

            &.pause {
              animation-play-state: paused;
            }

            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }
        }

        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;

          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }

      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;

        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;

          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;

            &.current {
              color: $color-text;
            }
          }
        }
      }
    }

    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;

      .dot-wrapper {
        text-align: center;
        font-size: 0;

        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;

          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }

      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;

        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 30px;
          line-height: 30px;
          width: 30px;

          &.time-l {
            text-align: left;
          }

          &.time-r {
            text-align: right;
          }
        }

        .progress-bar-wrapper {
          flex: 1;
        }
      }

      .operators {
        display: flex;
        align-items: center;

        .icon {
          flex: 1;
          color: $color-theme;

          &.disable {
            color: $color-theme-d;
          }

          i {
            font-size: 30px;
          }
        }

        .i-left {
          text-align: right;
        }

        .i-center {
          padding: 0 20px;
          text-align: center;

          i {
            font-size: 40px;
          }
        }

        .i-right {
          text-align: left;
        }

        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    &.normal-enter-active, &.normal-leave-active {
      transition: all 0.4s;

      .top, .bottom {
        transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32);
      }
    }

    &.normal-enter, &.normal-leave-to {
      opacity: 0;

      .top {
        transform: translate3d(0, -100px, 0);
      }

      .bottom {
        transform: translate3d(0, 100px, 0);
      }
    }
  }

  .mini-player {
    display: flex;
    align-items: center;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;

    &.mini-enter-active, &.mini-leave-active {
      transition: all 0.4s;
    }

    &.mini-enter, &.mini-leave-to {
      opacity: 0;
    }

    .icon {
      flex: 0 0 40px;
      width: 40px;
      padding: 0 10px 0 20px;

      img {
        border-radius: 50%;

        &.play {
          animation: rotate 10s linear infinite;
        }

        &.pause {
          animation-play-state: paused;
        }
      }
    }

    .text {
      display: flex;
      flex-direction: column;
      justify-content: center;
      flex: 1;
      line-height: 20px;
      overflow: hidden;

      .name {
        margin-bottom: 2px;
        no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
      }

      .desc {
        no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
      }
    }

    .control {
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;

      .icon-play-mini, .icon-pause-mini, .icon-playlist {
        font-size: 30px;
        color: $color-theme-d;
      }

      .icon-mini {
        font-size: 32px;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
