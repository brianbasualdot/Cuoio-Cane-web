'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { useRouter } from 'next/navigation';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    signOut: () => Promise<void>;
    isAdmin: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setUser(session?.user ?? null);
            if (session?.user) {
                checkRole(session.user.id);
            } else {
                setLoading(false);
            }
        };

        fetchSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            setUser(session?.user ?? null);
            if (session?.user) {
                checkRole(session.user.id);
            } else {
                setIsAdmin(false);
                setLoading(false);
            }
            if (event === 'SIGNED_OUT') {
                router.refresh();
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, [router]);

    const checkRole = async (uid: string) => {
        try {
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', uid)
                .single();

            if (!error && data) {
                setIsAdmin(data.role === 'admin' || data.role === 'staff');
            }
        } catch (e) {
            console.error('Error checking role', e);
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
