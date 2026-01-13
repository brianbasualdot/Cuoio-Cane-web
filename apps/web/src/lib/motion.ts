export const transitions = {
    default: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1], // Custom heavy ease
    },
    slow: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
    },
};

export const variants = {
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: transitions.default,
    },
    fadeInUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 10 },
        transition: transitions.default,
    },
    staggerContainer: {
        animate: {
            transition: {
                staggerChildren: 0.1,
            },
        },
    },
};
