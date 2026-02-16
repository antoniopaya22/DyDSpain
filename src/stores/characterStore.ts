/**
 * Store de personaje con Zustand y persistencia en AsyncStorage.
 * Gestiona el estado completo del personaje: CRUD, HP, condiciones,
 * salvaciones de muerte, descansos, espacios de conjuro, inventario y notas.
 */

import { create } from "zustand";
import { randomUUID } from "expo-crypto";
import type {
  Character,
  AbilityKey,
  AbilityScores,
  SkillKey,
  HitPoints,
  DeathSaves,
  ActiveCondition,
  Condition,
  CombatLogEntry,
  ConcentrationState,
  LevelUpRecord,
  Trait,
} from "@/types/character";
import {
  calcModifier,
  calcProficiencyBonus,
  hitDieFixedValue,
  formatModifier,
  SKILLS,
} from "@/types/character";
import type {
  Inventory,
  InventoryItem,
  Coins,
  CoinType,
  CoinTransaction,
} from "@/types/item";
import {
  createDefaultInventory,
  DEFAULT_COINS,
  calcInventoryWeight,
  calcCarryingCapacity,
} from "@/types/item";
import type {
  Note,
  CreateNoteInput,
  UpdateNoteInput,
  NoteFilters,
  NoteSortOptions,
  NoteTag,
} from "@/types/notes";
import {
  createDefaultNote,
  createQuickNote,
  getPredefinedTags,
  filterNotes,
  sortNotes,
} from "@/types/notes";
import {
  getSpellSlots,
  getPactMagicSlots,
  CLASS_CASTER_TYPE,
} from "@/types/spell";
import { getClassData, calcLevel1HP } from "@/data/srd/classes";
import { getSubraceData } from "@/data/srd/races";
import {
  XP_THRESHOLDS,
  MAX_LEVEL,
  canLevelUp,
  getLevelForXP,
  getFeaturesForLevel,
  isASILevel,
  isSubclassLevel,
  getLevelUpSummary,
  RAGE_USES,
  type LevelUpSummary,
} from "@/data/srd/leveling";

// ─── Class Resources State (Ki, Rage, Second Wind, etc.) ─────────────

export interface ClassResourceInfo {
  id: string;
  nombre: string;
  max: number;
  current: number;
  recovery: "short_rest" | "long_rest";
}

export interface ClassResourcesState {
  resources: Record<string, ClassResourceInfo>;
}

function createDefaultClassResources(
  character: Character,
): ClassResourcesState {
  const resources: Record<string, ClassResourceInfo> = {};
  const level = character.nivel;
  const clase = character.clase;

  if (clase === "barbaro") {
    const rageMax = RAGE_USES[level] ?? 2;
    // At level 20, rage is unlimited — we represent that as 999
    resources["furia"] = {
      id: "furia",
      nombre: "Furia",
      max: rageMax === "ilimitado" ? 999 : (rageMax as number),
      current: rageMax === "ilimitado" ? 999 : (rageMax as number),
      recovery: "long_rest",
    };
  }

  if (clase === "guerrero") {
    resources["tomar_aliento"] = {
      id: "tomar_aliento",
      nombre: "Tomar Aliento",
      max: 1,
      current: 1,
      recovery: "short_rest",
    };
    if (level >= 2) {
      const oleadaMax = level >= 17 ? 2 : 1;
      resources["oleada_accion"] = {
        id: "oleada_accion",
        nombre: "Oleada de Acción",
        max: oleadaMax,
        current: oleadaMax,
        recovery: "short_rest",
      };
    }
    if (level >= 9) {
      const indomableMax = level >= 17 ? 3 : level >= 13 ? 2 : 1;
      resources["indomable"] = {
        id: "indomable",
        nombre: "Indomable",
        max: indomableMax,
        current: indomableMax,
        recovery: "long_rest",
      };
    }
  }

  if (clase === "monje" && level >= 2) {
    resources["ki"] = {
      id: "ki",
      nombre: "Puntos de Ki",
      max: level,
      current: level,
      recovery: "short_rest",
    };
  }

  if (clase === "picaro" && level >= 20) {
    resources["golpe_de_suerte"] = {
      id: "golpe_de_suerte",
      nombre: "Golpe de Suerte",
      max: 1,
      current: 1,
      recovery: "short_rest",
    };
  }

  return { resources };
}

// ─── Internal Magic State type (simplified for UI) ───────────────────

interface SlotInfo {
  total: number;
  used: number;
}

interface InternalPactSlots {
  slotLevel: number;
  total: number;
  used: number;
}

interface InternalSorceryPoints {
  max: number;
  current: number;
}

interface InternalMagicState {
  knownSpellIds: string[];
  preparedSpellIds: string[];
  spellbookIds: string[];
  spellSlots: Record<number, SlotInfo>;
  pactMagicSlots?: InternalPactSlots;
  concentration: null;
  favoriteSpellIds: string[];
  sorceryPoints?: InternalSorceryPoints;
  /** Opciones de Metamagia elegidas (solo hechicero) */
  metamagicChosen?: string[];
}
import { STORAGE_KEYS, setItem, getItem, removeItem } from "@/utils/storage";

// ─── Tipos del store ─────────────────────────────────────────────────

interface CharacterState {
  /** Personaje actualmente cargado */
  character: Character | null;
  /** Inventario del personaje */
  inventory: Inventory | null;
  /** Notas del personaje */
  notes: Note[];
  /** Etiquetas personalizadas */
  customTags: NoteTag[];
  /** Estado mágico (spell slots, etc.) */
  magicState: InternalMagicState | null;
  /** Recursos de clase (Ki, Furia, etc.) */
  classResources: ClassResourcesState | null;
  /** Si se están cargando datos */
  loading: boolean;
  /** Mensaje de error */
  error: string | null;
}

/** Opciones que el jugador elige al subir de nivel */
export interface LevelUpOptions {
  /** Método de PG: tirar dado o usar valor fijo */
  hpMethod: "roll" | "fixed";
  /** Si el método es "roll", el valor tirado (si no se pasa, se genera) */
  hpRolled?: number;
  /** Mejoras de característica elegidas (solo si el nivel otorga ASI) */
  abilityImprovements?: Partial<AbilityScores>;
  /** Subclase elegida (solo si el nivel lo requiere y no tiene una) */
  subclassChosen?: string;
  /** Hechizos aprendidos al subir de nivel (IDs o nombres) */
  spellsLearned?: string[];
  /** Trucos aprendidos al subir de nivel */
  cantripsLearned?: string[];
  /** Hechizo intercambiado: [viejo, nuevo] */
  spellSwapped?: [string, string];
  /** Hechizos añadidos al libro de conjuros (solo mago) */
  spellbookAdded?: string[];
  /** Opciones de Metamagia elegidas (solo hechicero) */
  metamagicChosen?: string[];
}

