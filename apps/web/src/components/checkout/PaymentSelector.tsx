'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { paymentMethodVariants, logoFadeVariants } from '@/lib/motion/checkout';
import { cn } from '@/lib/utils';
// Assuming lucide-react is available, or use text/img
import { CreditCard, Wallet } from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    icon: React.ReactNode;
}

interface PaymentSelectorProps {
    selectedId: string;
    onSelect: (id: string) => void;
}

const methods: PaymentMethod[] = [
    { id: 'mercadopago', name: 'Mercado Pago', icon: <CreditCard className="w-5 h-5" /> },
    { id: 'transfer', name: 'Transferencia', icon: <Wallet className="w-5 h-5" /> },
];

export const PaymentSelector: React.FC<PaymentSelectorProps> = ({ selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-2 gap-4">
            {methods.map((method) => {
                const isSelected = selectedId === method.id;
                return (
                    <motion.div
                        key={method.id}
                        variants={paymentMethodVariants}
                        initial="idle"
                        animate={isSelected ? "selected" : "unselected"}
                        onClick={() => onSelect(method.id)}
                        className={cn(
                            "cursor-pointer rounded-sm bg-muted/10 p-4 flex flex-col items-center justify-center gap-2 border border-border/5",
                            "hover:bg-muted/20"
                        )}
                    >
                        <motion.div variants={logoFadeVariants} animate="visible">
                            {method.icon}
                        </motion.div>
                        <span className="text-sm font-medium">{method.name}</span>
                    </motion.div>
                );
            })}
        </div>
    );
};
