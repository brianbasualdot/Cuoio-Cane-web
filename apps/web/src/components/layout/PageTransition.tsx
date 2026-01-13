'use client';

import { motion } from 'framer-motion';

export function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{
                duration: 0.6,
                ease: [0.22, 1, 0.36, 1] // Custom "Heavy/Elegant" ease (cubic-bezier)
            }}
        >
            {children}
        </motion.div>
    );
}
