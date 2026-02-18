/**
 * Pure helper functions extracted from the levelUp() method in progressionSlice.
 * Each function is side-effect free and independently testable.
 */

import type {
  Character,
  AbilityKey,
  AbilityScoresDetailed,
  LevelUpRecord,
  Trait,
} from "@/types/character";
import { calcModifier } from "@/types/character";
import { now } from "@/utils/providers";
import type { LevelUpSummary } from "@/data/srd/leveling";
import { getSubclassOptions } from "@/data/srd/subclasses";
import { getSubclassFeaturesForLevel } from "@/data/srd/subclassFeatures";
import { rollDie, hitDieSides, createDefaultMagicState } from "./helpers";
import type { InternalMagicState } from "./helpers";
import type { LevelUpOptions } from "./types";

// ─── Return types ────────────────────────────────────────────────────

export interface HPGainResult {
  /** The base die roll (or fixed value) before CON modifier */
  hpRoll: number;
  /** Total HP gained this level (max(1, hpRoll + conMod)) */
  hpGained: number;
  /** Constitution modifier used for the calculation */
  conMod: number;
}

export interface ASIResult {
  /** Ability scores after applying the improvements */
  updatedScores: AbilityScoresDetailed;
  /** Difference in CON modifier caused by the improvements */
  conModDiff: number;
  /** Retroactive HP gained from increased CON (conModDiff * currentLevel) */
  retroactiveHP: number;
}

// ─── 1. applyHPGain ─────────────────────────────────────────────────

/**
 * Calculates HP gained from a level up.
 *
 * @param character - The character before leveling up.
 * @param options   - Level-up options (hpMethod, hpRolled).
 * @param dieSides  - Number of sides on the character's hit die.
 * @returns The HP roll, total HP gained, and CON modifier used.
 */
export function applyHPGain(
  character: Character,
  options: Pick<LevelUpOptions, "hpMethod" | "hpRolled">,
  dieSides: number,
): HPGainResult {
  let hpRoll: number;
  if (options.hpMethod === "fixed") {
    hpRoll = Math.ceil(dieSides / 2) + 1;
  } else {
    hpRoll = options.hpRolled ?? rollDie(dieSides);
  }
  const conMod = calcModifier(character.abilityScores.con.total);
  const hpGained = Math.max(1, hpRoll + conMod);

  return { hpRoll, hpGained, conMod };
}

// ─── 2. applyASI ────────────────────────────────────────────────────

/**
 * Applies Ability Score Improvements (ASI) to the character's ability scores.
 *
 * @param abilityScores       - Current detailed ability scores.
 * @param summary             - Level-up summary (used to check hasASI).
 * @param options             - Level-up options containing the improvements map.
 * @param currentConMod       - CON modifier before improvements.
 * @param currentLevel        - Character's level before leveling up (for retroactive HP).
 * @returns Updated scores, CON modifier difference, and retroactive HP.
 */
export function applyASI(
  abilityScores: AbilityScoresDetailed,
  summary: Pick<LevelUpSummary, "hasASI">,
  options: Pick<LevelUpOptions, "abilityImprovements">,
  currentConMod: number,
  currentLevel: number,
): ASIResult {
  const updatedScores = { ...abilityScores };

  if (summary.hasASI && options.abilityImprovements) {
    for (const [key, value] of Object.entries(options.abilityImprovements)) {
      const abilityKey = key as AbilityKey;
      if (updatedScores[abilityKey] && value) {
        const currentDetail = { ...updatedScores[abilityKey] };
        currentDetail.improvement += value;
        currentDetail.total =
          currentDetail.base +
          currentDetail.racial +
          currentDetail.improvement +
          currentDetail.misc;
        if (currentDetail.override !== null) {
          currentDetail.total = currentDetail.override;
        }
        currentDetail.total = Math.min(20, currentDetail.total);
        currentDetail.modifier = calcModifier(currentDetail.total);
        updatedScores[abilityKey] = currentDetail;
      }
    }
  }

  const newConMod = calcModifier(updatedScores.con.total);
  const conModDiff = newConMod - currentConMod;
  const retroactiveHP = conModDiff > 0 ? conModDiff * currentLevel : 0;

  return { updatedScores, conModDiff, retroactiveHP };
}

