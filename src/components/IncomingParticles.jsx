import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { audioController } from '../utils/AudioController'

// Groupe de particules d'une seule couleur
const ParticleGroup = ({ color, count, frequencyType, isPlaying }) => {
    const instancedMeshRef = useRef()
    const velocities = useRef([])
    const tempObject = new THREE.Object3D()

    // Générer les particules
    const particlesData = useMemo(() => {
        const data = []
        velocities.current = []

        for (let i = 0; i < count; i++) {
            // Position aléatoire loin du centre
            const theta = Math.random() * Math.PI * 2
            const phi = Math.random() * Math.PI
            const r = 15 + Math.random() * 10

            const x = r * Math.sin(phi) * Math.cos(theta)
            const y = r * Math.sin(phi) * Math.sin(theta)
            const z = r * Math.cos(phi)

            data.push({ x, y, z })
            velocities.current.push(0.5 + Math.random() * 0.5)
        }

        return data
    }, [count])

    useFrame(() => {
        if (!instancedMeshRef.current) return

        const audioData = audioController.update()

        // Sélectionner la fréquence appropriée
        let frequency = 0
        if (frequencyType === 'bass') frequency = audioData.bass
        else if (frequencyType === 'mids') frequency = audioData.mids
        else if (frequencyType === 'highs') frequency = audioData.highs

        if (isPlaying) {
            // Vitesse et intensité basées sur la fréquence
            const speedMultiplier = 1 + frequency * 3
            const pulseScale = 1 + frequency * 0.3

            // Déplacer chaque particule vers le centre
            for (let i = 0; i < particlesData.length; i++) {
                let { x, y, z } = particlesData[i]

                const length = Math.sqrt(x * x + y * y + z * z)

                if (length > 0) {
                    // Direction vers le centre (normalisée)
                    const dirX = -x / length
                    const dirY = -y / length
                    const dirZ = -z / length

                    const speed = velocities.current[i] * 0.1 * speedMultiplier

                    x += dirX * speed
                    y += dirY * speed
                    z += dirZ * speed

                    particlesData[i].x = x
                    particlesData[i].y = y
                    particlesData[i].z = z
                }

                // Reset si la particule atteint le centre
                const newLength = Math.sqrt(x * x + y * y + z * z)
                if (newLength < 2) {
                    // Repositionner loin du centre
                    const theta = Math.random() * Math.PI * 2
                    const phi = Math.random() * Math.PI
                    const r = 15 + Math.random() * 10

                    particlesData[i].x = r * Math.sin(phi) * Math.cos(theta)
                    particlesData[i].y = r * Math.sin(phi) * Math.sin(theta)
                    particlesData[i].z = r * Math.cos(phi)
                }

                // Mettre à jour la matrice avec pulse
                tempObject.position.set(particlesData[i].x, particlesData[i].y, particlesData[i].z)
                tempObject.scale.setScalar(pulseScale)
                tempObject.updateMatrix()
                instancedMeshRef.current.setMatrixAt(i, tempObject.matrix)
            }

            instancedMeshRef.current.instanceMatrix.needsUpdate = true
        }
    })

    return (
        <instancedMesh ref={instancedMeshRef} args={[null, null, particlesData.length]}>
            <sphereGeometry args={[0.04, 8, 8]} />
            <meshStandardMaterial
                color={color}
                transparent={true}
                opacity={0.9}
                emissive={color}
                emissiveIntensity={0.5}
            />
        </instancedMesh>
    )
}

// Composant principal avec 4 groupes de couleurs
const IncomingParticles = ({ isPlaying }) => {
    return (
        <group>
            {/* Cyan - réagit aux basses */}
            <ParticleGroup
                color="#00ffff"
                count={75}
                frequencyType="bass"
                isPlaying={isPlaying}
            />
            {/* Magenta - réagit aux mids */}
            <ParticleGroup
                color="#ff00ff"
                count={75}
                frequencyType="mids"
                isPlaying={isPlaying}
            />
            {/* Jaune - réagit aux highs */}
            <ParticleGroup
                color="#ffff00"
                count={75}
                frequencyType="highs"
                isPlaying={isPlaying}
            />
            {/* Orange - réagit aux basses */}
            <ParticleGroup
                color="#ff8800"
                count={75}
                frequencyType="bass"
                isPlaying={isPlaying}
            />
        </group>
    )
}

export default IncomingParticles
