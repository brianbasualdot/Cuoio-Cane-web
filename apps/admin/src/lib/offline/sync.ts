import { queueManager } from './queue';

class SyncManager {
    private isOnline: boolean = true;
    private isSyncing: boolean = false;
    private apiUrl: string;

    constructor() {
        if (typeof window !== 'undefined') {
            this.isOnline = navigator.onLine;
            window.addEventListener('online', () => this.handleOnline());
            window.addEventListener('offline', () => this.handleOffline());
            // also listen to custom events if needed
        }
        this.apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';
    }

    private handleOffline() {
        console.log('[Sync] Network is OFFLINE');
        this.isOnline = false;
    }

    private async handleOnline() {
        console.log('[Sync] Network is ONLINE. Attempting sync...');
        this.isOnline = true;
        await this.sync();
    }

    async sync() {
        if (this.isSyncing) return;
        if (!this.isOnline) return;

        const count = await queueManager.size();
        if (count === 0) {
            console.log('[Sync] Queue is empty.');
            return;
        }

        this.isSyncing = true;
        try {

            const items = await queueManager.getAll();
            console.log(`[Sync] Syncing ${items.length} items to backend...`);

            // We need to extract an `operario_id` for the top level of the request as requested.
            // Assuming all events in the queue belong to the same currently logged in operator.
            const operarioId = items.length > 0 ? items[0].operario_id : null;

            if (operarioId) {
                // Batch sync
                const res = await fetch(`${this.apiUrl}/sync`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        operario_id: operarioId,
                        events: items
                    })
                });

                if (!res.ok) {
                    throw new Error(`Sync failed with status ${res.status}`);
                }

                const result = await res.json();
                console.log('[Sync] Sync successful:', result);

                // Clear queue on success
                await queueManager.clear();
            } else {
                console.warn('[Sync] No operario_id found in queue items. Skipping sync.');
            }

        } catch (e) {
            console.error('[Sync] Sync failed:', e);
            // Will retry on next online event or manual trigger
        } finally {
            this.isSyncing = false;
        }
    }

    public getNetworkStatus() {
        return this.isOnline;
    }
}

export const syncManager = new SyncManager();
