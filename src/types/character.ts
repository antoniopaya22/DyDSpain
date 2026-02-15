/**
 * Tipos para personajes de D&D 5e en español
 * Cubre: HU-02 (Creación), HU-03 (Hoja), HU-04 (Estadísticas), HU-08 (Vida/Combate)
 */

// ─── Enums y tipos base ──────────────────────────────────────────────

export type AbilityKey = "fue" | "des" | "con" | "int" | "sab" | "car";

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

export type SkillKey =
  | "acrobacias"
  | "atletismo"
  | "engano"
  | "historia"
  | "interpretacion"
  | "intimidacion"
  | "investigacion"
  | "juego_de_manos"
  | "medicina"
  | "naturaleza"
  | "percepcion"
  | "perspicacia"
  | "persuasion"
  | "religion"
  | "sigilo"
  | "supervivencia"
  | "trato_con_animales"
  | "arcanos";

export interface SkillDefinition {
  nombre: string;
  habilidad: AbilityKey;
}

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

export type Alignment =
  | "legal_bueno"
  | "neutral_bueno"
  | "caotico_bueno"
  | "legal_neutral"
  | "neutral"
  | "caotico_neutral"
  | "legal_malvado"
  | "neutral_malvado"
  | "caotico_malvado";

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

export type Size = "pequeno" | "mediano" | "grande";

export type HitDie = "d6" | "d8" | "d10" | "d12";

export type ProficiencyLevel = "none" | "proficient" | "expertise";

export type AbilityScoreMethod =
  | "standard_array"
  | "point_buy"
  | "dice_roll"
  | "manual";

export type DamageType =
  | "acido"
  | "contundente"
  | "cortante"
  | "frio"
  | "fuego"
  | "fuerza"
  | "necrotico"
  | "perforante"
  | "psiquico"
  | "radiante"
  | "relampago"
  | "trueno"
  | "veneno";

export type Condition =
  | "agarrado"
  | "asustado"
  | "aturdido"
  | "cegado"
  | "derribado"
  | "encantado"
  | "ensordecido"
  | "envenenado"
  | "hechizado"
  | "incapacitado"
  | "inconsciente"
  | "invisible"
  | "paralizado"
  | "petrificado"
  | "restringido";

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

// ─── Razas ───────────────────────────────────────────────────────────

export type RaceId =
  | "enano"
  | "elfo"
  | "mediano"
  | "humano"
  | "draconido"
  | "gnomo"
  | "semielfo"
  | "semiorco"
  | "tiefling";

export type SubraceId =
  | "enano_colinas"
  | "enano_montanas"
  | "alto_elfo"
  | "elfo_bosque"
  | "elfo_oscuro"
  | "mediano_piesligeros"
  | "mediano_fornido"
  | "gnomo_bosque"
  | "gnomo_rocas"
  | null;

// ─── Clases ──────────────────────────────────────────────────────────

export type ClassId =
  | "barbaro"
  | "bardo"
  | "brujo"
  | "clerigo"
  | "druida"
  | "explorador"
  | "guerrero"
  | "hechicero"
  | "mago"
  | "monje"
  | "paladin"
  | "picaro";

export type SubclassId = string;

// ─── Trasfondos ──────────────────────────────────────────────────────

export type BackgroundId =
  | "acolito"
  | "charlatan"
  | "criminal"
  | "artista"
  | "heroe_del_pueblo"
  | "artesano_gremial"
  | "ermitano"
  | "noble"
  | "forastero"
  | "sabio"
  | "marinero"
  | "soldado"
  | "huerfano";

// ─── Puntuaciones de característica ──────────────────────────────────

export interface AbilityScores {
  fue: number;
  des: number;
  con: number;
  int: number;
  sab: number;
  car: number;
}

export interface AbilityScoreDetail {
  base: number;
  racial: number;
  improvement: number;
  misc: number;
  override: number | null;
  total: number;
  modifier: number;
}

export type AbilityScoresDetailed = Record<AbilityKey, AbilityScoreDetail>;

