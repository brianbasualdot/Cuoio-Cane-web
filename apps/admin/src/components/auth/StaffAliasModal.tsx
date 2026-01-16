'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/CardContainer';
import { Button } from '@/components/ui/ActionButton';
import { Input } from '@/components/ui/InputField';

interface StaffAliasModalProps {
    onSetAlias: (alias: string) => void;
}

export function StaffAliasModal({ onSetAlias }: StaffAliasModalProps) {
    const [value, setValue] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (value.trim().length > 2) {
            onSetAlias(value.trim());
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
            <Card className="w-full max-w-md border-border-subtle bg-surface shadow-2xl">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl">Identificación Operativa</CardTitle>
                    <CardDescription>
                        Para continuar, ingresa tu alias o nombre para el turno actual.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="alias" className="text-xs font-medium text-zinc-400">
                                Alias / Nombre
                            </label>
                            <Input
                                id="alias"
                                placeholder="Ej: Juan - Turno Mañana"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                                autoFocus
                                required
                                className="bg-background"
                            />
                        </div>
                        <Button
                            type="submit"
                            className="w-full"
                            disabled={value.trim().length < 3}
                        >
                            Comenzar Turno
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