interface CharacterActions {
  // ── Carga y persistencia ──
  loadCharacter: (characterId: string) => Promise<void>;
  saveCharacter: () => Promise<void>;
  clearCharacter: () => void;

  // ── Experiencia y progresión ──
  addExperience: (amount: number) => Promise<void>;
  removeExperience: (amount: number) => Promise<void>;
  setExperience: (amount: number) => Promise<void>;
  levelUp: (options: LevelUpOptions) => Promise<LevelUpSummary | null>;
  getLevelUpPreview: () => LevelUpSummary | null;
  canLevelUp: () => boolean;
  resetToLevel1: () => Promise<void>;

  // ── HP Management (HU-08) ──
  takeDamage: (amount: number, description?: string) => Promise<void>;
  heal: (amount: number, description?: string) => Promise<void>;
  setTempHP: (amount: number) => Promise<void>;
  setMaxHP: (amount: number) => Promise<void>;
  setCurrentHP: (amount: number) => Promise<void>;

  // ── Hit Dice ──
  useHitDie: () => Promise<{ rolled: number; healed: number } | null>;
  restoreHitDice: (count: number) => Promise<void>;

  // ── Death Saves ──
  addDeathSuccess: () => Promise<"stable" | "success" | null>;
  addDeathFailure: () => Promise<"dead" | "failure" | null>;
  resetDeathSaves: () => Promise<void>;

  // ── Conditions ──
  addCondition: (condition: Condition, note?: string) => Promise<void>;
  removeCondition: (condition: Condition) => Promise<void>;
  clearConditions: () => Promise<void>;

  // ── Concentration ──
  setConcentration: (spellId: string, spellName: string) => Promise<void>;
  clearConcentration: () => Promise<void>;

  // ── Rests ──
  shortRest: (
    hitDiceToUse: number,
  ) => Promise<{ hpRestored: number; diceUsed: number }>;
  longRest: () => Promise<void>;

  // ── Trait uses ──
  useTraitCharge: (traitId: string) => Promise<void>;
  restoreTraitCharges: (traitId: string) => Promise<void>;

  // ── Class Resources (Ki, Rage, etc.) ──
  useClassResource: (resourceId: string) => Promise<boolean>;
  useClassResourceAmount: (
    resourceId: string,
    amount: number,
  ) => Promise<boolean>;
  restoreClassResource: (resourceId: string) => Promise<void>;
  restoreAllClassResources: () => Promise<void>;
  getClassResources: () => ClassResourcesState | null;

  // ── Spell Slots ──
  useSpellSlot: (level: number) => Promise<boolean>;
  restoreSpellSlot: (level: number) => Promise<void>;
  restoreAllSpellSlots: () => Promise<void>;
  usePactSlot: () => Promise<boolean>;
  restoreAllPactSlots: () => Promise<void>;
  getMagicState: () => InternalMagicState | null;

  // ── Inventory ──
  loadInventory: (characterId: string) => Promise<void>;
  addItem: (item: Omit<InventoryItem, "id">) => Promise<void>;
  updateItem: (
    itemId: string,
    updates: Partial<InventoryItem>,
  ) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleEquipItem: (itemId: string) => Promise<void>;
  updateCoins: (coins: Partial<Coins>) => Promise<void>;
  addCoinTransaction: (
    transaction: Omit<CoinTransaction, "id" | "timestamp">,
  ) => Promise<void>;

  // ── Notes ──
  loadNotes: (characterId: string) => Promise<void>;
  addNote: (input: CreateNoteInput) => Promise<Note>;
  updateNote: (noteId: string, updates: UpdateNoteInput) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  togglePinNote: (noteId: string) => Promise<void>;
  addQuickNote: (content: string) => Promise<Note>;

  // ── Utility ──
  getAbilityModifier: (ability: AbilityKey) => number;
  getSkillBonus: (skill: SkillKey) => number;
  getSavingThrowBonus: (ability: AbilityKey) => number;
  getProficiencyBonus: () => number;
  getArmorClass: () => number;
  clearError: () => void;
}

type CharacterStore = CharacterState & CharacterActions;

// ─── Helpers ─────────────────────────────────────────────────────────

