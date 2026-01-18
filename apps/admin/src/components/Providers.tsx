'use client';

import { useState, useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient, initPersister } from '@/lib/react-query';
import { OfflineSyncProvider } from './OfflineSyncProvider';
import { StaffAliasProvider } from '@/contexts/StaffAliasContext';

interface ProvidersProps {
    children: React.ReactNode;
    userRole: string | null;
}

export function Providers({ children, userRole }: ProvidersProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        // Initialize persister (IndexedDB)
        initPersister().then(() => {
            setMounted(true);
        });
    }, []);

    // Prevent hydration mismatch or show loader while restoring cache?
    // For now, we render immediately but persistence might kick in slightly after.
    // Actually, persistQueryClient restores cache asynchronously. 
    // We might want to wait for it, but usually it's fine to show loading/stale.

    return (
        <QueryClientProvider client={queryClient}>
            <StaffAliasProvider userRole={userRole}>
                <OfflineSyncProvider />
                {children}
            </StaffAliasProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
