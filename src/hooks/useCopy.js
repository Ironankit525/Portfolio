import { useCallback, useEffect, useRef, useState } from 'react';

// const [copied, copy] = useCopy(); `copied` stays true for a moment after a successful copy.
export function useCopy(resetAfter = 1800) {
    const [copied, setCopied] = useState(false);
    const timer = useRef(0);

    const copy = useCallback(async (text) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch {
            return false;
        }
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), resetAfter);
        return true;
    }, [resetAfter]);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    return [copied, copy];
}
