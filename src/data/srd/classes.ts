/**
 * Datos SRD de clases de D&D 5e en español.
 * Incluye las 12 clases del SRD con dados de golpe, competencias,
 * tiradas de salvación, habilidades disponibles y lanzamiento de conjuros.
 */

import type {
  ClassId,
  AbilityKey,
  SkillKey,
  HitDie,
} from "@/types/character";
import type { CasterType } from "@/types/spell";

// ─── Tipos de datos de clase ─────────────────────────────────────────

export interface ClassFeature {
  nombre: string;
  descripcion: string;
  nivel: number;
}

export interface EquipmentChoice {
  id: string;
  label: string;
  options: {
    id: string;
    label: string;
    items: string[];
  }[];
}

export interface ClassData {
  id: ClassId;
  nombre: string;
  descripcion: string;
  hitDie: HitDie;
  /** PG a nivel 1 = hitDieMax + mod. Constitución */
  hitDieMax: number;
  /** PG fijos por nivel (promedio redondeado arriba) */
  hitDieFixed: number;

  // ── Competencias ──
  armorProficiencies: string[];
  weaponProficiencies: string[];
  toolProficiencies: string[];
  /** Opciones de herramienta a elegir (ej: bardo elige un instrumento musical) */
  toolChoices?: string[];
  toolChoiceCount?: number;

  // ── Tiradas de salvación ──
  savingThrows: [AbilityKey, AbilityKey];

  // ── Habilidades ──
  /** Pool de habilidades disponibles para elegir */
  skillChoicePool: SkillKey[];
  /** Número de habilidades a elegir */
  skillChoiceCount: number;

  // ── Lanzamiento de conjuros ──
  casterType: CasterType;
  /** Aptitud mágica (null si no lanza conjuros) */
  spellcastingAbility: AbilityKey | null;
  /** Si prepara conjuros (clérigo, druida, paladín, mago) vs conoce (bardo, hechicero, brujo, explorador) */
  preparesSpells: boolean;
  /** Número de trucos conocidos a nivel 1 (0 si no tiene) */
  cantripsAtLevel1: number;
  /** Número de conjuros de nivel 1 conocidos/en libro a nivel 1 */
  spellsAtLevel1: number;

  // ── Equipo inicial (opciones) ──
  equipmentChoices: EquipmentChoice[];
  /** Equipo que siempre se obtiene */
  defaultEquipment: string[];

  // ── Rasgos de clase a nivel 1 ──
  level1Features: ClassFeature[];

  // ── Subclase ──
  subclassLevel: number;
  subclassLabel: string;

  // ── UI ──
  iconName: string;
  color: string;
}

// ─── Datos de clases ─────────────────────────────────────────────────

