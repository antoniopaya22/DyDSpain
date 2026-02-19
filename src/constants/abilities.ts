/**
 * Shared ability-related constants, extracted from AbilitiesTab.
 */

import type { AbilityKey } from "@/types/character";

/** Color per ability score for UI badges and indicators */
export const ABILITY_COLORS: Record<AbilityKey, string> = {
  fue: "#dc2626",
  des: "#16a34a",
  con: "#f59e0b",
  int: "#3b82f6",
  sab: "#8b5cf6",
  car: "#ec4899",
};

/** Canonical order of ability scores */
export const ABILITY_KEYS: AbilityKey[] = [
  "fue",
  "des",
  "con",
  "int",
  "sab",
  "car",
];

/** Color per spell level for UI badges and indicators */
export const SPELL_LEVEL_COLORS: Record<number, string> = {
  0: "#9ca3af",
  1: "#3b82f6",
  2: "#22c55e",
  3: "#f59e0b",
  4: "#ef4444",
  5: "#a855f7",
  6: "#ec4899",
  7: "#14b8a6",
  8: "#f97316",
  9: "#dc2626",
};

/** Theme (icon, color, label) for each non-caster class ability section */
export const CLASS_ABILITY_THEME: Record<
  string,
  { icon: string; color: string; label: string }
> = {
  barbaro: { icon: "flash", color: "#dc2626", label: "Furia" },
  guerrero: { icon: "shield", color: "#b91c1c", label: "Combate" },
  monje: { icon: "hand-left", color: "#0891b2", label: "Ki" },
  picaro: { icon: "eye-off", color: "#374151", label: "Astucia" },
};
