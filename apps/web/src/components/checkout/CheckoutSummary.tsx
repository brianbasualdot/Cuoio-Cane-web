'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { priceCountUpVariants } from '@/lib/motion/checkout';

interface CartItem {
    variantId: string;
    name: string;
    variantName: string;
    quantity: number;
    price: number;
}

interface CheckoutSummaryProps {
    items: CartItem[];
    subtotal: number;
    shippingCost: number;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({ items, subtotal, shippingCost }) => {
    const total = subtotal + shippingCost;

    return (
        <div className="bg-white/[0.02] border border-white/5 p-8 md:p-12 rounded-sm space-y-8">
            <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60 font-medium">Resumen</h2>

            <div className="space-y-6">
                {items.map(item => (
                    <div key={item.variantId} className="flex justify-between items-start text-sm group">
                        <div className="space-y-1">
                            <p className="text-brand-platinum font-medium tracking-wide">{item.name}</p>
                            <p className="text-xs text-muted-foreground/60 uppercase tracking-wider">{item.variantName} x {item.quantity}</p>
                        </div>
                        <span className="text-muted-foreground group-hover:text-brand-platinum transition-colors">
                            {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(item.price * item.quantity)}
                        </span>
                    </div>
                ))}
            </div>

            <div className="border-t border-white/5 pt-6 space-y-3">
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Envío</span>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={shippingCost}
                            variants={priceCountUpVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="text-brand-platinum/80"
                        >
                            {shippingCost === 0 ? 'Gratis' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(shippingCost)}
                        </motion.span>
                    </AnimatePresence>
                </div>
            </div>

            <div className="border-t border-white/5 pt-6 flex justify-between items-baseline text-brand-platinum">
                <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground/60">Total</span>
                <AnimatePresence mode="wait">
                    <motion.span
                        key={total}
                        variants={priceCountUpVariants}
                        initial="initial"
                        animate="animate"
                        className="text-3xl font-serif"
                    >
                        {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(total)}
                    </motion.span>
                </AnimatePresence>
            </div>
        </div>
    );
};
