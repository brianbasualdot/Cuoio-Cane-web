'use client';

import Link from 'next/link';
import { ShoppingBag, User as UserIcon, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

function UserMenu() {
    const { user, signOut, isAdmin, loading } = useAuth();

    if (loading) return <div className="w-8 h-8 rounded-full bg-muted/20 animate-pulse" />;

    if (!user) {
        return (
            <Link href="/login" className="text-sm font-medium hover:text-primary transition-colors">
                ENTRAR
            </Link>
        );
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                    <UserIcon className="h-5 w-5" />
                    <span className="sr-only">Mi cuenta</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {isAdmin && (
                    <DropdownMenuItem asChild>
                        <a href={process.env.NEXT_PUBLIC_ADMIN_URL || 'http://localhost:3001'} target="_blank" rel="noreferrer" className="cursor-pointer">
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Administración</span>
                        </a>
                    </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => signOut()} className="text-destructive focus:text-destructive cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar Sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4">
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <span className="text-xl font-bold font-serif tracking-widest text-primary">CUOIO CANE</span>
                </Link>
                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/products" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Colección
                    </Link>
                    <Link href="/care" className="transition-colors hover:text-foreground/80 text-foreground/60 hidden sm:inline-block">
                        Cuidados del Cuero
                    </Link>
                </nav>
                <div className="flex items-center space-x-4">
                    <UserMenu />
                    <button className="relative p-2 hover:bg-muted/50 rounded-full transition-all duration-300 hover:scale-105 active:scale-95">
                        <ShoppingBag className="h-5 w-5 text-primary" />
                        {/* Badge Placeholer */}
                        {/* <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">0</span> */}
                    </button>
                </div>
            </div>
        </header>
    );
}
