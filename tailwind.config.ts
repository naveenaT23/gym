import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#D4AF37", // Gold
        secondary: "#E63946", // Red
        charcoal: {
          DEFAULT: "#121212",
          light: "#1A1A1A",
          dark: "#0A0A0A",
        },
      },
      fontFamily: {
        bebas: ["var(--font-bebas)"],
        nunito: ["var(--font-nunito)"],
      },
    },
  },
  plugins: [],
};
export default config;
