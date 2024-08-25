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
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {
          
"primary": "#155e75",
          
"secondary": "#0891b2",
          
"accent": "#0e7490",
          
"neutral": "#0891b2",
          
"base-100": "#164e63",
          
"info": "#06b6d4",
          
"success": "#15803d",
          
"warning": "#f97316",
          
"error": "#dc2626",
          },
        },
      ],
    },
};
export default config;
