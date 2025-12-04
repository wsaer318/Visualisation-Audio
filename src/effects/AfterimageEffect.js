import { Effect } from 'postprocessing'
import { Uniform } from 'three'

// Shader pour l'effet de traînée
const fragmentShader = `
uniform sampler2D previousFrame;
uniform float damp;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 texel = texture2D(previousFrame, uv);
    outputColor = max(texel * damp, inputColor);
}
`

// Classe pour l'effet custom de traînée
class AfterimageEffect extends Effect {
    constructor({ damp = 0.92 } = {}) {
        super('AfterimageEffect', fragmentShader, {
            uniforms: new Map([
                ['previousFrame', new Uniform(null)],
                ['damp', new Uniform(damp)]
            ])
        })
    }

    update(renderer, inputBuffer) {
        // Mettre à jour la frame précédente
        this.uniforms.get('previousFrame').value = inputBuffer.texture
    }
}

export default AfterimageEffect
