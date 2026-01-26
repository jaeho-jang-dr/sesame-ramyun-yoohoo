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
        sesame: {
          gold: '#F59E0B',
          cream: '#FFF7ED',
        },
        yoohoo: {
          pink: '#EC4899',
        },
      },
    },
  },
  plugins: [],
};
export default config;
