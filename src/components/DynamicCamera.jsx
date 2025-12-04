import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { audioController } from '../utils/AudioController'

const DynamicCamera = ({ isPlaying }) => {
    const { camera } = useThree()
    const targetPosition = useRef(new THREE.Vector3(0, 0, 6))
    const targetLookAt = useRef(new THREE.Vector3(0, 0, 0))
    const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))
    const lastBeatTime = useRef(0)
    const movementDuration = useRef(0)
    const movementTimer = useRef(0)

    // Presets de positions de caméra
    const cameraPresets = [
        { pos: [0, 0, 6], lookAt: [0, 0, 0] },      // Vue de face
        { pos: [4, 3, 5], lookAt: [0, 0, 0] },      // Vue 3/4 haut
        { pos: [-4, 2, 4], lookAt: [0, 0, 0] },     // Vue 3/4 gauche
        { pos: [0, 5, 3], lookAt: [0, 0, 0] },      // Vue du dessus
        { pos: [3, -2, 5], lookAt: [0, 0, 0] },     // Vue basse droite
        { pos: [-3, 1, 7], lookAt: [0, 0, 0] },     // Vue éloignée gauche
        { pos: [2, 0, 4], lookAt: [0, 0, 0] },      // Vue proche droite
        { pos: [0, -3, 5], lookAt: [0, 0, 0] },     // Vue basse
    ]

    useFrame((state, delta) => {
        if (!isPlaying) {
            // Retour progressif à la position par défaut en pause
            targetPosition.current.lerp(new THREE.Vector3(0, 0, 6), 0.05)
            targetLookAt.current.lerp(new THREE.Vector3(0, 0, 0), 0.05)
        } else {
            const { beatDetected, bass } = audioController.update()
            const now = Date.now()

            // Déclencher un mouvement sur un beat (avec cooldown de 3 secondes)
            if (beatDetected && (now - lastBeatTime.current > 3000)) {
                lastBeatTime.current = now

                // Choisir une position aléatoire
                const preset = cameraPresets[Math.floor(Math.random() * cameraPresets.length)]

                targetPosition.current.set(...preset.pos)
                targetLookAt.current.set(...preset.lookAt)

                // Durée du mouvement (2-4 secondes)
                movementDuration.current = 2000 + Math.random() * 2000
                movementTimer.current = 0

                console.log('🎬 Changement de plan !')
            }

            // Incrémenter le timer
            movementTimer.current += delta * 1000

            // Retour progressif à la vue par défaut après la durée du mouvement
            if (movementTimer.current > movementDuration.current) {
                targetPosition.current.lerp(new THREE.Vector3(0, 0, 6), 0.02)
                targetLookAt.current.lerp(new THREE.Vector3(0, 0, 0), 0.02)
            }

            // Légère vibration sur les basses
            const shake = bass * 0.05
            const shakeX = (Math.random() - 0.5) * shake
            const shakeY = (Math.random() - 0.5) * shake
            camera.position.x += shakeX
            camera.position.y += shakeY
        }

        // Interpolation fluide de la position
        camera.position.lerp(targetPosition.current, 0.05)

        // Interpolation fluide du lookAt
        currentLookAt.current.lerp(targetLookAt.current, 0.05)
        camera.lookAt(currentLookAt.current)

        camera.updateProjectionMatrix()
    })

    return null
}

export default DynamicCamera
