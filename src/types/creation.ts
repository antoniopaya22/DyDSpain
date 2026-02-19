/**
 * Types for the character creation wizard (HU-02).
 * Extracted from character.ts for separation of concerns.
 */

import type {
  RaceId,
  SubraceId,
  ClassId,
  AbilityScoreMethod,
  AbilityScores,
  BackgroundId,
  SkillKey,
  Personality,
  Alignment,
  Appearance,
  AbilityKey,
} from "./character";

// ─── Estado parcial para el wizard de creación (HU-02) ───────────────

export interface CharacterCreationDraft {
  /** Paso actual del wizard (1-11) */
  currentStep: number;
  /** UUID de la partida donde se está creando */
  campaignId: string;

  // Pasos completados
  nombre?: string;
  raza?: RaceId;
  subraza?: SubraceId;
  clase?: ClassId;
  abilityScoreMethod?: AbilityScoreMethod;
  abilityScoresBase?: AbilityScores;
  trasfondo?: BackgroundId;
  skillChoices?: SkillKey[];
  spellChoices?: {
    cantrips: string[];
    spells: string[];
    spellbook?: string[];
  };
  equipmentChoices?: Record<string, string>;
  personality?: Personality;
  alineamiento?: Alignment;
  appearance?: Appearance;
  /** Bonificadores de característica libres elegidos (ej: semielfo elige 2 × +1) */
  freeAbilityBonuses?: AbilityKey[];

  /** Timestamp para recuperar borradores */
  lastSaved: string;

  // ── Re-creación (reset a nivel 1) ──
  /** Si está presente, indica que estamos re-creando un personaje existente */
  recreatingCharacterId?: string;
  /** Inventory ID del personaje que se está re-creando */
  recreatingInventoryId?: string;
}
