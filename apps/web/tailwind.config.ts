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
                    foreground: "#000000",
                },
                secondary: {
                    DEFAULT: "var(--color-navy)", /* Now used for accents/hover, not main bg */
                    foreground: "var(--color-platinum)",
                },
                surface: {
                    DEFAULT: "var(--color-surface)",
                    foreground: "var(--color-platinum)",
                },
                muted: {
                    DEFAULT: "#1A1A1A",
                    foreground: "var(--color-platinum-dark)",
                },
                card: {
                    DEFAULT: "var(--color-surface)",
                    foreground: "var(--color-platinum)",
                },
                border: "#262626",
                input: "#171717",
                ring: "var(--color-copper)",
                destructive: "#7F1D1D",

                // Raw Palette (for reference or utility)
                brand: {
                    black: "#0A0A0A",
                    surface: "#111111",
                    navy: "#0B1C2D",
                    platinum: "#E6E6E6",
                    copper: "#C6A87C",
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
