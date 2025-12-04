import React, { useEffect, useRef, useState } from 'react'
import { audioController } from '../utils/AudioController'

const ProgressBar = ({ isPlaying }) => {
    const [progress, setProgress] = useState({ current: 0, total: 0, ratio: 0 })
    const requestRef = useRef()

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }

    const updateProgress = () => {
        const prog = audioController.getProgress()
        setProgress(prog)
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateProgress)
        }
    }

    useEffect(() => {
        if (isPlaying) {
            requestRef.current = requestAnimationFrame(updateProgress)
        } else {
            cancelAnimationFrame(requestRef.current)
            setProgress(audioController.getProgress())
        }
        return () => cancelAnimationFrame(requestRef.current)
    }, [isPlaying])

    return (
        <div style={styles.container}>
            <style>
                {`
                    @keyframes wave {
                        0% { transform: translateX(0) translateZ(0) scaleY(1); }
                        50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
                        100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
                    }
                    .wave-layer {
                        position: absolute;
                        left: 0;
                        width: 200%;
                        height: 100%;
                        background-repeat: repeat-x;
                        background-position: 0 bottom;
                        transform-origin: center bottom;
                    }
                `}
            </style>

            <div style={styles.timeDisplay}>
                <span style={styles.currentTime}>{formatTime(progress.current)}</span>
                <span style={styles.separator}>/</span>
                <span style={styles.totalTime}>{formatTime(progress.total)}</span>
            </div>

            <div style={styles.barContainer}>
                {/* Fond de la barre */}
                <div style={styles.barBackground} />

                {/* Partie remplie (Masque) */}
                <div style={{ ...styles.barFillMask, width: `${progress.ratio * 100}%` }}>

                    {/* Vague 1 : Arrière-plan (Lente, Magenta) */}
                    <div className="wave-layer" style={{
                        ...styles.wave,
                        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iI2ZmMDBmZiIgZmlsbC1vcGFjaXR5PSIwLjMiIGQ9Ik0wLDE5Mkw0OCwxOTdDOTYsMjAzLDE5MiwyMTMsMjg4LDIyOUMzODQsMjQ1LDQ4MCwyNjcsNTc2LDI1MEM2NzIsMjM1LDc2OCwxODEsODY0LDE2MEM5NjAsMTM5LDEwNTYsMTQ5LDExNTIsMTYwQzEyNDgsMTcxLDEzNDQsMTgzLDEzOTIsMTg5TDE0NDAsMTkyTDE0NDAsMzIwTDEzOTIsMzIwQzEzNDQsMzIwLDEyNDgsMzIwLDExNTIsMzIwQzEwNTYsMzIwLDk2MCwzMjAsODY0LDMyMEM3NjgsMzIwLDY3MiwzMjAsNTc2LDMyMEM0ODAsMzIwLDM4NCwzMjAsMjg4LDMyMEMxOTIsMzIwLDk2LDMyMCw0OCwzMjBMMCwzMjBaIj48L3BhdGg+PC9zdmc+")',
                        animation: 'wave 10s linear infinite',
                        opacity: 0.5,
                        bottom: '-10px'
                    }} />

                    {/* Vague 2 : Milieu (Moyenne, Cyan) */}
                    <div className="wave-layer" style={{
                        ...styles.wave,
                        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iIzAwZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjQiIGQ9Ik0wLDE2MEw0OCwxNzdDOTYsMTkyLDE5MiwyMjQsMjg4LDIxM0MzODQsMjAzLDQ4MCwxNDksNTc2LDEzOUM2NzIsMTI4LDc2OCwxNjAsODY0LDE3NkM5NjAsMTkyLDEwNTYsMTkyLDExNTIsMTc2QzEyNDgsMTYwLDEzNDQsMTI4LDEzOTIsMTEyTDE0NDAsOTZMMTQ0MCwzMjBMMTM5MiwzMjBDMTM0NCwzMjAsMTI0OCwzMjAsMTE1MiwzMjBDMTA1NiwzMjAsOTYwLDMyMCw4NjQsMzIwQzc2OCwzMjAsNjcyLDMyMCw1NzYsMzIwQzQ4MCwzMjAsMzg0LDMyMCwyODgsMzIwQzE5MiwzMjAsOTYsMzIwLDQ4LDMyMEwwLDMyMFoiPjwvcGF0aD48L3N2Zz4=")',
                        animation: 'wave 7s linear infinite reverse',
                        opacity: 0.6,
                        bottom: '-5px'
                    }} />

                    {/* Vague 3 : Devant (Rapide, Blanche/Brillante) */}
                    <div className="wave-layer" style={{
                        ...styles.wave,
                        backgroundImage: 'url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNDQwIDMyMCI+PHBhdGggZmlsbD0iI2ZmZmZmZiIgZmlsbC1vcGFjaXR5PSIwLjUiIGQ9Ik0wLDk2TDQ4LDExMkM5NiwxMjgsMTkyLDE2MCwyODgsMTYwQzM4NCwxNjAsNDgwLDEyOCw1NzYsMTE3LjNDNjcyLDEwNyw3NjgsMTE3LDg2NCwxMzMuM0M5NjAsMTQ5LDEwNTYsMTcxLDExNTIsMTcwLjdDMTI0OCwxNzEsMTM0NCwxNDksMTM5MiwxMzlMMTQ0MCwxMjhMMTQ0MCwzMjBMMTM5MiwzMjBDMTM0NCwzMjAsMTI0OCwzMjAsMTE1MiwzMjBDMTA1NiwzMjAsOTYwLDMyMCw4NjQsMzIwQzc2OCwzMjAsNjcyLDMyMCw1NzYsMzIwQzQ4MCwzMjAsMzg0LDMyMCwyODgsMzIwQzE5MiwzMjAsOTYsMzIwLDQ4LDMyMEwwLDMyMFoiPjwvcGF0aD48L3N2Zz4=")',
                        animation: 'wave 5s linear infinite',
                        opacity: 0.8,
                        bottom: '0px'
                    }} />
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        position: 'absolute',
        top: '30px',
        left: '30px',
        zIndex: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        width: '300px',
        fontFamily: '"Courier New", monospace',
        pointerEvents: 'none'
    },
    timeDisplay: {
        display: 'flex',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 'bold',
        letterSpacing: '1px',
        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
    },
    currentTime: {
        color: '#00ffff',
        textShadow: '0 0 10px #00ffff'
    },
    separator: {
        color: 'rgba(255, 255, 255, 0.5)'
    },
    totalTime: {
        color: 'rgba(255, 255, 255, 0.7)'
    },
    barContainer: {
        width: '100%',
        height: '12px', // Plus épais pour voir les vagues
        borderRadius: '6px',
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 0 15px rgba(0, 255, 255, 0.1)'
    },
    barFillMask: {
        height: '100%',
        position: 'absolute',
        left: 0,
        top: 0,
        overflow: 'hidden', // Coupe les vagues
        borderRadius: '6px',
        transition: 'width 0.1s linear'
    },
    wave: {
        backgroundSize: '50% 100%', // 2 cycles dans les 200% de largeur
        position: 'absolute',
        left: 0,
        width: '200%',
        height: '200%', // Plus haut pour permettre le mouvement vertical
    }
}

export default ProgressBar
