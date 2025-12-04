import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { audioController } from '../utils/AudioController'

// Composant pour un groupe de particules (Basses, Mids, ou Highs)
const ParticleGroup = ({ count, radiusMin, radiusMax, color, frequencyType, isPlaying }) => {
    const pointsRef = useRef()
    const hueRotation = useRef(0)
    const originalPositions = useRef(null)

    // Générer les particules pour ce groupe
    const particlesPosition = useMemo(() => {
        const positions = new Float32Array(count * 3)
        for (let i = 0; i < count; i++) {
            const theta = Math.random() * Math.PI * 2
            const phi = Math.acos((Math.random() * 2) - 1)
            // Rayon variable selon le groupe
            const r = radiusMin + Math.random() * (radiusMax - radiusMin)

            const x = r * Math.sin(phi) * Math.cos(theta)
            const y = r * Math.sin(phi) * Math.sin(theta)
            const z = r * Math.cos(phi)

            positions[i * 3] = x
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = z
        }
        originalPositions.current = positions.slice()
        return positions
    }, [count, radiusMin, radiusMax])

    useFrame((state, delta) => {
        if (!pointsRef.current) return

        const { bass, mids, highs, beatDetected } = audioController.update()

        // Sélectionner la fréquence appropriée
        let intensity = 0
        if (frequencyType === 'bass') intensity = bass
        else if (frequencyType === 'mids') intensity = mids
        else if (frequencyType === 'highs') intensity = highs

        // Rotation continue seulement si en lecture
        if (isPlaying) {
            pointsRef.current.rotation.y += delta * 0.1 * (1 + intensity * 2)
        }

        // Pulse selon la fréquence
        if (isPlaying) {
            const scale = 1 + intensity * 0.4
            pointsRef.current.scale.setScalar(scale)
        } else {
            const currentScale = pointsRef.current.scale.x
            pointsRef.current.scale.setScalar(currentScale + (1 - currentScale) * 0.1)
        }

        // === COULEURS DYNAMIQUES PAR GROUPE ===
        const material = pointsRef.current.material

        if (isPlaying) {
            // Arc-en-ciel rotatif (vitesse selon intensité)
            hueRotation.current += delta * (20 + intensity * 100)
            if (hueRotation.current > 360) hueRotation.current -= 360

            let baseHue = 0
            if (frequencyType === 'bass') baseHue = 0 // Rouge-Orange
            else if (frequencyType === 'mids') baseHue = 120 // Vert-Cyan
            else if (frequencyType === 'highs') baseHue = 240 // Bleu-Violet

            // Modulation selon intensité et rythme
            const hue = (baseHue + hueRotation.current * 0.3) % 360
            const saturation = 0.8 + intensity * 0.2
            const lightness = 0.4 + intensity * 0.4

            material.color.setHSL(hue / 360, saturation, lightness)

            // Flash blanc sur les beats
            if (beatDetected && frequencyType === 'bass') {
                material.color.lerp(new THREE.Color(1, 1, 1), 0.5)
            }

        } else {
            // Retour à la couleur de base
            const target = new THREE.Color(color)
            material.color.lerp(target, 0.1)
        }

        // Animation des particules individuelles selon la fréquence
        if (isPlaying && intensity > 0.1) {
            const positions = pointsRef.current.geometry.attributes.position.array

            for (let i = 0; i < count; i++) {
                const i3 = i * 3

                // Récupérer position originale
                const originalX = originalPositions.current[i3]
                const originalY = originalPositions.current[i3 + 1]
                const originalZ = originalPositions.current[i3 + 2]

                // Calculer la direction depuis le centre
                const length = Math.sqrt(originalX ** 2 + originalY ** 2 + originalZ ** 2)
                const normalX = originalX / length
                const normalY = originalY / length
                const normalZ = originalZ / length

                // Déplacement vers l'extérieur selon l'intensité
                const displacement = intensity * 0.3

                positions[i3] = originalX + normalX * displacement
                positions[i3 + 1] = originalY + normalY * displacement
                positions[i3 + 2] = originalZ + normalZ * displacement
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true

        } else {
            // Retour progressif aux positions d'origine
            const positions = pointsRef.current.geometry.attributes.position.array

            for (let i = 0; i < count; i++) {
                const i3 = i * 3
                positions[i3] += (originalPositions.current[i3] - positions[i3]) * 0.1
                positions[i3 + 1] += (originalPositions.current[i3 + 1] - positions[i3 + 1]) * 0.1
                positions[i3 + 2] += (originalPositions.current[i3 + 2] - positions[i3 + 2]) * 0.1
            }

            pointsRef.current.geometry.attributes.position.needsUpdate = true
        }
    })

    return (
        <points ref={pointsRef}>
            <bufferGeometry>
                <bufferAttribute
                    attach="attributes-position"
                    count={count}
                    array={particlesPosition}
                    itemSize={3}
                />
            </bufferGeometry>
            <pointsMaterial
                size={0.015}
                color={color}
                sizeAttenuation={true}
                transparent={true}
                opacity={0.8}
                depthWrite={false}
                blending={THREE.AdditiveBlending}
            />
        </points>
    )
}

// Composant principal : 3 groupes de particules
const CoreSphere = ({ isPlaying }) => {
    return (
        <group>
            {/* Groupe BASSES (intérieur, rouge-orange) */}
            <ParticleGroup
                count={7000}
                radiusMin={1.2}
                radiusMax={1.6}
                color="#ff3300"
                frequencyType="bass"
                isPlaying={isPlaying}
            />

            {/* Groupe MIDS (médian, vert-cyan) */}
            <ParticleGroup
                count={7000}
                radiusMin={1.6}
                radiusMax={2.0}
                color="#00ff88"
                frequencyType="mids"
                isPlaying={isPlaying}
            />

            {/* Groupe HIGHS (extérieur, bleu-violet) */}
            <ParticleGroup
                count={6000}
                radiusMin={2.0}
                radiusMax={2.4}
                color="#5500ff"
                frequencyType="highs"
                isPlaying={isPlaying}
            />
        </group>
    )
}

export { CoreSphere }
