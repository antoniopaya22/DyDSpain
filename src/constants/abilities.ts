/**
 * Shared ability-related constants, extracted from AbilitiesTab.
 */

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
