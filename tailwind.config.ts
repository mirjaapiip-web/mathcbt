import type { Config } from "tailwindcss";
import forms from "@tailwindcss/forms";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        battle: {
          ink: "#102033",
          blue: "#2563EB",
          cyan: "#08B6D8",
          mint: "#16A34A",
          amber: "#F59E0B",
          rose: "#E11D48",
          paper: "#F6F9FF",
          grid: "#DCEBFF",
        },
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "ui-sans-serif", "system-ui"],
      },
      boxShadow: {
        exam: "0 18px 60px rgba(37, 99, 235, 0.12)",
        panel: "0 16px 44px rgba(16, 32, 51, 0.10)",
        glow: "0 0 0 1px rgba(37, 99, 235, 0.08), 0 24px 80px rgba(8, 182, 216, 0.20)",
      },
      backgroundImage: {
        "exam-grid":
          "linear-gradient(rgba(37,99,235,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(37,99,235,0.08) 1px, transparent 1px)",
        "soft-radial":
          "radial-gradient(circle at 15% 15%, rgba(37, 99, 235, 0.16), transparent 34%), radial-gradient(circle at 85% 5%, rgba(8, 182, 216, 0.18), transparent 30%), radial-gradient(circle at 70% 88%, rgba(22, 163, 74, 0.12), transparent 28%)",
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [forms],
};

export default config;