// ─── Habilidades (Skills) ────────────────────────────────────────────

export interface SkillProficiency {
  level: ProficiencyLevel;
  /** Origen de la competencia: 'clase', 'raza', 'trasfondo', 'dote', 'manual' */
  source?: string;
}

export type SkillProficiencies = Record<SkillKey, SkillProficiency>;

// ─── Tiradas de salvación ────────────────────────────────────────────

export interface SavingThrowProficiency {
  proficient: boolean;
  /** Origen de la competencia */
  source?: string;
}

export type SavingThrowProficiencies = Record<AbilityKey, SavingThrowProficiency>;

// ─── Puntos de golpe / Vida ──────────────────────────────────────────

export interface HitPoints {
  /** PG máximos */
  max: number;
  /** PG actuales */
  current: number;
  /** PG temporales */
  temp: number;
}

export interface HitDicePool {
  /** Tipo de dado de golpe */
  die: HitDie;
  /** Dados totales (= nivel) */
  total: number;
  /** Dados disponibles (no gastados) */
  remaining: number;
}

export interface DeathSaves {
  successes: number;
  failures: number;
}

// ─── Combate ─────────────────────────────────────────────────────────

export interface ArmorClassDetail {
  /** CA total */
  total: number;
  /** CA base (armadura o 10) */
  base: number;
  /** Bonus de destreza aplicado */
  dexBonus: number;
  /** Bonus de escudo */
  shieldBonus: number;
  /** Otros bonificadores */
  miscBonus: number;
  /** Descripción del cálculo */
  breakdown: string;
}

export interface SpeedInfo {
  /** Velocidad base en pies */
  walk: number;
  /** Velocidad de nado */
  swim?: number;
  /** Velocidad de trepar */
  climb?: number;
  /** Velocidad de vuelo */
  fly?: number;
}

export interface DamageModifier {
  type: DamageType;
  modifier: "resistance" | "immunity" | "vulnerability";
  source: string;
}

export interface ActiveCondition {
  condition: Condition;
  note?: string;
}

// ─── Competencias generales ──────────────────────────────────────────

export interface Proficiencies {
  armors: string[];
  weapons: string[];
  tools: string[];
  languages: string[];
}

// ─── Rasgos y capacidades ────────────────────────────────────────────

export interface Trait {
  id: string;
  nombre: string;
  descripcion: string;
  origen: "raza" | "clase" | "subclase" | "trasfondo" | "dote" | "manual";
  /** Usos máximos por descanso (null = ilimitado / pasivo) */
  maxUses: number | null;
  /** Usos restantes */
  currentUses: number | null;
  /** Tipo de recarga */
  recharge: "short_rest" | "long_rest" | "dawn" | null;
}

// ─── Personalidad ────────────────────────────────────────────────────

export interface Personality {
  traits: string[];
  ideals: string;
  bonds: string;
  flaws: string;
  backstory?: string;
}

// ─── Apariencia ──────────────────────────────────────────────────────

export interface Appearance {
  age?: string;
  height?: string;
  weight?: string;
  eyeColor?: string;
  hairColor?: string;
  skinColor?: string;
  description?: string;
  avatarUri?: string;
}

// ─── Historial de nivel ──────────────────────────────────────────────

export interface LevelUpRecord {
  level: number;
  /** Fecha de la subida de nivel */
  date: string;
  /** PG ganados en este nivel */
  hpGained: number;
  /** Método usado para PG: 'roll' o 'fixed' */
  hpMethod: "roll" | "fixed";
  /** Mejoras de característica aplicadas */
  abilityImprovements?: Partial<AbilityScores>;
  /** Subclase elegida (si fue en este nivel) */
  subclassChosen?: SubclassId;
  /** Hechizos aprendidos */
  spellsLearned?: string[];
  /** Hechizos intercambiados: [viejo, nuevo] */
  spellsSwapped?: [string, string][];
  /** Rasgos de clase obtenidos */
  traitsGained?: string[];
}

// ─── Historial de combate ────────────────────────────────────────────

