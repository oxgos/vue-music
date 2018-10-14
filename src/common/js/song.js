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
        url = `http://isure.stream.qqmusic.qq.com/C400${musicData.songmid}.m4a?guid=8791617024&vkey=E5DF90D5810F8CED4BFA47CB01BAF4122ECA55EDB0C83C16A71F9916B521F5ED7EF892DCEB22A64000A836EF769F97A92A59D54BFF651E12&uin=0&fromtag=66`
    } else {
        url = `http://124.172.114.18/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=8791617024&vkey=13B5D4600885C3B163217A3272E1A3E349C170E3639EE33EB9CB2F2BF21BD17118AB77F51C1C091B47A55B45300FE9F43C100C2C3D30B146&uin=0&fromtag=66`
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