// ─── 3. buildNewTraits ──────────────────────────────────────────────

/**
 * Builds Trait[] from class features gained at this level (NOT subclass features).
 *
 * @param character - The character leveling up.
 * @param summary   - Level-up summary containing the features list.
 * @param newLevel  - The new level being reached.
 * @param options   - Level-up options (used to check subclassChosen).
 * @returns Array of Trait objects for the class features.
 */
export function buildNewTraits(
  character: Character,
  summary: Pick<LevelUpSummary, "features">,
  newLevel: number,
  options: Pick<LevelUpOptions, "subclassChosen">,
): Trait[] {
  return summary.features
    .filter(
      (f) =>
        !f.esSubclase || character.subclase || options.subclassChosen,
    )
    .map((f) => ({
      id: `${character.clase}_${f.nombre.toLowerCase().replace(/\s+/g, "_")}_nv${newLevel}`,
      nombre: f.nombre,
      descripcion: f.descripcion,
      origen: (f.esSubclase ? "subclase" : "clase") as Trait["origen"],
      maxUses: null,
      currentUses: null,
      recharge: null,
    }));
}

// ─── 4. buildSubclassTraits ─────────────────────────────────────────

/**
 * Builds Trait[] from subclass features gained at this level.
 * Resolves the active subclass ID from options or existing character data,
 * then fetches detailed subclass features for the level.
 *
 * @param character - The character leveling up.
 * @param newLevel  - The new level being reached.
 * @param options   - Level-up options (subclassChosen, subclassFeatureChoices).
 * @returns Array of Trait objects for the subclass features.
 */
export function buildSubclassTraits(
  character: Character,
  newLevel: number,
  options: Pick<LevelUpOptions, "subclassChosen" | "subclassFeatureChoices">,
): Trait[] {
  const traits: Trait[] = [];

  // Resolve active subclass ID
  const activeSubclassId = (() => {
    const searchName = options.subclassChosen ?? character.subclase;
    if (!searchName) return null;
    const opts = getSubclassOptions(character.clase);
    const match = opts.find((o) => o.nombre === searchName);
    return match?.id ?? null;
  })();

  if (!activeSubclassId) return traits;

  const subLevelBlock = getSubclassFeaturesForLevel(
    character.clase,
    activeSubclassId,
    newLevel,
  );

  if (!subLevelBlock) return traits;

  const featureChoicesMap = new Map(
    (options.subclassFeatureChoices ?? []).map((c) => [
      c.choiceId,
      c.selectedOptionIds,
    ]),
  );

  for (const rasgo of subLevelBlock.rasgos) {
    let descripcionFinal = rasgo.descripcion;
    if (rasgo.elecciones && rasgo.elecciones.length > 0) {
      for (const eleccion of rasgo.elecciones) {
        const selectedIds = featureChoicesMap.get(eleccion.id);
        if (selectedIds && selectedIds.length > 0) {
          const selectedNames = selectedIds
            .map((sid) => {
              const opt = eleccion.opciones.find((o) => o.id === sid);
              return opt ? `${opt.nombre}: ${opt.descripcion}` : sid;
            })
            .join("\n");
          descripcionFinal += `\n\n🎯 Elegido — ${eleccion.nombre}:\n${selectedNames}`;
        }
      }
    }

    traits.push({
      id: `${character.clase}_sub_${rasgo.nombre.toLowerCase().replace(/\s+/g, "_")}_nv${newLevel}`,
      nombre: rasgo.nombre,
      descripcion: descripcionFinal,
      origen: "subclase" as Trait["origen"],
      maxUses: null,
      currentUses: null,
      recharge: null,
    });
  }

  // Competencias de subclase
  if (subLevelBlock.competenciasGanadas) {
    const comp = subLevelBlock.competenciasGanadas;
    const compParts: string[] = [];
    if (comp.armaduras)
      compParts.push(`Armaduras: ${comp.armaduras.join(", ")}`);
    if (comp.armas)
      compParts.push(`Armas: ${comp.armas.join(", ")}`);
    if (comp.herramientas)
      compParts.push(`Herramientas: ${comp.herramientas.join(", ")}`);
    if (compParts.length > 0) {
      traits.push({
        id: `${character.clase}_sub_competencias_nv${newLevel}`,
        nombre: "Competencias de Subclase",
        descripcion: compParts.join(". ") + ".",
        origen: "subclase" as Trait["origen"],
        maxUses: null,
        currentUses: null,
        recharge: null,
      });
    }
  }

  return traits;
}

