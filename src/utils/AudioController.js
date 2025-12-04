// Gestion de l'analyse audio via Web Audio API
class AudioController {
    constructor() {
        this.ctx = null
        this.analyser = null
        this.source = null
        this.dataArray = null
        this.isPlaying = false
        this.frequencyData = { bass: 0, mids: 0, highs: 0 }
        this.previousBass = 0
        this.beatDetected = false
        this.startTime = 0
        this.pausedAt = 0
    }

    async loadFromUrl(url) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)()
        const response = await fetch(url)
        const arrayBuffer = await response.arrayBuffer()
        this.buffer = await this.ctx.decodeAudioData(arrayBuffer)
    }

    async loadFromFile(file) {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)()
        const arrayBuffer = await file.arrayBuffer()
        this.buffer = await this.ctx.decodeAudioData(arrayBuffer)
    }

    start() {
        if (!this.ctx) return
        if (this.ctx.state === 'suspended') this.ctx.resume()
        if (this.isPlaying) return

        this.source = this.ctx.createBufferSource()
        this.source.buffer = this.buffer
        this.source.loop = true

        this.analyser = this.ctx.createAnalyser()
        this.analyser.fftSize = 1024

        this.source.connect(this.analyser)
        this.analyser.connect(this.ctx.destination)

        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount)

        // Gérer le temps de départ pour la synchro
        this.startTime = this.ctx.currentTime - this.pausedAt
        this.source.start(0, this.pausedAt % this.buffer.duration)

        this.isPlaying = true
    }

    stop() {
        if (this.source) {
            this.source.stop()
            this.source.disconnect()
            this.source = null
            this.pausedAt = 0
        }
        this.isPlaying = false
    }

    pause() {
        if (this.source) {
            this.pausedAt = this.ctx.currentTime - this.startTime
            this.source.stop()
            this.source.disconnect()
            this.source = null
        }
        this.isPlaying = false
    }

    toggle() {
        if (this.isPlaying) {
            this.pause()
        } else {
            this.start()
        }
        return this.isPlaying
    }

    getProgress() {
        if (!this.ctx || !this.buffer) return { current: 0, total: 0, ratio: 0 }

        let currentTime = 0
        if (this.isPlaying) {
            currentTime = (this.ctx.currentTime - this.startTime) % this.buffer.duration
        } else {
            currentTime = this.pausedAt % this.buffer.duration
        }

        return {
            current: currentTime,
            total: this.buffer.duration,
            ratio: currentTime / this.buffer.duration
        }
    }

    update() {
        if (!this.analyser) return { ...this.frequencyData, beatDetected: false }

        this.analyser.getByteFrequencyData(this.dataArray)

        const getAvg = (min, max) => {
            let sum = 0
            for (let i = min; i <= max; i++) sum += this.dataArray[i]
            return sum / (max - min + 1)
        }

        // Calcul des moyennes par fréquence
        const targetBass = getAvg(0, 2) / 255
        const targetMids = getAvg(7, 23) / 255
        const targetHighs = getAvg(46, 100) / 255

        // LERP pour lisser les transitions
        this.frequencyData.bass += (targetBass - this.frequencyData.bass) * 0.15
        this.frequencyData.mids += (targetMids - this.frequencyData.mids) * 0.15
        this.frequencyData.highs += (targetHighs - this.frequencyData.highs) * 0.15

        // Détection de beat (montée rapide des basses)
        const bassDelta = this.frequencyData.bass - this.previousBass
        this.beatDetected = bassDelta > 0.15 && this.frequencyData.bass > 0.3
        this.previousBass = this.frequencyData.bass

        return { ...this.frequencyData, beatDetected: this.beatDetected }
    }
}

const audioController = new AudioController()
export { audioController }
export default AudioController
