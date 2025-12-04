import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { audioController } from '../utils/AudioController'

const CentralPrism = ({ isPlaying }) => {
    const prismRef = useRef()
    const glowRef = useRef()

    useFrame((state) => {
        if (!prismRef.current || !glowRef.current) return

        const { bass, mids, highs, beatDetected } = audioController.update()

        if (isPlaying) {
            // Rotation continue
            prismRef.current.rotation.x += 0.005
            prismRef.current.rotation.y += 0.01
            prismRef.current.rotation.z += 0.003

            // Pulse basé sur l'intensité globale (réduit)
            const intensity = (bass * 0.5 + mids * 0.3 + highs * 0.2)
            const scale = 1 + intensity * 0.2  // Réduit de 0.4 à 0.2

            prismRef.current.scale.setScalar(scale)
            glowRef.current.scale.setScalar(scale * 1.2)

            // Couleur basée sur l'intensité
            const material = prismRef.current.material
            if (intensity < 0.3) {
                material.emissive.setHSL(270 / 360, 0.8, 0.3)
            } else if (intensity < 0.6) {
                material.emissive.setHSL(300 / 360, 0.9, 0.4)
            } else {
                material.emissive.setHSL(330 / 360, 1, 0.5)
            }

            // Flash sur beat
            if (beatDetected) {
                material.emissive.setRGB(1, 1, 1)
                material.emissiveIntensity = 2
            } else {
                material.emissiveIntensity = 0.8 + intensity * 0.5
            }

            // Opacité du glow
            glowRef.current.material.opacity = 0.2 + intensity * 0.3
        } else {
            // Retour progressif au repos
            const currentScale = prismRef.current.scale.x
            prismRef.current.scale.setScalar(currentScale + (1 - currentScale) * 0.05)
            glowRef.current.scale.setScalar(currentScale * 1.2 + (1.2 - currentScale * 1.2) * 0.05)

            const material = prismRef.current.material
            const targetColor = new THREE.Color()
            targetColor.setHSL(270 / 360, 0.8, 0.3)
            material.emissive.lerp(targetColor, 0.05)
            material.emissiveIntensity += (0.5 - material.emissiveIntensity) * 0.05
        }
    })

    return (
        <group>
            {/* Lueur extérieure */}
            <mesh ref={glowRef}>
                <octahedronGeometry args={[0.4, 0]} />
                <meshBasicMaterial
                    color="#5500ff"
                    transparent={true}
                    opacity={0.2}
                    side={THREE.BackSide}
                />
            </mesh>

            {/* Prisme cristallin */}
            <mesh ref={prismRef}>
                <octahedronGeometry args={[0.3, 0]} />
                <meshStandardMaterial
                    color="#ffffff"
                    metalness={0.9}
                    roughness={0.1}
                    transparent={true}
                    opacity={0.8}
                    emissive="#5500ff"
                    emissiveIntensity={0.5}
                />
            </mesh>
        </group>
    )
}

export default CentralPrism
