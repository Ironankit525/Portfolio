import { useCallback, useEffect, useState } from 'react';
import { MotionConfig } from 'framer-motion';
import AboutSection from './components/AboutSection';
import CommandPalette from './components/CommandPalette';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Nav from './components/Nav';
import OpenSourceSection from './components/OpenSourceSection';
import ProjectDetail from './components/ProjectDetail';
import ProjectsSection from './components/ProjectsSection';
import ScrollProgress from './components/ScrollProgress';
import ToolkitSection from './components/ToolkitSection';
import { isProjectRoute, projectForRoute } from './data/projectModel';
import { projects } from './data/projects';
import { useHashRoute } from './hooks/useHashRoute';
import { useOpenSource } from './hooks/useOpenSource';
import { useTheme } from './hooks/useTheme';

export default function App() {
    const route = useHashRoute();
    const { theme, toggleTheme } = useTheme();
    const openSource = useOpenSource();
    const [paletteOpen, setPaletteOpen] = useState(false);

    const openPalette = useCallback(() => setPaletteOpen(true), []);
    const closePalette = useCallback(() => setPaletteOpen(false), []);

    // ⌘K on macOS, Ctrl+K elsewhere.
    useEffect(() => {
        const onKeyDown = (event) => {
            if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
                event.preventDefault();
                setPaletteOpen((open) => !open);
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, []);

    return (
        // reducedMotion="user" turns off movement for visitors who ask their system for less of it.
        <MotionConfig reducedMotion="user">
            <a className="skip-link" href="#about">Skip to content</a>
            <ScrollProgress />
            <Nav theme={theme} onToggleTheme={toggleTheme} onOpenPalette={openPalette} />

            <main>
                <Hero />
                <Marquee />
                <AboutSection />
                <ProjectsSection items={projects} />
                <ToolkitSection projects={projects} openSource={openSource} />
                <OpenSourceSection data={openSource} />
                <ContactSection />
            </main>
            <Footer onOpenPalette={openPalette} />

            {/* Case studies open over the page at #/project/<id>; the key restarts the dialog for each one. */}
            {isProjectRoute(route) && <ProjectDetail key={route} project={projectForRoute(projects, route)} projects={projects} />}
            {paletteOpen && <CommandPalette projects={projects} theme={theme} onToggleTheme={toggleTheme} onClose={closePalette} />}
        </MotionConfig>
    );
}
