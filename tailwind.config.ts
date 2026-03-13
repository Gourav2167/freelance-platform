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
        obsidian: {
          900: '#030305',
          800: '#0a0a0f',
          700: '#12121a',
        },
        accent: {
          glow: 'rgba(255, 255, 255, 0.2)',
        }
      },
    },
  },
  plugins: [],
};
export default config;
