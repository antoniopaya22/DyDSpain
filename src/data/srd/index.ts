/**
 * Barrel export de todos los datos SRD de D&D 5e en español.
 */

// ─── Razas ───────────────────────────────────────────────────────────
export {
  RACES,
  DRAGON_LINEAGES,
  RACE_ICONS,
  AVAILABLE_LANGUAGES,
  getRaceData,
  getSubraceData,
  getTotalRacialBonuses,
  getAllRaceTraits,
  getRaceList,
  hasSubraces,
} from "./races";

export type { RaceData, SubraceData, RaceTrait, DragonLineage } from "./races";

// ─── Clases ──────────────────────────────────────────────────────────
export {
  CLASSES,
  CLASS_ICONS,
  SPELLCASTING_DESCRIPTIONS,
  getClassData,
  getClassList,
  isSpellcaster,
  hasSpellsAtLevel1,
  calcLevel1HP,
} from "./classes";

export type {
  ClassData,
  ClassFeature,
  EquipmentChoice,
} from "./classes";

// ─── Trasfondos ──────────────────────────────────────────────────────
export {
  BACKGROUNDS,
  BACKGROUND_ICONS,
  getBackgroundData,
  getBackgroundList,
  getBackgroundSkills,
  getRandomPersonalityTrait,
  getRandomIdeal,
  getRandomBond,
  getRandomFlaw,
  generateRandomPersonality,
} from "./backgrounds";

export type { BackgroundData, BackgroundPersonality } from "./backgrounds";
