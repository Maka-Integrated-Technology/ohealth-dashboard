import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/components/**/*.{ts,tsx}",
    "./app/routes/**/*.{ts,tsx}",
    "./app/features/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["DM Sans", "sans-serif"],
      },
      maxWidth: {
        content: "1400px",
      },
      screens: {
        xs: "545px",
        tablet: "900px",
        xl: "1200px",
        "2xl": "1300px",
        "3xl": "1440px",
        "4xl": "1600px",
      },
    },
  },
  plugins: [],
};

export default config;
