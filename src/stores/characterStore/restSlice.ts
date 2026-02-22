/**
 * Rest Slice — short rest & long rest orchestration.
 * Rests touch combat, magic, and class resources simultaneously.
 */

import type {
  Character,
  DeathSaves,
} from "@/types/character";
import { STORAGE_KEYS } from "@/utils/storage";
import { now } from "@/utils/providers";
import {
  rollDie,
  hitDieSides,
  safeSetItem,
  type InternalMagicState,
  type SlotInfo,
  type ClassResourceInfo,
} from "./helpers";
import type { CharacterStore, RestActions } from "./types";

type SetState = (partial: Partial<CharacterStore>) => void;
type GetState = () => CharacterStore;

export function createRestSlice(
  set: SetState,
  get: GetState,
): RestActions {
  return {
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

      // Restore short rest traits
      const updatedTraits = character.traits.map((t) => {
        if (t.recharge === "short_rest" && t.maxUses !== null) {
          return { ...t, currentUses: t.maxUses };
        }
        return t;
      });

      // Restore warlock pact slots
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

      // Restore short_rest class resources
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
        actualizadoEn: now(),
      };

      set({
        character: updatedChar,
        magicState: updatedMagicState,
        classResources: updatedClassResources,
      });
      await safeSetItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
      if (updatedMagicState) {
        await safeSetItem(
          STORAGE_KEYS.MAGIC_STATE(character.id),
          updatedMagicState,
        );
      }
      if (updatedClassResources) {
        await safeSetItem(
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
      const dicesToRestore = Math.max(
        1,
        Math.floor(character.hitDice.total / 2),
      );
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

      const updatedChar: Character = {
        ...character,
        hp: { ...character.hp, current: newCurrent, temp: 0 },
        hitDice: { ...character.hitDice, remaining: newRemaining },
        deathSaves: newDeathSaves,
        conditions: [],
        concentration: null,
        traits: updatedTraits,
        actualizadoEn: now(),
      };

      set({
        character: updatedChar,
        magicState: updatedMagicState,
        classResources: updatedClassResources,
      });
      await safeSetItem(STORAGE_KEYS.CHARACTER(character.id), updatedChar);
      if (updatedMagicState) {
        await safeSetItem(
          STORAGE_KEYS.MAGIC_STATE(character.id),
          updatedMagicState,
        );
      }
      if (updatedClassResources) {
        await safeSetItem(
          STORAGE_KEYS.CLASS_RESOURCES(character.id),
          updatedClassResources,
        );
      }
    },
  };
}
