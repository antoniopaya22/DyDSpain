/**
 * combat.ts - Combat utility functions and constants
 *
 * Extracted from CombatTab.tsx for reuse and separation of concerns.
 */

import type { Condition } from "@/types/character";

// ─── HP Color / Label ────────────────────────────────────────────────

interface HpColorPalette {
  accentDanger: string;
  accentGreen: string;
  accentLime: string;
  accentYellow: string;
  accentOrange: string;
}

/** Returns a theme-aware color string based on current/max HP ratio. */
export function getHpColor(
  current: number,
  max: number,
  colors: HpColorPalette,
): string {
  if (max <= 0) return colors.accentDanger;
  const pct = current / max;
  if (pct >= 0.75) return colors.accentGreen;
  if (pct >= 0.5) return colors.accentLime;
  if (pct >= 0.25) return colors.accentYellow;
  if (pct > 0) return colors.accentOrange;
  return colors.accentDanger;
}

/** Returns a Spanish HP status label based on current/max HP ratio. */
export function getHpLabel(current: number, max: number): string {
  if (max <= 0) return "Muerto";
  const pct = current / max;
  if (pct >= 0.75) return "Saludable";
  if (pct >= 0.5) return "Herido";
  if (pct >= 0.25) return "Malherido";
  if (pct > 0) return "Crítico";
  return "Inconsciente";
}

// ─── Conditions ──────────────────────────────────────────────────────

/** Canonical list of all D&D 5e conditions (in Spanish). */
export const ALL_CONDITIONS: Condition[] = [
  "agarrado",
  "asustado",
  "aturdido",
  "cegado",
  "derribado",
  "encantado",
  "ensordecido",
  "envenenado",
  "hechizado",
  "incapacitado",
  "inconsciente",
  "invisible",
  "paralizado",
  "petrificado",
  "restringido",
];
