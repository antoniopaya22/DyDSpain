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
}

// ─── Dark Palette ────────────────────────────────────────────────────

export const DARK_THEME: ThemeColors = {
  // Backgrounds
  bgPrimary: "#1a1a2e",
  bgSecondary: "#141425",
  bgCard: "#23233d",
  bgElevated: "#2d2d52",
  bgSubtle: "rgba(255,255,255,0.03)",
  bgInput: "rgba(255,255,255,0.05)",

  // Gradients
  gradientMain: ["#0d0d1a", "#141425", "#1a1a2e", "#1a1a2e"],
  gradientHeader: ["#0d0d1a", "#13132200"],
  gradientLocations: [0, 0.12, 0.3, 1],

  // Text
  textPrimary: "#ffffff",
  textSecondary: "#b3b3cc",
  textMuted: "#666699",
  textInverted: "#0d0d1a",

  // Borders
  borderDefault: "#3a3a5c",
  borderSubtle: "rgba(255,255,255,0.06)",
  borderSeparator: "rgba(58,58,92,0.6)",

  // Accents
  accentGold: "#fbbf24",
  accentGoldGlow: "rgba(251,191,36,0.2)",
  accentRed: "#c62828",
  accentGreen: "#22c55e",
  accentBlue: "#3b82f6",
  accentPurple: "#a855f7",
  accentAmber: "#f59e0b",
  accentOrange: "#f97316",
  accentLime: "#84cc16",
  accentLightBlue: "#60a5fa",
  accentDanger: "#ef4444",
  accentDeepPurple: "#7c3aed",
  accentYellow: "#eab308",

  // Interactive
  optionBg: "rgba(255,255,255,0.03)",
  optionBorder: "rgba(255,255,255,0.06)",
  optionSelectedBg: "rgba(251,191,36,0.08)",
  optionSelectedBorder: "rgba(251,191,36,0.4)",

  // Switch
  switchTrackOff: "#3a3a5c",
  switchTrackOn: "#c6282860",
  switchThumbOff: "#8c8cb3",
  switchThumbOn: "#c62828",

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
  headerLabelColor: "#fbbf24",
  headerTitleColor: "#ffffff",
  sectionTitleColor: "#ffffff",
  sectionDescColor: "#8c8cb3",
  chevronColor: "#666699",

  // Danger
  dangerBg: "rgba(239,68,68,0.06)",
  dangerBorder: "rgba(239,68,68,0.18)",
  dangerText: "#ef4444",
  dangerTextMuted: "#ef444480",

  // Chips
  chipBg: "rgba(255,255,255,0.04)",
  chipBorder: "rgba(255,255,255,0.06)",
  chipText: "#8c8cb3",

  // Search
  searchBg: "rgba(255,255,255,0.05)",
  searchBorder: "rgba(255,255,255,0.08)",
  searchBorderFocused: "rgba(251,191,36,0.35)",
  searchText: "#ffffff",
  searchPlaceholder: "#666699",

  // Stats
  statsBg: "rgba(255,255,255,0.04)",
  statsBorder: "rgba(255,255,255,0.06)",
  statsValue: "#ffffff",
  statsLabel: "#555577",
  statsDivider: "rgba(255,255,255,0.06)",

  // Campaign card
  cardBg: "#23233d",
  cardBorder: "#3a3a5c",
  cardTitle: "#ffffff",
  cardDescription: "#8c8cb3",
  cardChevronBg: "rgba(255,255,255,0.06)",

  // Empty
  emptyIconRingBorder: "rgba(198,40,40,0.15)",
  emptyIconBg: "rgba(198,40,40,0.08)",
  emptyIconBorder: "rgba(198,40,40,0.12)",
  emptyTitle: "#ffffff",
  emptySubtitle: "#8c8cb3",
  emptyDividerLine: "rgba(255,255,255,0.06)",
  emptyDividerDiamond: "rgba(198,40,40,0.25)",
  emptyHintText: "#555577",

  // Compendium
  tabBg: "rgba(255,255,255,0.04)",
  tabBorder: "rgba(255,255,255,0.06)",
  tabActiveBg: "rgba(198,40,40,0.12)",
  tabActiveBorder: "rgba(198,40,40,0.3)",
  tabText: "#8c8cb3",
  tabActiveText: "#ffffff",
  detailBg: "rgba(255,255,255,0.03)",
  detailBorder: "rgba(255,255,255,0.05)",
};

// ─── Light Palette ───────────────────────────────────────────────────

