import { motion, useReducedMotion } from 'framer-motion';

// Fades content up the first time it scrolls into view. `as` picks the element ("div", "li", "article"…).
export default function Reveal({ children, as = 'div', className, delay = 0, ...rest }) {
    const reducedMotion = useReducedMotion();
    const Element = motion[as];
    return (
        <Element
            className={className}
            initial={reducedMotion ? false : { opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
            {...rest}
        >
            {children}
        </Element>
    );
}
