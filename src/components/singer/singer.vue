<template>
    <div class="singer" ref="singer">
        <listview :data="singers"></listview>
    </div>
</template>

<script type="text/ecmascript-6">
import { getSingerList } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'

const HOT_NAME = '热门'
const HOT_SINGER_LEN = 10

export default {
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSingerList()
  },
  methods: {
    _getSingerList () {
      getSingerList().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normallizeSinger(res.data.list)
        }
      })
    },
    _normallizeSinger (list) {
      let map = {
        hot: {
          title: HOT_NAME,
          item: []
        }
      }
      list.forEach((item, i) => {
        if (i < HOT_SINGER_LEN) {
          map.hot.item.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }

        const key = item.Findex
        if (!(key in map)) {
          map[key] = {
            title: key,
            item: []
          }
        }
        map[key].item.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，我们需要处理 map
      let ret = []
      let hot = []
      for (let key in map) {
        let val = map[key]
        if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        } else if (val.title === HOT_NAME) {
          hot.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    }
  },
  components: {
    Listview
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
.singer {
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
}
</style>
