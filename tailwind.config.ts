import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        heading: ['"Outfit"', "system-ui", "sans-serif"],
        sans: ['"Plus Jakarta Sans"', "system-ui", "sans-serif"],
      },
      colors: {
        background: "#FFFDF5",
        foreground: "#1E293B",
        muted: "#F1F5F9",
        "muted-fg": "#64748B",
        accent: "#8B5CF6",
        "accent-fg": "#FFFFFF",
        secondary: "#F472B6",
        tertiary: "#FBBF24",
        quaternary: "#34D399",
        border: "#E2E8F0",
        card: "#FFFFFF",
        ring: "#8B5CF6",
      },
      borderRadius: {
        sm: "8px",
        md: "16px",
        lg: "24px",
        blob: "24px 24px 24px 0px",
      },
      borderWidth: {
        DEFAULT: "2px",
      },
      boxShadow: {
        pop: "4px 4px 0px 0px #1E293B",
        "pop-hover": "6px 6px 0px 0px #1E293B",
        "pop-active": "2px 2px 0px 0px #1E293B",
        "sticker-violet": "6px 6px 0px 0px #8B5CF6",
        "sticker-pink": "6px 6px 0px 0px #F472B6",
        "sticker-yellow": "6px 6px 0px 0px #FBBF24",
        "sticker-mint": "6px 6px 0px 0px #34D399",
      },
      transitionTimingFunction: {
        bouncy: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      animation: {
        "pop-in": "popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        wiggle: "wiggle 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-up": "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "slide-in-right": "slideInRight 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "fade-in": "fadeIn 0.4s ease-out",
        "bounce-subtle": "bounceSubtle 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      keyframes: {
        popIn: {
          "0%": { opacity: "0", transform: "scale(0.8)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(3deg)" },
          "75%": { transform: "rotate(-3deg)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(16px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        bounceSubtle: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
