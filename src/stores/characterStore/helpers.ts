/**
 * Helpers compartidos para los slices del character store.
 * Incluye utilidades de persistencia, creación de log de combate,
 * dados y estado mágico/recursos por defecto.
 */

import { randomUUID } from "expo-crypto";
import type { Character, CombatLogEntry, AbilityKey } from "@/types/character";
import { calcModifier } from "@/types/character";
import { getSpellSlots, getPactMagicSlots } from "@/types/spell";
import { STORAGE_KEYS, setItem } from "@/utils/storage";
import { rollDieRaw } from "@/utils/dice";
import { now } from "@/utils/providers";
import { getClassResourcesForLevel } from "./classResourceStrategies";

// ─── Safe Persistence ────────────────────────────────────────────────

/**
 * Wrapper around `setItem` that catches storage errors so an async action
 * never throws after the optimistic `set()` has already updated the UI.
 * Logs the error for debugging; the in-memory state stays valid for the
 * current session even if persistence fails.
 */
export async function safeSetItem<T>(
  key: string,
  value: T,
  tag = "CharacterStore",
): Promise<void> {
  try {
    await setItem(key, value);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`[${tag}] Error persisting ${key}: ${message}`);
  }
}

// ─── Constants ───────────────────────────────────────────────────────

/** Maximum number of entries in the combat log */
export const COMBAT_LOG_MAX = 100;

/** Represents an unlimited resource (e.g., Barbarian rage at level 20) */
export const UNLIMITED_RESOURCE = 999;

// ─── Types ───────────────────────────────────────────────────────────

export interface SlotInfo {
  total: number;
  used: number;
}

export interface InternalPactSlots {
  slotLevel: number;
  total: number;
  used: number;
}

export interface InternalSorceryPoints {
  max: number;
  current: number;
}

export interface InternalMagicState {
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

// ─── Helper Functions ────────────────────────────────────────────────

/** Creates a combat log entry with auto-generated id and timestamp */
export function createCombatLogEntry(
  type: CombatLogEntry["type"],
  amount: number,
  hpAfter: number,
  description?: string,
): CombatLogEntry {
  return {
    id: randomUUID(),
    timestamp: now(),
    type,
    amount,
    hpAfter,
    description,
  };
}

/** Roll a single die with the given number of sides (delegates to @/utils/dice) */
export const rollDie = rollDieRaw;

/** Convert a hit die string (e.g. "d8") to its number of sides */
export function hitDieSides(die: string): number {
  const map: Record<string, number> = { d6: 6, d8: 8, d10: 10, d12: 12 };
  return map[die] ?? 8;
}

/** Creates the default magic state for a character */
export function createDefaultMagicState(character: Character): InternalMagicState {
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

/** Creates the default class resources based on character class and level */
export function createDefaultClassResources(
  character: Character,
): ClassResourcesState {
  return { resources: getClassResourcesForLevel(character.clase, character.nivel) };
}

/**
 * Updates a character with a patch, sets the timestamp,
 * persists it to storage, and updates the store state.
 * Reduces the ~30 occurrences of duplicated update-and-persist boilerplate.
 */
export async function updateCharacterAndPersist(
  get: () => { character: Character | null },
  set: (state: Partial<{ character: Character }>) => void,
  patch: Partial<Character>,
): Promise<Character | null> {
  const { character } = get();
  if (!character) return null;

  const updatedChar: Character = {
    ...character,
    ...patch,
    actualizadoEn: now(),
  };

  set({ character: updatedChar });
  await safeSetItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);

  return updatedChar;
}
