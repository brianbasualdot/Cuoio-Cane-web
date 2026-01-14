import { Variants } from "framer-motion";

export const inputVariants: Variants = {
    idle: {
        borderColor: "var(--input-border, rgba(255, 255, 255, 0.1))",
        opacity: 0.7,
    },
    focused: {
        borderColor: "var(--primary, #A88B60)",
        opacity: 1,
        transition: { duration: 0.5, ease: "easeOut" },
    },
    error: {
        x: [0, -5, 5, -5, 5, 0],
        borderColor: "#EF4444",
        transition: { duration: 0.4 },
    },
};

export const errorTextVariants: Variants = {
    hidden: { opacity: 0, y: -5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { delay: 0.2, duration: 0.4 },
    },
};

export const shippingOptionVariants: Variants = {
    unchecked: {
        border: "1px solid transparent",
        backgroundColor: "rgba(255,255,255,0.03)",
    },
    checked: {
        border: "1px solid var(--primary, #A88B60)",
        backgroundColor: "rgba(168, 139, 96, 0.05)",
        transition: { duration: 0.3 },
    },
};

export const shippingHeightVariants: Variants = {
    collapsed: { height: "auto" },
    expanded: { height: "auto", transition: { duration: 0.3 } },
};

export const paymentMethodVariants: Variants = {
    idle: { scale: 1, opacity: 0.6, y: 0 },
    selected: {
        scale: 1.02,
        opacity: 1,
        y: -2,
        boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)",
        transition: { duration: 0.4, ease: "backOut" },
    },
    unselected: {
        scale: 0.98,
        opacity: 0.4,
        y: 0,
        transition: { duration: 0.4 },
    },
};

export const logoFadeVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
};

export const checkoutButtonVariants: Variants = {
    disabled: {
        opacity: 0.5,
        cursor: "not-allowed",
    },
    enabled: {
        opacity: 1,
        cursor: "pointer",
    },
    hover: {
        scale: 1.02,
        boxShadow: "0 0 15px rgba(168, 139, 96, 0.3)", // subtle glow
        transition: { duration: 0.3 },
    },
    tap: { scale: 0.98 },
};

export const priceCountUpVariants: Variants = {
    initial: { opacity: 0, y: 5 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
