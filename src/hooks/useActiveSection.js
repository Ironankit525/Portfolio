import { useEffect, useState } from 'react';

// Returns the id of the section that currently crosses the middle of the viewport.
// `ids` must be a stable array (define it outside the component).
export function useActiveSection(ids) {
    const [active, setActive] = useState(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    if (entry.isIntersecting) setActive(entry.target.id);
                }
            },
            { rootMargin: '-45% 0px -50% 0px' },
        );
        for (const id of ids) {
            const element = document.getElementById(id);
            if (element) observer.observe(element);
        }
        return () => observer.disconnect();
    }, [ids]);

    return active;
}
