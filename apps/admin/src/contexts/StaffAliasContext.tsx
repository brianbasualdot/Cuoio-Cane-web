'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { StaffAliasModal } from '@/components/auth/StaffAliasModal';

interface StaffAliasContextType {
    alias: string | null;
    setAlias: (alias: string) => void;
    role: string | null;
}

const StaffAliasContext = createContext<StaffAliasContextType | undefined>(undefined);

export function useStaffAlias() {
    const context = useContext(StaffAliasContext);
    if (context === undefined) {
        throw new Error('useStaffAlias must be used within a StaffAliasProvider');
    }
    return context;
}

interface StaffAliasProviderProps {
    children: React.ReactNode;
    userRole: string | null;
}

export function StaffAliasProvider({ children, userRole }: StaffAliasProviderProps) {
    const [alias, setAliasState] = useState<string | null>(null);

    // In a real app, we might persist this to sessionStorage or cookies
    // so it survives refreshes. For now, state is fine for per-tab session.

    useEffect(() => {
        // If we wanted to persist:
        const stored = sessionStorage.getItem('staff_alias');
        if (stored) {
            setAliasState(stored);
        }
    }, []);

    const setAlias = (newAlias: string) => {
        setAliasState(newAlias);
        sessionStorage.setItem('staff_alias', newAlias);
    };

    return (
        <StaffAliasContext.Provider value={{ alias, setAlias, role: userRole }}>
            {children}
            {userRole === 'staff' && !alias && <StaffAliasModal onSetAlias={setAlias} />}
        </StaffAliasContext.Provider>
    );
}
