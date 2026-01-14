import { Variants } from "framer-motion";

export const emptyContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" },
    },
};

export const emptyTextVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.3, duration: 0.8, ease: "easeOut" },
    },
};

export const breathingLineVariants: Variants = {
    initial: { scaleX: 0.8, opacity: 0.5 },
    animate: {
        scaleX: [0.8, 1, 0.8],
        opacity: [0.5, 0.8, 0.5],
        transition: {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
        },
    },
};

export const linkVariants: Variants = {
    initial: { x: 0 },
    hover: { x: 5, transition: { duration: 0.3 } },
};