export interface CombatLogEntry {
  id: string;
  timestamp: string;
  type: "damage" | "healing" | "temp_hp" | "hit_dice" | "death_save" | "rest";
  amount: number;
  hpAfter: number;
  description?: string;
}

// ─── Concentración en hechizo ────────────────────────────────────────

export interface ConcentrationState {
  spellId: string;
  spellName: string;
  startedAt: string;
}

// ─── Personaje completo ──────────────────────────────────────────────

export interface Character {
  /** UUID del personaje */
  id: string;
  /** UUID de la partida asociada */
  campaignId: string;

  // ── Información básica ──
  nombre: string;
  raza: RaceId;
  subraza: SubraceId;
  clase: ClassId;
  subclase: SubclassId | null;
  nivel: number;
  experiencia: number;
  trasfondo: BackgroundId;
  alineamiento: Alignment;

  // ── Estadísticas (HU-04) ──
  abilityScores: AbilityScoresDetailed;
  skillProficiencies: SkillProficiencies;
  savingThrows: SavingThrowProficiencies;

  // ── Vida y combate (HU-08) ──
  hp: HitPoints;
  hitDice: HitDicePool;
  deathSaves: DeathSaves;
  speed: SpeedInfo;
  damageModifiers: DamageModifier[];
  conditions: ActiveCondition[];
  concentration: ConcentrationState | null;
  combatLog: CombatLogEntry[];

  // ── Competencias ──
  proficiencies: Proficiencies;
  proficiencyBonus: number;

  // ── Rasgos ──
  traits: Trait[];

  // ── Personalidad y apariencia ──
  personality: Personality;
  appearance: Appearance;

  // ── Progresión ──
  levelHistory: LevelUpRecord[];

  // ── Hechizos (IDs, detalle en spell.ts) ──
  knownSpellIds: string[];
  preparedSpellIds: string[];
  /** Libro de hechizos del Mago */
  spellbookIds: string[];

  // ── Inventario (IDs, detalle en item.ts) ──
  /** Referencia al inventario, gestionado aparte */
  inventoryId: string;

  // ── Meta ──
  creadoEn: string;
  actualizadoEn: string;
}

// ─── Estado parcial para el wizard de creación (HU-02) ───────────────

export interface CharacterCreationDraft {
  /** Paso actual del wizard (1-11) */
  currentStep: number;
  /** UUID de la partida donde se está creando */
  campaignId: string;

  // Pasos completados
  nombre?: string;
  raza?: RaceId;
  subraza?: SubraceId;
  clase?: ClassId;
  abilityScoreMethod?: AbilityScoreMethod;
  abilityScoresBase?: AbilityScores;
  trasfondo?: BackgroundId;
  skillChoices?: SkillKey[];
  spellChoices?: {
    cantrips: string[];
    spells: string[];
    spellbook?: string[];
  };
  equipmentChoices?: Record<string, string>;
  personality?: Personality;
  alineamiento?: Alignment;
  appearance?: Appearance;
  /** Bonificadores de característica libres elegidos (ej: semielfo elige 2 × +1) */
  freeAbilityBonuses?: AbilityKey[];

  /** Timestamp para recuperar borradores */
  lastSaved: string;
}

// ─── Funciones utilitarias de tipo ───────────────────────────────────

/** Calcula el modificador a partir de una puntuación de característica */
export function calcModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

/** Calcula el bonificador de competencia según el nivel */
export function calcProficiencyBonus(level: number): number {
  return Math.floor((level - 1) / 4) + 2;
}

/** Valor numérico del dado de golpe */
export function hitDieValue(die: HitDie): number {
  const values: Record<HitDie, number> = {
    d6: 6,
    d8: 8,
    d10: 10,
    d12: 12,
  };
  return values[die];
}

/** Valor fijo (promedio redondeado arriba) del dado de golpe para subir de nivel */
export function hitDieFixedValue(die: HitDie): number {
  return hitDieValue(die) / 2 + 1;
}

/** Formatea un modificador con signo (+/-) */
export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}
