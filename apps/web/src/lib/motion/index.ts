import { Variants, BezierDefinition } from 'framer-motion';

// -----------------------------------------------------------------------------
// TIMINGS & EASINGS
// "Heavy", "Premium", "Matter" feel. No bounce.
// -----------------------------------------------------------------------------

export const EASING: Record<string, BezierDefinition> = {
    premium: [0.33, 1, 0.68, 1], // Cubic bezier custom for smooth landing
    smooth: [0.25, 0.1, 0.25, 1],
    out: [0.215, 0.61, 0.355, 1],
};

export const DURATION = {
    fast: 0.3,
    base: 0.5,
    slow: 0.8,
    hero: 1.2,
};

// -----------------------------------------------------------------------------
// VARIANTS
// -----------------------------------------------------------------------------

// Page & Section Entries
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { duration: DURATION.slow, ease: "easeInOut" }
    }
};

export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.slow, ease: EASING.out }
    }
};

// Stagger Container
export const staggerContainer: Variants = {
    hidden: { opacity: 1 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2
        }
    }
};

// Hero Specific (Slower, more weight)
export const heroItem: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: DURATION.hero, ease: EASING.premium }
    }
};

// Micro-interactions
export const hoverScale: Variants = {
    initial: { scale: 1 },
    hover: {
        scale: 1.02,
        transition: { duration: DURATION.base, ease: "easeOut" }
    },
    tap: {
        scale: 0.98,
        transition: { duration: DURATION.fast, ease: "easeOut" }
    }
};

export const buttonMotion: Variants = {
    hover: {
        y: -1,
        transition: { duration: DURATION.fast, ease: "easeOut" }
    },
    tap: {
        y: 1,
        scale: 0.98,
        transition: { duration: DURATION.fast, ease: "easeOut" }
    }
};

export const linkUnderline: Variants = {
    initial: { width: "0%" },
    hover: {
        width: "100%",
        transition: { duration: DURATION.base, ease: EASING.smooth }
    }
};
