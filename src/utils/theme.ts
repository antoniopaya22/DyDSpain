/**
 * Theme System — Color palettes for light and dark modes
 *
 * Provides a complete set of semantic color tokens for the entire app.
 * Each token has a light and dark variant. The `useTheme()` hook resolves
 * which palette to use based on the user's settings (claro / oscuro / auto).
 */

// ─── Color Palette Type ──────────────────────────────────────────────

export interface ThemeColors {
  // ── Backgrounds ──
  /** Main app background */
  bgPrimary: string;
  /** Secondary / slightly elevated background */
  bgSecondary: string;
  /** Card / surface background */
  bgCard: string;
  /** Elevated surface (modals, popovers) */
  bgElevated: string;
  /** Subtle tint used for pressed/hover states */
  bgSubtle: string;
  /** Input field background */
  bgInput: string;

  // ── Gradient backgrounds ──
  /** Main background gradient (top → bottom) */
  gradientMain: [string, string, string, string];
  /** Header gradient overlay */
  gradientHeader: [string, string];
  /** Header gradient locations */
  gradientLocations: [number, number, number, number];

  // ── Text ──
  /** Primary text (headings, body) */
  textPrimary: string;
  /** Secondary text (subtitles, descriptions) */
  textSecondary: string;
  /** Muted / hint text */
  textMuted: string;
  /** Inverted text (for colored backgrounds) */
  textInverted: string;

  // ── Borders ──
  /** Default border color */
  borderDefault: string;
  /** Subtle / lighter border */
  borderSubtle: string;
  /** Separator lines */
  borderSeparator: string;

  // ── Accents (stay consistent across themes) ──
  /** Gold / brand accent */
  accentGold: string;
  /** Gold glow (shadow, text-shadow) */
  accentGoldGlow: string;
  /** Red / primary action accent */
  accentRed: string;
  /** Green accent */
  accentGreen: string;
  /** Blue accent */
  accentBlue: string;
  /** Purple accent (hit dice, concentration, caster badges) */
  accentPurple: string;
  /** Pink accent (subclass, d20) */
  accentPink: string;
  /** Amber / warning accent (conditions, initiative, warnings) */
  accentAmber: string;
  /** Orange accent (HP critical-low, fire) */
  accentOrange: string;
  /** Lime accent (HP wounded state) */
  accentLime: string;
  /** Light-blue accent (rest, secondary-blue) */
  accentLightBlue: string;
  /** Danger / error red (death saves, critical errors) */
  accentDanger: string;
  /** Deep purple accent (pact casters) */
  accentDeepPurple: string;
  /** Indigo accent (d100, secondary-purple) */
  accentIndigo: string;
  /** Yellow accent (clues, secondary-gold) */
  accentYellow: string;

  // ── Interactive elements ──
  /** Button / option unselected background */
  optionBg: string;
  /** Button / option unselected border */
  optionBorder: string;
  /** Selected theme option background */
  optionSelectedBg: string;
  /** Selected theme option border */
  optionSelectedBorder: string;

  // ── Switch / toggle ──
  /** Switch track color when OFF */
  switchTrackOff: string;
  /** Switch track color when ON */
  switchTrackOn: string;
  /** Switch thumb color when OFF */
  switchThumbOff: string;
  /** Switch thumb color when ON */
  switchThumbOn: string;

  // ── Section header icon backgrounds (keep alpha-based) ──
  /** Multiplier applied to icon bg — just use iconColor + this suffix */
  iconBgAlpha: string;

  // ── Shadows ──
  /** Shadow color */
  shadowColor: string;
  /** Shadow opacity */
  shadowOpacity: number;

  // ── Status bar ──
  /** StatusBar style for expo-status-bar */
  statusBarStyle: "light" | "dark";

  // ── Specific UI elements ──
  /** Back button / header button background */
  headerButtonBg: string;
  /** Back button / header button border */
  headerButtonBorder: string;
  /** Header label color (brand name) */
  headerLabelColor: string;
  /** Header title color */
  headerTitleColor: string;
  /** Section title color */
  sectionTitleColor: string;
  /** Section description color */
  sectionDescColor: string;
  /** Chevron / secondary icon color */
  chevronColor: string;

