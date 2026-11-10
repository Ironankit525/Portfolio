import { useSyncExternalStore } from 'react';
import { currentHash, subscribe } from '../lib/router';

export function useHashRoute() {
    return useSyncExternalStore(subscribe, currentHash);
}
