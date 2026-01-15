import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
                display: ['var(--font-cormorant)', 'serif'],
                mono: ['monospace'], // Keep defaults or specific if needed
            },
        },
    },
    plugins: [],
};
export default config;
