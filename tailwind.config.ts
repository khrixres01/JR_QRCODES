import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        paper: { DEFAULT: "#ECE3D1", 2: "#E3D7C0", 3: "#D6C6A9" },
        ink: { DEFAULT: "#38281E", soft: "#7B6753", faint: "#A6927B" },
        clay: { DEFAULT: "#C0673E", deep: "#9E4E29" },
        sage: { DEFAULT: "#7E8A5E", deep: "#5C6640" },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        body: ["var(--font-body)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};
export default config;
