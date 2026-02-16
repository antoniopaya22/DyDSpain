/**
 * Tipos para el sistema de hechizos de D&D 5e en español (HU-06)
 */

import type { ClassId, AbilityKey } from "./character";

// ─── Escuelas de magia ───────────────────────────────────────────────

export type MagicSchool =
  | "abjuracion"
  | "conjuracion"
  | "adivinacion"
  | "encantamiento"
  | "evocacion"
  | "ilusion"
  | "nigromancia"
  | "transmutacion";

export const MAGIC_SCHOOL_NAMES: Record<MagicSchool, string> = {
  abjuracion: "Abjuración",
  conjuracion: "Conjuración",
  adivinacion: "Adivinación",
  encantamiento: "Encantamiento",
  evocacion: "Evocación",
  ilusion: "Ilusión",
  nigromancia: "Nigromancia",
  transmutacion: "Transmutación",
};

export const MAGIC_SCHOOL_ICONS: Record<MagicSchool, string> = {
  abjuracion: "🛡️",
  conjuracion: "✨",
  adivinacion: "👁️",
  encantamiento: "💫",
  evocacion: "🔥",
  ilusion: "🌀",
  nigromancia: "💀",
  transmutacion: "🔄",
};

// ─── Niveles de hechizo ──────────────────────────────────────────────

/**
 * Nivel de hechizo: 0 = truco, 1-9 = niveles de hechizo
 */
export type SpellLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

export const SPELL_LEVEL_NAMES: Record<SpellLevel, string> = {
  0: "Truco",
  1: "1er nivel",
  2: "2º nivel",
  3: "3er nivel",
  4: "4º nivel",
  5: "5º nivel",
  6: "6º nivel",
  7: "7º nivel",
  8: "8º nivel",
  9: "9º nivel",
};

// ─── Componentes de hechizo ──────────────────────────────────────────

export interface SpellComponents {
  verbal: boolean;
  somatic: boolean;
  material: boolean;
  /** Descripción del componente material, si aplica */
  materialDescription?: string;
  /** Si el componente material tiene coste en oro */
  materialCost?: number;
  /** Si el componente material se consume al lanzar */
  materialConsumed?: boolean;
}

// ─── Tiempos de lanzamiento ──────────────────────────────────────────

export type CastingTimeUnit =
  | "accion"
  | "accion_adicional"
  | "reaccion"
  | "minuto"
  | "minutos"
  | "hora"
  | "horas";

export interface CastingTime {
  amount: number;
  unit: CastingTimeUnit;
  /** Condición para la reacción (si aplica) */
  reactionTrigger?: string;
}

// ─── Duración ────────────────────────────────────────────────────────

export type DurationUnit =
  | "instantaneo"
  | "ronda"
  | "rondas"
  | "minuto"
  | "minutos"
  | "hora"
  | "horas"
  | "dia"
  | "dias"
  | "especial"
  | "hasta_disipar"
  | "permanente";

export interface SpellDuration {
  amount: number | null;
  unit: DurationUnit;
  concentration: boolean;
}

// ─── Alcance ─────────────────────────────────────────────────────────

export type RangeType =
  | "personal"
  | "toque"
  | "distancia"
  | "vision"
  | "ilimitado"
  | "especial";

export interface SpellRange {
  type: RangeType;
  /** Distancia en pies (solo si type === 'distancia') */
  distance?: number;
  /** Área de efecto, si aplica */
  area?: SpellArea;
}

export type AreaShape =
  | "esfera"
  | "cubo"
  | "cono"
  | "cilindro"
  | "linea"
  | "hemisferio";

export interface SpellArea {
  shape: AreaShape;
  /** Tamaño en pies (radio para esfera, lado para cubo, etc.) */
  size: number;
}

// ─── Hechizo completo ────────────────────────────────────────────────

export interface Spell {
  /** Identificador único del hechizo */
  id: string;
  /** Nombre del hechizo en español */
  nombre: string;
  /** Nombre original en inglés (referencia) */
  nombreOriginal?: string;
  /** Nivel del hechizo (0 = truco) */
  nivel: SpellLevel;
  /** Escuela de magia */
  escuela: MagicSchool;
  /** Tiempo de lanzamiento */
  tiempoLanzamiento: CastingTime;
  /** Alcance */
  alcance: SpellRange;
  /** Componentes */
  componentes: SpellComponents;
  /** Duración */
  duracion: SpellDuration;
  /** Si requiere concentración (derivado de duracion.concentration) */
  concentracion: boolean;
  /** Si se puede lanzar como ritual */
  ritual: boolean;
  /** Descripción completa del efecto */
  descripcion: string;
  /** Efecto al lanzar a niveles superiores */
  aNivelesSuperiors?: string;
  /** Clases que pueden usar este hechizo */
  clases: ClassId[];
  /** Fuente del hechizo (SRD, manual, homebrew) */
  fuente: string;
  /** Si es un hechizo personalizado/homebrew */
  homebrew: boolean;
}

