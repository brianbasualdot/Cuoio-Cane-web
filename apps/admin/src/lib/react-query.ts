import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';

// Since we already have 'idb' installed (from package.json), we might use it or a simpler wrapper.
// For simplicity and robustness with 'persistQueryClient', we need a persister interface.

// Let's create a custom IDB persister using the 'idb' library we saw in package.json
import { openDB } from 'idb';

const dbPromise = typeof window !== 'undefined'
    ? openDB('cuoio-cane-query-cache', 1, {
        upgrade(db) {
            db.createObjectStore('key-val');
        },
    })
    : Promise.resolve(null);

// (Unused persister code removed)

// CORRECT IMPLEMENTATION:
// We define the QueryClient and the persister separately.

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 1000 * 60 * 60 * 24, // 24 hours
            staleTime: 1000 * 60 * 5, // 5 minutes (data is fresh for 5 mins)
            retry: 1,
            networkMode: 'offlineFirst', // IMPORTANT: don't fail immediately if offline
        },
    },
});

// We need an async function to loose-couple the persistence initialization
// because it relies on browser APIs (IndexedDB)
export async function initPersister() {
    if (typeof window === 'undefined') return;

    const { persistQueryClient } = await import('@tanstack/react-query-persist-client');
    const { createAsyncStoragePersister } = await import('@tanstack/query-async-storage-persister');

    const persister = createAsyncStoragePersister({
        storage: {
            getItem: async (key) => {
                const db = await dbPromise;
                return (await db?.get('key-val', key)) ?? null;
            },
            setItem: async (key, value) => {
                const db = await dbPromise;
                await db?.put('key-val', value, key);
            },
            removeItem: async (key) => {
                const db = await dbPromise;
                await db?.delete('key-val', key);
            },
        },
    });

    await persistQueryClient({
        queryClient,
        persister,
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
}
