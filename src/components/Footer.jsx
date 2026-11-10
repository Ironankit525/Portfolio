import { ArrowUp } from 'lucide-react';
import { profile } from '../data/profile';
import { isApplePlatform, trackPointer } from '../lib/pointer';

export default function Footer({ onOpenPalette }) {
    return (
        <footer className="footer">
            <div className="container footer-row">
                <p>© {new Date().getFullYear()} {profile.name}. Built with React, Vite and Framer Motion.</p>
                <div className="footer-links">
                    <a href={profile.links.github} target="_blank" rel="noreferrer">GitHub</a>
                    <a href={profile.links.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
                    <a href={`mailto:${profile.email}`}>Email</a>
                    <button type="button" onClick={onOpenPalette}>
                        Command menu <kbd>{isApplePlatform() ? '⌘K' : 'Ctrl K'}</kbd>
                    </button>
                    <a href="#top">Back to top <ArrowUp size={14} aria-hidden="true" /></a>
                </div>
            </div>
            <p className="footer-name" aria-hidden="true" onPointerMove={trackPointer}>{profile.name}</p>
        </footer>
    );
}
