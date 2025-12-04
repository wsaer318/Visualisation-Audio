import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { audioController } from '../utils/AudioController'
import * as THREE from 'three'

const ReactiveFloor = ({ isPlaying }) => {
    const outerRingRef = useRef()
    const middleRingRef = useRef()
    const innerRingRef = useRef()

    useFrame(() => {
        if (!outerRingRef.current || !middleRingRef.current || !innerRingRef.current) return

        const { bass, mids, highs, beatDetected } = audioController.update()

        if (isPlaying) {
            // --- Anneau Externe (Basses) ---
            outerRingRef.current.rotation.z += 0.001
            const scaleOuter = 1 + bass * 0.1
            outerRingRef.current.scale.setScalar(scaleOuter)
            outerRingRef.current.material.opacity = 0.2 + bass * 0.3
            outerRingRef.current.material.emissiveIntensity = 0.2 + bass * 0.5

            // --- Anneau Moyen (Mids) ---
            middleRingRef.current.rotation.z -= 0.003 // Rotation inverse plus rapide
            const scaleMiddle = 1 + mids * 0.15
            middleRingRef.current.scale.setScalar(scaleMiddle)
            middleRingRef.current.material.opacity = 0.3 + mids * 0.4
            middleRingRef.current.material.emissiveIntensity = 0.4 + mids * 0.6

            // --- Anneau Interne (Highs/Beat) ---
            innerRingRef.current.rotation.z += 0.01 // Rotation rapide
            const scaleInner = 1 + highs * 0.2
            innerRingRef.current.scale.setScalar(scaleInner)

            if (beatDetected) {
                innerRingRef.current.material.opacity = 1
                innerRingRef.current.material.emissiveIntensity = 3
                innerRingRef.current.scale.setScalar(1.5) // Gros jump sur beat
            } else {
                innerRingRef.current.material.opacity = 0.4 + highs * 0.4
                innerRingRef.current.material.emissiveIntensity = 0.5 + highs * 0.8
            }
        }
    })

    return (
        <group position={[0, -4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Anneau Externe - Cyan - Large */}
            <mesh ref={outerRingRef}>
                <ringGeometry args={[5, 6, 64]} />
                <meshStandardMaterial
                    color="#00ffff"
                    wireframe={true}
                    transparent={true}
                    opacity={0.3}
                    emissive="#00ffff"
                    emissiveIntensity={0.5}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Anneau Moyen - Magenta - Fin */}
            <mesh ref={middleRingRef}>
                <ringGeometry args={[3.5, 3.8, 64]} />
                <meshStandardMaterial
                    color="#ff00ff"
                    wireframe={true}
                    transparent={true}
                    opacity={0.4}
                    emissive="#ff00ff"
                    emissiveIntensity={0.6}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Anneau Interne - Jaune - Très fin */}
            <mesh ref={innerRingRef}>
                <ringGeometry args={[2, 2.1, 32]} />
                <meshStandardMaterial
                    color="#ffff00"
                    wireframe={false} // Plein pour plus d'impact
                    transparent={true}
                    opacity={0.5}
                    emissive="#ffff00"
                    emissiveIntensity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </group>
    )
}

export default ReactiveFloor
