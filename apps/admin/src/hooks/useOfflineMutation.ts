import { useState } from 'react';
import { queueManager } from '@/lib/offline/queue';
import { useQueryClient } from '@tanstack/react-query';

interface UseOfflineMutationProps {
    entidad: string;
    accion: 'create' | 'update' | 'delete';
    onSuccess?: (data: any) => void;
    onError?: (error: any) => void;
}

export function useOfflineMutation({ entidad, accion, onSuccess, onError }: UseOfflineMutationProps) {
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();

    const mutate = async (payload: any, operarioId: string) => {
        setIsLoading(true);
        const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;

        if (isOnline) {
            try {
                // Online: Direct fetch to API
                // NOTE: We assume a standardized API structure: POST /api/{entidad} or similar
                // But since we have specific URLs (like /staff, /users), we might need a URL mapper or pass it in.
                // For now, we will assume strict mappings or pass 'url' in payload if needed, 
                // BUT the requirement is "Action Queue -> Sync".
                // Ideally online behavior = offline behavior (queue + immediate sync) OR direct fetch.
                // Requirement: "3. Si hay conexion -> Intenter enviar evento".

                // Let's try direct fetch to real endpoint first (legacy compatibility)
                // We need to map (entidad, accion) -> URL + Method
                // This is implicit logic. 
                // For simplicity in this specialized hook, let's accept a 'performOnline' callback? 
                // Or we can just ALWAYS enqueue and trigger sync? 
                // "1. Al realizar accion -> Guardar en cola local -> Actualizar UI"
                // "2. Si hay conexión -> Intentar enviar evento"
                // This suggests ALWAYS going through queue is safer for "Offline First".

                await queueManager.enqueue({
                    operario_id: operarioId,
                    entidad,
                    accion,
                    payload
                });

                // Optimistic UI Update happens via onSuccess usually (refetch or setCache)
                // Trigger Sync immediately and WAIT for it so refetch gets fresh data
                const { syncManager } = await import('@/lib/offline/sync');
                await syncManager.sync();

                if (onSuccess) onSuccess({ offline: false, success: true });

            } catch (e) {
                console.error('Online mutation failed:', e);
                if (onError) onError(e);
            }
        } else {
            // Offline
            try {
                await queueManager.enqueue({
                    operario_id: operarioId,
                    entidad,
                    accion,
                    payload
                });

                // Optimistic response
                if (onSuccess) onSuccess({ offline: true, success: true });
            } catch (e) {
                console.error('Offline enqueue failed:', e);
                if (onError) onError(e);
            }
        }
        setIsLoading(false);
    };

    return { mutate, isLoading };
}
