const formatTime = (ms) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    return `${m}:${s.toString().padStart(2, '0')}.${cs.toString().padStart(2, '0')}`
}

const formatTimeText = (ms) => {
    const m = Math.floor(ms / 60000)
    const s = Math.floor((ms % 60000) / 1000)
    const cs = Math.floor((ms % 1000) / 10)
    
    if (m > 0) {
        return `${m} minute${m > 1 ? 's' : ''}, ${s} seconde${s > 1 ? 's' : ''} et ${cs} milliseconde${cs > 1 ? 's' : ''}`
    }
    return `${s} seconde${s > 1 ? 's' : ''} et ${cs} milliseconde${cs > 1 ? 's' : ''}`
}

const calcSpeed = (score, ms) => ms > 0 ? Math.round((score / (ms / 1000)) * 60) : 0
const calcPercent = (score, total) => total > 0 ? Math.round((score / total) * 100) : 0

const pickRandom = (arr, n) => {
    const copy = [...arr]
    const res = []
    for (let i = 0; i < n && copy.length; i++) {
        const idx = Math.floor(Math.random() * copy.length)
        res.push(copy.splice(idx, 1)[0])
    }
    return res
}