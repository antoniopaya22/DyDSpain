/**
 * Strategy pattern for class-specific resources.
 * Each class has a factory function that returns its resources for a given level.
 * New classes can be supported by adding entries to CLASS_RESOURCE_REGISTRY.
 */

import { UNLIMITED_RESOURCE, type ClassResourceInfo } from "./classResourceTypes";
import { RAGE_USES } from "@/data/srd/leveling";

type ClassResourceFactory = (level: number) => Record<string, ClassResourceInfo>;

// ─── Individual class strategies ─────────────────────────────────────

function barbaroResources(level: number): Record<string, ClassResourceInfo> {
  const rageMax = RAGE_USES[level] ?? 2;
  return {
    furia: {
      id: "furia",
      nombre: "Furia",
      max: rageMax === "ilimitado" ? UNLIMITED_RESOURCE : (rageMax as number),
      current: rageMax === "ilimitado" ? UNLIMITED_RESOURCE : (rageMax as number),
      recovery: "long_rest",
    },
  };
}

function guerreroResources(level: number): Record<string, ClassResourceInfo> {
  const resources: Record<string, ClassResourceInfo> = {
    tomar_aliento: {
      id: "tomar_aliento",
      nombre: "Tomar Aliento",
      max: 1,
      current: 1,
      recovery: "short_rest",
    },
  };
  if (level >= 2) {
    const oleadaMax = level >= 17 ? 2 : 1;
    resources.oleada_accion = {
      id: "oleada_accion",
      nombre: "Oleada de Acción",
      max: oleadaMax,
      current: oleadaMax,
      recovery: "short_rest",
    };
  }
  if (level >= 9) {
    const indomableMax = level >= 17 ? 3 : level >= 13 ? 2 : 1;
    resources.indomable = {
      id: "indomable",
      nombre: "Indomable",
      max: indomableMax,
      current: indomableMax,
      recovery: "long_rest",
    };
  }
  return resources;
}

function monjeResources(level: number): Record<string, ClassResourceInfo> {
  if (level < 2) return {};
  return {
    ki: {
      id: "ki",
      nombre: "Puntos de Ki",
      max: level,
      current: level,
      recovery: "short_rest",
    },
  };
}

function picaroResources(level: number): Record<string, ClassResourceInfo> {
  if (level < 20) return {};
  return {
    golpe_de_suerte: {
      id: "golpe_de_suerte",
      nombre: "Golpe de Suerte",
      max: 1,
      current: 1,
      recovery: "short_rest",
    },
  };
}

// ─── Registry ────────────────────────────────────────────────────────

/** Registry mapping class names to their resource factory functions */
const CLASS_RESOURCE_REGISTRY: Record<string, ClassResourceFactory> = {
  barbaro: barbaroResources,
  guerrero: guerreroResources,
  monje: monjeResources,
  picaro: picaroResources,
};

/**
 * Returns the class-specific resources for a given class and level.
 * Uses a strategy/registry pattern — add new entries to CLASS_RESOURCE_REGISTRY
 * to support additional classes.
 */
export function getClassResourcesForLevel(
  clase: string,
  level: number,
): Record<string, ClassResourceInfo> {
  const factory = CLASS_RESOURCE_REGISTRY[clase];
  return factory ? factory(level) : {};
}
