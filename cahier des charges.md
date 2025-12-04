**Rôle :** Tu es un Creative Developer expert en WebGL, Three.js et Audio Visualization, primé aux Awwwards.

**Objectif :** Créer une "Visualisation Audio" interactive, immersive et visuellement époustouflante pour un concours (Nuit de l'Info). Le rendu doit être futuriste, "néon", et extrêmement réactif au rythme.

**Stack Technique Obligatoire :**
* **React** (Vite)
* **@react-three/fiber** (R3F) pour la scène 3D.
* **@react-three/drei** (pour `OrbitControls`, `Sphere`, etc.).
* **@react-three/postprocessing** (pour les effets Bloom, Glitch, Chromatic Aberration).
* **Web Audio API** native (pas de librairie audio tierce lourde).

**Cahier des Charges Fonctionnel & Artistique :**

#### 1. Moteur Audio (AudioEngine)
* L'application doit attendre une interaction utilisateur (Click "START EXPERIENCE") pour démarrer l'audio (contournement des politiques autoplay navigateur).
* Charge un fichier MP3 de démo (utilise une URL libre de droit ou un placeholder).
* Analyse le son via `AnalyserNode` (FFT Size 1024).
* Extrais 3 plages de fréquences distinctes à chaque frame :
    * **Basses (Kick) :** Moyenne des fréquences 0-100Hz (normalisée 0-1).
    * **Mids (Voix/Snare) :** Moyenne des fréquences 300-1000Hz.
    * **Highs (Cymbales) :** Moyenne des fréquences 2000Hz+.
* Utilise une fonction de lissage (Linear Interpolation - LERP) pour que les valeurs ne soient pas trop saccadées.

#### 2. Le Visuel "Core" (L'objet central)
* Ne crée pas de simples cubes. Crée une **Sphère de Particules Instanciées** (ou un `PointsMaterial` sur une géométrie complexe).
* **Géométrie :** Une sphère composée de 5000+ points.
* **Comportement Réactif (Dans la boucle `useFrame`) :**
    * La sphère doit tourner lentement sur elle-même.
    * **Sur les Basses :** La sphère doit "pulser" (scale up rapide, scale down lent) et changer de couleur (ex: passer de Bleu Profond à Violet Intense).
    * **Sur les Aigus :** Les particules doivent s'agiter (ajouter du `noise` à leur position) pour donner un effet électrique/pétillant.

#### 3. Post-Processing (La "Vibe")
C'est le point le plus important pour le rendu "hors norme".
* Ajoute un **EffectComposer**.
* **Bloom :** Ajoute un effet de Bloom (Lueur) très intense. Les particules doivent ressembler à des néons ou des lasers. (Threshold bas, Intensity haute).
* **Chromatic Aberration (Glitch) :** Ajoute une aberration chromatique qui est normalement à 0, mais qui "saute" brusquement quand les Basses dépassent un seuil de 0.8 (effet d'impact lors des drops).

#### 4. UI / UX
* Fond de la page : Noir absolu (`#000000`).
* Bouton "Start" : Centré, minimaliste, contour blanc fin, police monospace. Disparaît une fois cliqué.
* Optionnel : Un petit texte en bas à gauche "AUDIO REACTIVE SYSTEM // DEF 475" en style terminal.

**Instructions de Code :**
* Génère tout le code dans un seul fichier ou une structure de composants propre.
* Assure-toi que les imports Three.js et R3F sont corrects.
* Gère les erreurs de contexte Audio (resume context on click).
