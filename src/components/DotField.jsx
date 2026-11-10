import { useEffect, useRef } from 'react';

const GAP = 30;        // distance between dots, in CSS pixels
const REACH = 200;     // how far the light spreads around the pointer
const RIPPLE_MS = 1100;
const TAU = Math.PI * 2;

// The hero background: a grid of dots that lights up around the pointer and sends a
// ripple from every click or tap. With no pointer over it, the light drifts on its own.
// Self-contained 2D canvas: no libraries, no network. It pauses when the hero is off
// screen or the tab is hidden, and stays still for visitors who prefer reduced motion.
export default function DotField({ containerRef }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        const context = canvas.getContext('2d');
        const still = document.createElement('canvas'); // the resting grid, painted once per resize
        const stillContext = still.getContext('2d');
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        let width = 0;
        let height = 0;
        let scale = 1;
        let frame = 0;
        let onScreen = true;
        let colors = readColors();
        const pointer = { x: 0, y: 0, inside: false };
        const light = { x: 0, y: 0, placed: false };
        let ripples = [];

        function readColors() {
            const styles = getComputedStyle(document.documentElement);
            return { dot: styles.getPropertyValue('--dot').trim(), accent: styles.getPropertyValue('--dot-accent').trim() };
        }

        function paintStill() {
            stillContext.setTransform(scale, 0, 0, scale, 0, 0);
            stillContext.clearRect(0, 0, width, height);
            stillContext.fillStyle = colors.dot;
            for (let y = GAP / 2; y < height; y += GAP) {
                for (let x = GAP / 2; x < width; x += GAP) stillContext.fillRect(x - 0.75, y - 0.75, 1.5, 1.5);
            }
        }

        function resize() {
            const bounds = container.getBoundingClientRect();
            width = bounds.width;
            height = bounds.height;
            scale = Math.min(window.devicePixelRatio || 1, 2);
            for (const surface of [canvas, still]) {
                surface.width = Math.round(width * scale);
                surface.height = Math.round(height * scale);
            }
            paintStill();
            draw(performance.now());
        }

        function draw(now) {
            context.setTransform(1, 0, 0, 1, 0, 0);
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(still, 0, 0);
            if (reducedMotion) return;

            // The light eases toward the pointer, or wanders when there is none.
            const targetX = pointer.inside ? pointer.x : width * (0.5 + 0.34 * Math.sin(now / 4300));
            const targetY = pointer.inside ? pointer.y : height * (0.42 + 0.24 * Math.cos(now / 5700));
            if (!light.placed) {
                light.x = targetX;
                light.y = targetY;
                light.placed = true;
            }
            light.x += (targetX - light.x) * 0.1;
            light.y += (targetY - light.y) * 0.1;
            ripples = ripples.filter((ripple) => now - ripple.start < RIPPLE_MS);

            context.setTransform(scale, 0, 0, scale, 0, 0);
            context.fillStyle = colors.accent;
            for (let y = GAP / 2; y < height; y += GAP) {
                for (let x = GAP / 2; x < width; x += GAP) {
                    const distance = Math.hypot(x - light.x, y - light.y);
                    let glow = distance < REACH ? (1 - distance / REACH) ** 2 : 0;
                    for (const ripple of ripples) {
                        const progress = (now - ripple.start) / RIPPLE_MS;
                        const offset = Math.abs(Math.hypot(x - ripple.x, y - ripple.y) - progress * 620);
                        if (offset < 36) glow = Math.max(glow, (1 - offset / 36) * (1 - progress));
                    }
                    if (glow < 0.03) continue;
                    context.globalAlpha = Math.min(1, glow * 1.1);
                    context.beginPath();
                    context.arc(x, y, 0.9 + glow * 2.3, 0, TAU);
                    context.fill();
                }
            }
            context.globalAlpha = 1;
        }

        function loop(now) {
            draw(now);
            frame = requestAnimationFrame(loop);
        }

        function sync() {
            const shouldRun = onScreen && !document.hidden && !reducedMotion;
            if (shouldRun && !frame) frame = requestAnimationFrame(loop);
            if (!shouldRun && frame) {
                cancelAnimationFrame(frame);
                frame = 0;
            }
        }

        function toLocal(event) {
            const bounds = container.getBoundingClientRect();
            return { x: event.clientX - bounds.left, y: event.clientY - bounds.top };
        }

        function onPointerMove(event) {
            if (event.pointerType === 'touch') return;
            Object.assign(pointer, toLocal(event), { inside: true });
        }

        function onPointerLeave() {
            pointer.inside = false;
        }

        function onPointerDown(event) {
            ripples.push({ ...toLocal(event), start: performance.now() });
        }

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        const visibilityObserver = new IntersectionObserver(([entry]) => {
            onScreen = entry.isIntersecting;
            sync();
        });
        visibilityObserver.observe(container);

        // Repaint in the new colours when the theme class on <html> changes.
        const themeObserver = new MutationObserver(() => {
            colors = readColors();
            paintStill();
            draw(performance.now());
        });
        themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

        container.addEventListener('pointermove', onPointerMove);
        container.addEventListener('pointerleave', onPointerLeave);
        container.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('visibilitychange', sync);
        sync();

        return () => {
            cancelAnimationFrame(frame);
            resizeObserver.disconnect();
            visibilityObserver.disconnect();
            themeObserver.disconnect();
            container.removeEventListener('pointermove', onPointerMove);
            container.removeEventListener('pointerleave', onPointerLeave);
            container.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('visibilitychange', sync);
        };
    }, [containerRef]);

    return <canvas ref={canvasRef} className="dot-field" aria-hidden="true" />;
}
