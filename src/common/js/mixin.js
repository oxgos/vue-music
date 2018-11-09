import {mapGetters} from 'vuex'

export const playlistMixin = {
    computed: {
        ...mapGetters([
            'playlist'
        ])
    },
    mounted() {
        this.handlePlaylist(this.playlist)
    },
    // keep-alive的hook生命周期
    activated() {
        this.handlePlaylist(this.playlist)
    },
    methods: {
        handlePlaylist() {
            // 每个引入mixin的组件,必需重写此方法,不是的话抛出异常
            throw new Error('component must implement handlePlaylist method')
        }
    },
    watch: {
        playlist(newVal) {
            this.handlePlaylist(newVal)
        }
    }
}