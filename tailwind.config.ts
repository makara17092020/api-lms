import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#14B8A6",
          dark: "#0F766E",
        },
        success: "#2DCE89",
        info: "#11CDEF",
        warning: "#FB6340",
        danger: "#F5365C",
        accent: "#7C3AED",
        slate: {
          900: "#0F172A",
          800: "#1E293B",
          700: "#334155",
          100: "#F1F5F9",
        },
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #14B8A6, #7C3AED)",
      },
    },
  },
  plugins: [],
};

export default config;
