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
}

export function creatSong(musicData, index) {
    let url
    if (index % 2 === 0) {
        url = `http://14.29.86.12/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=6561550953&vkey=1D9E5D1C9D7C4BC1388508F127F9B01219380DF97FDDC59875DB858F3348C1839F2BCE7B5D0DEECABB81F2D4E74D734D94C462F53253DAB2&uin=0&fromtag=66`
    } else {
        url = `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=6561550953&vkey=7C9D5B3723A4C807ED38972E13E72D5EC804A598027CFCBD80CCA7B2D6CF669755B8C4B8CF35ACC8DA227EE023705847BED8991ACA7D8F34&uin=0&fromtag=66`
    }
    return new Song({
        id: musicData.songid,
        mid: musicData.songmid,
        singer: filterSinger(musicData.singer),
        name: musicData.songname,
        album: musicData.albumname,
        duration: musicData.interval,
        image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
        // url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
        // url: `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=8330575250&vkey=0F82CB53B562EB91473EFC53ACBD9786797E00ABAD4BDA78E833B7E8EAC943338E7C08DCC52DEFF30852522E39AC0EDDBCDA398F08107AE9&uin=0&fromtag=66`
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