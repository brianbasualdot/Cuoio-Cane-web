'use client';

import { useEffect } from 'react';
import { syncManager } from '@/lib/offline/sync';

export function OfflineSyncProvider() {
    useEffect(() => {
        // Just by importing and running this effect, we ensure the singleton listeners are active
        // logic is inside sync.ts constructor/init, but we might want to expose a hook or status later.
        console.log('Offline Sync Provider Mounted');
    }, []);

    return null;
}
