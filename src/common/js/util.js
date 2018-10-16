// 打乱数组排序
export function shuffle(arr) {
    // 为了不改变原本的数组,把值赋给新变量
    let _arr = arr.slice()
    for (let i = 0; i < _arr.length; i++) {
        let j = getRandomInt(0, i)
        let temp = _arr[i]
        _arr[i] = _arr[j]
        _arr[j] = temp
    }
    return _arr
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}