export const CLASSES: Record<ClassId, ClassData> = {
  // ─── BÁRBARO ───────────────────────────────────────────────────────
  barbaro: {
    id: "barbaro",
    nombre: "Bárbaro",
    descripcion:
      "Un guerrero feroz que recurre a la furia primordial para arrasar a sus enemigos en el campo de batalla.",
    hitDie: "d12",
    hitDieMax: 12,
    hitDieFixed: 7,

    armorProficiencies: [
      "Armaduras ligeras",
      "Armaduras medias",
      "Escudos",
    ],
    weaponProficiencies: ["Armas sencillas", "Armas marciales"],
    toolProficiencies: [],

    savingThrows: ["fue", "con"],

    skillChoicePool: [
      "atletismo",
      "intimidacion",
      "naturaleza",
      "percepcion",
      "supervivencia",
      "trato_con_animales",
    ],
    skillChoiceCount: 2,

    casterType: "none",
    spellcastingAbility: null,
    preparesSpells: false,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma principal",
        options: [
          {
            id: "greataxe",
            label: "Un hacha a dos manos",
            items: ["Hacha a dos manos"],
          },
          {
            id: "martial_melee",
            label: "Cualquier arma cuerpo a cuerpo marcial",
            items: ["Arma marcial cuerpo a cuerpo (a elegir)"],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma secundaria",
        options: [
          {
            id: "handaxes",
            label: "Dos hachas de mano",
            items: ["Hacha de mano", "Hacha de mano"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Paquete de explorador",
      "Jabalina ×4",
    ],

    level1Features: [
      {
        nombre: "Furia",
        descripcion:
          "Puedes usar una acción adicional para enfurecerte. Ganas ventaja en pruebas y salvaciones de FUE, bonificador al daño cuerpo a cuerpo (+2), y resistencia al daño contundente, cortante y perforante. Dura 1 minuto. Usos: 2 (aumentan con el nivel).",
        nivel: 1,
      },
      {
        nombre: "Defensa sin Armadura",
        descripcion:
          "Mientras no lleves armadura, tu CA es 10 + mod. Destreza + mod. Constitución. Puedes usar escudo y mantener este beneficio.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Senda Primordial",
    iconName: "flash-outline",
    color: "#dc2626",
  },

  // ─── BARDO ─────────────────────────────────────────────────────────
  bardo: {
    id: "bardo",
    nombre: "Bardo",
    descripcion:
      "Un maestro de la canción, el habla y la magia que teje su arte en la realidad, inspirando aliados y confundiendo enemigos.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: ["Armaduras ligeras"],
    weaponProficiencies: [
      "Armas sencillas",
      "Ballestas de mano",
      "Espadas cortas",
      "Espadas largas",
      "Estoques",
    ],
    toolProficiencies: [],
    toolChoices: [
      "Laúd",
      "Flauta",
      "Lira",
      "Cuerno",
      "Viola",
      "Tambor",
      "Dulcémele",
      "Gaita",
      "Chirimía",
      "Zanfona",
    ],
    toolChoiceCount: 3,

    savingThrows: ["des", "car"],

    skillChoicePool: [
      "acrobacias",
      "atletismo",
      "engano",
      "historia",
      "interpretacion",
      "intimidacion",
      "investigacion",
      "juego_de_manos",
      "medicina",
      "naturaleza",
      "percepcion",
      "perspicacia",
      "persuasion",
      "religion",
      "sigilo",
      "supervivencia",
      "trato_con_animales",
      "arcanos",
    ],
    skillChoiceCount: 3,

    casterType: "full",
    spellcastingAbility: "car",
    preparesSpells: false,
    cantripsAtLevel1: 2,
    spellsAtLevel1: 4,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma",
        options: [
          {
            id: "rapier",
            label: "Un estoque",
            items: ["Estoque"],
          },
          {
            id: "longsword",
            label: "Una espada larga",
            items: ["Espada larga"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "diplomat",
            label: "Paquete de diplomático",
            items: ["Paquete de diplomático"],
          },
          {
            id: "entertainer",
            label: "Paquete de entretenedor",
            items: ["Paquete de entretenedor"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Armadura de cuero",
      "Daga",
      "Instrumento musical (a elegir)",
    ],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros",
        descripcion:
          "Puedes lanzar conjuros de bardo usando el Carisma como aptitud mágica. Conoces 2 trucos y 4 conjuros de nivel 1.",
        nivel: 1,
      },
      {
        nombre: "Inspiración de Bardo",
        descripcion:
          "Puedes inspirar a otros con tu arte. Un aliado a 18 m que pueda oírte gana un dado de Inspiración de Bardo (d6) que puede sumar a una tirada de ataque, característica o salvación. Usos: mod. Carisma por descanso largo.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Colegio de Bardo",
    iconName: "musical-notes-outline",
    color: "#a855f7",
  },

  // ─── BRUJO ─────────────────────────────────────────────────────────
  brujo: {
    id: "brujo",
    nombre: "Brujo",
    descripcion:
      "Un portador de magia derivada de un pacto con una entidad de otro plano, que usa invocaciones y conjuros alimentados por un poder ajeno.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: ["Armaduras ligeras"],
    weaponProficiencies: ["Armas sencillas"],
    toolProficiencies: [],

    savingThrows: ["sab", "car"],

    skillChoicePool: [
      "arcanos",
      "engano",
      "historia",
      "intimidacion",
      "investigacion",
      "naturaleza",
      "religion",
    ],
    skillChoiceCount: 2,

    casterType: "pact",
    spellcastingAbility: "car",
    preparesSpells: false,
    cantripsAtLevel1: 2,
    spellsAtLevel1: 2,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma principal",
        options: [
          {
            id: "light_crossbow",
            label: "Una ballesta ligera y 20 virotes",
            items: ["Ballesta ligera", "Virotes ×20"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "focus",
        label: "Canalizador",
        options: [
          {
            id: "component_pouch",
            label: "Un saquito de componentes",
            items: ["Saquito de componentes"],
          },
          {
            id: "arcane_focus",
            label: "Un canalizador arcano",
            items: ["Canalizador arcano"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Armadura de cuero",
      "Arma sencilla (a elegir)",
      "Paquete de explorador de mazmorras",
      "Daga ×2",
    ],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros (Magia de Pacto)",
        descripcion:
          "Puedes lanzar conjuros de brujo usando el Carisma como aptitud mágica. Conoces 2 trucos y 2 conjuros de nivel 1. Tus espacios de conjuro se recuperan tras un descanso corto o largo.",
        nivel: 1,
      },
      {
        nombre: "Patrón de Otro Mundo",
        descripcion:
          "Has establecido un pacto con un ser de otro plano. A nivel 1 tu patrón te otorga rasgos especiales. Elige tu patrón al crear el personaje.",
        nivel: 1,
      },
    ],

    subclassLevel: 1,
    subclassLabel: "Patrón de Otro Mundo",
    iconName: "eye-outline",
    color: "#7c3aed",
  },

  // ─── CLÉRIGO ───────────────────────────────────────────────────────
  clerigo: {
    id: "clerigo",
    nombre: "Clérigo",
    descripcion:
      "Un canalizador del poder divino que emplea la fe y la devoción a su deidad para curar, proteger y castigar a los enemigos de su dios.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: [
      "Armaduras ligeras",
      "Armaduras medias",
      "Escudos",
    ],
    weaponProficiencies: ["Armas sencillas"],
    toolProficiencies: [],

    savingThrows: ["sab", "car"],

    skillChoicePool: [
      "historia",
      "medicina",
      "perspicacia",
      "persuasion",
      "religion",
    ],
    skillChoiceCount: 2,

    casterType: "full",
    spellcastingAbility: "sab",
    preparesSpells: true,
    cantripsAtLevel1: 3,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma",
        options: [
          {
            id: "mace",
            label: "Una maza",
            items: ["Maza"],
          },
          {
            id: "warhammer",
            label: "Un martillo de guerra (si eres competente)",
            items: ["Martillo de guerra"],
          },
        ],
      },
      {
        id: "armor",
        label: "Armadura",
        options: [
          {
            id: "scale_mail",
            label: "Una cota de escamas",
            items: ["Cota de escamas"],
          },
          {
            id: "leather",
            label: "Una armadura de cuero",
            items: ["Armadura de cuero"],
          },
          {
            id: "chain_mail",
            label: "Una cota de malla (si eres competente)",
            items: ["Cota de malla"],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma secundaria",
        options: [
          {
            id: "light_crossbow",
            label: "Una ballesta ligera y 20 virotes",
            items: ["Ballesta ligera", "Virotes ×20"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "priest",
            label: "Paquete de sacerdote",
            items: ["Paquete de sacerdote"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: ["Escudo", "Símbolo sagrado"],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros",
        descripcion:
          "Puedes lanzar conjuros de clérigo usando la Sabiduría como aptitud mágica. Conoces 3 trucos. Preparas conjuros: nivel de clérigo + mod. Sabiduría.",
        nivel: 1,
      },
      {
        nombre: "Dominio Divino",
        descripcion:
          "Elige un dominio relacionado con tu deidad: Conocimiento, Guerra, Luz, Naturaleza, Tempestad, Engaño o Vida. Tu dominio te otorga conjuros adicionales y rasgos especiales.",
        nivel: 1,
      },
    ],

    subclassLevel: 1,
    subclassLabel: "Dominio Divino",
    iconName: "medkit-outline",
    color: "#f59e0b",
  },

  // ─── DRUIDA ────────────────────────────────────────────────────────
  druida: {
    id: "druida",
    nombre: "Druida",
    descripcion:
      "Un sacerdote de la Vieja Fe que extrae su poder de la fuerza divina de la naturaleza, capaz de adoptar formas animales y conjurar la energía de los elementos.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: [
      "Armaduras ligeras",
      "Armaduras medias",
      "Escudos (no metálicos)",
    ],
    weaponProficiencies: [
      "Bastones",
      "Cimitarras",
      "Clavas",
      "Dagas",
      "Dardos",
      "Hoces",
      "Jabalinas",
      "Mazas",
      "Hondas",
      "Lanzas",
    ],
    toolProficiencies: ["Kit de herboristería"],

    savingThrows: ["int", "sab"],

    skillChoicePool: [
      "arcanos",
      "medicina",
      "naturaleza",
      "percepcion",
      "perspicacia",
      "religion",
      "supervivencia",
      "trato_con_animales",
    ],
    skillChoiceCount: 2,

    casterType: "full",
    spellcastingAbility: "sab",
    preparesSpells: true,
    cantripsAtLevel1: 2,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma/escudo",
        options: [
          {
            id: "shield_wood",
            label: "Un escudo de madera",
            items: ["Escudo de madera"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma secundaria",
        options: [
          {
            id: "scimitar",
            label: "Una cimitarra",
            items: ["Cimitarra"],
          },
          {
            id: "simple_melee",
            label: "Cualquier arma sencilla cuerpo a cuerpo",
            items: ["Arma sencilla cuerpo a cuerpo (a elegir)"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Armadura de cuero",
      "Paquete de explorador",
      "Canalizador druídico",
    ],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros",
        descripcion:
          "Puedes lanzar conjuros de druida usando la Sabiduría como aptitud mágica. Conoces 2 trucos. Preparas conjuros: nivel de druida + mod. Sabiduría.",
        nivel: 1,
      },
      {
        nombre: "Druídico",
        descripcion:
          "Conoces el druídico, el idioma secreto de los druidas. Puedes dejar mensajes ocultos en él que solo otros druidas pueden encontrar.",
        nivel: 1,
      },
    ],

    subclassLevel: 2,
    subclassLabel: "Círculo Druídico",
    iconName: "leaf-outline",
    color: "#16a34a",
  },

  // ─── EXPLORADOR ────────────────────────────────────────────────────
  explorador: {
    id: "explorador",
    nombre: "Explorador",
    descripcion:
      "Un guerrero de la espesura que emplea el combate marcial y la magia de la naturaleza para defender los confines de la civilización.",
    hitDie: "d10",
    hitDieMax: 10,
    hitDieFixed: 6,

    armorProficiencies: [
      "Armaduras ligeras",
      "Armaduras medias",
      "Escudos",
    ],
    weaponProficiencies: ["Armas sencillas", "Armas marciales"],
    toolProficiencies: [],

    savingThrows: ["fue", "des"],

    skillChoicePool: [
      "atletismo",
      "investigacion",
      "naturaleza",
      "percepcion",
      "perspicacia",
      "sigilo",
      "supervivencia",
      "trato_con_animales",
    ],
    skillChoiceCount: 3,

    casterType: "half",
    spellcastingAbility: "sab",
    preparesSpells: false,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "armor",
        label: "Armadura",
        options: [
          {
            id: "scale_mail",
            label: "Una cota de escamas",
            items: ["Cota de escamas"],
          },
          {
            id: "leather",
            label: "Una armadura de cuero",
            items: ["Armadura de cuero"],
          },
        ],
      },
      {
        id: "weapon1",
        label: "Armas",
        options: [
          {
            id: "two_shortswords",
            label: "Dos espadas cortas",
            items: ["Espada corta", "Espada corta"],
          },
          {
            id: "two_simple_melee",
            label: "Dos armas sencillas cuerpo a cuerpo",
            items: [
              "Arma sencilla cuerpo a cuerpo (a elegir)",
              "Arma sencilla cuerpo a cuerpo (a elegir)",
            ],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Paquete de explorador de mazmorras",
      "Arco largo",
      "Aljaba con 20 flechas",
    ],

    level1Features: [
      {
        nombre: "Enemigo Predilecto",
        descripcion:
          "Tienes experiencia estudiando y rastreando un tipo de enemigo. Elige un tipo de enemigo predilecto. Tienes ventaja en pruebas de Supervivencia para rastrearlos y de Inteligencia para recordar información sobre ellos.",
        nivel: 1,
      },
      {
        nombre: "Explorador Natural",
        descripcion:
          "Estás familiarizado con un tipo de entorno natural. Mientras viajas por tu terreno predilecto: el terreno difícil no ralentiza al grupo, no os podéis perder (salvo magia), permaneces alerta incluso realizando otra actividad, etc.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Arquetipo de Explorador",
    iconName: "compass-outline",
    color: "#059669",
  },

  // ─── GUERRERO ──────────────────────────────────────────────────────
  guerrero: {
    id: "guerrero",
    nombre: "Guerrero",
    descripcion:
      "Un maestro del combate marcial que domina una amplia variedad de armas y armaduras para sobrevivir en cualquier campo de batalla.",
    hitDie: "d10",
    hitDieMax: 10,
    hitDieFixed: 6,

    armorProficiencies: ["Todas las armaduras", "Escudos"],
    weaponProficiencies: ["Armas sencillas", "Armas marciales"],
    toolProficiencies: [],

    savingThrows: ["fue", "con"],

    skillChoicePool: [
      "acrobacias",
      "atletismo",
      "historia",
      "intimidacion",
      "percepcion",
      "perspicacia",
      "supervivencia",
      "trato_con_animales",
    ],
    skillChoiceCount: 2,

    casterType: "none",
    spellcastingAbility: null,
    preparesSpells: false,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "armor",
        label: "Armadura",
        options: [
          {
            id: "chain_mail",
            label: "Una cota de malla",
            items: ["Cota de malla"],
          },
          {
            id: "leather_longbow",
            label: "Armadura de cuero, arco largo y 20 flechas",
            items: ["Armadura de cuero", "Arco largo", "Flechas ×20"],
          },
        ],
      },
      {
        id: "weapon1",
        label: "Arma principal",
        options: [
          {
            id: "martial_shield",
            label: "Un arma marcial y un escudo",
            items: ["Arma marcial (a elegir)", "Escudo"],
          },
          {
            id: "two_martial",
            label: "Dos armas marciales",
            items: [
              "Arma marcial (a elegir)",
              "Arma marcial (a elegir)",
            ],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma a distancia",
        options: [
          {
            id: "light_crossbow",
            label: "Una ballesta ligera y 20 virotes",
            items: ["Ballesta ligera", "Virotes ×20"],
          },
          {
            id: "handaxes",
            label: "Dos hachas de mano",
            items: ["Hacha de mano", "Hacha de mano"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "dungeoneer",
            label: "Paquete de explorador de mazmorras",
            items: ["Paquete de explorador de mazmorras"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: [],

    level1Features: [
      {
        nombre: "Estilo de Combate",
        descripcion:
          "Adoptas un estilo de combate: Combate con Armas a Dos Manos, Combate con Dos Armas, Defensa, Duelo, Protección o Tiro con Arco.",
        nivel: 1,
      },
      {
        nombre: "Tomar Aliento",
        descripcion:
          "Puedes usar una acción adicional para recuperar 1d10 + nivel de guerrero PG. Se recupera tras un descanso corto o largo.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Arquetipo Marcial",
    iconName: "shield-outline",
    color: "#b91c1c",
  },

  // ─── HECHICERO ─────────────────────────────────────────────────────
  hechicero: {
    id: "hechicero",
    nombre: "Hechicero",
    descripcion:
      "Un lanzador de conjuros que extrae su magia innata de un don o de un linaje, capaz de doblar y retorcer los conjuros para adaptarlos a sus necesidades.",
    hitDie: "d6",
    hitDieMax: 6,
    hitDieFixed: 4,

    armorProficiencies: [],
    weaponProficiencies: [
      "Ballestas ligeras",
      "Bastones",
      "Dagas",
      "Dardos",
      "Hondas",
    ],
    toolProficiencies: [],

    savingThrows: ["con", "car"],

    skillChoicePool: [
      "arcanos",
      "engano",
      "intimidacion",
      "perspicacia",
      "persuasion",
      "religion",
    ],
    skillChoiceCount: 2,

    casterType: "full",
    spellcastingAbility: "car",
    preparesSpells: false,
    cantripsAtLevel1: 4,
    spellsAtLevel1: 2,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma",
        options: [
          {
            id: "light_crossbow",
            label: "Una ballesta ligera y 20 virotes",
            items: ["Ballesta ligera", "Virotes ×20"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "focus",
        label: "Canalizador",
        options: [
          {
            id: "component_pouch",
            label: "Un saquito de componentes",
            items: ["Saquito de componentes"],
          },
          {
            id: "arcane_focus",
            label: "Un canalizador arcano",
            items: ["Canalizador arcano"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Paquete de explorador de mazmorras",
      "Daga ×2",
    ],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros",
        descripcion:
          "Puedes lanzar conjuros de hechicero usando el Carisma como aptitud mágica. Conoces 4 trucos y 2 conjuros de nivel 1.",
        nivel: 1,
      },
      {
        nombre: "Origen Mágico",
        descripcion:
          "Elige un origen mágico que describa la fuente de tu poder innato: Linaje Dracónico o Magia Salvaje. Tu origen te otorga rasgos especiales a nivel 1 y superiores.",
        nivel: 1,
      },
    ],

    subclassLevel: 1,
    subclassLabel: "Origen Mágico",
    iconName: "sparkles-outline",
    color: "#dc2626",
  },

  // ─── MAGO ──────────────────────────────────────────────────────────
  mago: {
    id: "mago",
    nombre: "Mago",
    descripcion:
      "Un erudito de la magia arcana que emplea el estudio meticuloso y la memorización de conjuros para doblegar la realidad a su voluntad.",
    hitDie: "d6",
    hitDieMax: 6,
    hitDieFixed: 4,

    armorProficiencies: [],
    weaponProficiencies: [
      "Ballestas ligeras",
      "Bastones",
      "Dagas",
      "Dardos",
      "Hondas",
    ],
    toolProficiencies: [],

    savingThrows: ["int", "sab"],

    skillChoicePool: [
      "arcanos",
      "historia",
      "investigacion",
      "medicina",
      "perspicacia",
      "religion",
    ],
    skillChoiceCount: 2,

    casterType: "full",
    spellcastingAbility: "int",
    preparesSpells: true,
    cantripsAtLevel1: 3,
    spellsAtLevel1: 6,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma",
        options: [
          {
            id: "quarterstaff",
            label: "Un bastón",
            items: ["Bastón"],
          },
          {
            id: "dagger",
            label: "Una daga",
            items: ["Daga"],
          },
        ],
      },
      {
        id: "focus",
        label: "Canalizador",
        options: [
          {
            id: "component_pouch",
            label: "Un saquito de componentes",
            items: ["Saquito de componentes"],
          },
          {
            id: "arcane_focus",
            label: "Un canalizador arcano",
            items: ["Canalizador arcano"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "scholar",
            label: "Paquete de erudito",
            items: ["Paquete de erudito"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: ["Libro de conjuros"],

    level1Features: [
      {
        nombre: "Lanzamiento de Conjuros",
        descripcion:
          "Puedes lanzar conjuros de mago usando la Inteligencia como aptitud mágica. Conoces 3 trucos. Tu libro contiene 6 conjuros de nivel 1. Preparas conjuros: nivel de mago + mod. Inteligencia.",
        nivel: 1,
      },
      {
        nombre: "Recuperación Arcana",
        descripcion:
          "Una vez al día, al terminar un descanso corto, puedes recuperar espacios de conjuro cuya suma de niveles sea igual o menor que la mitad de tu nivel de mago (redondeado hacia arriba), sin que ningún espacio individual sea de nivel 6 o superior.",
        nivel: 1,
      },
    ],

    subclassLevel: 2,
    subclassLabel: "Tradición Arcana",
    iconName: "book-outline",
    color: "#2563eb",
  },

  // ─── MONJE ─────────────────────────────────────────────────────────
  monje: {
    id: "monje",
    nombre: "Monje",
    descripcion:
      "Un maestro de las artes marciales que canaliza el poder del cuerpo para lograr perfección física y espiritual, empleando el ki como arma.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: [],
    weaponProficiencies: ["Armas sencillas", "Espadas cortas"],
    toolProficiencies: [],
    toolChoices: [
      "Herramientas de artesano (a elegir)",
      "Instrumento musical (a elegir)",
    ],
    toolChoiceCount: 1,

    savingThrows: ["fue", "des"],

    skillChoicePool: [
      "acrobacias",
      "atletismo",
      "historia",
      "perspicacia",
      "religion",
      "sigilo",
    ],
    skillChoiceCount: 2,

    casterType: "none",
    spellcastingAbility: null,
    preparesSpells: false,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma",
        options: [
          {
            id: "shortsword",
            label: "Una espada corta",
            items: ["Espada corta"],
          },
          {
            id: "simple",
            label: "Cualquier arma sencilla",
            items: ["Arma sencilla (a elegir)"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "dungeoneer",
            label: "Paquete de explorador de mazmorras",
            items: ["Paquete de explorador de mazmorras"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: ["Dardos ×10"],

    level1Features: [
      {
        nombre: "Defensa sin Armadura",
        descripcion:
          "Mientras no lleves armadura ni empuñes un escudo, tu CA es 10 + mod. Destreza + mod. Sabiduría.",
        nivel: 1,
      },
      {
        nombre: "Artes Marciales",
        descripcion:
          "Mientras estés sin armadura y sin escudo: puedes usar DES en lugar de FUE para ataques y daño con armas de monje; tus armas de monje usan un d4 de daño (sube con el nivel); cuando atacas con un arma de monje, puedes hacer un ataque desarmado como acción adicional.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Tradición Monástica",
    iconName: "hand-left-outline",
    color: "#0891b2",
  },

  // ─── PALADÍN ───────────────────────────────────────────────────────
  paladin: {
    id: "paladin",
    nombre: "Paladín",
    descripcion:
      "Un guerrero sagrado unido a un juramento que canaliza el poder divino para proteger a los inocentes y castigar a los malvados.",
    hitDie: "d10",
    hitDieMax: 10,
    hitDieFixed: 6,

    armorProficiencies: ["Todas las armaduras", "Escudos"],
    weaponProficiencies: ["Armas sencillas", "Armas marciales"],
    toolProficiencies: [],

    savingThrows: ["sab", "car"],

    skillChoicePool: [
      "atletismo",
      "intimidacion",
      "medicina",
      "perspicacia",
      "persuasion",
      "religion",
    ],
    skillChoiceCount: 2,

    casterType: "half",
    spellcastingAbility: "car",
    preparesSpells: true,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma principal",
        options: [
          {
            id: "martial_shield",
            label: "Un arma marcial y un escudo",
            items: ["Arma marcial (a elegir)", "Escudo"],
          },
          {
            id: "two_martial",
            label: "Dos armas marciales",
            items: [
              "Arma marcial (a elegir)",
              "Arma marcial (a elegir)",
            ],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma secundaria",
        options: [
          {
            id: "javelins",
            label: "Cinco jabalinas",
            items: ["Jabalina ×5"],
          },
          {
            id: "simple_melee",
            label: "Cualquier arma sencilla cuerpo a cuerpo",
            items: ["Arma sencilla cuerpo a cuerpo (a elegir)"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "priest",
            label: "Paquete de sacerdote",
            items: ["Paquete de sacerdote"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: ["Cota de malla", "Símbolo sagrado"],

    level1Features: [
      {
        nombre: "Sentido Divino",
        descripcion:
          "Puedes detectar la presencia de cualquier celestial, infernal o no muerto a 18 m de ti que no esté detrás de una cobertura total. Usos: 1 + mod. Carisma por descanso largo.",
        nivel: 1,
      },
      {
        nombre: "Imposición de Manos",
        descripcion:
          "Tu toque bendito puede curar heridas. Tienes una reserva de poder curativo que se repone tras un descanso largo. Reserva = nivel de paladín × 5. Puedes restaurar PG (1 por 1) o gastar 5 puntos para curar una enfermedad o neutralizar un veneno.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Juramento Sagrado",
    iconName: "sunny-outline",
    color: "#eab308",
  },

  // ─── PÍCARO ────────────────────────────────────────────────────────
  picaro: {
    id: "picaro",
    nombre: "Pícaro",
    descripcion:
      "Un hábil especialista en sigilo, trampas y ataques precisos que aprovecha la astucia y la agilidad para superar cualquier obstáculo.",
    hitDie: "d8",
    hitDieMax: 8,
    hitDieFixed: 5,

    armorProficiencies: ["Armaduras ligeras"],
    weaponProficiencies: [
      "Armas sencillas",
      "Ballestas de mano",
      "Espadas cortas",
      "Espadas largas",
      "Estoques",
    ],
    toolProficiencies: ["Herramientas de ladrón"],

    savingThrows: ["des", "int"],

    skillChoicePool: [
      "acrobacias",
      "atletismo",
      "engano",
      "interpretacion",
      "intimidacion",
      "investigacion",
      "juego_de_manos",
      "percepcion",
      "perspicacia",
      "persuasion",
      "sigilo",
    ],
    skillChoiceCount: 4,

    casterType: "none",
    spellcastingAbility: null,
    preparesSpells: false,
    cantripsAtLevel1: 0,
    spellsAtLevel1: 0,

    equipmentChoices: [
      {
        id: "weapon1",
        label: "Arma principal",
        options: [
          {
            id: "rapier",
            label: "Un estoque",
            items: ["Estoque"],
          },
          {
            id: "shortsword",
            label: "Una espada corta",
            items: ["Espada corta"],
          },
        ],
      },
      {
        id: "weapon2",
        label: "Arma secundaria",
        options: [
          {
            id: "shortbow",
            label: "Un arco corto y aljaba con 20 flechas",
            items: ["Arco corto", "Aljaba", "Flechas ×20"],
          },
          {
            id: "shortsword2",
            label: "Una espada corta",
            items: ["Espada corta"],
          },
        ],
      },
      {
        id: "pack",
        label: "Paquete",
        options: [
          {
            id: "burglar",
            label: "Paquete de ladrón",
            items: ["Paquete de ladrón"],
          },
          {
            id: "dungeoneer",
            label: "Paquete de explorador de mazmorras",
            items: ["Paquete de explorador de mazmorras"],
          },
          {
            id: "explorer",
            label: "Paquete de explorador",
            items: ["Paquete de explorador"],
          },
        ],
      },
    ],
    defaultEquipment: [
      "Armadura de cuero",
      "Daga ×2",
      "Herramientas de ladrón",
    ],

    level1Features: [
      {
        nombre: "Pericia",
        descripcion:
          "Elige dos competencias en habilidades (o una habilidad y herramientas de ladrón). Tu bonificador por competencia se duplica para pruebas que usen esas competencias.",
        nivel: 1,
      },
      {
        nombre: "Ataque Furtivo",
        descripcion:
          "Una vez por turno, puedes infligir 1d6 de daño adicional a una criatura que impactes con un ataque si tienes ventaja o si un aliado está a 1,5 m del objetivo. El arma debe ser sutil o a distancia.",
        nivel: 1,
      },
      {
        nombre: "Jerga de Ladrones",
        descripcion:
          "Conoces la jerga de ladrones, un lenguaje secreto de señales, símbolos y argot que permite ocultar mensajes en conversaciones aparentemente normales.",
        nivel: 1,
      },
    ],

    subclassLevel: 3,
    subclassLabel: "Arquetipo de Pícaro",
    iconName: "eye-off-outline",
    color: "#374151",
  },
};

// ─── Funciones auxiliares ────────────────────────────────────────────

/**
 * Obtiene los datos completos de una clase por su ID.
 */
export function getClassData(classId: ClassId): ClassData {
  return CLASSES[classId];
}

/**
 * Devuelve la lista de clases como un array ordenado para selección.
 */
export function getClassList(): ClassData[] {
  return Object.values(CLASSES);
}

/**
 * Devuelve si la clase es lanzadora de conjuros.
 */
export function isSpellcaster(classId: ClassId): boolean {
  return CLASSES[classId].casterType !== "none";
}

/**
 * Devuelve si la clase tiene conjuros a nivel 1.
 */
export function hasSpellsAtLevel1(classId: ClassId): boolean {
  const cls = CLASSES[classId];
  return cls.cantripsAtLevel1 > 0 || cls.spellsAtLevel1 > 0;
}

/**
 * Calcula los PG a nivel 1 de una clase.
 */
export function calcLevel1HP(classId: ClassId, conModifier: number): number {
  const cls = CLASSES[classId];
  return cls.hitDieMax + conModifier;
}

/**
 * Iconos emoji representativos de cada clase.
 */
export const CLASS_ICONS: Record<ClassId, string> = {
  barbaro: "⚔️",
  bardo: "🎵",
  brujo: "👁️",
  clerigo: "✝️",
  druida: "🌿",
  explorador: "🏹",
  guerrero: "🛡️",
  hechicero: "✨",
  mago: "📖",
  monje: "👊",
  paladin: "☀️",
  picaro: "🗡️",
};

/**
 * Descripción corta de cada aptitud mágica según la clase.
 */
export const SPELLCASTING_DESCRIPTIONS: Partial<Record<ClassId, string>> = {
  bardo:
    "El Carisma es tu aptitud mágica. Conoces un número fijo de conjuros que eliges de la lista de bardo.",
  brujo:
    "El Carisma es tu aptitud mágica. Conoces pocos conjuros, pero tus espacios se recuperan con descansos cortos.",
  clerigo:
    "La Sabiduría es tu aptitud mágica. Preparas conjuros cada día de entre toda la lista de clérigo.",
  druida:
    "La Sabiduría es tu aptitud mágica. Preparas conjuros cada día de entre toda la lista de druida.",
  explorador:
    "La Sabiduría es tu aptitud mágica. Obtienes conjuros a nivel 2. Conoces un número fijo de conjuros.",
  hechicero:
    "El Carisma es tu aptitud mágica. Tu magia es innata. Conoces un número fijo de conjuros y puedes usar Puntos de Hechicería para modificarlos.",
  mago:
    "La Inteligencia es tu aptitud mágica. Registras conjuros en tu libro y preparas una selección cada día.",
  paladin:
    "El Carisma es tu aptitud mágica. Obtienes conjuros a nivel 2. Preparas conjuros cada día.",
};

// ─── Constantes derivadas (fuente única de verdad) ───────────────────

/**
 * Tipo de lanzador por clase, derivado de CLASSES.
 * Antes hardcodeado en constants/spells.ts — ahora esta es la fuente canónica.
 */
export const CLASS_CASTER_TYPE_FROM_CLASSES = Object.fromEntries(
  Object.entries(CLASSES).map(([id, c]) => [id, c.casterType]),
) as Record<ClassId, CasterType>;

/**
 * Característica de lanzamiento por clase, derivada de CLASSES.
 * Antes hardcodeado en constants/spells.ts — ahora esta es la fuente canónica.
 */
export const SPELLCASTING_ABILITY_FROM_CLASSES = Object.fromEntries(
  Object.entries(CLASSES)
    .filter(([, c]) => c.spellcastingAbility !== null)
    .map(([id, c]) => [id, c.spellcastingAbility]),
) as Partial<Record<ClassId, AbilityKey>>;

/**
 * Tipo de preparación de conjuros por clase, derivado de CLASSES.
 */
export const CLASS_SPELL_PREPARATION_FROM_CLASSES = Object.fromEntries(
  Object.entries(CLASSES).map(([id, c]) => {
    if (c.casterType === "none") return [id, "none"] as const;
    if (c.preparesSpells) {
      return [id, id === "mago" ? "spellbook" : "prepared"] as const;
    }
    return [id, "known"] as const;
  }),
) as Record<ClassId, "known" | "prepared" | "spellbook" | "none">;
