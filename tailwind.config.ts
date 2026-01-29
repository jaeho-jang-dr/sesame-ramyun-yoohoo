import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  presets: [
    // eslint-disable-next-line
    require('../design-system/tailwind.preset.js')
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
