import { motion, useScroll, useSpring } from 'framer-motion';

// The thin lime bar at the top of the window that fills as the page scrolls.
export default function ScrollProgress() {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
    return <motion.div className="scroll-progress" style={{ scaleX }} aria-hidden="true" />;
}