  // ── Danger zone ──
  dangerBg: string;
  dangerBorder: string;
  dangerText: string;
  dangerTextMuted: string;

  // ── Tech badge / chip ──
  chipBg: string;
  chipBorder: string;
  chipText: string;

  // ── Search bar ──
  searchBg: string;
  searchBorder: string;
  searchBorderFocused: string;
  searchText: string;
  searchPlaceholder: string;

  // ── Stats row ──
  statsBg: string;
  statsBorder: string;
  statsValue: string;
  statsLabel: string;
  statsDivider: string;

  // ── Campaign card ──
  cardBg: string;
  cardBorder: string;
  cardTitle: string;
  cardDescription: string;
  cardChevronBg: string;

  // ── Empty state ──
  emptyIconRingBorder: string;
  emptyIconBg: string;
  emptyIconBorder: string;
  emptyTitle: string;
  emptySubtitle: string;
  emptyDividerLine: string;
  emptyDividerDiamond: string;
  emptyHintText: string;

  // ── Compendium ──
  tabBg: string;
  tabBorder: string;
  tabActiveBg: string;
  tabActiveBorder: string;
  tabText: string;
  tabActiveText: string;
  detailBg: string;
  detailBorder: string;

  // ── Overlays ──
  /** Semi-transparent backdrop for modals, pickers, etc. */
  backdrop: string;
}

// ─── Dark Palette ────────────────────────────────────────────────────

export const DARK_THEME: ThemeColors = {
  // Backgrounds
  bgPrimary: "#272519",
  bgSecondary: "#1F1D14",
  bgCard: "#323021",
  bgElevated: "#423E2B",
  bgSubtle: "rgba(255,255,255,0.03)",
  bgInput: "rgba(255,255,255,0.05)",

  // Gradients
  gradientMain: ["#17160F", "#1F1D14", "#272519", "#272519"],
  gradientHeader: ["#17160F", "#1F1D1400"],
  gradientLocations: [0, 0.12, 0.3, 1],

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#AAA37B",
  textMuted: "#807953",
  textInverted: "#17160F",

  // Borders
  borderDefault: "#514D35",
  borderSubtle: "rgba(255,255,255,0.06)",
  borderSeparator: "rgba(81,77,53,0.6)",

  // Accents
  accentGold: "#CDC9B2",
  accentGoldGlow: "rgba(178,172,136,0.2)",
  accentRed: "#8f3d38",
  accentGreen: "#22c55e",
  accentBlue: "#3b82f6",
  accentPurple: "#a855f7",
  accentAmber: "#f59e0b",
  accentOrange: "#f97316",
  accentLime: "#84cc16",
  accentLightBlue: "#60a5fa",
  accentDanger: "#ef4444",
  accentDeepPurple: "#7c3aed",
  accentIndigo: "#6366f1",
  accentPink: "#ec4899",
  accentYellow: "#eab308",

  // Interactive
  optionBg: "rgba(255,255,255,0.03)",
  optionBorder: "rgba(255,255,255,0.06)",
  optionSelectedBg: "rgba(178,172,136,0.08)",
  optionSelectedBorder: "rgba(178,172,136,0.4)",

  // Switch
  switchTrackOff: "#514D35",
  switchTrackOn: "#8f3d3860",
  switchThumbOff: "#AAA37B",
  switchThumbOn: "#8f3d38",

  // Icon bg alpha suffix
  iconBgAlpha: "20",

  // Shadows
  shadowColor: "#000000",
  shadowOpacity: 0.12,

  // Status bar
  statusBarStyle: "light",

  // Header
  headerButtonBg: "rgba(255,255,255,0.07)",
  headerButtonBorder: "rgba(255,255,255,0.09)",
  headerLabelColor: "#CDC9B2",
  headerTitleColor: "#ffffff",
  sectionTitleColor: "#ffffff",
  sectionDescColor: "#AAA37B",
  chevronColor: "#807953",

  // Danger
  dangerBg: "rgba(239,68,68,0.06)",
  dangerBorder: "rgba(239,68,68,0.18)",
  dangerText: "#ef4444",
  dangerTextMuted: "#ef444480",

  // Chips
  chipBg: "rgba(255,255,255,0.04)",
  chipBorder: "rgba(255,255,255,0.06)",
  chipText: "#AAA37B",

  // Search
  searchBg: "rgba(255,255,255,0.05)",
  searchBorder: "rgba(255,255,255,0.08)",
  searchBorderFocused: "rgba(178,172,136,0.35)",
  searchText: "#ffffff",
  searchPlaceholder: "#807953",

  // Stats
  statsBg: "rgba(255,255,255,0.04)",
  statsBorder: "rgba(255,255,255,0.06)",
  statsValue: "#ffffff",
  statsLabel: "#6C6746",
  statsDivider: "rgba(255,255,255,0.06)",

  // Campaign card
  cardBg: "#323021",
  cardBorder: "#514D35",
  cardTitle: "#ffffff",
  cardDescription: "#AAA37B",
  cardChevronBg: "rgba(255,255,255,0.06)",

  // Empty
  emptyIconRingBorder: "rgba(143,61,56,0.15)",
  emptyIconBg: "rgba(143,61,56,0.08)",
  emptyIconBorder: "rgba(143,61,56,0.12)",
  emptyTitle: "#ffffff",
  emptySubtitle: "#AAA37B",
  emptyDividerLine: "rgba(255,255,255,0.06)",
  emptyDividerDiamond: "rgba(143,61,56,0.25)",
  emptyHintText: "#6C6746",

  // Compendium
  tabBg: "rgba(255,255,255,0.04)",
  tabBorder: "rgba(255,255,255,0.06)",
  tabActiveBg: "rgba(143,61,56,0.12)",
  tabActiveBorder: "rgba(143,61,56,0.3)",
  tabText: "#AAA37B",
  tabActiveText: "#ffffff",
  detailBg: "rgba(255,255,255,0.03)",
  detailBorder: "rgba(255,255,255,0.05)",

  // Overlays
  backdrop: "rgba(0,0,0,0.5)",
};

