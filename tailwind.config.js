/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
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
          50: "#FDFBFA",
          100: "#F1DCDA",
          200: "#DBA7A3",
          300: "#C97A76",
          400: "#B74E48",
          500: "#8f3d38",
          600: "#7C3530",
          700: "#652B27",
          800: "#4E211E",
          900: "#3C1917",
          950: "#2E1412",
        },
        // Fondo oscuro temático D&D
        dark: {
          50: "#F7F7F3",
          100: "#E6E4D8",
          200: "#C5C1A6",
          300: "#AAA37B",
          400: "#807953",
          500: "#4A4630",
          600: "#3A3726",
          700: "#323021",
          800: "#272519",
          900: "#1F1D14",
          950: "#17160F",
        },
        // Dorado / Pergamino
        gold: {
          50: "#FCFCFB",
          100: "#EBE9E0",
          200: "#D4D1BD",
          300: "#BBB696",
          400: "#B2AC88",
          500: "#978F62",
          600: "#7C7650",
          700: "#615C3F",
          800: "#4A4630",
          900: "#323021",
          950: "#1F1D14",
        },
        // Colores de características de D&D
        str: "#dc2626", // Fuerza - Rojo
        dex: "#16a34a", // Destreza - Verde
        con: "#ea580c", // Constitución - Naranja
        int: "#2563eb", // Inteligencia - Azul
        wis: "#9333ea", // Sabiduría - Púrpura
        cha: "#db2777", // Carisma - Rosa
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
          DEFAULT: "#2E2C1E",
          light: "#3A3726",
          lighter: "#423E2B",
          card: "#323021",
          border: "#514D35",
        },
        parchment: {
          DEFAULT: "#F0EFE8",
          dark: "#E6E4D8",
          light: "#F7F7F3",
          card: "#FAFAF7",
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