// ─── Gestión de hechizos del personaje ───────────────────────────────

/**
 * Hechizo en el contexto de un personaje (conocido, preparado, etc.)
 */
export interface CharacterSpell {
  spellId: string;
  /** Si el hechizo está preparado (para clases que preparan) */
  prepared: boolean;
  /** Si está siempre preparado (hechizos de dominio/subclase) */
  alwaysPrepared: boolean;
  /** Si es un hechizo aprendido de forma gratuita (por nivel) */
  freeLearn: boolean;
  /** Fuente: clase, subclase, raza, objeto, etc. */
  source: string;
}

// ─── Espacios de hechizo ─────────────────────────────────────────────

/**
 * Espacios de hechizo por nivel (1-9, no incluye trucos)
 */
export interface SpellSlots {
  /** Espacios totales por nivel */
  total: Record<number, number>;
  /** Espacios usados por nivel */
  used: Record<number, number>;
}

/**
 * Espacios de hechizo de pacto del Brujo (sistema separado)
 */
export interface PactMagicSlots {
  /** Nivel de los espacios de pacto */
  slotLevel: number;
  /** Número total de espacios */
  total: number;
  /** Número de espacios usados */
  used: number;
}

// ─── Tabla de espacios de hechizo por nivel de lanzador ──────────────

/**
 * Tabla de espacios de hechizo para lanzadores completos.
 * Clave = nivel de clase, Valor = array de espacios por nivel de hechizo [1º, 2º, ..., 9º]
 */
export const FULL_CASTER_SLOTS: Record<number, number[]> = {
  1: [2],
  2: [3],
  3: [4, 2],
  4: [4, 3],
  5: [4, 3, 2],
  6: [4, 3, 3],
  7: [4, 3, 3, 1],
  8: [4, 3, 3, 2],
  9: [4, 3, 3, 3, 1],
  10: [4, 3, 3, 3, 2],
  11: [4, 3, 3, 3, 2, 1],
  12: [4, 3, 3, 3, 2, 1],
  13: [4, 3, 3, 3, 2, 1, 1],
  14: [4, 3, 3, 3, 2, 1, 1],
  15: [4, 3, 3, 3, 2, 1, 1, 1],
  16: [4, 3, 3, 3, 2, 1, 1, 1],
  17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
  18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
  19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
  20: [4, 3, 3, 3, 3, 2, 2, 1, 1],
};

/**
 * Tabla de espacios de hechizo para medio lanzadores (Paladín, Explorador).
 * Clave = nivel de clase, Valor = array de espacios por nivel de hechizo [1º, 2º, ..., 5º]
 * Nota: empiezan a lanzar hechizos en el nivel 2.
 */
export const HALF_CASTER_SLOTS: Record<number, number[]> = {
  2: [2],
  3: [3],
  4: [3],
  5: [4, 2],
  6: [4, 2],
  7: [4, 3],
  8: [4, 3],
  9: [4, 3, 2],
  10: [4, 3, 2],
  11: [4, 3, 3],
  12: [4, 3, 3],
  13: [4, 3, 3, 1],
  14: [4, 3, 3, 1],
  15: [4, 3, 3, 2],
  16: [4, 3, 3, 2],
  17: [4, 3, 3, 3, 1],
  18: [4, 3, 3, 3, 1],
  19: [4, 3, 3, 3, 2],
  20: [4, 3, 3, 3, 2],
};

/**
 * Tabla de espacios de pacto del Brujo.
 * Clave = nivel de Brujo, Valor = [número de espacios, nivel de los espacios]
 */
export const WARLOCK_PACT_SLOTS: Record<number, [number, number]> = {
  1: [1, 1],
  2: [2, 1],
  3: [2, 2],
  4: [2, 2],
  5: [2, 3],
  6: [2, 3],
  7: [2, 4],
  8: [2, 4],
  9: [2, 5],
  10: [2, 5],
  11: [3, 5],
  12: [3, 5],
  13: [3, 5],
  14: [3, 5],
  15: [3, 5],
  16: [3, 5],
  17: [4, 5],
  18: [4, 5],
  19: [4, 5],
  20: [4, 5],
};

// ─── Trucos conocidos por clase y nivel ──────────────────────────────

/**
 * Trucos conocidos por nivel de clase.
 * Clave = nivel de clase, Valor = número de trucos conocidos
 */
