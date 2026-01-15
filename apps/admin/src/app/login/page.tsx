'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// NOTE: We don't import ANY legacy components. This is pure, strict output.

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
            alert('Error: ' + error.message);
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        // CONTAINER: Full Screen, Centered, No Scroll
        // bg-[var(--background)] defined in globals, but explicit here for safety
        <div className="w-full h-full flex items-center justify-center relative bg-[var(--background)]">

            {/* AMBIENT LIGHT: Static radial, no animation */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(circle at center, rgba(62, 39, 35, 0.15) 0%, transparent 60%)' }}
            />

            {/* CARD: Rigid Dimensions (420px), Padding (40px) */}
            <div className="relative z-10 w-full max-w-[420px] bg-[var(--surface)] border border-[var(--border)] rounded-xl p-10 shadow-2xl">

                {/* HEADER */}
                <div className="flex flex-col items-center mb-10 text-center">
                    <h1 className="font-serif-title text-3xl text-[var(--text-primary)] leading-tight tracking-tight mb-2">
                        Iniciar Sesión
                    </h1>
                    <span className="font-sans text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)] font-medium">
                        Cuoio Cane Admin
                    </span>
                </div>

                {/* FORM */}
                <form onSubmit={handleLogin} className="flex flex-col gap-6">

                    {/* INPUTS GROUP */}
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-sans font-medium text-[var(--text-secondary)] ml-1">
                                Email
                            </label>
                            <input
                                type="email"
                                disabled={loading}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-coffee-light)] transition-colors"
                                placeholder="usuario@cuoiocane.com"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-[11px] font-sans font-medium text-[var(--text-secondary)] ml-1">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                disabled={loading}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-11 px-4 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--accent-coffee-light)] transition-colors"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* ACTIONS (Remember / Forgot) */}
                    <div className="flex items-center justify-between px-1">
                        <label className="flex items-center gap-2 cursor-pointer opacity-80 hover:opacity-100 transition-opacity">
                            <input type="checkbox" className="w-3.5 h-3.5 rounded border border-[var(--border)] bg-transparent checked:bg-[var(--accent-coffee)] appearance-none cursor-pointer" />
                            <span className="text-[10px] font-sans text-[var(--text-secondary)] uppercase tracking-wider">Recordarme</span>
                        </label>
                        <button type="button" className="text-[10px] font-sans text-[var(--text-secondary)] uppercase tracking-wider hover:text-[var(--accent-copper)] transition-colors">
                            ¿Olvidaste clave?
                        </button>
                    </div>

                    {/* BUTTON: Dark Coffee Gradient */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 mt-2 rounded-lg bg-gradient-to-b from-[var(--accent-coffee)] to-[#251815] border border-[#5D4037]/20 text-[rgb(240,230,225)] text-xs font-sans font-medium uppercase tracking-[0.2em] hover:brightness-110 active:scale-[0.99] transition-all flex items-center justify-center gap-2 shadow-lg shadow-black/40"
                    >
                        {loading && <Loader2 className="w-3 h-3 animate-spin" />}
                        {loading ? 'Verificando...' : 'Entrar al Panel'}
                    </button>

                </form>
            </div>

            {/* FOOTER */}
            <div className="absolute bottom-6 opacity-40">
                <p className="text-[10px] font-mono text-[var(--text-muted)] tracking-widest uppercase">
                    © 2026 Atelier System v2.0
                </p>
            </div>

        </div>
    );
}
