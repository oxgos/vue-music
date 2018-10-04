<template>
  <transition name="slide">
    <music-list :songs="songs" :title="title" :bgIamge="bgIamge"></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
  import { creatSong } from 'common/js/song'
  import { ERR_OK } from 'api/config'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        songs: []
      }
    },
    created () {
      this._getSingerDetail()
    },
    methods: {
      _getSingerDetail() {
        if (!this.singer.id) {
          this.$router.push({
            path: '/singer'
          })
          return
        }
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            this.songs = this._normalizeSinger(res.data.list)
          }
        })
      },
      _normalizeSinger(list) {
        let ret = []
        list.forEach((item, i) => {
          let { musicData } = item
          if (musicData.songid && musicData.albummid) {
            ret.push(creatSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title () {
        return this.singer.name
      },
      bgIamge() {
        return this.singer.avatar
      },
      ...mapGetters([
        'singer'
      ])
    },
    components: {
      MusicList
    }
  }
</script>

<style scoped lang="stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>
