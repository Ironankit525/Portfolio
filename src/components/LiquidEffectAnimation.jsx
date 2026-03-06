import { useEffect, useRef } from "react";

export default function LiquidEffectAnimation({
    imageUrl = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2000&auto=format&fit=crop",
    metalness = 0.75,
    roughness = 0.25,
    displacementScale = 5,
}) {
    const canvasRef = useRef(null);
    useEffect(() => {
        if (!canvasRef.current) return;
        const scriptId = "liquid-bg-script-module";
        let script = document.getElementById(scriptId);
        if (!script) {
            script = document.createElement("script");
            script.id = scriptId;
            script.type = "module";
            script.textContent = `
        import LiquidBackground from 'https://cdn.jsdelivr.net/npm/threejs-components@0.0.22/build/backgrounds/liquid1.min.js';
        const canvas = document.getElementById('liquid-canvas');
        if (canvas) {
          const app = LiquidBackground(canvas);
          app.loadImage('${imageUrl}');
          app.liquidPlane.material.metalness = ${metalness};
          app.liquidPlane.material.roughness = ${roughness};
          app.liquidPlane.uniforms.displacementScale.value = ${displacementScale};
          app.setRain(false);
          window.__liquidApp = app;
        }
      `;
            document.body.appendChild(script);
        }
        return () => {
            if (window.__liquidApp && typeof window.__liquidApp.dispose === "function") {
                window.__liquidApp.dispose();
                delete window.__liquidApp;
            }
            const existingScript = document.getElementById(scriptId);
            if (existingScript) {
                document.body.removeChild(existingScript);
            }
        };
    }, [imageUrl, metalness, roughness, displacementScale]);
    return (
        <div
            className="absolute inset-0 m-0 w-full h-full touch-none overflow-hidden -z-10 bg-white dark:bg-black transition-colors duration-500"
            style={{ fontFamily: '"Montserrat", sans-serif' }}
        >
            <canvas
                ref={canvasRef}
                id="liquid-canvas"
                className="absolute inset-0 w-full h-full object-cover opacity-30 dark:opacity-100 transition-opacity duration-500"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-white/50 via-white/10 to-white/60 dark:from-black/60 dark:via-black/20 dark:to-black/80 pointer-events-none transition-colors duration-500" />

            <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-gray-50 via-gray-50/80 to-transparent dark:from-black dark:via-black/80 dark:to-transparent pointer-events-none transition-colors duration-500" />
        </div>
    );
}
