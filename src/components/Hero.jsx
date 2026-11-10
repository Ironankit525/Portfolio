import { useCallback, useRef, useState } from 'react';
import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { ArrowDownRight, ArrowUpRight, GraduationCap, Mail, MapPin } from 'lucide-react';
import { FaGithub, FaLinkedinIn } from 'react-icons/fa';
import portrait from '../assets/portrait.webp';
import { profile } from '../data/profile';
import DotField from './DotField';
import Magnetic from './Magnetic';
import ResumeButton from './ResumeButton';
import TypedText from './TypedText';
import WaterField from './WaterField';

const EASE = [0.22, 1, 0.36, 1];
const TILT_SPRING = { stiffness: 160, damping: 18, mass: 0.6 };

// The portrait leans toward the cursor; the glare and the two floating tags sit at
// different depths, so they shift against the photo as it turns.
function Portrait() {
    const reducedMotion = useReducedMotion();
    const pointerX = useMotionValue(0);
    const pointerY = useMotionValue(0);
    const x = useSpring(pointerX, TILT_SPRING);
    const y = useSpring(pointerY, TILT_SPRING);
    const rotateY = useTransform(x, [-0.5, 0.5], [-10, 10]);
    const rotateX = useTransform(y, [-0.5, 0.5], [8, -8]);
    const glareX = useTransform(x, [-0.5, 0.5], [15, 85]);
    const glareY = useTransform(y, [-0.5, 0.5], [10, 90]);
    const glare = useMotionTemplate`radial-gradient(380px circle at ${glareX}% ${glareY}%, rgb(255 255 255 / 0.2), transparent 62%)`;

    function onPointerMove(event) {
        if (event.pointerType !== 'mouse') return;
        const bounds = event.currentTarget.getBoundingClientRect();
        pointerX.set((event.clientX - bounds.left) / bounds.width - 0.5);
        pointerY.set((event.clientY - bounds.top) / bounds.height - 0.5);
    }

    function onPointerLeave() {
        pointerX.set(0);
        pointerY.set(0);
    }

    return (
        <motion.div
            className="portrait"
            initial={reducedMotion ? false : { opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: EASE }}
            onPointerMove={reducedMotion ? undefined : onPointerMove}
            onPointerLeave={onPointerLeave}
        >
            <motion.div className="portrait-card" style={reducedMotion ? undefined : { rotateX, rotateY }}>
                <div className="portrait-frame">
                    <img src={portrait} alt={`Portrait of ${profile.name}`} width="1100" height="1409" fetchPriority="high" decoding="async" />
                    <motion.span className="portrait-glare" style={{ background: glare }} aria-hidden="true" />
                </div>
                <p className="portrait-tag">
                    <GraduationCap size={15} aria-hidden="true" />
                    {profile.badge}
                </p>
                <a className="spin-badge" href="#contact" aria-label={`${profile.status}. Get in touch`}>
                    <svg viewBox="0 0 120 120" aria-hidden="true">
                        <defs>
                            <path id="spin-badge-path" d="M60 60m-45 0a45 45 0 1 1 90 0a45 45 0 1 1-90 0" />
                        </defs>
                        <text>
                            <textPath href="#spin-badge-path" textLength="276">OPEN TO INTERNSHIPS ✦ LET’S TALK ✦</textPath>
                        </text>
                    </svg>
                    <ArrowUpRight size={26} aria-hidden="true" />
                </a>
            </motion.div>
        </motion.div>
    );
}

export default function Hero() {
    const sectionRef = useRef(null);
    const reducedMotion = useReducedMotion();
    // The dot grid shows first; the water effect replaces it once it has loaded.
    const [waterReady, setWaterReady] = useState(false);
    const showWater = useCallback(() => setWaterReady(true), []);

    // Staggered entrance for everything under the name.
    const rise = (delay) => ({
        initial: reducedMotion ? false : { opacity: 0, y: 18 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.7, delay, ease: EASE },
    });
    const nameLine = (delay) => ({
        initial: reducedMotion ? false : { y: '105%' },
        animate: { y: 0 },
        transition: { duration: 0.95, delay, ease: EASE },
    });


    return (
        <section id="top" className="hero" ref={sectionRef} aria-labelledby="hero-title">
            {!waterReady && <DotField containerRef={sectionRef} />}
            {!reducedMotion && <WaterField ready={waterReady} onReady={showWater} />}

            <div className="container hero-grid">
                <div className="hero-copy">
                    <motion.p className="hero-status" {...rise(0)}>
                        <span className="pulse-dot" aria-hidden="true" />
                        {profile.status}
                        <span className="hero-status-divider" aria-hidden="true" />
                        <MapPin size={13} aria-hidden="true" />
                        {profile.location}
                    </motion.p>

                    <h1 id="hero-title" className="hero-name">
                        <span className="hero-line"><motion.span {...nameLine(0.05)}>{profile.firstName}</motion.span></span>{' '}
                        <span className="hero-line hero-line-accent"><motion.span {...nameLine(0.15)}>{profile.lastName}</motion.span></span>
                    </h1>

                    <motion.p className="hero-role" {...rise(0.4)}>
                        <span className="hero-prompt" aria-hidden="true">❯</span> I build <TypedText phrases={profile.typedRoles} />
                    </motion.p>

                    <motion.p className="hero-intro" {...rise(0.5)}>{profile.intro}</motion.p>

                    <motion.div className="hero-actions" {...rise(0.6)}>
                        <Magnetic>
                            <a className="button button-primary button-lg" href="#projects">
                                View my work <ArrowDownRight size={18} aria-hidden="true" />
                            </a>
                        </Magnetic>
                        <ResumeButton size="lg" />
                        <ul className="hero-socials">
                            <li><a className="icon-button" href={profile.links.github} target="_blank" rel="noreferrer" aria-label="GitHub"><FaGithub size={18} aria-hidden="true" /></a></li>
                            <li><a className="icon-button" href={profile.links.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><FaLinkedinIn size={17} aria-hidden="true" /></a></li>
                            <li><a className="icon-button" href={`mailto:${profile.email}`} aria-label={`Email ${profile.email}`}><Mail size={17} aria-hidden="true" /></a></li>
                        </ul>
                    </motion.div>
                </div>

                <Portrait />
            </div>

        </section>
    );
}
