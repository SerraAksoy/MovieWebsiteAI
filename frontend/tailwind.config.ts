import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        bender: ["Bender", "sans-serif"],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        light: {
          primary: "#FF758F",
          secondary: "#d33a67",
          accent: "#73072e",
          neutral: "#1f2937",
          "base-100": "#ffffff",
          "base-content": "#000000",
        },
      },
      {
        dark: {
          primary: "#7650c6",
          secondary: "#b895f6",
          accent: "#fbbf24",
          neutral: "#ffffff",
          "base-100": "rgb(45,49,55)",
          "base-content": "#f3f4f6",
        },
      },
    ],
  },
} satisfies Config;