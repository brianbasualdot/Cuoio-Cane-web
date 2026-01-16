'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';

export const WhatsAppButton = () => {
    const phoneNumber = '5491100000000'; // Replace with actual number
    const message = 'Hola! Estoy interesado en un producto de Cuoio Cane.';
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 flex items-center justify-center p-4 bg-[#25D366] text-white rounded-full shadow-lg hover:shadow-xl transition-shadow group"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
            <motion.div
                className="absolute inset-0 rounded-full bg-white opacity-0 group-hover:opacity-20 transition-opacity"
            />
            {/* Ping animation effect */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-75 animate-ping -z-10"></span>

            <MessageCircle className="w-8 h-8 fill-current" strokeWidth={1.5} />

            {/* Tooltip on hover */}
            <span className="absolute right-full mr-4 px-3 py-1 bg-white text-zinc-900 text-sm font-medium rounded-md shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden md:block">
                ¡Contáctanos!
            </span>
        </motion.a>
    );
};
