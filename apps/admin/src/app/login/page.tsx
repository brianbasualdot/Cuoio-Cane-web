'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            alert('Login failed: ' + error.message);
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
            <div className="w-full max-w-[400px] p-12 bg-[var(--background)] rounded-sm border border-[var(--border)]">
                <div className="flex flex-col items-center mb-12">
                    <span className="font-mono text-[10px] font-bold text-[var(--accent-copper)] tracking-[0.25em] uppercase mb-6">
                        CUOIO CANE
                    </span>
                    <h1 className="text-xl font-medium tracking-wide text-[var(--text-primary)]">Admin Access</h1>
                    <p className="text-xs text-[var(--text-secondary)] mt-2 font-mono tracking-wide opacity-60">Atelier Control Panel</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)/30] focus:outline-none focus:border-[var(--accent-copper)] transition-colors duration-300"
                            placeholder="admin@cuoiocane.com"
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block text-[10px] font-mono uppercase tracking-widest text-[var(--text-secondary)]">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 bg-[var(--surface)] border border-[var(--border)] rounded-sm text-sm text-[var(--text-primary)] placeholder-[var(--text-secondary)/30] focus:outline-none focus:border-[var(--accent-copper)] transition-colors duration-300"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-mono uppercase tracking-widest rounded-sm hover:bg-[var(--surface-hover)] hover:border-[var(--text-secondary)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                    >
                        {loading ? 'Authenticating...' : 'Enter Atelier'}
                    </button>
                </form>
            </div>
        </div>
    );
}
