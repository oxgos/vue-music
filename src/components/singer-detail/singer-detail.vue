<template>
  <transition name="slide">
    <music-list></music-list>
  </transition>
</template>

<script type="text/ecmascript-6">
  import MusicList from 'components/music-list/music-list'
  import { getSingerDetail } from 'api/singer'
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
        getSingerDetail(this.singer.id).then(res => {
          if (res.code === ERR_OK) {
            console.log(res.data)
          }
        })
      }
    },
    computed: {
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
