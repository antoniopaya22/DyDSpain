/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      // ─── Animation Durations ─────────────────────────────────
      transitionDuration: {
        250: "250ms",
        350: "350ms",
        450: "450ms",
      },
      colors: {
        // Colores principales de la app
        primary: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#c62828",
          600: "#b91c1c",
          700: "#991b1b",
          800: "#7f1d1d",
          900: "#611515",
          950: "#450a0a",
        },
        // Fondo oscuro temático D&D
        dark: {
          50: "#f0f0f5",
          100: "#d9d9e6",
          200: "#b3b3cc",
          300: "#8c8cb3",
          400: "#666699",
          500: "#2d2d44",
          600: "#252540",
          700: "#1e1e38",
          800: "#1a1a2e",
          900: "#141425",
          950: "#0d0d1a",
        },
        // Dorado / Pergamino
        gold: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#d4a017",
          600: "#b8860b",
          700: "#92400e",
          800: "#78350f",
          900: "#5c2d0e",
          950: "#3b1a08",
        },
        // Colores de características de D&D
        str: "#dc2626",    // Fuerza - Rojo
        dex: "#16a34a",    // Destreza - Verde
        con: "#ea580c",    // Constitución - Naranja
        int: "#2563eb",    // Inteligencia - Azul
        wis: "#9333ea",    // Sabiduría - Púrpura
        cha: "#db2777",    // Carisma - Rosa
        // Colores de estado de vida
        hp: {
          full: "#22c55e",
          high: "#84cc16",
          mid: "#eab308",
          low: "#f97316",
          critical: "#ef4444",
          temp: "#3b82f6",
        },
        // Colores de rareza de objetos
        rarity: {
          common: "#9ca3af",
          uncommon: "#22c55e",
          rare: "#3b82f6",
          "very-rare": "#a855f7",
          legendary: "#f59e0b",
          artifact: "#ef4444",
        },
        // Escuelas de magia
        magic: {
          abjuration: "#3b82f6",
          conjuration: "#f59e0b",
          divination: "#a3a3a3",
          enchantment: "#ec4899",
          evocation: "#ef4444",
          illusion: "#a855f7",
          necromancy: "#22c55e",
          transmutation: "#f97316",
        },
        // Superficie y bordes
        surface: {
          DEFAULT: "#1e1e38",
          light: "#252540",
          lighter: "#2d2d52",
          card: "#23233d",
          border: "#3a3a5c",
        },
        parchment: {
          DEFAULT: "#f5e6c8",
          dark: "#e6d5a8",
          light: "#faf0dc",
        },
      },
      fontFamily: {
        sans: ["System"],
      },
      borderRadius: {
        card: "14px",
        "card-lg": "18px",
        "card-sm": "10px",
      },
      spacing: {
        13: "3.25rem",
        15: "3.75rem",
        18: "4.5rem",
        22: "5.5rem",
        26: "6.5rem",
        30: "7.5rem",
        88: "22rem",
        100: "25rem",
        120: "30rem",
      },
      // ─── Opacity Tokens ────────────────────────────────────
      opacity: {
        3: "0.03",
        4: "0.04",
        6: "0.06",
        8: "0.08",
        12: "0.12",
        15: "0.15",
        85: "0.85",
      },
      // ─── Font Size Extensions ──────────────────────────────
      fontSize: {
        "2xs": ["10px", { lineHeight: "14px" }],
        "3xs": ["8px", { lineHeight: "12px" }],
      },
      // ─── Letter Spacing ────────────────────────────────────
      letterSpacing: {
        "extra-wide": "0.15em",
        "ultra-wide": "0.25em",
      },
      // ─── Z-index ───────────────────────────────────────────
      zIndex: {
        60: "60",
        70: "70",
        80: "80",
        90: "90",
        100: "100",
      },
      // ─── Min/Max Heights ───────────────────────────────────
      minHeight: {
        14: "3.5rem",
        16: "4rem",
        20: "5rem",
      },
    },
  },
  plugins: [],
};
