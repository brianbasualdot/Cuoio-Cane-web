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
                background: "var(--bg-app)",
                surface: {
                    DEFAULT: "var(--bg-surface)",
                    hover: "var(--bg-surface-hover)",
                },
                border: {
                    DEFAULT: "var(--border-base)",
                    subtle: "var(--border-subtle)",
                },
                coffee: {
                    DEFAULT: "var(--accent-coffee)",
                    light: "var(--accent-coffee-hover)",
                },
                copper: "var(--accent-copper)",
            },
            borderRadius: {
                token: {
                    sm: "var(--radius-sm)",
                    md: "var(--radius-md)",
                    lg: "var(--radius-lg)",
                }
            },
            boxShadow: {
                'elevation-1': "var(--shadow-1)",
                'elevation-2': "var(--shadow-2)",
            },
            fontFamily: {
                sans: ['var(--font-inter)', 'sans-serif'],
                serif: ['var(--font-playfair)', 'serif'],
                display: ['var(--font-cormorant)', 'serif'],
            },
        },
    },
    plugins: [],
};
export default config;
