import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';

const SPRING = { stiffness: 240, damping: 16, mass: 0.5 };

// Wraps a button or link so it leans toward the cursor and springs back when it leaves.
export default function Magnetic({ children, strength = 0.3 }) {
    const reducedMotion = useReducedMotion();
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const springX = useSpring(x, SPRING);
    const springY = useSpring(y, SPRING);

    if (reducedMotion) return children;

    function onPointerMove(event) {
        if (event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        x.set((event.clientX - (bounds.left + bounds.width / 2)) * strength);
        y.set((event.clientY - (bounds.top + bounds.height / 2)) * strength);
    }

    function onPointerLeave() {
        x.set(0);
        y.set(0);
    }

    return (
        <motion.span className="magnetic" style={{ x: springX, y: springY }} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            {children}
        </motion.span>
    );
}
