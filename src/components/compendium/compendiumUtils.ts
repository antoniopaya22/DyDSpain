/**
 * Shared utility functions for Compendium components
 */

import { ABILITY_NAMES, type AbilityKey, SKILLS } from "@/types/character";

/** Format ability bonus map into a readable string (e.g. "FUE +2, DES +1") */
export function formatAbilityBonuses(
  bonuses: Partial<Record<AbilityKey, number>>,
): string {
  return Object.entries(bonuses)
    .filter(([, v]) => v && v !== 0)
    .map(([key, val]) => {
      const name = ABILITY_NAMES[key as AbilityKey] || key.toUpperCase();
      return `${name} ${val! > 0 ? "+" : ""}${val}`;
    })
    .join(", ");
}

/** Format a modifier number with sign (e.g. +2 or -1) */
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

/** Format a skill key into its Spanish display name */
export function formatSkillName(skill: string): string {
  const def = SKILLS[skill as keyof typeof SKILLS];
  if (def) return def.nombre;
  return skill.charAt(0).toUpperCase() + skill.slice(1).replace(/_/g, " ");
}
