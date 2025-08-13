import { Polygon } from "react-kakao-maps-sdk";
import tailwindScrollbarHide from "tailwind-scrollbar-hide";

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "circle-shrink":
          "circleShrink 1s cubic-bezier(0.3, 0.2, 1, 0.55) forwards",
        "stone-bounce": "stoneBounce 0.8s ease-out 1s forwards",
        "char-wave": "charWave 0.15s ease-out var(--delay) forwards",
        "sentence-up": "sentenceUp 0.65s ease-out 2.5s forwards",
      },
      keyframes: {
        circleShrink: {
          "0%": { clipPath: "circle(80% at center)" },
          "100%": { clipPath: "circle(0% at center)" },
        },
        stoneBounce: {
          "0%": { transform: "scale(0) rotate(0deg)", opacity: "0" },
          "50%": { transform: "scale(1.2) rotate(180deg)", opacity: "1" },
          "100%": { transform: "scale(1) rotate(360deg)", opacity: "1" },
        },
        charWave: {
          "0%": { transform: "translateY(20px)", opacity: "1" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
        sentenceUp: {
          "0%": { transform: "translateY(30px)", opacity: "1" },
          "100%": { transform: "translateY(0px)", opacity: "1" },
        },
      },
      screens: {
        xs: "475px",
      },
      colors: {
        primary: {
          50: "#eff6ff",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
        },
      },
    },
  },
  plugins: [tailwindScrollbarHide],
};