// ─── Light Palette ───────────────────────────────────────────────────

export const LIGHT_THEME: ThemeColors = {
  // Backgrounds
  bgPrimary: "#F0EFE8",
  bgSecondary: "#E8E7DC",
  bgCard: "#FAFAF7",
  bgElevated: "#FCFCFB",
  bgSubtle: "rgba(151,143,98,0.06)",
  bgInput: "rgba(151,143,98,0.08)",

  // Gradients
  gradientMain: ["#E6E4D8", "#EDECE4", "#F0EFE8", "#F0EFE8"],
  gradientHeader: ["#E6E4D8", "#EDECE400"],
  gradientLocations: [0, 0.12, 0.3, 1],

  // Text
  textPrimary: "#272519",
  textSecondary: "#555137",
  textMuted: "#978F62",
  textInverted: "#ffffff",

  // Borders
  borderDefault: "#D4D1BD",
  borderSubtle: "rgba(0,0,0,0.08)",
  borderSeparator: "rgba(0,0,0,0.08)",

  // Accents (keep vibrant)
  accentGold: "#978F62",
  accentGoldGlow: "rgba(151,143,98,0.15)",
  accentRed: "#8f3d38",
  accentGreen: "#16a34a",
  accentBlue: "#2563eb",
  accentPurple: "#9333ea",
  accentAmber: "#d97706",
  accentOrange: "#ea580c",
  accentLime: "#65a30d",
  accentLightBlue: "#3b82f6",
  accentDanger: "#dc2626",
  accentDeepPurple: "#6d28d9",
  accentIndigo: "#4f46e5",
  accentPink: "#db2777",
  accentYellow: "#ca8a04",

  // Interactive
  optionBg: "rgba(0,0,0,0.03)",
  optionBorder: "rgba(0,0,0,0.08)",
  optionSelectedBg: "rgba(151,143,98,0.10)",
  optionSelectedBorder: "rgba(151,143,98,0.45)",

  // Switch
  switchTrackOff: "#C5C1A6",
  switchTrackOn: "rgba(143,61,56,0.35)",
  switchThumbOff: "#ffffff",
  switchThumbOn: "#8f3d38",

  // Icon bg alpha suffix
  iconBgAlpha: "18",

  // Shadows
  shadowColor: "#000000",
  shadowOpacity: 0.08,

  // Status bar
  statusBarStyle: "dark",

  // Header
  headerButtonBg: "rgba(0,0,0,0.05)",
  headerButtonBorder: "rgba(0,0,0,0.08)",
  headerLabelColor: "#807953",
  headerTitleColor: "#272519",
  sectionTitleColor: "#272519",
  sectionDescColor: "#7C7650",
  chevronColor: "#978F62",

  // Danger
  dangerBg: "rgba(239,68,68,0.06)",
  dangerBorder: "rgba(239,68,68,0.20)",
  dangerText: "#dc2626",
  dangerTextMuted: "rgba(220,38,38,0.55)",

  // Chips
  chipBg: "rgba(0,0,0,0.04)",
  chipBorder: "rgba(0,0,0,0.08)",
  chipText: "#7C7650",

  // Search
  searchBg: "rgba(0,0,0,0.04)",
  searchBorder: "rgba(0,0,0,0.10)",
  searchBorderFocused: "rgba(151,143,98,0.40)",
  searchText: "#272519",
  searchPlaceholder: "#978F62",

  // Stats
  statsBg: "rgba(0,0,0,0.03)",
  statsBorder: "rgba(0,0,0,0.08)",
  statsValue: "#272519",
  statsLabel: "#7C7650",
  statsDivider: "rgba(0,0,0,0.08)",

  // Campaign card
  cardBg: "#FAFAF7",
  cardBorder: "#D4D1BD",
  cardTitle: "#272519",
  cardDescription: "#7C7650",
  cardChevronBg: "rgba(0,0,0,0.05)",

  // Empty
  emptyIconRingBorder: "rgba(143,61,56,0.18)",
  emptyIconBg: "rgba(143,61,56,0.08)",
  emptyIconBorder: "rgba(143,61,56,0.15)",
  emptyTitle: "#272519",
  emptySubtitle: "#7C7650",
  emptyDividerLine: "rgba(0,0,0,0.08)",
  emptyDividerDiamond: "rgba(143,61,56,0.25)",
  emptyHintText: "#978F62",

  // Compendium
  tabBg: "rgba(0,0,0,0.04)",
  tabBorder: "rgba(0,0,0,0.08)",
  tabActiveBg: "rgba(143,61,56,0.10)",
  tabActiveBorder: "rgba(143,61,56,0.30)",
  tabText: "#7C7650",
  tabActiveText: "#272519",
  detailBg: "rgba(0,0,0,0.02)",
  detailBorder: "rgba(0,0,0,0.06)",

  // Overlays
  backdrop: "rgba(0,0,0,0.35)",
};

