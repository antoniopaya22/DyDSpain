/**
 * Character Store — composed from domain slices.
 *
 * This barrel file replaces the former monolithic characterStore.ts (~2100 lines).
 * Each slice owns one responsibility (combat, magic, progression, etc.) while
 * the store surface stays identical — zero breaking changes for consumers.
 *
 * Slices:
 *   characterCrudSlice   – load / save / clear + computed getters
 *   combatSlice          – HP, hit dice, death saves, conditions, concentration, traits
 *   progressionSlice     – XP, level-up, reset to level 1
 *   magicSlice           – spell slots, pact magic, sorcery points
 *   classResourceSlice   – Ki, rage, second wind, etc.
 *   inventorySlice       – items, coins, transactions
 *   notesSlice           – notes CRUD
 *   restSlice            – short & long rest orchestration
 */

import { create } from "zustand";
import type { CharacterStore } from "./types";

// Slices
import { CRUD_INITIAL_STATE, createCharacterCrudSlice } from "./characterCrudSlice";
import { createCombatSlice } from "./combatSlice";
import { createProgressionSlice } from "./progressionSlice";
import { MAGIC_INITIAL_STATE, createMagicSlice } from "./magicSlice";
import { CLASS_RESOURCE_INITIAL_STATE, createClassResourceSlice } from "./classResourceSlice";
import { INVENTORY_INITIAL_STATE, createInventorySlice } from "./inventorySlice";
import { NOTES_INITIAL_STATE, createNotesSlice } from "./notesSlice";
import { createRestSlice } from "./restSlice";

// ─── Compose the store ───────────────────────────────────────────────

export const useCharacterStore = create<CharacterStore>((set, get) => ({
  // ── Initial State ──
  ...CRUD_INITIAL_STATE,
  ...MAGIC_INITIAL_STATE,
  ...CLASS_RESOURCE_INITIAL_STATE,
  ...INVENTORY_INITIAL_STATE,
  ...NOTES_INITIAL_STATE,

  // ── Actions (spread each slice) ──
  ...createCharacterCrudSlice(set, get),
  ...createCombatSlice(set, get),
  ...createProgressionSlice(set, get),
  ...createMagicSlice(set, get),
  ...createClassResourceSlice(set, get),
  ...createInventorySlice(set, get),
  ...createNotesSlice(set, get),
  ...createRestSlice(set, get),
}));

// ─── Re-exports (preserve public API) ────────────────────────────────

export type {
  CharacterStore,
  LevelUpOptions,
  SubclassFeatureChoiceResult,
} from "./types";

export type {
  ClassResourceInfo,
  ClassResourcesState,
} from "./helpers";
