import { useCallback, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';

const STORAGE_KEY = 'theme';
const BROWSER_BAR = { dark: '#050505', light: '#f4f4ef' };

// index.html sets the class before first paint; this reads it back.
const activeTheme = () => (document.documentElement.classList.contains('light') ? 'light' : 'dark');

function savedTheme() {
    try {
        return window.localStorage.getItem(STORAGE_KEY);
    } catch {
        return null;
    }
}

function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', BROWSER_BAR[theme]);
}

export function useTheme() {
    const [theme, setTheme] = useState(activeTheme);

    // Follow the system setting until the visitor picks a theme themselves.
    useEffect(() => {
        const media = window.matchMedia('(prefers-color-scheme: light)');
        const follow = (event) => {
            if (savedTheme()) return;
            const next = event.matches ? 'light' : 'dark';
            applyTheme(next);
            setTheme(next);
        };
        media.addEventListener('change', follow);
        return () => media.removeEventListener('change', follow);
    }, []);

    // Pass the click event to reveal the new theme in a circle growing from the button.
    const toggleTheme = useCallback((event) => {
        const next = activeTheme() === 'dark' ? 'light' : 'dark';
        const commit = () => {
            applyTheme(next);
            setTheme(next);
            try {
                window.localStorage.setItem(STORAGE_KEY, next);
            } catch {
                // Private browsing: the choice simply lasts for this visit.
            }
        };

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !document.startViewTransition) {
            commit();
            return;
        }

        const origin = event?.currentTarget?.getBoundingClientRect?.();
        const x = origin ? origin.left + origin.width / 2 : window.innerWidth / 2;
        const y = origin ? origin.top + origin.height / 2 : 0;
        const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

        document.startViewTransition(() => flushSync(commit)).ready
            .then(() => {
                document.documentElement.animate(
                    { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`] },
                    { duration: 600, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', pseudoElement: '::view-transition-new(root)' },
                );
            })
            .catch(() => {
                // The theme has already changed; only the animation was skipped.
            });
    }, []);

    return { theme, toggleTheme };
}
