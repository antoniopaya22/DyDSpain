/**
 * Rasgos detallados de subclase por nivel para D&D 5e SRD en español.
 * Incluye elecciones que el jugador debe realizar al obtener ciertos rasgos.
 *
 * Datos divididos por clase para mejor mantenibilidad.
 */

import type { ClassId } from "@/types/character";
import type {
  SubclassFeatureData,
  SubclassLevelBlock,
  SubclassFeatureChoice,
} from "./types";

// Re-export types
export type {
  SubclassChoiceOption,
  SubclassFeatureChoice,
  SubclassFeatureDetail,
  SubclassLevelBlock,
  SubclassFeatureData,
} from "./types";

// ─── Data imports ────────────────────────────────────────────────────

import { BARDO_SUBCLASS_FEATURES } from "./bardo";
import { BARBARO_SUBCLASS_FEATURES } from "./barbaro";
import { GUERRERO_SUBCLASS_FEATURES } from "./guerrero";
import { EXPLORADOR_SUBCLASS_FEATURES } from "./explorador";
import { PICARO_SUBCLASS_FEATURES } from "./picaro";
import { MONJE_SUBCLASS_FEATURES } from "./monje";
import { CLERIGO_SUBCLASS_FEATURES } from "./clerigo";
import { MAGO_SUBCLASS_FEATURES } from "./mago";
import { DRUIDA_SUBCLASS_FEATURES } from "./druida";
import { PALADIN_SUBCLASS_FEATURES } from "./paladin";
import { HECHICERO_SUBCLASS_FEATURES } from "./hechicero";
import { BRUJO_SUBCLASS_FEATURES } from "./brujo";

// ─── Combined data ──────────────────────────────────────────────────

export const SUBCLASS_FEATURES: SubclassFeatureData[] = [
  ...BARDO_SUBCLASS_FEATURES,
  ...BARBARO_SUBCLASS_FEATURES,
  ...GUERRERO_SUBCLASS_FEATURES,
  ...EXPLORADOR_SUBCLASS_FEATURES,
  ...PICARO_SUBCLASS_FEATURES,
  ...MONJE_SUBCLASS_FEATURES,
  ...CLERIGO_SUBCLASS_FEATURES,
  ...MAGO_SUBCLASS_FEATURES,
  ...DRUIDA_SUBCLASS_FEATURES,
  ...PALADIN_SUBCLASS_FEATURES,
  ...HECHICERO_SUBCLASS_FEATURES,
  ...BRUJO_SUBCLASS_FEATURES,
];

// ─── Utilidades ──────────────────────────────────────────────────────

/**
 * Obtiene los datos de rasgos de una subclase concreta.
 */
export function getSubclassFeatures(
  claseId: ClassId,
  subclaseId: string,
): SubclassFeatureData | null {
  return (
    SUBCLASS_FEATURES.find(
      (sf) => sf.claseId === claseId && sf.subclaseId === subclaseId,
    ) ?? null
  );
}

/**
 * Obtiene los rasgos de una subclase para un nivel concreto.
 */
export function getSubclassFeaturesForLevel(
  claseId: ClassId,
  subclaseId: string,
  nivel: number,
): SubclassLevelBlock | null {
  const data = getSubclassFeatures(claseId, subclaseId);
  if (!data) return null;
  return data.niveles.find((n) => n.nivel === nivel) ?? null;
}

/**
 * Obtiene todos los rasgos de subclase hasta un nivel dado (inclusivo).
 */
export function getSubclassFeaturesUpToLevel(
  claseId: ClassId,
  subclaseId: string,
  nivel: number,
): SubclassLevelBlock[] {
  const data = getSubclassFeatures(claseId, subclaseId);
  if (!data) return [];
  return data.niveles.filter((n) => n.nivel <= nivel);
}

/**
 * Recoge todas las elecciones pendientes para un nivel de subclase.
 * Devuelve un array plano de SubclassFeatureChoice.
 */
export function getSubclassChoicesForLevel(
  claseId: ClassId,
  subclaseId: string,
  nivel: number,
): SubclassFeatureChoice[] {
  const block = getSubclassFeaturesForLevel(claseId, subclaseId, nivel);
  if (!block) return [];
  const choices: SubclassFeatureChoice[] = [];
  for (const rasgo of block.rasgos) {
    if (rasgo.elecciones) {
      choices.push(...rasgo.elecciones);
    }
  }
  return choices;
}
