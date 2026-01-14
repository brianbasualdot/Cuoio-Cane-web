'use client';

import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { Button } from "@/components/ui/button"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-black/80 backdrop-blur-sm supports-[backdrop-filter]:bg-black/50">
            <div className="container flex h-14 items-center justify-between px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="text-base font-serif tracking-[0.2em] text-brand-platinum/90 hover:text-white transition-colors">CUOIO CANE</span>
                </Link>
                <nav className="flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase">
                    {/* Navigation Items with Animated Underline */}
                    {['Colección', 'Cuidado'].map((label, i) => (
                        <Link
                            key={label}
                            href={i === 0 ? "/products" : "/care"}
                            className="group relative py-1 text-muted-foreground hover:text-brand-platinum transition-colors"
                        >
                            {label}
                            {/* Animated Underline */}
                            <span className="absolute bottom-0 left-0 w-full h-[1px] bg-brand-platinum/30 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] origin-left" />
                        </Link>
                    ))}
                </nav>
                <div className="flex items-center space-x-4">
                    {/* Public Store: No Auth UI exposed */}
                    <button className="relative p-2 hover:bg-white/5 rounded-full transition-all duration-300 text-muted-foreground hover:text-brand-platinum">
                        <ShoppingBag className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </header>
    );
}
