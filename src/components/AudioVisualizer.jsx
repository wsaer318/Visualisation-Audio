import React, { useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { CoreSphere } from './CoreSphere'
import { audioController } from '../utils/AudioController'
import IncomingParticles from './IncomingParticles'
import CentralPrism from './CentralPrism'
import DynamicCamera from './DynamicCamera'
// import ShockwaveRings from './ShockwaveRings'
import ReactiveFloor from './ReactiveFloor'
import ProgressBar from './ProgressBar'
// import FrequencyBars from './ReactiveBorder'
// import ReactiveBackground from './ReactiveBackground'

export default function AudioVisualizer() {
    const [ready, setReady] = useState(false)
    const [loading, setLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const fileInputRef = useRef()

    const handleStartDemo = async () => {
        setLoading(true)
        try {
            await audioController.loadFromUrl('/demo.mp3')
            audioController.start()
            setReady(true)
            setIsPlaying(true)
        } catch (e) {
            console.error("Échec du chargement audio", e)
            alert("Impossible de charger l'audio. Vérifiez que 'demo.mp3' est bien dans le dossier public.")
        }
        setLoading(false)
    }

    const handleFileUpload = async (event) => {
        const file = event.target.files[0]
        if (!file) return

        if (!file.type.startsWith('audio/')) {
            alert("Veuillez sélectionner un fichier audio valide (MP3, WAV, etc.)")
            return
        }

        setLoading(true)
        try {
            audioController.stop()
            await audioController.loadFromFile(file)
            audioController.start()
            setReady(true)
            setIsPlaying(true)
        } catch (e) {
            console.error("Échec du chargement du fichier", e)
            alert("Impossible de charger ce fichier audio. Format non supporté.")
        }
        setLoading(false)
    }

    const toggleAudio = () => {
        const playing = audioController.toggle()
        setIsPlaying(playing)
    }

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen()
            setIsFullscreen(true)
        } else {
            document.exitFullscreen()
            setIsFullscreen(false)
        }
    }

    React.useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement)
        }
        document.addEventListener('fullscreenchange', handleFullscreenChange)
        return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }, [])

    return (
        <>
            {/* <FrequencyBars isPlaying={isPlaying} /> */}
            <Canvas camera={{ position: [0, 0, 6], fov: 45 }} dpr={[1, 2]} gl={{ antialias: true }}>
                <color attach="background" args={['#000000']} />
                {ready && (
                    <>
                        {/* <DynamicCamera isPlaying={isPlaying} /> */}
                        <ambientLight intensity={0.1} />
                        {/* <ReactiveBackground isPlaying={isPlaying} /> */}
                        <IncomingParticles isPlaying={isPlaying} />
                        <CentralPrism isPlaying={isPlaying} />
                        {/* <ShockwaveRings isPlaying={isPlaying} /> */}
                        <ReactiveFloor isPlaying={isPlaying} />
                        <CoreSphere isPlaying={isPlaying} />
                        <EffectComposer>
                            {/* Bloom pour l'effet néon */}
                            <Bloom
                                luminanceThreshold={0.2}
                                intensity={1.8}
                                levels={8}
                            />
                        </EffectComposer>
                        <OrbitControls
                            enableZoom={true}
                            enablePan={false}
                            autoRotate={true}
                            autoRotateSpeed={0.3}
                            minDistance={3}
                            maxDistance={10}
                            minPolarAngle={Math.PI / 2}
                            maxPolarAngle={Math.PI / 2}
                        />
                    </>
                )}
            </Canvas>

            {/* Écran de sélection audio */}
            {!ready && (
                <div style={styles.startScreen}>
                    <div style={styles.title}>CHOISISSEZ VOTRE AUDIO</div>

                    <button
                        onClick={handleStartDemo}
                        disabled={loading}
                        style={{ ...styles.button, ...styles.primaryButton }}
                        onMouseOver={(e) => !loading && Object.assign(e.target.style, styles.primaryButtonHover)}
                        onMouseOut={(e) => Object.assign(e.target.style, styles.primaryButton)}
                    >
                        {loading ? 'CHARGEMENT...' : 'DÉMO'}
                    </button>

                    <div style={styles.separator}>— OU —</div>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        style={{ ...styles.button, ...styles.secondaryButton }}
                        onMouseOver={(e) => !loading && Object.assign(e.target.style, styles.secondaryButtonHover)}
                        onMouseOut={(e) => Object.assign(e.target.style, styles.secondaryButton)}
                    >
                        📁 CHARGER VOTRE AUDIO
                    </button>
                </div>
            )}

            {/* Barre de progression */}
            {ready && <ProgressBar isPlaying={isPlaying} />}

            {/* Contrôles */}
            {ready && (
                <div style={styles.controls}>
                    <button onClick={toggleAudio} style={styles.controlButton}>
                        {isPlaying ? '⏸ PAUSE' : '▶ PLAY'}
                    </button>

                    <button onClick={toggleFullscreen} style={styles.controlButton}>
                        {isFullscreen ? '🗙 QUITTER' : '⛶ PLEIN ÉCRAN'}
                    </button>

                    <button
                        onClick={() => {
                            audioController.stop()
                            setReady(false)
                            setIsPlaying(false)
                        }}
                        style={{ ...styles.controlButton, borderColor: 'rgba(255,100,100,0.5)', color: '#ff6464' }}
                    >
                        ↩ CHANGER
                    </button>
                </div>
            )}

            {/* Footer */}
            <div style={styles.footer}>
                Système Réactif Audio // DEF 475
            </div>
        </>
    )
}

// Styles séparés pour meilleure lisibilité
const styles = {
    startScreen: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
        pointerEvents: 'none',
        gap: '2rem'
    },
    title: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.6)',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.9rem',
        letterSpacing: '2px',
        marginBottom: '1rem'
    },
    button: {
        pointerEvents: 'auto',
        padding: '1.5rem 3rem',
        fontSize: '1rem',
        fontFamily: '"Courier New", monospace',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '4px',
        transition: 'all 0.3s ease',
        border: 'none'
    },
    primaryButton: {
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.8)',
        color: 'white'
    },
    primaryButtonHover: {
        background: 'white',
        color: 'black'
    },
    secondaryButton: {
        background: 'rgba(85, 0, 255, 0.2)',
        border: '1px solid rgba(85, 0, 255, 0.8)',
        color: '#a855ff'
    },
    secondaryButtonHover: {
        background: 'rgba(85, 0, 255, 0.5)',
        color: 'white'
    },
    separator: {
        color: 'rgba(255,255,255,0.4)',
        fontFamily: '"Courier New", monospace',
        fontSize: '0.8rem',
        letterSpacing: '2px'
    },
    controls: {
        position: 'absolute',
        top: '30px',
        right: '30px',
        zIndex: 10,
        display: 'flex',
        gap: '1rem'
    },
    controlButton: {
        background: 'rgba(0,0,0,0.5)',
        border: '1px solid rgba(255,255,255,0.5)',
        color: 'white',
        padding: '0.75rem 1.5rem',
        fontFamily: '"Courier New", monospace',
        cursor: 'pointer',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem'
    },
    footer: {
        position: 'absolute',
        bottom: '30px',
        left: '30px',
        color: 'rgba(255,255,255,0.4)',
        fontFamily: '"Courier New", monospace',
        fontSize: '10px',
        letterSpacing: '2px',
        textTransform: 'uppercase'
    }
}
