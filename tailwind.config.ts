import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // ===========================================
        // LIGHTCURVE BRAND COLORS
        // ===========================================

        // Navy - Primary Brand Color
        // HEX: #0E0A49 | RGB: 14/10/73 | PMS: 275 C
        navy: {
          50: "#E8E7EF",
          100: "#C5C3D8",
          200: "#9E9BBE",
          300: "#7773A4",
          400: "#595491",
          500: "#3B357D",
          600: "#352F71",
          700: "#2D2762",
          800: "#251F53",
          900: "#0E0A49", // Primary Navy
          950: "#080630",
        },

        // Wave - Primary Accent (Teal)
        // HEX: #00A2AD | RGB: 0/162/173 | PMS: 7466 C
        wave: {
          50: "#E6F7F8",
          100: "#B3E8EB",
          200: "#80D9DE",
          300: "#4DCAD1",
          400: "#26BEC7",
          500: "#00A2AD", // Primary Wave
          600: "#00929C",
          700: "#007F88",
          800: "#006C74",
          900: "#004D52",
        },

        // Violetta - Secondary Accent (Magenta)
        // HEX: #BD137A | RGB: 189/19/122 | PMS: 233 C
        violetta: {
          50: "#FBE8F2",
          100: "#F4C6DE",
          200: "#EDA0C8",
          300: "#E57AB2",
          400: "#DF5DA1",
          500: "#BD137A", // Primary Violetta
          600: "#AA116E",
          700: "#930F5F",
          800: "#7C0D50",
          900: "#550938",
        },

        // Charcoal - Secondary Text
        // HEX: #1D1D1D | RGB: 29/29/29
        charcoal: "#1D1D1D",

        // ===========================================
        // SEMANTIC COLORS (using brand colors)
        // ===========================================

        // Success - Using Wave for positive states
        success: {
          50: "#E6F7F8",
          100: "#B3E8EB",
          500: "#00A2AD", // Wave
          600: "#00929C",
          700: "#007F88",
        },

        // Warning - Amber tones
        warning: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#F59E0B",
          600: "#D97706",
          700: "#B45309",
        },

        // Error - Using Violetta-inspired tones
        error: {
          50: "#FBE8F2",
          100: "#F4C6DE",
          500: "#BD137A", // Violetta
          600: "#AA116E",
          700: "#930F5F",
        },

        // ===========================================
        // STAGE COLORS (Tracker specific)
        // ===========================================
        stage: {
          pending: "#9E9BBE",    // Navy 200
          inProgress: "#00A2AD", // Wave
          completed: "#00A2AD",  // Wave
          blocked: "#BD137A",    // Violetta
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },

      boxShadow: {
        "glow-wave": "0 0 20px rgba(0, 162, 173, 0.3)",
        "glow-violetta": "0 0 20px rgba(189, 19, 122, 0.3)",
      },

      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(0, 162, 173, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(0, 162, 173, 0)",
          },
        },
        "pulse-glow-violetta": {
          "0%, 100%": {
            boxShadow: "0 0 0 0 rgba(189, 19, 122, 0.4)",
          },
          "50%": {
            boxShadow: "0 0 0 10px rgba(189, 19, 122, 0)",
          },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },

      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "pulse-glow-violetta": "pulse-glow-violetta 2s ease-in-out infinite",
        "slide-in": "slide-in 0.3s ease-out",
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
