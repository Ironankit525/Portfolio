import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, Moon, Search, Sun, X } from 'lucide-react';
import { profile, sections } from '../data/profile';
import { useActiveSection } from '../hooks/useActiveSection';
import { isApplePlatform } from '../lib/pointer';
import ResumeButton from './ResumeButton';

// "top" is watched too, so no link stays highlighted once the visitor is back in the hero.
const WATCHED = ['top', ...sections.map((section) => section.id)];

export default function Nav({ theme, onToggleTheme, onOpenPalette }) {
    const active = useActiveSection(WATCHED);
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        if (!menuOpen) return undefined;
        const onKeyDown = (event) => {
            if (event.key === 'Escape') setMenuOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [menuOpen]);

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    return (
        <header className={`nav${scrolled || menuOpen ? ' is-solid' : ''}`}>
            <nav className="nav-bar" aria-label="Main navigation">
                <a href="#top" className="nav-logo" aria-label={`${profile.name}, back to top`}>
                    <span className="nav-mark" aria-hidden="true">{profile.initials}</span>
                    <span className="nav-name">{profile.name}</span>
                </a>

                <ul className="nav-links">
                    {sections.map((section) => (
                        <li key={section.id}>
                            <a href={`#${section.id}`} aria-current={active === section.id ? 'location' : undefined}>
                                {active === section.id && (
                                    <motion.span
                                        layoutId="nav-active"
                                        className="nav-active"
                                        transition={{ type: 'spring', stiffness: 420, damping: 36 }}
                                    />
                                )}
                                {section.label}
                            </a>
                        </li>
                    ))}
                </ul>

                <div className="nav-actions">
                    <button type="button" className="nav-search" onClick={onOpenPalette} aria-label="Open the command menu">
                        <Search size={15} aria-hidden="true" />
                        <kbd>{isApplePlatform() ? '⌘K' : 'Ctrl K'}</kbd>
                    </button>
                    <button type="button" className="icon-button" onClick={onToggleTheme} aria-label={`Switch to ${nextTheme} theme`}>
                        {theme === 'dark' ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
                    </button>
                    <ResumeButton label="Résumé" variant="primary" className="nav-resume" />
                    <button
                        type="button"
                        className="icon-button nav-toggle"
                        aria-expanded={menuOpen}
                        aria-controls="nav-sheet"
                        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMenuOpen((open) => !open)}
                    >
                        {menuOpen ? <X size={18} aria-hidden="true" /> : <Menu size={18} aria-hidden="true" />}
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        id="nav-sheet"
                        className="nav-sheet"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                    >
                        <ul>
                            {sections.map((section, index) => (
                                <li key={section.id}>
                                    <a
                                        href={`#${section.id}`}
                                        aria-current={active === section.id ? 'location' : undefined}
                                        onClick={() => setMenuOpen(false)}
                                    >
                                        <span>{String(index + 1).padStart(2, '0')}</span>
                                        {section.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                        <ResumeButton variant="primary" size="lg" onClick={() => setMenuOpen(false)} />
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
