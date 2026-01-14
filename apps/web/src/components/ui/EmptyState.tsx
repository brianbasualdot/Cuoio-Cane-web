'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { emptyContainerVariants, emptyTextVariants, breathingLineVariants, linkVariants } from '@/lib/motion/empty-states';
import Link from 'next/link';

export const EmptyState = () => {
    return (
        <motion.div
            variants={emptyContainerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center justify-center py-32 text-center px-4"
        >
            <motion.div
                variants={breathingLineVariants}
                initial="initial"
                animate="animate"
                className="w-24 h-[1px] bg-primary/40 mb-8"
            />

            <motion.h3
                variants={emptyTextVariants}
                className="text-2xl md:text-3xl font-serif text-brand-platinum mb-4 font-light tracking-wide"
            >
                Cada pieza lleva tiempo.
                <br />
                <span className="italic text-muted-foreground text-lg block mt-2">Pronto.</span>
            </motion.h3>

            <motion.div
                variants={linkVariants}
                initial="initial"
                whileHover="hover"
                className="mt-8"
            >
                <Link href="/" className="group flex items-center gap-2 text-sm uppercase tracking-widest text-primary hover:text-primary/80 transition-colors">
                    <span className="border-b border-transparent group-hover:border-primary transition-all pb-0.5">Explorar la marca</span>
                </Link>
            </motion.div>
        </motion.div>
    );
};
