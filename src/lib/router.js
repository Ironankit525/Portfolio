// A tiny hash router. Sections use plain #anchors; case studies use #/project/<id>.
// Changing the hash through here (instead of location.hash) skips the browser's own
// jump, so closing a case study leaves the page where the visitor was.

const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

export function subscribe(listener) {
    listeners.add(listener);
    window.addEventListener('hashchange', listener);
    window.addEventListener('popstate', listener);
    return () => {
        listeners.delete(listener);
        window.removeEventListener('hashchange', listener);
        window.removeEventListener('popstate', listener);
    };
}

export const currentHash = () => window.location.hash;

export function setHash(hash) {
    if (hash !== window.location.hash) window.history.pushState(null, '', hash);
    notify();
}

export function goToSection(id) {
    setHash(`#${id}`);
    document.getElementById(id)?.scrollIntoView();
}
