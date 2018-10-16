import * as types from './mutation-types'
import { shuffle } from 'common/js/util'
import { playMode } from 'common/js/config'

function findIdx(list, currentSong) {
    return list.findIndex((item) => {
        return currentSong.id === item.id
    })
}

export const selectPlay = function({commit, state}, {list, index}) {
    commit(types.SET_SEQUENCE_LIST, list)
    if (state.mode === playMode.random) {
        let randomList = shuffle(list)
        commit(types.SET_PLAYLIST, randomList)
        index = findIdx(randomList, list[index])
    } else {
        // 顺序播放
        commit(types.SET_PLAYLIST, list)
    }
    // 点的第几首歌
    commit(types.SET_CURRENT_INDEX, index)
    // 打开播放器
    commit(types.SET_FULL_SCREEN, true)
    // 播放状态
    commit(types.SET_PLAYING_STATE, true)
}

export const randomPlay = function({commit}, {list}) {
    commit(types.SET_PLAY_MODE, playMode.random)
    commit(types.SET_SEQUENCE_LIST, list)
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    // 随机播放任意一首,index为0即可
    commit(types.SET_CURRENT_INDEX, 0)
    commit(types.SET_FULL_SCREEN, true)
    commit(types.SET_PLAYING_STATE, true)
}
