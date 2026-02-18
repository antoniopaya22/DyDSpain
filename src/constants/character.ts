/**
 * Character-related constants — ability names, skills, alignments, conditions.
 * Extracted from types/character.ts for separation of concerns.
 */
import type { AbilityKey, SkillKey, SkillDefinition, Alignment, Condition } from "@/types/character";

// ─── Ability Names ───────────────────────────────────────────────────

export const ABILITY_NAMES: Record<AbilityKey, string> = {
  fue: "Fuerza",
  des: "Destreza",
  con: "Constitución",
  int: "Inteligencia",
  sab: "Sabiduría",
  car: "Carisma",
};

export const ABILITY_ABBR: Record<AbilityKey, string> = {
  fue: "FUE",
  des: "DES",
  con: "CON",
  int: "INT",
  sab: "SAB",
  car: "CAR",
};

// ─── Skills ──────────────────────────────────────────────────────────

export const SKILLS: Record<SkillKey, SkillDefinition> = {
  acrobacias: { nombre: "Acrobacias", habilidad: "des" },
  atletismo: { nombre: "Atletismo", habilidad: "fue" },
  engano: { nombre: "Engaño", habilidad: "car" },
  historia: { nombre: "Historia", habilidad: "int" },
  interpretacion: { nombre: "Interpretación", habilidad: "car" },
  intimidacion: { nombre: "Intimidación", habilidad: "car" },
  investigacion: { nombre: "Investigación", habilidad: "int" },
  juego_de_manos: { nombre: "Juego de Manos", habilidad: "des" },
  medicina: { nombre: "Medicina", habilidad: "sab" },
  naturaleza: { nombre: "Naturaleza", habilidad: "int" },
  percepcion: { nombre: "Percepción", habilidad: "sab" },
  perspicacia: { nombre: "Perspicacia", habilidad: "sab" },
  persuasion: { nombre: "Persuasión", habilidad: "car" },
  religion: { nombre: "Religión", habilidad: "int" },
  sigilo: { nombre: "Sigilo", habilidad: "des" },
  supervivencia: { nombre: "Supervivencia", habilidad: "sab" },
  trato_con_animales: { nombre: "Trato con Animales", habilidad: "sab" },
  arcanos: { nombre: "Arcanos", habilidad: "int" },
};

// ─── Alignments ──────────────────────────────────────────────────────

export const ALIGNMENT_NAMES: Record<Alignment, string> = {
  legal_bueno: "Legal Bueno",
  neutral_bueno: "Neutral Bueno",
  caotico_bueno: "Caótico Bueno",
  legal_neutral: "Legal Neutral",
  neutral: "Neutral (Auténtico)",
  caotico_neutral: "Caótico Neutral",
  legal_malvado: "Legal Malvado",
  neutral_malvado: "Neutral Malvado",
  caotico_malvado: "Caótico Malvado",
};

// ─── Conditions ──────────────────────────────────────────────────────

export const CONDITION_NAMES: Record<Condition, string> = {
  agarrado: "Agarrado",
  asustado: "Asustado",
  aturdido: "Aturdido",
  cegado: "Cegado",
  derribado: "Derribado",
  encantado: "Encantado",
  ensordecido: "Ensordecido",
  envenenado: "Envenenado",
  hechizado: "Hechizado",
  incapacitado: "Incapacitado",
  inconsciente: "Inconsciente",
  invisible: "Invisible",
  paralizado: "Paralizado",
  petrificado: "Petrificado",
  restringido: "Restringido",
};
