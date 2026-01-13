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

                // Semantic Tokens
                primary: {
                    DEFAULT: "var(--color-copper)",
                    foreground: "var(--color-black)",
                },
                secondary: {
                    DEFAULT: "var(--color-navy)",
                    foreground: "var(--color-platinum)",
                },
                accent: {
                    DEFAULT: "var(--color-coffee)",
                    foreground: "var(--color-platinum)",
                },
                muted: {
                    DEFAULT: "var(--color-navy-light)",
                    foreground: "var(--color-platinum-dark)",
                },
                card: {
                    DEFAULT: "var(--color-navy)",
                    foreground: "var(--color-platinum)",
                },
                border: "var(--color-coffee-light)",
                input: "var(--color-navy-light)",
                ring: "var(--color-copper)",
                destructive: "#991B1B",

                // Raw Palette (for reference or utility)
                brand: {
                    black: "#050505",
                    navy: "#0D1B2A",
                    navyLight: "#1B263B",
                    platinum: "#E0E1DD",
                    platinumDark: "#8D8D8A",
                    coffee: "#3E2723",
                    coffeeLight: "#5D4037",
                    copper: "#AD8A6E",
                }
            },
            fontFamily: {
                sans: ["var(--font-inter)"],
                serif: ["var(--font-cinzel)"],
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'subtle-grain': "url('/noise.png')", // Placeholder if we want texture later
            }
        },
    },
    plugins: [],
};

export default config;
