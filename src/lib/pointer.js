// Writes the pointer position into --mx / --my on the element it is attached to.
// The `.spot` styles in index.css use those to draw a glow that follows the cursor.
export function trackPointer(event) {
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty('--mx', `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

export const isApplePlatform = () => /Mac|iPhone|iPad/.test(window.navigator.userAgent);
