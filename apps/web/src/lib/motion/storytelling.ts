import { Variants } from "framer-motion";

export const sectionFadeVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 1, ease: "easeOut" },
    },
};

export const materialTextVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, filter: "blur(10px)" },
    visible: {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 1.2, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        y: -50,
        transition: { duration: 0.8 },
    },
};

export const lineRevealVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
        pathLength: 1,
        opacity: 1,
        transition: { duration: 1.5, ease: "easeInOut" },
    },
};

export const detailImageVariants: Variants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: { duration: 1.5, ease: "easeOut" },
    },
};
