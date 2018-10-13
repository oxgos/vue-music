import { playMode } from 'common/js/config'

const state = {
    singer: {}, // 歌手信息
    playing: false, // 播放状态
    fullScreen: false, // 播放器全屏或mini
    playlist: [],
    sequenceList: [],
    mode: playMode.sequence, // 播放模式
    currentIndex: -1 // 当前歌曲索引
}

export default state