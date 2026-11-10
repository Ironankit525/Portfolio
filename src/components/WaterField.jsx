import { useEffect, useRef } from 'react';
import waterImage from '../assets/hero-water.webp';

const RAIN_INTERVAL = 0.9; // seconds between drops

// The water effect behind the hero: a liquid surface that ripples under the cursor.
// It is a WebGL scene from the threejs-components package. The code and the image
// are bundled with the site and fetched only after the page has rendered, so the
// first paint does not wait for them. If WebGL is unavailable, `onReady` never
// fires and the hero keeps its dot grid.
export default function WaterField({ ready, onReady }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        let scene = null;
        let cancelled = false;

        import('threejs-components/build/backgrounds/liquid1.min.js')
            .then(async ({ default: createLiquidBackground }) => {
                if (cancelled) return;
                scene = createLiquidBackground(canvasRef.current);
                scene.liquidPlane.material.metalness = 0.9;
                scene.liquidPlane.material.roughness = 0.15;
                scene.liquidPlane.uniforms.displacementScale.value = 5;
                // There is no cursor on touch screens, so let a slow rain fall there instead.
                scene.setRain(window.matchMedia('(hover: none)').matches);
                scene.setRainTime(RAIN_INTERVAL);
                await scene.loadImage(waterImage);
                if (!cancelled) onReady();
            })
            .catch(() => {
                // No WebGL, or the chunk failed to load: the dot grid stays.
            });

        return () => {
            cancelled = true;
            scene?.dispose();
        };
    }, [onReady]);

    return <canvas ref={canvasRef} className={`water-field${ready ? ' is-ready' : ''}`} aria-hidden="true" />;
}