export const CANTRIPS_KNOWN: Partial<Record<ClassId, Record<number, number>>> = {
  bardo: {
    1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
    11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
  },
  brujo: {
    1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
    11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
  },
  clerigo: {
    1: 3, 2: 3, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5,
    11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
  },
  druida: {
    1: 2, 2: 2, 3: 2, 4: 3, 5: 3, 6: 3, 7: 3, 8: 3, 9: 3, 10: 4,
    11: 4, 12: 4, 13: 4, 14: 4, 15: 4, 16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
  },
  hechicero: {
    1: 4, 2: 4, 3: 4, 4: 5, 5: 5, 6: 5, 7: 5, 8: 5, 9: 5, 10: 6,
    11: 6, 12: 6, 13: 6, 14: 6, 15: 6, 16: 6, 17: 6, 18: 6, 19: 6, 20: 6,
  },
  mago: {
    1: 3, 2: 3, 3: 3, 4: 4, 5: 4, 6: 4, 7: 4, 8: 4, 9: 4, 10: 5,
    11: 5, 12: 5, 13: 5, 14: 5, 15: 5, 16: 5, 17: 5, 18: 5, 19: 5, 20: 5,
  },
};

// ─── Hechizos conocidos por clase y nivel (clases con hechizos fijos) ─

export const SPELLS_KNOWN: Partial<Record<ClassId, Record<number, number>>> = {
  bardo: {
    1: 4, 2: 5, 3: 6, 4: 7, 5: 8, 6: 9, 7: 10, 8: 11, 9: 12, 10: 14,
    11: 15, 12: 15, 13: 16, 14: 18, 15: 19, 16: 19, 17: 20, 18: 22, 19: 22, 20: 22,
  },
  brujo: {
    1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 10,
    11: 11, 12: 11, 13: 12, 14: 12, 15: 13, 16: 13, 17: 14, 18: 14, 19: 15, 20: 15,
  },
  explorador: {
    2: 2, 3: 3, 4: 3, 5: 4, 6: 4, 7: 5, 8: 5, 9: 6, 10: 6,
    11: 7, 12: 7, 13: 8, 14: 8, 15: 9, 16: 9, 17: 10, 18: 10, 19: 11, 20: 11,
  },
  hechicero: {
    1: 2, 2: 3, 3: 4, 4: 5, 5: 6, 6: 7, 7: 8, 8: 9, 9: 10, 10: 11,
    11: 12, 12: 12, 13: 13, 14: 13, 15: 14, 16: 14, 17: 15, 18: 15, 19: 15, 20: 15,
  },
};

// ─── Característica de lanzamiento por clase ─────────────────────────

export const SPELLCASTING_ABILITY: Partial<Record<ClassId, AbilityKey>> = {
  bardo: "car",
  brujo: "car",
  clerigo: "sab",
  druida: "sab",
  explorador: "sab",
  hechicero: "car",
  mago: "int",
  paladin: "car",
};

// ─── Tipo de lanzador ────────────────────────────────────────────────

export type CasterType = "full" | "half" | "pact" | "none";

export const CLASS_CASTER_TYPE: Record<ClassId, CasterType> = {
  barbaro: "none",
  bardo: "full",
  brujo: "pact",
  clerigo: "full",
  druida: "full",
  explorador: "half",
  guerrero: "none",
  hechicero: "full",
  mago: "full",
  monje: "none",
  paladin: "half",
  picaro: "none",
};

// ─── Tipo de preparación de hechizos ─────────────────────────────────

export type SpellPreparationType = "known" | "prepared" | "spellbook" | "none";

export const CLASS_SPELL_PREPARATION: Record<ClassId, SpellPreparationType> = {
  barbaro: "none",
  bardo: "known",
  brujo: "known",
  clerigo: "prepared",
  druida: "prepared",
  explorador: "known",
  guerrero: "none",
  hechicero: "known",
  mago: "spellbook",
  monje: "none",
  paladin: "prepared",
  picaro: "none",
};

// ─── Recursos mágicos especiales ─────────────────────────────────────

/**
 * Puntos de hechicería del Hechicero
 */
export interface SorceryPoints {
  /** Puntos totales (= nivel de Hechicero) */
  total: number;
  /** Puntos restantes */
  remaining: number;
}

export type MetamagicOption =
  | "hechizo_cuidadoso"
  | "hechizo_distante"
  | "hechizo_potenciado"
  | "hechizo_extendido"
  | "hechizo_intensificado"
  | "hechizo_rapido"
  | "hechizo_sutil"
  | "hechizo_duplicado";

export const METAMAGIC_NAMES: Record<MetamagicOption, string> = {
  hechizo_cuidadoso: "Hechizo Cuidadoso",
  hechizo_distante: "Hechizo Distante",
  hechizo_potenciado: "Hechizo Potenciado",
  hechizo_extendido: "Hechizo Extendido",
  hechizo_intensificado: "Hechizo Intensificado",
  hechizo_rapido: "Hechizo Rápido",
  hechizo_sutil: "Hechizo Sutil",
  hechizo_duplicado: "Hechizo Duplicado",
};

