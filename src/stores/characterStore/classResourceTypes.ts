/**
 * Shared types and constants for class resources.
 *
 * Extracted from helpers.ts to break the require cycle between
 * helpers.ts ↔ classResourceStrategies.ts.
 */

/** Represents an unlimited resource (e.g. Barbarian rage at level 20) */
export const UNLIMITED_RESOURCE = 999;

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