// ─── 5. buildLevelRecord ────────────────────────────────────────────

/**
 * Creates the LevelUpRecord for this level-up.
 *
 * @param newLevel  - The new level reached.
 * @param hpGained  - Total HP gained this level.
 * @param options   - Full level-up options.
 * @param summary   - Level-up summary (for feature names).
 * @returns A LevelUpRecord to be appended to the character's levelHistory.
 */
export function buildLevelRecord(
  newLevel: number,
  hpGained: number,
  options: LevelUpOptions,
  summary: Pick<LevelUpSummary, "features">,
): LevelUpRecord {
  return {
    level: newLevel,
    date: now(),
    hpGained,
    hpMethod: options.hpMethod,
    abilityImprovements: options.abilityImprovements,
    subclassChosen: options.subclassChosen,
    subclassFeatureChoices: options.subclassFeatureChoices,
    spellsLearned: [
      ...(options.cantripsLearned ?? []),
      ...(options.spellsLearned ?? []),
      ...(options.spellbookAdded ?? []),
    ].filter(Boolean),
    spellsSwapped: options.spellSwapped
      ? [options.spellSwapped]
      : undefined,
    traitsGained: summary.features.map((f) => f.nombre),
  };
}

// ─── 6. applyMagicProgression ───────────────────────────────────────

/**
 * Updates magic state with new spells, metamagic, and swaps from level-up.
 * Returns null if no magic state exists.
 *
 * @param character  - The updated character (after level/class change applied).
 * @param magicState - The existing magic state (or null).
 * @param options    - Level-up options with spell choices.
 * @returns Updated InternalMagicState, or null if magicState was null.
 */
export function applyMagicProgression(
  character: Character,
  magicState: InternalMagicState | null,
  options: Pick<
    LevelUpOptions,
    | "cantripsLearned"
    | "spellsLearned"
    | "spellbookAdded"
    | "spellSwapped"
    | "metamagicChosen"
  >,
): InternalMagicState | null {
  if (!magicState) return null;

  const newMagicState = createDefaultMagicState(character);
  newMagicState.knownSpellIds = [...magicState.knownSpellIds];
  newMagicState.preparedSpellIds = [...magicState.preparedSpellIds];
  newMagicState.spellbookIds = [...magicState.spellbookIds];
  newMagicState.favoriteSpellIds = [...magicState.favoriteSpellIds];

  const existingMetamagic = magicState.metamagicChosen ?? [];
  const newMetamagic = options.metamagicChosen ?? [];
  newMagicState.metamagicChosen = [...existingMetamagic, ...newMetamagic];

  // Trucos y hechizos
  const newKnown = [
    ...(options.cantripsLearned ?? []),
    ...(options.spellsLearned ?? []),
  ].filter(Boolean);
  for (const spellId of newKnown) {
    if (!newMagicState.knownSpellIds.includes(spellId)) {
      newMagicState.knownSpellIds.push(spellId);
    }
  }

  // Libro de conjuros (mago)
  const newBookSpells = (options.spellbookAdded ?? []).filter(Boolean);
  for (const spellId of newBookSpells) {
    if (!newMagicState.spellbookIds.includes(spellId)) {
      newMagicState.spellbookIds.push(spellId);
    }
  }

  // Intercambio de hechizo
  if (options.spellSwapped) {
    const [oldSpell, newSpell] = options.spellSwapped;
    const idx = newMagicState.knownSpellIds.indexOf(oldSpell);
    if (idx !== -1) {
      newMagicState.knownSpellIds[idx] = newSpell;
    }
    const prepIdx = newMagicState.preparedSpellIds.indexOf(oldSpell);
    if (prepIdx !== -1) {
      newMagicState.preparedSpellIds.splice(prepIdx, 1);
    }
  }

  return newMagicState;
}
