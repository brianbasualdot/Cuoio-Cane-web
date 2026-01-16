'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { priceCountUpVariants } from '@/lib/motion/checkout';
import { Loader2, Ticket } from 'lucide-react';

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
    discountAmount: number;
    onApplyCoupon: (code: string) => Promise<boolean>;
}

export const CheckoutSummary: React.FC<CheckoutSummaryProps> = ({
    items,
    subtotal,
    shippingCost,
    discountAmount,
    onApplyCoupon
}) => {
    const total = Math.max(0, subtotal + shippingCost - discountAmount);

    const [couponInput, setCouponInput] = useState('');
    const [couponLoading, setCouponLoading] = useState(false);
    const [couponMessage, setCouponMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

    const handleApply = async () => {
        if (!couponInput.trim()) return;
        setCouponLoading(true);
        setCouponMessage(null);

        try {
            const success = await onApplyCoupon(couponInput);
            if (success) {
                setCouponMessage({ text: 'Cupón aplicado', type: 'success' });
            } else {
                setCouponMessage({ text: 'Cupón inválido', type: 'error' });
            }
        } catch (error) {
            setCouponMessage({ text: 'Error al aplicar', type: 'error' });
        } finally {
            setCouponLoading(false);
        }
    };

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

            <div className="border-t border-white/5 pt-6 space-y-4">
                {/* Coupon Input */}
                <div className="space-y-2">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            placeholder="CÓDIGO DE CUPÓN"
                            value={couponInput}
                            onChange={(e) => setCouponInput(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-sm text-xs px-3 py-2 w-full text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-colors uppercase tracking-widest"
                        />
                        <button
                            onClick={handleApply}
                            disabled={couponLoading || !couponInput}
                            className="bg-white/10 text-white text-[10px] uppercase tracking-wider px-4 rounded-sm hover:bg-white/20 disabled:opacity-50 transition-colors flex items-center justify-center min-w-[80px]"
                        >
                            {couponLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Aplicar'}
                        </button>
                    </div>
                    {couponMessage && (
                        <p className={`text-[10px] uppercase tracking-wider ${couponMessage.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                            {couponMessage.text}
                        </p>
                    )}
                </div>

                <div className="flex justify-between text-sm text-muted-foreground pt-4">
                    <span>Subtotal</span>
                    <span>{new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(subtotal)}</span>
                </div>

                <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Envío</span>
                    <span className="text-brand-platinum/80">
                        {shippingCost === 0 ? 'Gratis' : new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(shippingCost)}
                    </span>
                </div>

                {discountAmount > 0 && (
                    <div className="flex justify-between text-sm text-green-400/90 animate-in fade-in slide-in-from-right-4">
                        <span className="flex items-center gap-2"><Ticket className="w-3 h-3" /> Descuento</span>
                        <span>- {new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(discountAmount)}</span>
                    </div>
                )}
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
