'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { shippingOptionVariants, shippingHeightVariants } from '@/lib/motion/checkout';
import { cn } from '@/lib/utils';

interface ShippingOption {
    id: string;
    name: string;
    price: number;
    description: string;
}

interface ShippingSelectorProps {
    selectedId: string;
    options: ShippingOption[];
    onSelect: (id: string) => void;
}

export const ShippingSelector: React.FC<ShippingSelectorProps> = ({ selectedId, options, onSelect }) => {
    return (
        <div className="space-y-4">
            {options.map((option) => {
                const isSelected = selectedId === option.id;
                return (
                    <motion.div
                        key={option.id}
                        variants={shippingOptionVariants}
                        initial="unchecked"
                        animate={isSelected ? "checked" : "unchecked"}
                        onClick={() => onSelect(option.id)}
                        className={cn(
                            "relative cursor-pointer rounded-sm p-4 overflow-hidden",
                            "hover:bg-muted/5 transition-colors"
                        )}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{option.name}</span>
                            <span className="text-sm font-semibold">
                                {option.price === 0 ? 'Gratis' : `$${option.price}`}
                            </span>
                        </div>

                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    variants={shippingHeightVariants}
                                    initial="collapsed"
                                    animate="expanded"
                                    exit="collapsed"
                                    className="overflow-hidden"
                                >
                                    <p className="text-sm text-muted-foreground pt-2 border-t border-border/10 mt-2">
                                        {option.description}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>
    );
};
