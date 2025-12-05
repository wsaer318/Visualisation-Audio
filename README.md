# 🎵 Visualisation Audio - Nuit de l'Info

> Une expérience audiovisuelle immersive et interactive développée pour la Nuit de l'Info.

![Project Preview](./image.png)

## 🌟 Présentation

Ce projet est une **visualisation audio interactive** en 3D temps réel, conçue pour transformer la musique en une expérience visuelle époustouflante. Utilisant **WebGL** et l'**API Web Audio**, l'application analyse les fréquences sonores (basses, médiums, aigus) pour animer une scène futuriste de style "Néon / Cyberpunk".

Le cœur de l'expérience réside dans la réactivité totale des éléments graphiques au rythme de la musique, créant une symbiose parfaite entre le son et l'image.

## ✨ Fonctionnalités Clés

*   **Moteur Audio Natif** : Analyse spectrale en temps réel (FFT 1024) sans librairies lourdes, extrayant avec précision les kicks, les voix et les hautes fréquences.
*   **Visuels Réactifs** :
    *   **Prisme Central** : Un artefact cristallin qui pulse et change de couleur selon l'intensité sonore et les beats.
    *   **Système de Particules** : Des particules dynamiques qui s'agitent et orbitent en fonction des aigus.
    *   **Sol Réactif** : Un environnement qui ondule et réagit aux basses fréquences.
*   **Post-Processing Cinématographique** :
    *   **Bloom** intense pour un effet néon éclatant.
    *   **Aberration Chromatique** dynamique qui "glitch" lors des drops intenses.
*   **Interface Minimaliste** : UI épurée pour une immersion totale.

## 🛠️ Stack Technique

Ce projet repose sur des technologies web modernes pour garantir performances et fluidité :

*   **[React 19](https://react.dev/)** : Structure de l'application et gestion d'état.
*   **[Vite](https://vitejs.dev/)** : Bundler ultra-rapide pour le développement.
*   **[Three.js](https://threejs.org/)** : Moteur 3D standard du web.
*   **[@react-three/fiber (R3F)](https://docs.pmnd.rs/react-three-fiber)** : Réconciliateur React pour Three.js.
*   **[@react-three/drei](https://github.com/pmndrs/drei)** : Collection d'aides et d'abstractions pour R3F.
*   **[@react-three/postprocessing](https://github.com/pmndrs/react-postprocessing)** : Chaîne d'effets visuels avancés.
*   **Web Audio API** : Analyse audio native performante.

## 🚀 Installation et Démarrage

Prérequis : Node.js installé sur votre machine.

1.  **Cloner le dépôt**
    ```bash
    git clone https://github.com/votre-user/visualisation-audio.git
    cd visualisation-audio
    ```

2.  **Installer les dépendances**
    ```bash
    npm install
    ```

3.  **Lancer le serveur de développement**
    ```bash
    npm run dev
    ```

4.  **Accéder à l'expérience**
    Ouvrez votre navigateur sur `http://localhost:5173`.
    *Cliquez sur "START EXPERIENCE" pour lancer l'audio (requis par les politiques de navigateur).*

## 🎛️ Architecture du Code

*   `src/components/AudioVisualizer.jsx` : Chef d'orchestre de la scène 3D.
*   `src/components/CentralPrism.jsx` : Composant central réactif (remplace la sphère traditionnelle).
*   `src/components/ReactiveFloor.jsx` : Sol animé par les fréquences basses.
*   `src/components/IncomingParticles.jsx` : Système de particules d'ambiance.
*   `src/utils/AudioController.js` : Singleton gérant l'analyse audio et la FFT.

## 🏆 Contexte

Développé dans le cadre de la **Nuit de l'Info**, ce projet répond au défi de créer une visualisation audio innovante et techniquement optimisée pour le web.

---

*Développé avec passion par l'équipe [Nom de votre équipe]*
