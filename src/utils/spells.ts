/**
 * Spell utility functions — slot calculations, formatting helpers.
 * Extracted from types/spell.ts for separation of concerns.
 */
import type {
  ClassId,
} from "@/types/character";
import type {
  SpellComponents,
  SpellDuration,
  CastingTime,
  SpellRange,
  PactMagicSlots,
} from "@/types/spell";
import {
  CLASS_CASTER_TYPE,
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  WARLOCK_PACT_SLOTS,
} from "@/constants/spells";

// ─── Cálculos ────────────────────────────────────────────────────────

/**
 * Calcula el número de hechizos preparados para clases que preparan.
 */
export function calcPreparedSpells(
  classId: ClassId,
  classLevel: number,
  abilityModifier: number
): number {
  switch (classId) {
    case "clerigo":
    case "druida":
      return Math.max(1, classLevel + abilityModifier);
    case "mago":
      return Math.max(1, classLevel + abilityModifier);
    case "paladin":
      return Math.max(1, Math.floor(classLevel / 2) + abilityModifier);
    default:
      return 0;
  }
}

/**
 * Calcula la CD de salvación de conjuros.
 * CD = 8 + bonificador de competencia + modificador de característica de lanzamiento
 */
export function calcSpellSaveDC(
  proficiencyBonus: number,
  abilityModifier: number
): number {
  return 8 + proficiencyBonus + abilityModifier;
}

/**
 * Calcula el bonificador de ataque con conjuros.
 */
export function calcSpellAttackBonus(
  proficiencyBonus: number,
  abilityModifier: number
): number {
  return proficiencyBonus + abilityModifier;
}

/**
 * Obtiene los espacios de hechizo para una clase y nivel dados.
 */
export function getSpellSlots(
  classId: ClassId,
  classLevel: number
): Record<number, number> {
  const casterType = CLASS_CASTER_TYPE[classId];
  const slots: Record<number, number> = {};

  if (casterType === "none") return slots;

  if (casterType === "pact") {
    const pactData = WARLOCK_PACT_SLOTS[classLevel];
    if (pactData) {
      // El Brujo tiene un sistema especial, se maneja con PactMagicSlots
      // Aquí retornamos vacío; los slots de pacto se gestionan por separado
    }
    return slots;
  }

  const table = casterType === "full" ? FULL_CASTER_SLOTS : HALF_CASTER_SLOTS;
  const levelSlots = table[classLevel];

  if (levelSlots) {
    levelSlots.forEach((count, index) => {
      if (count > 0) {
        slots[index + 1] = count;
      }
    });
  }

  return slots;
}

/**
 * Obtiene los espacios de pacto del Brujo para un nivel dado.
 */
export function getPactMagicSlots(
  classLevel: number
): PactMagicSlots | null {
  const data = WARLOCK_PACT_SLOTS[classLevel];
  if (!data) return null;

  return {
    total: data[0],
    slotLevel: data[1],
    used: 0,
  };
}

// ─── Formateo ────────────────────────────────────────────────────────

/**
 * Formatea los componentes del hechizo para mostrar.
 * Ejemplo: "V, S, M (un trozo de pelo de gato)"
 */
export function formatSpellComponents(components: SpellComponents): string {
  const parts: string[] = [];
  if (components.verbal) parts.push("V");
  if (components.somatic) parts.push("S");
  if (components.material) {
    if (components.materialDescription) {
      parts.push(`M (${components.materialDescription})`);
    } else {
      parts.push("M");
    }
  }
  return parts.join(", ");
}

/**
 * Formatea la duración del hechizo para mostrar.
 */
export function formatSpellDuration(duration: SpellDuration): string {
  const prefix = duration.concentration ? "Concentración, " : "";

  switch (duration.unit) {
    case "instantaneo":
      return "Instantáneo";
    case "hasta_disipar":
      return `${prefix}hasta disipar`;
    case "permanente":
      return "Permanente";
    case "especial":
      return `${prefix}Especial`;
    case "ronda":
      return `${prefix}1 ronda`;
    case "rondas":
      return `${prefix}${duration.amount} rondas`;
    case "minuto":
      return `${prefix}1 minuto`;
    case "minutos":
      return `${prefix}${duration.amount} minutos`;
    case "hora":
      return `${prefix}1 hora`;
    case "horas":
      return `${prefix}${duration.amount} horas`;
    case "dia":
      return `${prefix}1 día`;
    case "dias":
      return `${prefix}${duration.amount} días`;
    default:
      return `${prefix}${duration.amount ?? ""} ${duration.unit}`;
  }
}

/**
 * Formatea el tiempo de lanzamiento del hechizo.
 */
export function formatCastingTime(castingTime: CastingTime): string {
  switch (castingTime.unit) {
    case "accion":
      return "1 acción";
    case "accion_adicional":
      return "1 acción adicional";
    case "reaccion":
      return castingTime.reactionTrigger
        ? `1 reacción, ${castingTime.reactionTrigger}`
        : "1 reacción";
    case "minuto":
      return "1 minuto";
    case "minutos":
      return `${castingTime.amount} minutos`;
    case "hora":
      return "1 hora";
    case "horas":
      return `${castingTime.amount} horas`;
    default:
      return `${castingTime.amount} ${castingTime.unit}`;
  }
}

/**
 * Formatea el alcance del hechizo.
 */
export function formatSpellRange(range: SpellRange): string {
  switch (range.type) {
    case "personal":
      if (range.area) {
        return `Personal (${range.area.shape} de ${range.area.size} pies)`;
      }
      return "Personal";
    case "toque":
      return "Toque";
    case "distancia":
      return `${range.distance} pies`;
    case "vision":
      return "Visión";
    case "ilimitado":
      return "Ilimitado";
    case "especial":
      return "Especial";
    default:
      return String(range.type);
  }
}
