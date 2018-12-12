<template>
    <div class="recommend" ref="recommend">
      <scroll ref="scroll" class="recommend-content" :data="discList">
        <div>
          <div class="slider-wrapper" v-if="recommends.length > 0">
            <slider>
              <div v-for="(item, index) in recommends" :key="index">
                <a :href="item.linkUrl">
                  <!-- 加class needsclick后,fastclick不会阻止默认行为 -->
                  <img class="needsclick" @load="loadImage" :src="item.picUrl" alt="slider">
                </a>
            </div>
            </slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
              <li @click="selectItem(item)" v-for="(item, index) in discList" :key="index" class="item">
                <div class="icon">
                  <img width="60" height="60" v-lazy="item.imgurl">
                </div>
                <div class="text">
                  <h2 class="name" v-html="item.creator.name"></h2>
                  <p class="desc" v-html="item.dissname"></p>
                </div>
              </li>
            </ul>
          </div>
        </div>
        <div class="loading-container" v-show="!discList.length">
          <loading></loading>
        </div>
      </scroll>
      <router-view></router-view>
    </div>
</template>

<script type="text/ecmascript-6">
  import Scroll from 'base/scroll/scroll'
  import Slider from 'base/slider/slider'
  import Loading from 'base/loading/loading'
  import { getRecommend, getDiscList } from 'api/recommend'
  import { ERR_OK } from 'api/config'
  import { playlistMixin } from 'common/js/mixin'

  export default {
      mixins: [playlistMixin],
      data () {
          return {
              recommends: [],
              discList: []
          }
      },
      created () {
        /*
          测试异步数据,并且不加onload监听图片时,scroll高度不正常
          setTimeout(() => {
            this._getRecommend()
          }, 2000)
        */
        this._getRecommend()
        this._getDiscList()
      },
      methods: {
          selectItem(item) {
            this.$router.push({
              path: `/recommend/${item.dissid}`
            })
          },
          handlePlaylist(playlist) {
            const bottom = playlist.length > 0 ? '60px' : ''
            this.$refs.recommend.style.bottom = bottom
            this.$refs.scroll.refresh()
          },
          _getRecommend () {
              getRecommend().then(res => {
                  if (res.code === ERR_OK) {
                      this.recommends = res.data.slider
                  }
              })
          },
          _getDiscList () {
            getDiscList().then(res => {
              if (res.code === ERR_OK) {
                this.discList = res.data.list
              }
            })
          },
          // recommends数据是异步的，不清楚discList和recommends哪个先后,并且recommends的图片高度是自适应的，不可以给定高度
          // recommends获取完，image再get请求读取,所以加一个onload事件，确保图片加载完后,scroll.refresh保证滚动的高度
          loadImage () {
            // 这个flag,为了只执行一次这refresh
            if (!this.checkLoadImage) {
              this.$refs.scroll.refresh()
              this.checkLoadImage = true
            }
          }
      },
      components: {
        Scroll,
        Slider,
        Loading
      }
  }
</script>

<style scoped lang="stylus">
@import "~common/stylus/variable"
  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