export const LIGHT_THEME: ThemeColors = {
  // Backgrounds
  bgPrimary: "#f3ead9",
  bgSecondary: "#e8dcc4",
  bgCard: "#fff8ee",
  bgElevated: "#fffdf7",
  bgSubtle: "rgba(124,92,44,0.06)",
  bgInput: "rgba(124,92,44,0.08)",

  // Gradients
  gradientMain: ["#efe3cf", "#f4ead8", "#f7efe2", "#f7efe2"],
  gradientHeader: ["#eadfc7", "#efe3cf00"],
  gradientLocations: [0, 0.12, 0.3, 1],

  // Text
  textPrimary: "#1a1a2e",
  textSecondary: "#4a4a6a",
  textMuted: "#8888aa",
  textInverted: "#ffffff",

  // Borders
  borderDefault: "#d0d0e0",
  borderSubtle: "rgba(0,0,0,0.08)",
  borderSeparator: "rgba(0,0,0,0.08)",

  // Accents (keep vibrant)
  accentGold: "#d4a017",
  accentGoldGlow: "rgba(212,160,23,0.15)",
  accentRed: "#c62828",
  accentGreen: "#16a34a",
  accentBlue: "#2563eb",
  accentPurple: "#9333ea",
  accentAmber: "#d97706",
  accentOrange: "#ea580c",
  accentLime: "#65a30d",
  accentLightBlue: "#3b82f6",
  accentDanger: "#dc2626",
  accentDeepPurple: "#6d28d9",
  accentYellow: "#ca8a04",

  // Interactive
  optionBg: "rgba(0,0,0,0.03)",
  optionBorder: "rgba(0,0,0,0.08)",
  optionSelectedBg: "rgba(212,160,23,0.10)",
  optionSelectedBorder: "rgba(212,160,23,0.45)",

  // Switch
  switchTrackOff: "#c0c0d8",
  switchTrackOn: "rgba(198,40,40,0.35)",
  switchThumbOff: "#ffffff",
  switchThumbOn: "#c62828",

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
  headerLabelColor: "#b8860b",
  headerTitleColor: "#1a1a2e",
  sectionTitleColor: "#1a1a2e",
  sectionDescColor: "#6a6a8a",
  chevronColor: "#8888aa",

  // Danger
  dangerBg: "rgba(239,68,68,0.06)",
  dangerBorder: "rgba(239,68,68,0.20)",
  dangerText: "#dc2626",
  dangerTextMuted: "rgba(220,38,38,0.55)",

  // Chips
  chipBg: "rgba(0,0,0,0.04)",
  chipBorder: "rgba(0,0,0,0.08)",
  chipText: "#6a6a8a",

  // Search
  searchBg: "rgba(0,0,0,0.04)",
  searchBorder: "rgba(0,0,0,0.10)",
  searchBorderFocused: "rgba(212,160,23,0.40)",
  searchText: "#1a1a2e",
  searchPlaceholder: "#8888aa",

  // Stats
  statsBg: "rgba(0,0,0,0.03)",
  statsBorder: "rgba(0,0,0,0.08)",
  statsValue: "#1a1a2e",
  statsLabel: "#6a6a8a",
  statsDivider: "rgba(0,0,0,0.08)",

  // Campaign card
  cardBg: "#ffffff",
  cardBorder: "#d0d0e0",
  cardTitle: "#1a1a2e",
  cardDescription: "#6a6a8a",
  cardChevronBg: "rgba(0,0,0,0.05)",

  // Empty
  emptyIconRingBorder: "rgba(198,40,40,0.18)",
  emptyIconBg: "rgba(198,40,40,0.08)",
  emptyIconBorder: "rgba(198,40,40,0.15)",
  emptyTitle: "#1a1a2e",
  emptySubtitle: "#6a6a8a",
  emptyDividerLine: "rgba(0,0,0,0.08)",
  emptyDividerDiamond: "rgba(198,40,40,0.25)",
  emptyHintText: "#8888aa",

  // Compendium
  tabBg: "rgba(0,0,0,0.04)",
  tabBorder: "rgba(0,0,0,0.08)",
  tabActiveBg: "rgba(198,40,40,0.10)",
  tabActiveBorder: "rgba(198,40,40,0.30)",
  tabText: "#6a6a8a",
  tabActiveText: "#1a1a2e",
  detailBg: "rgba(0,0,0,0.02)",
  detailBorder: "rgba(0,0,0,0.06)",
};

// ─── Helper ──────────────────────────────────────────────────────────

/**
 * Returns the correct theme palette for a given resolved mode.
 * The `resolvedMode` should already account for "auto" → system preference.
 */
export function getThemeColors(resolvedMode: "claro" | "oscuro"): ThemeColors {
  return resolvedMode === "claro" ? LIGHT_THEME : DARK_THEME;
}
