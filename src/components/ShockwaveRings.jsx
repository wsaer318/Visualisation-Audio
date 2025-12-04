import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Couleurs vives pour les anneaux
const colors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0080']

// Un seul anneau d'onde de choc
const ShockRing = ({ delay = 0, onComplete, colorIndex }) => {
    const ringRef = useRef()
    const [active, setActive] = useState(false)
    const elapsedTime = useRef(0)

    useFrame((state, delta) => {
        if (!ringRef.current) return

        elapsedTime.current += delta

        if (elapsedTime.current >= delay && !active) {
            setActive(true)
        }

        if (active) {
            const progress = (elapsedTime.current - delay) / 2 // 2 sec de durée

            if (progress >= 1) {
                if (onComplete) onComplete()
                return
            }

            // Expansion de l'anneau
            const scale = 0.5 + progress * 20
            ringRef.current.scale.setScalar(scale)

            // Fade out progressif
            const opacity = (1 - progress) * 0.9
            ringRef.current.material.opacity = opacity

            // Rotation pour mieux voir
            ringRef.current.rotation.x += delta * 0.5
            ringRef.current.rotation.y += delta * 0.3
        }
    })

    if (!active && elapsedTime.current < delay) return null

    return (
        <mesh ref={ringRef}>
            <torusGeometry args={[1, 0.08, 16, 64]} />
            <meshStandardMaterial
                color={colors[colorIndex % colors.length]}
                transparent={true}
                opacity={0.9}
                emissive={colors[colorIndex % colors.length]}
                emissiveIntensity={0.5}
                side={THREE.DoubleSide}
            />
        </mesh>
    )
}

// Gestionnaire des anneaux d'onde de choc
const ShockwaveRings = ({ isPlaying }) => {
    const [rings, setRings] = useState([])
    const lastRingTime = useRef(0)
    const ringIdCounter = useRef(0)

    useFrame(() => {
        if (!isPlaying) {
            setRings([])
            return
        }

        const now = Date.now()

        // Créer un anneau toutes les 1 seconde
        if (now - lastRingTime.current > 1000) {
            lastRingTime.current = now

            // Créer 3 anneaux
            const newRings = []
            for (let i = 0; i < 3; i++) {
                const id = ringIdCounter.current++
                newRings.push({
                    id,
                    delay: i * 0.2,
                    createdAt: now,
                    colorIndex: i
                })
            }

            setRings(prev => [...prev, ...newRings])
        }

        // Nettoyer les vieux anneaux
        setRings(prev => prev.filter(ring => (now - ring.createdAt) < 3000))
    })

    return (
        <group>
            {rings.map(ring => (
                <ShockRing
                    key={ring.id}
                    delay={ring.delay}
                    colorIndex={ring.colorIndex}
                    onComplete={() => {
                        setRings(prev => prev.filter(r => r.id !== ring.id))
                    }}
                />
            ))}
        </group>
    )
}

export default ShockwaveRings
