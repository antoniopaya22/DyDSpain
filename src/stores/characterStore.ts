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
  SkillKey,
  HitPoints,
  DeathSaves,
  ActiveCondition,
  Condition,
  CombatLogEntry,
  ConcentrationState,
  Trait,
} from "@/types/character";
import {
  calcModifier,
  calcProficiencyBonus,
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
  /** Si se están cargando datos */
  loading: boolean;
  /** Mensaje de error */
  error: string | null;
}

interface CharacterActions {
  // ── Carga y persistencia ──
  loadCharacter: (characterId: string) => Promise<void>;
  saveCharacter: () => Promise<void>;
  clearCharacter: () => void;

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
  shortRest: (hitDiceToUse: number) => Promise<{ hpRestored: number; diceUsed: number }>;
  longRest: () => Promise<void>;

  // ── Trait uses ──
  useTraitCharge: (traitId: string) => Promise<void>;
  restoreTraitCharges: (traitId: string) => Promise<void>;

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
  updateItem: (itemId: string, updates: Partial<InventoryItem>) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  toggleEquipItem: (itemId: string) => Promise<void>;
  updateCoins: (coins: Partial<Coins>) => Promise<void>;
  addCoinTransaction: (transaction: Omit<CoinTransaction, "id" | "timestamp">) => Promise<void>;

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
  description?: string
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
  const pactData = character.clase === "brujo" ? getPactMagicSlots(character.nivel) : null;

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
    sorceryPoints: character.clase === "hechicero"
      ? { max: Math.max(0, character.nivel), current: Math.max(0, character.nivel) }
      : undefined,
  };
}

// ─── Initial State ───────────────────────────────────────────────────

const INITIAL_STATE: CharacterState = {
  character: null,
  inventory: null,
  notes: [],
  customTags: [],
  magicState: null,
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
      const notes = await getItem<Note[]>(notesKey) ?? [];

      // Load custom tags
      const customTags = await getItem<NoteTag[]>(STORAGE_KEYS.CUSTOM_TAGS) ?? [];

      // Load magic state
      const magicKey = STORAGE_KEYS.MAGIC_STATE(characterId);
      let magicState = await getItem<InternalMagicState>(magicKey);
      if (!magicState) {
        magicState = createDefaultMagicState(character);
        await setItem(magicKey, magicState);
      }

      set({
        character,
        inventory,
        notes,
        customTags,
        magicState,
        loading: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al cargar el personaje";
      console.error("[CharacterStore] loadCharacter:", message);
      set({ error: message, loading: false });
    }
  },

  saveCharacter: async () => {
    const { character, inventory, notes, magicState } = get();
    if (!character) return;

    try {
      const updatedChar = { ...character, actualizadoEn: new Date().toISOString() };
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
      description ?? `Recibe ${amount} de daño`
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

    const newCurrent = Math.min(character.hp.max, character.hp.current + amount);
    const actualHeal = newCurrent - character.hp.current;

    const newHp: HitPoints = {
      ...character.hp,
      current: newCurrent,
    };

    const logEntry = createCombatLogEntry(
      "healing",
      actualHeal,
      newCurrent,
      description ?? `Cura ${actualHeal} PG`
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
      `PG temporales: ${newTemp}`
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
    const newCurrent = Math.min(character.hp.max, character.hp.current + healed);

    const logEntry = createCombatLogEntry(
      "hit_dice",
      healed,
      newCurrent,
      `Usa dado de golpe (${character.hitDice.die}): ${rolled} + CON(${formatModifier(conMod)}) = ${healed} PG`
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
      character.hitDice.remaining + count
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
      isStable ? "¡Estabilizado! (3 éxitos)" : `Salvación de muerte: Éxito (${newSuccesses}/3)`
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
      isDead ? "☠️ Muerte (3 fallos)" : `Salvación de muerte: Fallo (${newFailures}/3)`
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
    const { character, magicState } = get();
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

    const newCurrent = Math.min(character.hp.max, character.hp.current + totalHealed);

    const logEntry = createCombatLogEntry(
      "rest",
      totalHealed,
      newCurrent,
      `Descanso corto: usa ${diceUsed} dado(s) de golpe, recupera ${totalHealed} PG`
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
    if (magicState && character.clase === "brujo" && magicState.pactMagicSlots) {
      updatedMagicState = {
        ...magicState,
        pactMagicSlots: {
          ...magicState.pactMagicSlots,
          used: 0,
        },
      };
    }

    const updatedChar: Character = {
      ...character,
      hp: { ...character.hp, current: newCurrent },
      hitDice: { ...character.hitDice, remaining },
      traits: updatedTraits,
      combatLog: [logEntry, ...character.combatLog].slice(0, 100),
      actualizadoEn: new Date().toISOString(),
    };

    set({ character: updatedChar, magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
    if (updatedMagicState) {
      await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
    }

    return { hpRestored: totalHealed, diceUsed };
  },

  longRest: async () => {
    const { character, magicState } = get();
    if (!character) return;

    // Restore all HP
    const newCurrent = character.hp.max;

    // Restore half of hit dice (minimum 1)
    const dicesToRestore = Math.max(1, Math.floor(character.hitDice.total / 2));
    const newRemaining = Math.min(
      character.hitDice.total,
      character.hitDice.remaining + dicesToRestore
    );

    // Reset death saves
    const newDeathSaves: DeathSaves = { successes: 0, failures: 0 };

    // Restore all trait uses
    const updatedTraits = character.traits.map((t) => {
      if (t.maxUses !== null && (t.recharge === "short_rest" || t.recharge === "long_rest" || t.recharge === "dawn")) {
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
          ? { ...magicState.sorceryPoints, current: magicState.sorceryPoints.max }
          : undefined,
      };
    }

    const logEntry = createCombatLogEntry(
      "rest",
      character.hp.max - character.hp.current,
      newCurrent,
      `Descanso largo: PG al máximo, ${dicesToRestore} dado(s) de golpe restaurados`
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

    set({ character: updatedChar, magicState: updatedMagicState });
    await setItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
    if (updatedMagicState) {
      await setItem(STORAGE_KEYS.MAGIC_STATE(character.id), updatedMagicState);
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

    if (magicState.pactMagicSlots.used >= magicState.pactMagicSlots.total) return false;

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
      item.id === itemId ? { ...item, ...updates } : item
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
      item.id === itemId ? { ...item, equipado: !item.equipado } : item
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

  addCoinTransaction: async (transaction: Omit<CoinTransaction, "id" | "timestamp">) => {
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
          updatedCoins[coinType] = (updatedCoins[coinType] ?? 0) + (amount ?? 0);
        } else if (transaction.type === "expense") {
          updatedCoins[coinType] = Math.max(0, (updatedCoins[coinType] ?? 0) - (amount ?? 0));
        }
      }
    }

    const updatedInventory: Inventory = {
      ...inventory,
      coins: updatedCoins,
      coinTransactions: [newTransaction, ...inventory.coinTransactions].slice(0, 50),
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
      const notes = await getItem<Note[]>(notesKey) ?? [];
      const customTags = await getItem<NoteTag[]>(STORAGE_KEYS.CUSTOM_TAGS) ?? [];
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
        (i) => i.equipado && i.categoria === "armadura" && i.armorDetails
      );
      const equippedShield = inventory.items.find(
        (i) => i.equipado && i.categoria === "escudo" && i.armorDetails
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
