import { queueManager } from './queue';
import { syncManager } from './sync';

interface FetchOptions extends RequestInit {
    // Add any custom options here
}

export async function offlineFetch(url: string, options: FetchOptions = {}) {
    // Determine method
    const method = options.method ? options.method.toUpperCase() : 'GET';
    const isMutation = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);

    // Check network status (using syncManager or navigator directly)
    const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

    if (isOnline) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // If it's a 5xx error, maybe we want to queue it too?
                // For now, only network errors (fetch throws) trigger offline logic usually,
                // but requirements say "Si No hay conexión".
                // We trust `isOnline` check mostly.
            }
            return response;
        } catch (e) {
            // Fetch failed (network error likely)
            console.warn('[OfflineFetch] Fetch failed, assuming offline mode.', e);
            // proceed to offline handling
        }
    }

    // --- Offline Handling ---

    if (isMutation) {
        console.log(`[OfflineFetch] Enqueuing ${method} attempt for ${url}`);

        // Enqueue
        await queueManager.enqueue({
            url,
            method,
            body: options.body ? JSON.parse(options.body as string) : {}, // Assuming body is JSON string
            headers: options.headers
        });

        // Return a mock success response
        // This keeps the UI optimistic
        return new Response(JSON.stringify({
            success: true,
            message: 'Action queued offline',
            offline: true
        }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } else {
        // Query (GET)
        // Ideally we return cached data. 
        // For scope "Implementación básica", we can return a 200 with empty data or try to implement basic cache?
        // Prompt: "la UI sigue funcionando", "actualizar cache local" (when online)
        // Since we are not implementing a full cache interceptor for GETs in this step (complex),
        // we will try to fetch (it failed above) -> throw or return safe fallback?
        // Let's return a specific error or strict fallback so UI handles it gracefully?
        // Actually, best effort is to return a 503 or a flagged response.

        console.warn('[OfflineFetch] Offline GET not fully cached. UI should handle graceful degradation.');
        // Return error to let SWR/React Query/Custom components know processing failed, 
        // OR return cached if we had it.
        // For this specific iteration, we will let it throw or return 503 so component shows "Offline" state if needed.
        // BUT user asked "no mostrar errores invasivos".
        // A better approach for GET is using SWR which handles cache. 
        // The current `page.tsx` uses `fetch` in `useEffect`. It doesn't use SWR.
        // So `fetch` failing will cause the catch block in `page.tsx` to run.
        // We can throw a custom error.

        throw new Error('Offline mode: Cannot fetch fresh data.');
    }
}
