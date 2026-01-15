'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

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
            alert('Error de acceso: ' + error.message);
            setLoading(false);
        } else {
            router.push('/');
            router.refresh();
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-[#09090b]">
            {/* Ambient Background - Vignette & Warmth */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(62,39,35,0.15)_0%,rgba(9,9,11,1)_100%)] pointer-events-none" />

            {/* Main Login Card */}
            <div className={cn(
                "relative z-10 w-full max-w-[440px] p-10 md:p-14",
                "bg-[#121212] rounded-2xl",
                "border border-[#27272a] shadow-2xl shadow-black/80",
                "flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-1000 ease-out"
            )}>
                {/* Header */}
                <div className="text-center mb-12 space-y-3">
                    <h1 className="font-serif text-4xl text-[#f4f4f5] tracking-tight">
                        Iniciar Sesión
                    </h1>
                    <p className="font-sans text-[10px] text-[#d4b483] uppercase tracking-[0.25em] font-medium opacity-90">
                        Panel de administración Cuoio Cane
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-4">
                        <InputGroup
                            id="email"
                            type="email"
                            label="Correo Electrónico"
                            value={email}
                            onChange={setEmail}
                            placeholder="nombre@cuoiocane.com"
                        />
                        <InputGroup
                            id="password"
                            type="password"
                            label="Contraseña"
                            value={password}
                            onChange={setPassword}
                            placeholder="••••••••"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className="w-3.5 h-3.5 rounded border border-[#52525b] group-hover:border-[#d4b483] transition-colors relative" />
                            <span className="text-[10px] uppercase tracking-wider text-[#a1a1aa] font-sans">Recordarme</span>
                        </label>
                        <button type="button" className="text-[10px] uppercase tracking-wider text-[#a1a1aa] hover:text-[#d4b483] font-sans transition-colors">
                            ¿Olvidaste tu contraseña?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={cn(
                            "w-full h-12 mt-8 rounded-lg relative overflow-hidden group",
                            "bg-gradient-to-b from-[#3E2723] to-[#281815]", // Dark Coffee
                            "border border-[#5D4037]/30 hover:border-[#8D6E63]/50",
                            "shadow-[0_4px_20px_-5px_rgba(62,39,35,0.5)] hover:shadow-[0_8px_30px_-5px_rgba(62,39,35,0.6)]",
                            "transition-all duration-700 ease-out",
                            "flex items-center justify-center gap-2"
                        )}
                    >
                        {/* Inner Light Reflection (Top) */}
                        <div className="absolute inset-x-0 top-0 h-[1px] bg-white/10 opacity-50 group-hover:opacity-100 transition-opacity" />

                        <span className={cn(
                            "font-sans text-xs font-medium uppercase tracking-[0.2em] text-[#EFEBE9]",
                            "transition-all duration-500 group-hover:tracking-[0.25em]"
                        )}>
                            {loading ? 'Ingresando...' : 'Entrar al Panel'}
                        </span>

                        {loading && <Loader2 className="w-3 h-3 animate-spin text-[#d4b483]" />}
                    </button>
                </form>
            </div>

            {/* Footer */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
                <p className="text-[10px] text-[#52525b] font-mono tracking-widest opacity-50 uppercase">
                    © 2026 Cuoio Cane Atelier. Acceso Restringido.
                </p>
            </div>
        </div>
    );
}

// Subcomponent for Cleaner Inputs
function InputGroup({ id, type, label, value, onChange, placeholder }: any) {
    return (
        <div className="space-y-1.5 group">
            <label htmlFor={id} className="block text-[10px] font-playfair font-medium text-[#a1a1aa] ml-1 opacity-80 group-focus-within:text-[#d4b483] group-focus-within:opacity-100 transition-colors duration-500">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full px-5 py-3.5",
                    "bg-[#09090b] text-[#f4f4f5]",
                    "border border-[#27272a] rounded-xl",
                    "placeholder:text-[#52525b]/40 placeholder:text-xs placeholder:tracking-wide",
                    "focus:outline-none focus:border-[#5D4037] focus:ring-1 focus:ring-[#5D4037]/20",
                    "form-input transition-all duration-500 ease-out",
                    "font-sans text-sm tracking-wide"
                )}
                placeholder={placeholder}
                required
            />
        </div>
    );
}