export const METAMAGIC_COSTS: Record<MetamagicOption, number> = {
  hechizo_cuidadoso: 1,
  hechizo_distante: 1,
  hechizo_potenciado: 1,
  hechizo_extendido: 1,
  hechizo_intensificado: 3,
  hechizo_rapido: 2,
  hechizo_sutil: 1,
  hechizo_duplicado: 1,
};

export const METAMAGIC_DESCRIPTIONS: Record<MetamagicOption, string> = {
  hechizo_cuidadoso:
    "Al lanzar un conjuro que obliga a tiradas de salvación, protege a tantas criaturas como tu mod. CAR (superan automáticamente la salvación). Coste: 1 PH.",
  hechizo_distante:
    "Duplica el alcance de un conjuro (mín. 1,5 m) o cambia un conjuro de toque a 9 m de alcance. Coste: 1 PH.",
  hechizo_potenciado:
    "Repite hasta mod. CAR dados de daño de un conjuro (mín. 1). Compatible con otra Metamagia. Coste: 1 PH.",
  hechizo_extendido:
    "Duplica la duración de un conjuro (mín. 1 minuto, máx. 24 h). Coste: 1 PH.",
  hechizo_intensificado:
    "Un objetivo del conjuro tiene desventaja en su primera tirada de salvación contra él. Coste: 3 PH.",
  hechizo_rapido:
    "Cambia el tiempo de lanzamiento de 1 acción a 1 acción adicional. Coste: 2 PH.",
  hechizo_sutil:
    "Lanza el conjuro sin componentes somáticos ni verbales. Coste: 1 PH.",
  hechizo_duplicado:
    "Haz objetivo a una segunda criatura con un conjuro de objetivo único. Coste: nivel del conjuro en PH (1 PH para trucos).",
};

export const ALL_METAMAGIC_OPTIONS: MetamagicOption[] = [
  "hechizo_cuidadoso",
  "hechizo_distante",
  "hechizo_potenciado",
  "hechizo_extendido",
  "hechizo_intensificado",
  "hechizo_rapido",
  "hechizo_sutil",
  "hechizo_duplicado",
];

/**
 * Invocaciones sobrenaturales del Brujo
 */
export interface EldritchInvocation {
  id: string;
  nombre: string;
  descripcion: string;
  /** Nivel mínimo de Brujo requerido */
  nivelMinimo?: number;
  /** Requisitos previos (otra invocación, pacto, etc.) */
  requisitos?: string;
}

// ─── Estado mágico completo del personaje ────────────────────────────

export interface CharacterMagicState {
  /** Espacios de hechizo estándar */
  spellSlots: SpellSlots;
  /** Espacios de pacto del Brujo (null si no es Brujo) */
  pactSlots: PactMagicSlots | null;
  /** Hechizos conocidos/aprendidos por el personaje */
  characterSpells: CharacterSpell[];
  /** Libro de hechizos del Mago (null si no es Mago) */
  spellbook: string[] | null;
  /** Estado de concentración actual */
  concentration: {
    active: boolean;
    spellId: string | null;
    spellName: string | null;
  };
  /** Puntos de hechicería del Hechicero (null si no es Hechicero) */
  sorceryPoints: SorceryPoints | null;
  /** Opciones de metamagia elegidas (solo Hechicero) */
  metamagicOptions: MetamagicOption[];
  /** Invocaciones del Brujo (null si no es Brujo) */
  invocations: EldritchInvocation[] | null;
  /** Usos de Canalizar Divinidad (Clérigo/Paladín) */
  channelDivinity: { total: number; remaining: number } | null;
  /** Usos de Forma Salvaje (Druida) */
  wildShape: { total: number; remaining: number } | null;
}

// ─── Utilidades de hechizos ──────────────────────────────────────────

/**
 * Calcula el número de hechizos preparados para clases que preparan.
 * @param classId - Clase del personaje
 * @param classLevel - Nivel en la clase
 * @param abilityModifier - Modificador de la característica de lanzamiento
 * @returns Número máximo de hechizos que se pueden preparar
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
 * Bonificador = bonificador de competencia + modificador de característica de lanzamiento
 */
export function calcSpellAttackBonus(
  proficiencyBonus: number,
  abilityModifier: number
): number {
  return proficiencyBonus + abilityModifier;
}

/**
 * Obtiene los espacios de hechizo para una clase y nivel dados.
 * Retorna un Record donde la clave es el nivel de hechizo (1-9)
 * y el valor es el número de espacios.
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