// ─── Helper ──────────────────────────────────────────────────────────

/**
 * Parses a hex color (#RGB, #RRGGBB, or #RRGGBBAA) or an rgb()/rgba()
 * string and returns a new `rgba(r,g,b,opacity)` string.
 *
 * Usage:
 *   withAlpha('#8f3d38', 0.15)   → 'rgba(143,61,56,0.15)'
 *   withAlpha('#fff', 0.5)       → 'rgba(255,255,255,0.5)'
 *   withAlpha(colors.accentRed, 0.12)
 */
export function withAlpha(color: string, opacity: number): string {
  // Already rgba — replace the alpha component
  const rgbaMatch = color.match(
    /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/,
  );
  if (rgbaMatch) {
    return `rgba(${rgbaMatch[1]},${rgbaMatch[2]},${rgbaMatch[3]},${opacity})`;
  }

  // Hex → rgb components
  let hex = color.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  // Strip alpha hex if present (#RRGGBBAA)
  hex = hex.substring(0, 6);

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r},${g},${b},${opacity})`;
}

/**
 * Returns the correct theme palette for a given resolved mode.
 * The `resolvedMode` should already account for "auto" → system preference.
 */
export function getThemeColors(resolvedMode: "claro" | "oscuro"): ThemeColors {
  return resolvedMode === "claro" ? LIGHT_THEME : DARK_THEME;
}
