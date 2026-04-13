import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#0A0A0A",
        secondary: "#FAFAFA",
        accent: {
          DEFAULT: "#6366F1",
          hover: "#4F46E5",
        },
        success: "#10B981",
        danger: "#EF4444",
        warning: "#F59E0B",
        muted: "#71717A",
        card: {
          light: "#FFFFFF",
          dark: "#18181B",
        },
        surface: {
          light: "#F4F4F5",
          dark: "#27272A",
        },
        border: {
          light: "#E4E4E7",
          dark: "#3F3F46",
        },
      },
      fontFamily: {
        heading: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        btn: "8px",
        container: "20px",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};
export default config;
