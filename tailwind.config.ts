import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#020617",
        foreground: "#F8FAFC",
        muted: "#94A3B8",
        "neon-blue": "#3B82F6",
        "deep-blue": "#1E3A8A",
        accent: "#22C55E",
      },
      borderRadius: {
        xl: "0.75rem",
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(59,130,246,.25), 0 0 30px rgba(59,130,246,.25)",
        "glow-strong":
          "0 0 0 1px rgba(59,130,246,.35), 0 0 45px rgba(59,130,246,.35)",
      },
      keyframes: {
        "gradient-x": {
          "0%, 100%": { "background-position": "0% 50%" },
          "50%": { "background-position": "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "gradient-x": "gradient-x 12s ease infinite",
        float: "float 8s ease-in-out infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
} satisfies Config;

