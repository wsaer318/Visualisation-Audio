import { useEffect, useRef } from 'react'
import { audioController } from './CoreSphere'

const FrequencyBars = ({ isPlaying }) => {
    const canvasRef = useRef()
    const animationFrameRef = useRef()

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')

        // Ajuster taille du canvas
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        const barWidth = 6
        const barGap = 2
        const maxBarHeight = 80

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height)

            if (isPlaying) {
                const analyser = audioController.analyser
                if (!analyser) {
                    animationFrameRef.current = requestAnimationFrame(animate)
                    return
                }

                // Obtenir les données de fréquence
                const bufferLength = analyser.frequencyBinCount
                const dataArray = new Uint8Array(bufferLength)
                analyser.getByteFrequencyData(dataArray)

                // Calculer le périmètre total et le nombre de barres
                const perimetre = (canvas.width * 2) + (canvas.height * 2)
                const barCount = Math.floor(perimetre / (barWidth + barGap))

                // Échantillonner les données
                const sampledData = []
                for (let i = 0; i < barCount; i++) {
                    const sampleIndex = Math.floor((i / barCount) * bufferLength)
                    sampledData.push(dataArray[sampleIndex])
                }

                let barIndex = 0

                // Fonction pour dessiner une barre
                const drawBar = (x, y, width, height, isVertical, value) => {
                    const normalizedValue = value / 255
                    const barHeight = normalizedValue * maxBarHeight

                    // Couleur basée sur la position (pour varier les couleurs)
                    let hue
                    const position = barIndex / barCount
                    if (position < 0.33) {
                        hue = 330 // Rose
                    } else if (position < 0.66) {
                        hue = 300 // Magenta
                    } else {
                        hue = 270 // Violet
                    }

                    const saturation = 80 + normalizedValue * 20
                    const lightness = 50 + normalizedValue * 30
                    const alpha = 0.7 + normalizedValue * 0.3

                    ctx.fillStyle = `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`
                    ctx.shadowBlur = 15
                    ctx.shadowColor = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.8)`

                    if (isVertical) {
                        ctx.fillRect(x, y, width, barHeight)
                    } else {
                        ctx.fillRect(x, y, barHeight, width)
                    }

                    barIndex++
                }

                // Top - de gauche à droite
                for (let x = 0; x < canvas.width && barIndex < barCount; x += barWidth + barGap) {
                    drawBar(x, 0, barWidth, maxBarHeight, true, sampledData[barIndex])
                }

                // Droite - de haut en bas
                for (let y = 0; y < canvas.height && barIndex < barCount; y += barWidth + barGap) {
                    drawBar(canvas.width - maxBarHeight, y, barWidth, maxBarHeight, false, sampledData[barIndex])
                }

                // Bottom - de droite à gauche
                for (let x = canvas.width; x > 0 && barIndex < barCount; x -= barWidth + barGap) {
                    drawBar(x, canvas.height - maxBarHeight, barWidth, maxBarHeight, true, sampledData[barIndex])
                }

                // Gauche - de bas en haut
                for (let y = canvas.height; y > 0 && barIndex < barCount; y -= barWidth + barGap) {
                    drawBar(0, y, barWidth, maxBarHeight, false, sampledData[barIndex])
                }
            }

            animationFrameRef.current = requestAnimationFrame(animate)
        }

        animate()

        return () => {
            window.removeEventListener('resize', resizeCanvas)
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current)
            }
        }
    }, [isPlaying])

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 1000
            }}
        />
    )
}

export default FrequencyBars
