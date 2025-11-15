import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      // utilize design tokens taken from the solace health website
      colors: {
        neutralWhite: "#fff",
        neutralBlack: "#101010",
        primaryDefault: "#1d4339",
        accentGoldLight: "#e9cc95",
        neutralDarkGrey: "#5a5a5a",
        neutralGrey: "#9a9a9a",
        primaryFocused: "#285e50",
        neutralLightGrey: "#e9e9e9",
        opal: "#d4e2dd",
        green100: "#f4f8f7",
        primarySelected: "#347866",
        accentMidOpal: "#d4e2dd4d",
        accentMid: "#3f937c",
        rlBlack: "black",
        rlWhite: "white",
        bodyFontDark: "#6d6d6d",
        gold: "#d7a13b",
        headingDark: "#150438",
        linearColorThree: "#e0ecff",
        buttonBackgroundDark: "#131218",
        themeColor: "#116df8",
        gray600: "#475467",
      },
    },
  },
  plugins: [],
};
export default config;
