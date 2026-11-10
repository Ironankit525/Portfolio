import { useEffect, useReducer } from 'react';
import { useReducedMotion } from 'framer-motion';

const TYPE_MS = 55;
const DELETE_MS = 26;
const HOLD_MS = 1700;   // pause on a finished phrase
const GAP_MS = 320;     // pause before the next one starts

// One step of the typewriter: type forward, hold, delete, move to the next phrase.
function step(state, phrases) {
    const phrase = phrases[state.index];
    if (!state.deleting && state.length === phrase.length) return { ...state, deleting: true };
    if (state.deleting && state.length === 0) return { index: (state.index + 1) % phrases.length, length: 0, deleting: false };
    return { ...state, length: state.length + (state.deleting ? -1 : 1) };
}

// Types each phrase in turn. Screen readers get the whole list once instead of the animation.
export default function TypedText({ phrases }) {
    const reducedMotion = useReducedMotion();
    const [state, advance] = useReducer(step, { index: 0, length: 0, deleting: false });
    const phrase = phrases[state.index];

    useEffect(() => {
        if (reducedMotion) return undefined;
        let delay = state.deleting ? DELETE_MS : TYPE_MS;
        if (!state.deleting && state.length === phrase.length) delay = HOLD_MS;
        if (state.deleting && state.length === 0) delay = GAP_MS;
        const timer = window.setTimeout(() => advance(phrases), delay);
        return () => window.clearTimeout(timer);
    }, [state, phrase, phrases, reducedMotion]);

    return (
        <span className="typed">
            <span className="sr-only">{phrases.join(', ')}</span>
            <span aria-hidden="true">{reducedMotion ? phrases[0] : phrase.slice(0, state.length)}</span>
            <span className="typed-caret" aria-hidden="true" />
        </span>
    );
}
