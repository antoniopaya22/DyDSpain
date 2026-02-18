/**
 * Class Resources Slice — Ki, Rage, Second Wind, Action Surge, etc.
 * Handles class-specific resource management for the character store.
 */

import { STORAGE_KEYS } from "@/utils/storage";
import type { CharacterStore, ClassResourceSliceState, ClassResourceActions } from "./types";
import type { ClassResourceInfo, ClassResourcesState } from "./helpers";
import { safeSetItem } from "./helpers";

type SetState = (partial: Partial<CharacterStore>) => void;
type GetState = () => CharacterStore;

export const CLASS_RESOURCE_INITIAL_STATE: ClassResourceSliceState = {
  classResources: null,
};

export function createClassResourceSlice(
  set: SetState,
  get: GetState,
): ClassResourceActions {
  return {
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
      await safeSetItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
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
      await safeSetItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
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
      await safeSetItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
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
      await safeSetItem(STORAGE_KEYS.CLASS_RESOURCES(character.id), updatedResources);
    },

    getClassResources: () => {
      return get().classResources;
    },
  };
}
