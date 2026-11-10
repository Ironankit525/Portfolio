import { useEffect, useState } from 'react';
import { PR_SEARCH_API, normalizePullRequests, summarizeContributions } from '../data/openSource';
import snapshot from '../data/openSourceSnapshot.json';

const CACHE_KEY = 'open-source-v1';
const CACHE_MINUTES = 60;

function readCache() {
    try {
        const cached = JSON.parse(window.sessionStorage.getItem(CACHE_KEY));
        const fresh = cached && Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_MINUTES * 60_000;
        return fresh ? cached : null;
    } catch {
        return null;
    }
}

const toState = ({ fetchedAt, pullRequests }, live) => ({ ...summarizeContributions(pullRequests), fetchedAt, live });

// My pull requests, straight from GitHub. Starts with the saved snapshot so the
// section is never empty, then swaps in live data when the request succeeds.
// One unauthenticated request per visit, cached for an hour.
export function useOpenSource() {
    const [state, setState] = useState(() => {
        const cached = readCache();
        return cached ? toState(cached, true) : toState(snapshot, false);
    });

    useEffect(() => {
        if (readCache()) return undefined;
        let cancelled = false;

        fetch(PR_SEARCH_API, { headers: { Accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(10_000) })
            .then((response) => (response.ok ? response.json() : Promise.reject(new Error(`GitHub answered ${response.status}`))))
            .then(({ items }) => {
                const fresh = { fetchedAt: new Date().toISOString(), pullRequests: normalizePullRequests(items) };
                if (fresh.pullRequests.length === 0) return;
                try {
                    window.sessionStorage.setItem(CACHE_KEY, JSON.stringify(fresh));
                } catch {
                    // Storage is unavailable; the data still shows for this page view.
                }
                if (!cancelled) setState(toState(fresh, true));
            })
            .catch(() => {
                // Offline or rate-limited: the snapshot stays on screen.
            });

        return () => {
            cancelled = true;
        };
    }, []);

    return state;
}
