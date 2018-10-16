import { playMode } from 'common/js/config'

const state = {
    singer: {}, // 歌手信息
    playing: false, // 播放状态
    fullScreen: false, // 播放器全屏或mini
    playlist: [], // 播放列表
    sequenceList: [], // 原始列表
    mode: playMode.sequence, // 播放模式
    currentIndex: -1 // 当前歌曲索引
}

export default state