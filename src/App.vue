<template>
  <div id="app">
    <m-header></m-header>
    <tab></tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import mHeader from 'components/m-header/m-header'
import tab from 'components/tab/tab'
export default {
  name: 'app',
  components: {
    mHeader,
    tab
  }
}
</script>

<style lang="stylus">
  @import "~common/stylus/variable"
</style>