function createCombatLogEntry(
  type: CombatLogEntry["type"],
  amount: number,
  hpAfter: number,
  description?: string,
): CombatLogEntry {
  return {
    id: randomUUID(),
    timestamp: new Date().toISOString(),
    type,
    amount,
    hpAfter,
    description,
  };
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

function hitDieSides(die: string): number {
  const map: Record<string, number> = { d6: 6, d8: 8, d10: 10, d12: 12 };
  return map[die] ?? 8;
}

function createDefaultMagicState(character: Character): InternalMagicState {
  const slotsData = getSpellSlots(character.clase, character.nivel);
  const pactData =
    character.clase === "brujo" ? getPactMagicSlots(character.nivel) : null;

  const spellSlots: Record<number, SlotInfo> = {};
  if (slotsData) {
    for (const [level, total] of Object.entries(slotsData)) {
      const lvl = Number(level);
      if (lvl > 0 && (total as number) > 0) {
        spellSlots[lvl] = { total: total as number, used: 0 };
      }
    }
  }

  const pactMagicSlots: InternalPactSlots | undefined = pactData
    ? { total: pactData.total, slotLevel: pactData.slotLevel, used: 0 }
    : undefined;

  return {
    knownSpellIds: [...character.knownSpellIds],
    preparedSpellIds: [...character.preparedSpellIds],
    spellbookIds: [...character.spellbookIds],
    spellSlots,
    pactMagicSlots,
    concentration: null,
    favoriteSpellIds: [],
    sorceryPoints:
      character.clase === "hechicero"
        ? {
            max: Math.max(0, character.nivel),
            current: Math.max(0, character.nivel),
          }
        : undefined,
    metamagicChosen:
      character.clase === "hechicero" ? [] : undefined,
  };
}

// ─── Initial State ───────────────────────────────────────────────────

const INITIAL_STATE: CharacterState = {
  character: null,
  inventory: null,
  notes: [],
  customTags: [],
  magicState: null,
  classResources: null,
  loading: false,
  error: null,
};

// ─── Store ───────────────────────────────────────────────────────────

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  ...INITIAL_STATE,

  // ══════════════════════════════════════════════════════════════════
  // CARGA Y PERSISTENCIA
  // ══════════════════════════════════════════════════════════════════

  loadCharacter: async (characterId: string) => {
    set({ loading: true, error: null });
    try {
      const charKey = STORAGE_KEYS.CHARACTER(characterId);
      const character = await getItem<Character>(charKey);

      if (!character) {
        set({ loading: false, error: "Personaje no encontrado" });
        return;
      }

      // Load inventory
      const invKey = STORAGE_KEYS.INVENTORY(characterId);
      let inventory = await getItem<Inventory>(invKey);
      if (!inventory) {
        inventory = createDefaultInventory(character.inventoryId, characterId);
        await setItem(invKey, inventory);
      }

      // Load notes
      const notesKey = STORAGE_KEYS.NOTES(characterId);
      const notes = (await getItem<Note[]>(notesKey)) ?? [];

      // Load custom tags
      const customTags =
        (await getItem<NoteTag[]>(STORAGE_KEYS.CUSTOM_TAGS)) ?? [];

      // Load magic state
      const magicKey = STORAGE_KEYS.MAGIC_STATE(characterId);
      let magicState = await getItem<InternalMagicState>(magicKey);
      if (!magicState) {
        magicState = createDefaultMagicState(character);
        await setItem(magicKey, magicState);
      }

      // Load class resources (Ki, Rage, etc.)
      const classResKey = STORAGE_KEYS.CLASS_RESOURCES(characterId);
      let classResources = await getItem<ClassResourcesState>(classResKey);
      if (!classResources) {
        classResources = createDefaultClassResources(character);
        await setItem(classResKey, classResources);
      }

      set({
        character,
        inventory,
        notes,
        customTags,
        magicState,
        classResources,
        loading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al cargar el personaje";
      console.error("[CharacterStore] loadCharacter:", message);
      set({ error: message, loading: false });
    }
  },

  saveCharacter: async () => {
    const { character, inventory, notes, magicState, classResources } = get();
    if (!character) return;

    try {
      const updatedChar = {
        ...character,
        actualizadoEn: new Date().toISOString(),
      };
      await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
      set({ character: updatedChar });

      if (inventory) {
        await setItem(STORAGE_KEYS.INVENTORY(character.id), inventory);
      }
      if (notes) {
        await setItem(STORAGE_KEYS.NOTES(character.id), notes);
      }
      if (magicState) {
        await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), magicState);
      }
      if (classResources) {
        await setItem(
          STORAGE_KEYS.CLASS_RESOURCES(character.id),
          classResources,
        );
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al guardar";
      console.error("[CharacterStore] saveCharacter:", message);
      set({ error: message });
    }
  },

  clearCharacter: () => {
    set(INITIAL_STATE);
  },

  // ══════════════════════════════════════════════════════════════════
  // EXPERIENCIA Y PROGRESIÓN
  // ══════════════════════════════════════════════════════════════════

  addExperience: async (amount: number) => {
    const { character } = get();
    if (!character || amount <= 0) return;

    const newXP = character.experiencia + amount;
    const updatedChar: Character = {
      ...character,
      experiencia: newXP,
      actualizadoEn: new Date().toISOString(),
    };
    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  removeExperience: async (amount: number) => {
    const { character } = get();
    if (!character || amount <= 0) return;

    const newXP = Math.max(0, character.experiencia - amount);
    const updatedChar: Character = {
      ...character,
      experiencia: newXP,
      actualizadoEn: new Date().toISOString(),
    };
    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  setExperience: async (amount: number) => {
    const { character } = get();
    if (!character) return;

    const newXP = Math.max(0, amount);
    const updatedChar: Character = {
      ...character,
      experiencia: newXP,
      actualizadoEn: new Date().toISOString(),
    };
    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  canLevelUp: () => {
    const { character } = get();
    if (!character) return false;
    return canLevelUp(character.experiencia, character.nivel);
  },

  getLevelUpPreview: () => {
    const { character } = get();
    if (!character || character.nivel >= MAX_LEVEL) return null;
    return getLevelUpSummary(character.clase, character.nivel + 1);
  },

  levelUp: async (options: LevelUpOptions) => {
    const { character, magicState } = get();
    if (!character || character.nivel >= MAX_LEVEL) return null;

    const newLevel = character.nivel + 1;
    const classData = getClassData(character.clase);
    const summary = getLevelUpSummary(character.clase, newLevel);

    // ── Calcular PG ganados ──
    const dieSides = hitDieSides(character.hitDice.die);
    let hpRoll: number;
    if (options.hpMethod === "fixed") {
      hpRoll = Math.ceil(dieSides / 2) + 1;
    } else {
      hpRoll = options.hpRolled ?? rollDie(dieSides);
    }
    const conMod = calcModifier(character.abilityScores.con.total);
    const hpGained = Math.max(1, hpRoll + conMod);

    // ── Aplicar mejoras de característica (ASI) ──
    const updatedAbilityScores = { ...character.abilityScores };
    if (summary.hasASI && options.abilityImprovements) {
      for (const [key, value] of Object.entries(options.abilityImprovements)) {
        const abilityKey = key as AbilityKey;
        if (updatedAbilityScores[abilityKey] && value) {
          const currentDetail = { ...updatedAbilityScores[abilityKey] };
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
          updatedAbilityScores[abilityKey] = currentDetail;
        }
      }
    }

    // ── Recalcular CON mod después de posibles mejoras ──
    const newConMod = calcModifier(updatedAbilityScores.con.total);
    const conModDiff = newConMod - conMod;
    // Si el mod. CON subió, los PG max retroactivos suben (1 por nivel anterior)
    const retroactiveHP = conModDiff > 0 ? conModDiff * character.nivel : 0;

    // ── Nuevo HP máximo ──
    const newMaxHP = character.hp.max + hpGained + retroactiveHP;
    const newCurrentHP = character.hp.current + hpGained + retroactiveHP;

    // ── Registro de nivel ──
    const levelRecord: LevelUpRecord = {
      level: newLevel,
      date: new Date().toISOString(),
      hpGained,
      hpMethod: options.hpMethod,
      abilityImprovements: options.abilityImprovements,
      subclassChosen: options.subclassChosen,
      spellsLearned: [
        ...(options.cantripsLearned ?? []),
        ...(options.spellsLearned ?? []),
        ...(options.spellbookAdded ?? []),
      ].filter(Boolean),
      spellsSwapped: options.spellSwapped ? [options.spellSwapped] : undefined,
      traitsGained: summary.features.map((f) => f.nombre),
    };

    // ── Nuevos rasgos del nivel ──
    const newTraits: Trait[] = summary.features
      .filter(
        (f) => !f.esSubclase || character.subclase || options.subclassChosen,
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

    // ── Nuevo bonificador de competencia ──
    const newProfBonus = calcProficiencyBonus(newLevel);

    // ── Actualizar personaje ──
    const updatedChar: Character = {
      ...character,
      nivel: newLevel,
      abilityScores: updatedAbilityScores,
      subclase: options.subclassChosen ?? character.subclase,
      hp: {
        ...character.hp,
        max: newMaxHP,
        current: newCurrentHP,
      },
      hitDice: {
        ...character.hitDice,
        total: newLevel,
        remaining: character.hitDice.remaining + 1,
      },
      proficiencyBonus: newProfBonus,
      traits: [...character.traits, ...newTraits],
      levelHistory: [...character.levelHistory, levelRecord],
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });

    // Recalculate class resources for the new level
    const newClassResources = createDefaultClassResources(updatedChar);
    // Preserve current usage if the resource already existed
    const { classResources: oldClassResources } = get();
    if (oldClassResources) {
      for (const [id, newRes] of Object.entries(newClassResources.resources)) {
        const oldRes = oldClassResources.resources[id];
        if (oldRes) {
          // Keep current uses but clamp to new max; add bonus from max increase
          const maxIncrease = newRes.max - oldRes.max;
          newRes.current = Math.min(
            newRes.max,
            oldRes.current + Math.max(0, maxIncrease),
          );
        }
      }
    }
    set({ classResources: newClassResources });
    await setItem(
      STORAGE_KEYS.CLASS_RESOURCES(updatedChar.id),
      newClassResources,
    );
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

    // ── Actualizar estado mágico si es necesario ──
    if (magicState) {
      const newMagicState = createDefaultMagicState(updatedChar);
      // Preservar estado actual (hechizos conocidos, preparados, etc.)
      newMagicState.knownSpellIds = [...magicState.knownSpellIds];
      newMagicState.preparedSpellIds = [...magicState.preparedSpellIds];
      newMagicState.spellbookIds = [...magicState.spellbookIds];
      newMagicState.favoriteSpellIds = [...magicState.favoriteSpellIds];
      // Preservar metamagia existente y añadir nuevas opciones
      const existingMetamagic = magicState.metamagicChosen ?? [];
      const newMetamagic = options.metamagicChosen ?? [];
      newMagicState.metamagicChosen = [...existingMetamagic, ...newMetamagic];

      // ── Aplicar hechizos aprendidos al subir de nivel ──
      // Trucos y hechizos conocidos van a knownSpellIds
      const newKnown = [
        ...(options.cantripsLearned ?? []),
        ...(options.spellsLearned ?? []),
      ].filter(Boolean);
      for (const spellId of newKnown) {
        if (!newMagicState.knownSpellIds.includes(spellId)) {
          newMagicState.knownSpellIds.push(spellId);
        }
      }

      // Hechizos del libro de conjuros (mago)
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
        // También quitar de preparados si estaba
        const prepIdx = newMagicState.preparedSpellIds.indexOf(oldSpell);
        if (prepIdx !== -1) {
          newMagicState.preparedSpellIds.splice(prepIdx, 1);
        }
      }

      set({ magicState: newMagicState });
      await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), newMagicState);
    }

    return summary;
  },

  resetToLevel1: async () => {
    const { character } = get();
    if (!character || character.nivel <= 1) return;

    const classData = getClassData(character.clase);

    // ── Reset ability scores: remove all improvements ──
    const resetAbilityScores = { ...character.abilityScores };
    const abilityKeys: AbilityKey[] = ["fue", "des", "con", "int", "sab", "car"];
    for (const key of abilityKeys) {
      const detail = { ...resetAbilityScores[key] };
      detail.improvement = 0;
      detail.total = detail.override !== null
        ? detail.override
        : Math.min(20, detail.base + detail.racial + detail.misc);
      detail.modifier = calcModifier(detail.total);
      resetAbilityScores[key] = detail;
    }

    // ── Recalculate HP at level 1 ──
    const conMod = resetAbilityScores.con.modifier;
    const subraceData = character.subraza
      ? getSubraceData(character.raza, character.subraza)
      : null;
    const hpBonusPerLevel = subraceData?.hpBonusPerLevel ?? 0;
    const level1HP = calcLevel1HP(character.clase, conMod) + hpBonusPerLevel;

    // ── Restore only level-1 spells from original levelHistory ──
    const level1Record = character.levelHistory.find((r) => r.level === 1);
    const level1Spells = level1Record?.spellsLearned ?? [];

    // ── Keep only race, background, and level-1 class traits ──
    const traitsToKeep = character.traits.filter(
      (t) => t.origen === "raza" || t.origen === "trasfondo" || t.origen === "dote" || t.origen === "manual",
    );
    // Also keep class traits that existed at level 1 (from original creation)
    const level1TraitNames = new Set(
      level1Record?.traitsGained ?? classData.level1Features.map((f) => f.nombre),
    );
    const level1ClassTraits = character.traits.filter(
      (t) => t.origen === "clase" && level1TraitNames.has(t.nombre),
    );
    const finalTraits = [...traitsToKeep, ...level1ClassTraits];

    // ── Build reset character ──
    const now = new Date().toISOString();
    const updatedChar: Character = {
      ...character,
      nivel: 1,
      experiencia: 0,
      subclase: null,
      abilityScores: resetAbilityScores,
      hp: { max: level1HP, current: level1HP, temp: 0 },
      hitDice: { die: classData.hitDie, total: 1, remaining: 1 },
      deathSaves: { successes: 0, failures: 0 },
      conditions: [],
      concentration: null,
      combatLog: [],
      proficiencyBonus: calcProficiencyBonus(1),
      traits: finalTraits,
      levelHistory: level1Record
        ? [{ ...level1Record, hpGained: level1HP }]
        : [{ level: 1, date: now, hpGained: level1HP, hpMethod: "fixed" as const }],
      knownSpellIds: [...level1Spells],
      preparedSpellIds: level1Spells.filter(
        (id) => !level1Spells.some((s) => s === id && character.knownSpellIds.indexOf(s) === -1),
      ),
      spellbookIds: character.clase === "mago" ? [...level1Spells] : [],
      actualizadoEn: now,
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

    // ── Reset magic state ──
    const newMagicState = createDefaultMagicState(updatedChar);
    set({ magicState: newMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), newMagicState);

    // ── Reset class resources ──
    const newClassResources = createDefaultClassResources(updatedChar);
    set({ classResources: newClassResources });
    await setItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), newClassResources);
  },

  // ══════════════════════════════════════════════════════════════════
  // HP MANAGEMENT
  // ══════════════════════════════════════════════════════════════════

  takeDamage: async (amount: number, description?: string) => {
    const { character } = get();
    if (!character || amount <= 0) return;

    let remaining = amount;
    let newTemp = character.hp.temp;
    let newCurrent = character.hp.current;

    // Temp HP absorbs damage first
    if (newTemp > 0) {
      if (remaining >= newTemp) {
        remaining -= newTemp;
        newTemp = 0;
      } else {
        newTemp -= remaining;
        remaining = 0;
      }
    }

    newCurrent = Math.max(0, newCurrent - remaining);

    const newHp: HitPoints = {
      max: character.hp.max,
      current: newCurrent,
      temp: newTemp,
    };

    const logEntry = createCombatLogEntry(
      "damage",
      amount,
      newCurrent,
      description ?? `Recibe ${amount} de daño`,
    );

    const updatedChar: Character = {
      ...character,
      hp: newHp,
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  heal: async (amount: number, description?: string) => {
    const { character } = get();
    if (!character || amount <= 0) return;

    const newCurrent = Math.min(
      character.hp.max,
      character.hp.current + amount,
    );
    const actualHeal = newCurrent - character.hp.current;

    const newHp: HitPoints = {
      ...character.hp,
      current: newCurrent,
    };

    const logEntry = createCombatLogEntry(
      "healing",
      actualHeal,
      newCurrent,
      description ?? `Cura ${actualHeal} PG`,
    );

    const updatedChar: Character = {
      ...character,
      hp: newHp,
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  setTempHP: async (amount: number) => {
    const { character } = get();
    if (!character) return;

    // Temp HP doesn't stack, use the higher value
    const newTemp = Math.max(0, amount);

    const logEntry = createCombatLogEntry(
      "temp_hp",
      newTemp,
      character.hp.current,
      `PG temporales: ${newTemp}`,
    );

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, temp: newTemp },
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  setMaxHP: async (amount: number) => {
    const { character } = get();
    if (!character || amount < 1) return;

    const newCurrent = Math.min(character.hp.current, amount);

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, max: amount, current: newCurrent },
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  setCurrentHP: async (amount: number) => {
    const { character } = get();
    if (!character) return;

    const clamped = Math.max(0, Math.min(character.hp.max, amount));

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: clamped },
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // HIT DICE
  // ══════════════════════════════════════════════════════════════════

  useHitDie: async () => {
    const { character } = get();
    if (!character || character.hitDice.remaining <= 0) return null;

    const sides = hitDieSides(character.hitDice.die);
    const rolled = rollDie(sides);
    const conMod = character.abilityScores.con.modifier;
    const healed = Math.max(1, rolled + conMod);
    const newCurrent = Math.min(
      character.hp.max,
      character.hp.current + healed,
    );

    const logEntry = createCombatLogEntry(
      "hit_dice",
      healed,
      newCurrent,
      `Usa dado de golpe (${character.hitDice.die}): ${rolled} + CON(${formatModifier(conMod)}) = ${healed} PG`,
    );

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: newCurrent },
      hitDice: {
        ...character.hitDice,
        remaining: character.hitDice.remaining - 1,
      },
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

    return { rolled, healed };
  },

  restoreHitDice: async (count: number) => {
    const { character } = get();
    if (!character) return;

    const newRemaining = Math.min(
      character.hitDice.total,
      character.hitDice.remaining + count,
    );

    const updatedChar: Character = {
      ...character,
      hitDice: { ...character.hitDice, remaining: newRemaining },
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // DEATH SAVES
  // ══════════════════════════════════════════════════════════════════

  addDeathSuccess: async () => {
    const { character } = get();
    if (!character) return null;

    const newSuccesses = character.deathSaves.successes + 1;
    const isStable = newSuccesses >= 3;

    const logEntry = createCombatLogEntry(
      "death_save",
      1,
      character.hp.current,
      isStable
        ? "¡Estabilizado! (3 éxitos)"
        : `Salvación de muerte: Éxito (${newSuccesses}/3)`,
    );

    const updatedChar: Character = {
      ...character,
      deathSaves: {
        ...character.deathSaves,
        successes: newSuccesses,
      },
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    if (isStable) {
      updatedChar.deathSaves = { successes: 0, failures: 0 };
      updatedChar.hp = { ...updatedChar.hp, current: 1 };
    }

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

    return isStable ? "stable" : "success";
  },

  addDeathFailure: async () => {
    const { character } = get();
    if (!character) return null;

    const newFailures = character.deathSaves.failures + 1;
    const isDead = newFailures >= 3;

    const logEntry = createCombatLogEntry(
      "death_save",
      -1,
      character.hp.current,
      isDead
        ? "☠️ Muerte (3 fallos)"
        : `Salvación de muerte: Fallo (${newFailures}/3)`,
    );

    const updatedChar: Character = {
      ...character,
      deathSaves: {
        ...character.deathSaves,
        failures: newFailures,
      },
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

    return isDead ? "dead" : "failure";
  },

  resetDeathSaves: async () => {
    const { character } = get();
    if (!character) return;

    const updatedChar: Character = {
      ...character,
      deathSaves: { successes: 0, failures: 0 },
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // CONDITIONS
  // ══════════════════════════════════════════════════════════════════

  addCondition: async (condition: Condition, note?: string) => {
    const { character } = get();
    if (!character) return;

    // Don't add duplicates
    if (character.conditions.some((c) => c.condition === condition)) return;

    const updatedChar: Character = {
      ...character,
      conditions: [...character.conditions, { condition, note }],
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  removeCondition: async (condition: Condition) => {
    const { character } = get();
    if (!character) return;

    const updatedChar: Character = {
      ...character,
      conditions: character.conditions.filter((c) => c.condition !== condition),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  clearConditions: async () => {
    const { character } = get();
    if (!character) return;

    const updatedChar: Character = {
      ...character,
      conditions: [],
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // CONCENTRATION
  // ══════════════════════════════════════════════════════════════════

  setConcentration: async (spellId: string, spellName: string) => {
    const { character } = get();
    if (!character) return;

    const updatedChar: Character = {
      ...character,
      concentration: {
        spellId,
        spellName,
        startedAt: new Date().toISOString(),
      },
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  clearConcentration: async () => {
    const { character } = get();
    if (!character) return;

    const updatedChar: Character = {
      ...character,
      concentration: null,
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // RESTS
  // ══════════════════════════════════════════════════════════════════

  shortRest: async (hitDiceToUse: number) => {
    const { character, magicState, classResources } = get();
    if (!character) return { hpRestored: 0, diceUsed: 0 };

    const sides = hitDieSides(character.hitDice.die);
    const conMod = character.abilityScores.con.modifier;

    let totalHealed = 0;
    let diceUsed = 0;
    let remaining = character.hitDice.remaining;

    for (let i = 0; i < hitDiceToUse && remaining > 0; i++) {
      const rolled = rollDie(sides);
      const healed = Math.max(1, rolled + conMod);
      totalHealed += healed;
      remaining--;
      diceUsed++;
    }

    const newCurrent = Math.min(
      character.hp.max,
      character.hp.current + totalHealed,
    );

    const logEntry = createCombatLogEntry(
      "rest",
      totalHealed,
      newCurrent,
      `Descanso corto: usa ${diceUsed} dado(s) de golpe, recupera ${totalHealed} PG`,
    );

    // Restore short rest traits
    const updatedTraits = character.traits.map((t) => {
      if (t.recharge === "short_rest" && t.maxUses !== null) {
        return { ...t, currentUses: t.maxUses };
      }
      return t;
    });

    // Restore warlock pact slots on short rest
    let updatedMagicState: InternalMagicState | null = magicState;
    if (
      magicState &&
      character.clase === "brujo" &&
      magicState.pactMagicSlots
    ) {
      updatedMagicState = {
        ...magicState,
        pactMagicSlots: {
          ...magicState.pactMagicSlots,
          used: 0,
        },
      };
    }

    // Restore short_rest class resources (Ki, Second Wind, etc.)
    let updatedClassResources = classResources;
    if (classResources) {
      const restoredResources: Record<string, ClassResourceInfo> = {};
      for (const [id, res] of Object.entries(classResources.resources)) {
        restoredResources[id] =
          res.recovery === "short_rest"
            ? { ...res, current: res.max }
            : { ...res };
      }
      updatedClassResources = { resources: restoredResources };
    }

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: newCurrent },
      hitDice: { ...character.hitDice, remaining },
      traits: updatedTraits,
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({
      character: updatedChar,
      magicState: updatedMagicState,
      classResources: updatedClassResources,
    });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
    if (updatedMagicState) {
      await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
    }
    if (updatedClassResources) {
      await setItem(
        STORAGE_KEYS.CLASS_RESOURCES(character.id),
        updatedClassResources,
      );
    }

    return { hpRestored: totalHealed, diceUsed };
  },

  longRest: async () => {
    const { character, magicState, classResources } = get();
    if (!character) return;

    // Restore all HP
    const newCurrent = character.hp.max;

    // Restore half of hit dice (minimum 1)
    const dicesToRestore = Math.max(1, Math.floor(character.hitDice.total / 2));
    const newRemaining = Math.min(
      character.hitDice.total,
      character.hitDice.remaining + dicesToRestore,
    );

    // Reset death saves
    const newDeathSaves: DeathSaves = { successes: 0, failures: 0 };

    // Restore all trait uses
    const updatedTraits = character.traits.map((t) => {
      if (
        t.maxUses !== null &&
        (t.recharge === "short_rest" ||
          t.recharge === "long_rest" ||
          t.recharge === "dawn")
      ) {
        return { ...t, currentUses: t.maxUses };
      }
      return t;
    });

    // Restore all spell slots
    let updatedMagicState: InternalMagicState | null = magicState;
    if (magicState) {
      const restoredSlots: Record<number, SlotInfo> = {};
      for (const [level, slot] of Object.entries(magicState.spellSlots)) {
        if (slot) {
          restoredSlots[Number(level)] = {
            total: slot.total,
            used: 0,
          };
        }
      }

      updatedMagicState = {
        ...magicState,
        spellSlots: restoredSlots,
        pactMagicSlots: magicState.pactMagicSlots
          ? { ...magicState.pactMagicSlots, used: 0 }
          : undefined,
        sorceryPoints: magicState.sorceryPoints
          ? {
              ...magicState.sorceryPoints,
              current: magicState.sorceryPoints.max,
            }
          : undefined,
      };
    }

    // Restore ALL class resources on long rest
    let updatedClassResources = classResources;
    if (classResources) {
      const restoredResources: Record<string, ClassResourceInfo> = {};
      for (const [id, res] of Object.entries(classResources.resources)) {
        restoredResources[id] = { ...res, current: res.max };
      }
      updatedClassResources = { resources: restoredResources };
    }

    const logEntry = createCombatLogEntry(
      "rest",
      character.hp.max - character.hp.current,
      newCurrent,
      `Descanso largo: PG al máximo, ${dicesToRestore} dado(s) de golpe restaurados`,
    );

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: newCurrent, temp: 0 },
      hitDice: { ...character.hitDice, remaining: newRemaining },
      deathSaves: newDeathSaves,
      conditions: [],
      concentration: null,
      traits: updatedTraits,
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({
      character: updatedChar,
      magicState: updatedMagicState,
      classResources: updatedClassResources,
    });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
    if (updatedMagicState) {
      await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
    }
    if (updatedClassResources) {
      await setItem(
        STORAGE_KEYS.CLASS_RESOURCES(character.id),
        updatedClassResources,
      );
    }
  },

  // ══════════════════════════════════════════════════════════════════
  // TRAIT USES
  // ══════════════════════════════════════════════════════════════════

  useTraitCharge: async (traitId: string) => {
    const { character } = get();
    if (!character) return;

    const updatedTraits = character.traits.map((t) => {
      if (t.id === traitId && t.currentUses !== null && t.currentUses > 0) {
        return { ...t, currentUses: t.currentUses - 1 };
      }
      return t;
    });

    const updatedChar: Character = {
      ...character,
      traits: updatedTraits,
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  restoreTraitCharges: async (traitId: string) => {
    const { character } = get();
    if (!character) return;

    const updatedTraits = character.traits.map((t) => {
      if (t.id === traitId && t.maxUses !== null) {
        return { ...t, currentUses: t.maxUses };
      }
      return t;
    });

    const updatedChar: Character = {
      ...character,
      traits: updatedTraits,
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
  },

  // ══════════════════════════════════════════════════════════════════
  // CLASS RESOURCES (Ki, Rage, Second Wind, etc.)
  // ══════════════════════════════════════════════════════════════════

  useClassResource: async (resourceId: string) => {
    const { character, classResources } = get();
    if (!character || !classResources) return false;

    const resource = classResources.resources[resourceId];
    if (!resource || resource.current <= 0) return false;

    const updatedResources: ClassResourcesState = {
      resources: {
        ...classResources.resources,
        [resourceId]: {
          ...resource,
          current: resource.current - 1,
        },
      },
    };

    set({ classResources: updatedResources });
    await setItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
    return true;
  },

  useClassResourceAmount: async (resourceId: string, amount: number) => {
    const { character, classResources } = get();
    if (!character || !classResources) return false;

    const resource = classResources.resources[resourceId];
    if (!resource || resource.current < amount || amount <= 0) return false;

    const updatedResources: ClassResourcesState = {
      resources: {
        ...classResources.resources,
        [resourceId]: {
          ...resource,
          current: resource.current - amount,
        },
      },
    };

    set({ classResources: updatedResources });
    await setItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
    return true;
  },

  restoreClassResource: async (resourceId: string) => {
    const { character, classResources } = get();
    if (!character || !classResources) return;

    const resource = classResources.resources[resourceId];
    if (!resource || resource.current >= resource.max) return;

    const updatedResources: ClassResourcesState = {
      resources: {
        ...classResources.resources,
        [resourceId]: {
          ...resource,
          current: resource.max,
        },
      },
    };

    set({ classResources: updatedResources });
    await setItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
  },

  restoreAllClassResources: async () => {
    const { character, classResources } = get();
    if (!character || !classResources) return;

    const restoredResources: Record<string, ClassResourceInfo> = {};
    for (const [id, res] of Object.entries(classResources.resources)) {
      restoredResources[id] = { ...res, current: res.max };
    }

    const updatedResources: ClassResourcesState = {
      resources: restoredResources,
    };

    set({ classResources: updatedResources });
    await setItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
  },

  getClassResources: () => {
    return get().classResources;
  },

  // ══════════════════════════════════════════════════════════════════
  // SPELL SLOTS
  // ══════════════════════════════════════════════════════════════════

  useSpellSlot: async (level: number) => {
    const { character, magicState } = get();
    if (!character || !magicState) return false;

    const slot = magicState.spellSlots[level];
    if (!slot || slot.used >= slot.total) return false;

    const updatedMagicState: InternalMagicState = {
      ...magicState,
      spellSlots: {
        ...magicState.spellSlots,
        [level]: { ...slot, used: slot.used + 1 },
      },
    };

    set({ magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
    return true;
  },

  restoreSpellSlot: async (level: number) => {
    const { character, magicState } = get();
    if (!character || !magicState) return;

    const slot = magicState.spellSlots[level];
    if (!slot || slot.used <= 0) return;

    const updatedMagicState: InternalMagicState = {
      ...magicState,
      spellSlots: {
        ...magicState.spellSlots,
        [level]: { ...slot, used: slot.used - 1 },
      },
    };

    set({ magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
  },

  restoreAllSpellSlots: async () => {
    const { character, magicState } = get();
    if (!character || !magicState) return;

    const restoredSlots: Record<number, SlotInfo> = {};
    for (const [level, slot] of Object.entries(magicState.spellSlots)) {
      if (slot) {
        restoredSlots[Number(level)] = {
          total: slot.total,
          used: 0,
        };
      }
    }

    const updatedMagicState: InternalMagicState = {
      ...magicState,
      spellSlots: restoredSlots,
    };

    set({ magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
  },

  usePactSlot: async () => {
    const { character, magicState } = get();
    if (!character || !magicState || !magicState.pactMagicSlots) return false;

    if (magicState.pactMagicSlots.used >= magicState.pactMagicSlots.total)
      return false;

    const updatedMagicState: InternalMagicState = {
      ...magicState,
      pactMagicSlots: {
        ...magicState.pactMagicSlots,
        used: magicState.pactMagicSlots.used + 1,
      },
    };

    set({ magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
    return true;
  },

  restoreAllPactSlots: async () => {
    const { character, magicState } = get();
    if (!character || !magicState || !magicState.pactMagicSlots) return;

    const updatedMagicState: InternalMagicState = {
      ...magicState,
      pactMagicSlots: {
        ...magicState.pactMagicSlots!,
        used: 0,
      },
    };

    set({ magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
  },

  // ══════════════════════════════════════════════════════════════════
  // INVENTORY
  // ══════════════════════════════════════════════════════════════════

  loadInventory: async (characterId: string) => {
    try {
      const invKey = STORAGE_KEYS.INVENTORY(characterId);
      const inventory = await getItem<Inventory>(invKey);
      if (inventory) {
        set({ inventory });
      }
    } catch (err) {
      console.error("[CharacterStore] loadInventory:", err);
    }
  },

  addItem: async (item: Omit<InventoryItem, "id">) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const newItem: InventoryItem = {
      ...item,
      id: randomUUID(),
    };

    const updatedInventory: Inventory = {
      ...inventory,
      items: [...inventory.items, newItem],
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  updateItem: async (itemId: string, updates: Partial<InventoryItem>) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const updatedItems = inventory.items.map((item) =>
      item.id === itemId ? { ...item, ...updates } : item,
    );

    const updatedInventory: Inventory = {
      ...inventory,
      items: updatedItems,
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  removeItem: async (itemId: string) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const updatedInventory: Inventory = {
      ...inventory,
      items: inventory.items.filter((item) => item.id !== itemId),
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  toggleEquipItem: async (itemId: string) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const updatedItems = inventory.items.map((item) =>
      item.id === itemId ? { ...item, equipado: !item.equipado } : item,
    );

    const updatedInventory: Inventory = {
      ...inventory,
      items: updatedItems,
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  updateCoins: async (coins: Partial<Coins>) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const updatedCoins: Coins = {
      ...inventory.coins,
      ...coins,
    };

    // Clamp to 0
    for (const key of Object.keys(updatedCoins) as CoinType[]) {
      updatedCoins[key] = Math.max(0, updatedCoins[key]);
    }

    const updatedInventory: Inventory = {
      ...inventory,
      coins: updatedCoins,
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  addCoinTransaction: async (
    transaction: Omit<CoinTransaction, "id" | "timestamp">,
  ) => {
    const { character, inventory } = get();
    if (!character || !inventory) return;

    const newTransaction: CoinTransaction = {
      ...transaction,
      id: randomUUID(),
      timestamp: new Date().toISOString(),
    };

    // Apply the transaction to coins
    const updatedCoins = { ...inventory.coins };
    if (transaction.coins) {
      for (const [type, amount] of Object.entries(transaction.coins)) {
        const coinType = type as CoinType;
        if (transaction.type === "income") {
          updatedCoins[coinType] =
            (updatedCoins[coinType] ?? 0) + (amount ?? 0);
        } else if (transaction.type === "expense") {
          updatedCoins[coinType] = Math.max(
            0,
            (updatedCoins[coinType] ?? 0) - (amount ?? 0),
          );
        }
      }
    }

    const updatedInventory: Inventory = {
      ...inventory,
      coins: updatedCoins,
      coinTransactions: [newTransaction, ...inventory.coinTransactions].slice(
        0,
        50,
      ),
    };

    set({ inventory: updatedInventory });
    await setItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
  },

  // ══════════════════════════════════════════════════════════════════
  // NOTES
  // ══════════════════════════════════════════════════════════════════

  loadNotes: async (characterId: string) => {
    try {
      const notesKey = STORAGE_KEYS.NOTES(characterId);
      const notes = (await getItem<Note[]>(notesKey)) ?? [];
      const customTags =
        (await getItem<NoteTag[]>(STORAGE_KEYS.CUSTOM_TAGS)) ?? [];
      set({ notes, customTags });
    } catch (err) {
      console.error("[CharacterStore] loadNotes:", err);
    }
  },

  addNote: async (input: CreateNoteInput) => {
    const { character, notes } = get();
    if (!character) throw new Error("No character loaded");

    const noteId = randomUUID();
    const note = createDefaultNote(noteId, input.personajeId, input.partidaId);
    const newNote: Note = {
      ...note,
      titulo: input.titulo,
      contenido: input.contenido,
      etiquetas: input.etiquetas ?? [],
      tipo: input.tipo ?? "general",
      numeroSesion: input.numeroSesion ?? null,
      fechaSesion: input.fechaSesion ?? null,
      visibleParaMaster: input.visibleParaMaster ?? false,
    };

    const updatedNotes = [newNote, ...notes];
    set({ notes: updatedNotes });
    await setItem(STORAGE_KEYS.NOTES(character.id), updatedNotes);

    return newNote;
  },

  updateNote: async (noteId: string, updates: UpdateNoteInput) => {
    const { character, notes } = get();
    if (!character) return;

    const updatedNotes = notes.map((note) => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        ...updates,
        fechaModificacion: new Date().toISOString(),
      };
    });

    set({ notes: updatedNotes });
    await setItem(STORAGE_KEYS.NOTES(character.id), updatedNotes);
  },

  deleteNote: async (noteId: string) => {
    const { character, notes } = get();
    if (!character) return;

    const updatedNotes = notes.filter((n) => n.id !== noteId);
    set({ notes: updatedNotes });
    await setItem(STORAGE_KEYS.NOTES(character.id), updatedNotes);
  },

  togglePinNote: async (noteId: string) => {
    const { character, notes } = get();
    if (!character) return;

    const updatedNotes = notes.map((note) => {
      if (note.id !== noteId) return note;
      return {
        ...note,
        fijada: !note.fijada,
        fechaModificacion: new Date().toISOString(),
      };
    });

    set({ notes: updatedNotes });
    await setItem(STORAGE_KEYS.NOTES(character.id), updatedNotes);
  },

  addQuickNote: async (content: string) => {
    const { character, notes } = get();
    if (!character) throw new Error("No character loaded");

    const noteId = randomUUID();
    const newNote = createQuickNote(noteId, {
      personajeId: character.id,
      partidaId: character.campaignId,
      contenido: content,
    });

    const updatedNotes = [newNote, ...notes];
    set({ notes: updatedNotes });
    await setItem(STORAGE_KEYS.NOTES(character.id), updatedNotes);

    return newNote;
  },

  // ══════════════════════════════════════════════════════════════════
  // UTILITY
  // ══════════════════════════════════════════════════════════════════

  getAbilityModifier: (ability: AbilityKey) => {
    const { character } = get();
    if (!character) return 0;
    return character.abilityScores[ability].modifier;
  },

  getSkillBonus: (skill: SkillKey) => {
    const { character } = get();
    if (!character) return 0;

    const skillDef = SKILLS[skill];
    const abilityMod = character.abilityScores[skillDef.habilidad].modifier;
    const proficiency = character.skillProficiencies[skill];
    const profBonus = character.proficiencyBonus;

    if (proficiency.level === "expertise") {
      return abilityMod + profBonus * 2;
    } else if (proficiency.level === "proficient") {
      return abilityMod + profBonus;
    }
    return abilityMod;
  },

  getSavingThrowBonus: (ability: AbilityKey) => {
    const { character } = get();
    if (!character) return 0;

    const mod = character.abilityScores[ability].modifier;
    const proficient = character.savingThrows[ability].proficient;
    return proficient ? mod + character.proficiencyBonus : mod;
  },

  getProficiencyBonus: () => {
    const { character } = get();
    if (!character) return 2;
    return character.proficiencyBonus;
  },

  getArmorClass: () => {
    const { character, inventory } = get();
    if (!character) return 10;

    const dexMod = character.abilityScores.des.modifier;
    let baseAC = 10 + dexMod;

    if (inventory) {
      const equippedArmor = inventory.items.find(
        (i) => i.equipado && i.categoria === "armadura" && i.armorDetails,
      );
      const equippedShield = inventory.items.find(
        (i) => i.equipado && i.categoria === "escudo" && i.armorDetails,
      );

      if (equippedArmor?.armorDetails) {
        const armor = equippedArmor.armorDetails;
        if (!armor.addDexModifier) {
          baseAC = armor.baseAC;
        } else if (armor.maxDexBonus !== null) {
          baseAC = armor.baseAC + Math.min(dexMod, armor.maxDexBonus);
        } else {
          baseAC = armor.baseAC + dexMod;
        }
      }

      if (equippedShield?.armorDetails) {
        baseAC += equippedShield.armorDetails.baseAC;
      }
    }

    return baseAC;
  },

  getMagicState: () => {
    return get().magicState;
  },

  clearError: () => {
    set({ error: null });
  },
}));
