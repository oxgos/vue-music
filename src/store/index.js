import Vuex from 'vuex'
import Vue from 'vue'
import * as getters from './getters'
import mutations from './mutations'
import * as actions from './actions'
import state from './state'
// 可打印vuex日志
import createLogger from 'vuex/dist/logger'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    strict: debug,
    plugins: debug ? [createLogger()] : []
})