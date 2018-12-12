import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

export default class Song {
    constructor({id, mid, singer, name, album, duration, image, url}) {
        this.id = id
        this.mid = mid
        this.singer = singer
        this.name = name
        this.album = album
        this.duration = duration
        this.image = image
        this.url = url
    }

    getLyric() {
        if (this.lyric) {
            return Promise.resolve(this.lyric)
        }

        return new Promise((resolve, reject) => {
            getLyric(this.mid).then((res) => {
                if (res.retcode === ERR_OK) {
                    this.lyric = Base64.decode(res.lyric)
                    resolve(this.lyric)
                } else {
                    reject(new Error('no lyric'))
                }
            })
        })
    }
}

export function creatSong(musicData, index) {
    let url = `http://dl.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6561550953&vkey=569B3122A835E7E298F4F1AA44CC9A5D066A4DAA0ED362AA9551B1908B723644D1046A374F98932748C46F2563FE6CB32346F06470F58ECF&uin=0&fromtag=38`
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        url: url
    })
}

function filterSinger(singer) {
    let ret = []
    if (!singer) {
        return ''
    }
    singer.forEach((s) => {
        ret.push(s.name)
    })
    return ret.join('/')
}