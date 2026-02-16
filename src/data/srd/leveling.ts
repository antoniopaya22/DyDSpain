/**
 * Datos de progresión de nivel para D&D 5e SRD en español.
 * Incluye: tabla de XP, niveles de ASI por clase, rasgos por nivel,
 * y utilidades para calcular el nivel a partir de la experiencia.
 */

import type { ClassId } from "@/types/character";
import {
  CLASS_CASTER_TYPE,
  CANTRIPS_KNOWN,
  SPELLS_KNOWN,
  CLASS_SPELL_PREPARATION,
  FULL_CASTER_SLOTS,
  HALF_CASTER_SLOTS,
  WARLOCK_PACT_SLOTS,
} from "@/types/spell";

// ─── Tabla de XP por nivel (D&D 5e SRD) ─────────────────────────────

/**
 * XP mínima requerida para alcanzar cada nivel.
 * Índice = nivel (1-20).
 */
export const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 300,
  3: 900,
  4: 2700,
  5: 6500,
  6: 14000,
  7: 23000,
  8: 34000,
  9: 48000,
  10: 64000,
  11: 85000,
  12: 100000,
  13: 120000,
  14: 140000,
  15: 165000,
  16: 195000,
  17: 225000,
  18: 265000,
  19: 305000,
  20: 355000,
};

/** Nivel máximo permitido */
export const MAX_LEVEL = 20;

/** XP máxima rastreable (nivel 20) */
export const MAX_XP = 355000;

// ─── Niveles de Mejora de Puntuación de Característica (ASI) ─────────

/**
 * Niveles en los que cada clase obtiene ASI (Ability Score Improvement).
 * La mayoría usa [4, 8, 12, 16, 19]. Guerrero y Pícaro tienen extra.
 */
export const ASI_LEVELS: Record<ClassId, number[]> = {
  barbaro: [4, 8, 12, 16, 19],
  bardo: [4, 8, 12, 16, 19],
  brujo: [4, 8, 12, 16, 19],
  clerigo: [4, 8, 12, 16, 19],
  druida: [4, 8, 12, 16, 19],
  explorador: [4, 8, 12, 16, 19],
  guerrero: [4, 6, 8, 12, 14, 16, 19],
  hechicero: [4, 8, 12, 16, 19],
  mago: [4, 8, 12, 16, 19],
  monje: [4, 8, 12, 16, 19],
  paladin: [4, 8, 12, 16, 19],
  picaro: [4, 8, 10, 12, 16, 19],
};

/** Puntos máximos de una puntuación de característica */
export const MAX_ABILITY_SCORE = 20;

/** Puntos a repartir en un ASI estándar */
export const ASI_POINTS = 2;

// ─── Rasgos de clase por nivel ───────────────────────────────────────

export interface LevelFeature {
  nombre: string;
  descripcion: string;
  nivel: number;
  /** Si es un rasgo de subclase (requiere tener subclase elegida) */
  esSubclase?: boolean;
}

/**
 * Rasgos de clase obtenidos por nivel para cada clase (SRD simplificado).
 * Solo incluye los nombres y descripciones generales; los rasgos de subclase
 * se marcan con `esSubclase: true`.
 */
export const CLASS_LEVEL_FEATURES: Record<ClassId, LevelFeature[]> = {
  // ─── BÁRBARO ───────────────────────────────────────────────────────
  barbaro: [
    { nombre: "Furia", descripcion: "Puedes enfurecerte como acción adicional. Ganas bonificador al daño cuerpo a cuerpo, ventaja en pruebas/salvaciones de FUE y resistencia a daño contundente/cortante/perforante. 2 usos por descanso largo.", nivel: 1 },
    { nombre: "Defensa sin Armadura", descripcion: "Sin armadura, tu CA = 10 + mod. DES + mod. CON.", nivel: 1 },
    { nombre: "Ataque Temerario", descripcion: "Al atacar cuerpo a cuerpo, puedes atacar con ventaja, pero los ataques contra ti tienen ventaja hasta tu próximo turno.", nivel: 2 },
    { nombre: "Sentido del Peligro", descripcion: "Ventaja en salvaciones de DES contra efectos que puedas ver (no estando cegado, ensordecido o incapacitado).", nivel: 2 },
    { nombre: "Senda Primordial", descripcion: "Elige tu Senda Primordial (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Furia: 3 usos", descripcion: "Tus usos de Furia aumentan a 3.", nivel: 3 },
    { nombre: "Ataque Extra", descripcion: "Puedes atacar dos veces en tu turno al usar la acción de Atacar.", nivel: 5 },
    { nombre: "Movimiento Rápido", descripcion: "Tu velocidad aumenta en 10 pies mientras no lleves armadura pesada.", nivel: 5 },
    { nombre: "Furia: 4 usos", descripcion: "Tus usos de Furia aumentan a 4.", nivel: 6 },
    { nombre: "Rasgo de Senda", descripcion: "Obtienes un rasgo de tu Senda Primordial.", nivel: 6, esSubclase: true },
    { nombre: "Instinto Salvaje", descripcion: "Ventaja en tiradas de iniciativa. Si estás sorprendido pero no incapacitado, puedes actuar normalmente si enfureces primero.", nivel: 7 },
    { nombre: "Crítico Brutal (1 dado)", descripcion: "Puedes lanzar un dado de daño de arma adicional en un golpe crítico cuerpo a cuerpo.", nivel: 9 },
    { nombre: "Rasgo de Senda", descripcion: "Obtienes un rasgo de tu Senda Primordial.", nivel: 10, esSubclase: true },
    { nombre: "Furia Incansable", descripcion: "Si empiezas tu turno enfurecido y tienes 0 PG, puedes hacer una salvación de CON CD 10 (aumenta +5 cada vez) para caer a 1 PG en su lugar.", nivel: 11 },
    { nombre: "Furia: 5 usos", descripcion: "Tus usos de Furia aumentan a 5.", nivel: 12 },
    { nombre: "Crítico Brutal (2 dados)", descripcion: "Dados adicionales en crítico aumentan a 2.", nivel: 13 },
    { nombre: "Rasgo de Senda", descripcion: "Obtienes un rasgo de tu Senda Primordial.", nivel: 14, esSubclase: true },
    { nombre: "Furia Persistente", descripcion: "Tu Furia solo termina prematuramente si caes inconsciente o la finalizas voluntariamente.", nivel: 15 },
    { nombre: "Crítico Brutal (3 dados)", descripcion: "Dados adicionales en crítico aumentan a 3.", nivel: 17 },
    { nombre: "Furia: 6 usos", descripcion: "Tus usos de Furia aumentan a 6.", nivel: 17 },
    { nombre: "Poder Indomable", descripcion: "Si tu total de FUE es menor que 24, se convierte en 24. Si tu total de CON es menor que 24, se convierte en 24.", nivel: 20 },
    { nombre: "Furia Ilimitada", descripcion: "Tus usos de Furia son ilimitados.", nivel: 20 },
  ],

  // ─── BARDO ─────────────────────────────────────────────────────────
  bardo: [
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de bardo usando CAR como aptitud mágica.", nivel: 1 },
    { nombre: "Inspiración Bárdica (d6)", descripcion: "Puedes inspirar a otros con tu música. Un aliado gana un dado d6 para sumar a una tirada. Usos = mod. CAR por descanso largo.", nivel: 1 },
    { nombre: "Aprendiz de Todo", descripcion: "Suma la mitad de tu bonificador de competencia (redondeado abajo) a cualquier prueba de característica en la que no tengas competencia.", nivel: 2 },
    { nombre: "Canción de Descanso (d6)", descripcion: "Durante un descanso corto, puedes tocar música para curar dados de golpe extra (d6) a aliados.", nivel: 2 },
    { nombre: "Colegio de Bardo", descripcion: "Elige tu Colegio de Bardo (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Pericia", descripcion: "Elige dos habilidades en las que tengas competencia. Tu bonificador se duplica para ellas (Pericia).", nivel: 3 },
    { nombre: "Fuente de Inspiración", descripcion: "Tu Inspiración Bárdica se recupera en descansos cortos.", nivel: 5 },
    { nombre: "Inspiración Bárdica (d8)", descripcion: "El dado de Inspiración Bárdica sube a d8.", nivel: 5 },
    { nombre: "Rasgo de Colegio", descripcion: "Obtienes un rasgo de tu Colegio de Bardo.", nivel: 6, esSubclase: true },
    { nombre: "Contraencanto", descripcion: "Puedes usar tu acción para tocar música que da ventaja a aliados en salvaciones contra miedo y encantamiento.", nivel: 6 },
    { nombre: "Secretos Mágicos", descripcion: "Aprende dos conjuros de cualquier clase. Cuentan como conjuros de bardo.", nivel: 10 },
    { nombre: "Inspiración Bárdica (d10)", descripcion: "El dado de Inspiración Bárdica sube a d10.", nivel: 10 },
    { nombre: "Pericia (2 más)", descripcion: "Elige dos habilidades más para obtener Pericia.", nivel: 10 },
    { nombre: "Rasgo de Colegio", descripcion: "Obtienes un rasgo de tu Colegio de Bardo.", nivel: 14, esSubclase: true },
    { nombre: "Inspiración Bárdica (d12)", descripcion: "El dado de Inspiración Bárdica sube a d12.", nivel: 15 },
    { nombre: "Canción de Descanso (d10)", descripcion: "El dado de Canción de Descanso sube a d10.", nivel: 13 },
    { nombre: "Secretos Mágicos (2 más)", descripcion: "Aprende dos conjuros adicionales de cualquier clase.", nivel: 14 },
    { nombre: "Secretos Mágicos (2 más)", descripcion: "Aprende dos conjuros adicionales de cualquier clase.", nivel: 18 },
    { nombre: "Inspiración Superior", descripcion: "Cuando tires iniciativa sin usos de Inspiración Bárdica, recuperas uno.", nivel: 20 },
  ],

  // ─── BRUJO ─────────────────────────────────────────────────────────
  brujo: [
    { nombre: "Patrón de Otro Mundo", descripcion: "Elige tu Patrón de Otro Mundo (subclase).", nivel: 1, esSubclase: true },
    { nombre: "Magia de Pacto", descripcion: "Puedes lanzar conjuros de brujo. Tus espacios de conjuro se recuperan en descansos cortos.", nivel: 1 },
    { nombre: "Invocaciones Sobrenaturales (2)", descripcion: "Obtienes 2 Invocaciones Sobrenaturales.", nivel: 2 },
    { nombre: "Favor de Pacto", descripcion: "Elige un Favor de Pacto: Pacto de la Cadena, del Filo o del Tomo.", nivel: 3 },
    { nombre: "Invocaciones extra", descripcion: "Obtienes invocaciones sobrenaturales adicionales según tu nivel.", nivel: 5 },
    { nombre: "Rasgo de Patrón", descripcion: "Obtienes un rasgo de tu Patrón de Otro Mundo.", nivel: 6, esSubclase: true },
    { nombre: "Rasgo de Patrón", descripcion: "Obtienes un rasgo de tu Patrón de Otro Mundo.", nivel: 10, esSubclase: true },
    { nombre: "Arcano Místico", descripcion: "Tu patrón te otorga un conjuro de nivel 6 (uso 1/descanso largo). Ganas más a niveles superiores.", nivel: 11 },
    { nombre: "Rasgo de Patrón", descripcion: "Obtienes un rasgo de tu Patrón de Otro Mundo.", nivel: 14, esSubclase: true },
    { nombre: "Maestro Sobrenatural", descripcion: "Puedes suplicar a tu patrón para recuperar todos los espacios de conjuro gastados 1 vez por descanso largo.", nivel: 20 },
  ],

  // ─── CLÉRIGO ───────────────────────────────────────────────────────
  clerigo: [
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de clérigo usando SAB como aptitud mágica. Preparas conjuros tras un descanso largo.", nivel: 1 },
    { nombre: "Dominio Divino", descripcion: "Elige tu Dominio Divino (subclase).", nivel: 1, esSubclase: true },
    { nombre: "Canalizar Divinidad (1 uso)", descripcion: "Puedes canalizar energía divina: Expulsar Muertos Vivientes y un efecto de tu dominio. 1 uso por descanso.", nivel: 2 },
    { nombre: "Rasgo de Dominio", descripcion: "Obtienes un rasgo de tu Dominio Divino.", nivel: 6, esSubclase: true },
    { nombre: "Canalizar Divinidad (2 usos)", descripcion: "Puedes usar Canalizar Divinidad 2 veces entre descansos.", nivel: 6 },
    { nombre: "Destruir Muertos Vivientes (CD 1/2)", descripcion: "Cuando usas Expulsar Muertos Vivientes, destruyes a los de CD 1/2 o menos.", nivel: 5 },
    { nombre: "Rasgo de Dominio", descripcion: "Obtienes un rasgo de tu Dominio Divino.", nivel: 8, esSubclase: true },
    { nombre: "Destruir Muertos Vivientes (CD 1)", descripcion: "Destruyes muertos vivientes de CD 1 o menos.", nivel: 8 },
    { nombre: "Intervención Divina", descripcion: "Puedes pedir la intervención de tu deidad. Tira d100; si sacas ≤ tu nivel, la deidad interviene. 1 uso por descanso largo.", nivel: 10 },
    { nombre: "Destruir Muertos Vivientes (CD 2)", descripcion: "Destruyes muertos vivientes de CD 2 o menos.", nivel: 11 },
    { nombre: "Destruir Muertos Vivientes (CD 3)", descripcion: "Destruyes muertos vivientes de CD 3 o menos.", nivel: 14 },
    { nombre: "Rasgo de Dominio", descripcion: "Obtienes un rasgo de tu Dominio Divino.", nivel: 17, esSubclase: true },
    { nombre: "Canalizar Divinidad (3 usos)", descripcion: "Puedes usar Canalizar Divinidad 3 veces entre descansos.", nivel: 18 },
    { nombre: "Destruir Muertos Vivientes (CD 4)", descripcion: "Destruyes muertos vivientes de CD 4 o menos.", nivel: 17 },
    { nombre: "Intervención Divina Mejorada", descripcion: "Tu Intervención Divina funciona automáticamente.", nivel: 20 },
  ],

  // ─── DRUIDA ────────────────────────────────────────────────────────
  druida: [
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de druida usando SAB como aptitud mágica.", nivel: 1 },
    { nombre: "Druídico", descripcion: "Conoces el idioma secreto druídico.", nivel: 1 },
    { nombre: "Círculo Druídico", descripcion: "Elige tu Círculo Druídico (subclase).", nivel: 2, esSubclase: true },
    { nombre: "Forma Salvaje", descripcion: "Puedes transformarte en un animal que hayas visto. 2 usos por descanso. CD máx. 1/4 inicialmente.", nivel: 2 },
    { nombre: "Forma Salvaje (CD 1/2, sin vuelo)", descripcion: "Puedes transformarte en criaturas de CD 1/2. Sin velocidad de vuelo o nado aún.", nivel: 4 },
    { nombre: "Rasgo de Círculo", descripcion: "Obtienes un rasgo de tu Círculo Druídico.", nivel: 6, esSubclase: true },
    { nombre: "Forma Salvaje (CD 1, nado)", descripcion: "Puedes transformarte en criaturas de CD 1 con velocidad de nado.", nivel: 8 },
    { nombre: "Rasgo de Círculo", descripcion: "Obtienes un rasgo de tu Círculo Druídico.", nivel: 10, esSubclase: true },
    { nombre: "Rasgo de Círculo", descripcion: "Obtienes un rasgo de tu Círculo Druídico.", nivel: 14, esSubclase: true },
    { nombre: "Cuerpo Atemporal", descripcion: "Ya no sufres los inconvenientes de la vejez y no puedes ser envejecido mágicamente.", nivel: 18 },
    { nombre: "Conjuros Bestiales", descripcion: "Puedes lanzar conjuros en Forma Salvaje.", nivel: 18 },
    { nombre: "Archidruida", descripcion: "Puedes usar Forma Salvaje un número ilimitado de veces. Además, puedes ignorar componentes verbales, somáticos y materiales (sin coste) de tus conjuros.", nivel: 20 },
  ],

  // ─── EXPLORADOR ────────────────────────────────────────────────────
  explorador: [
    { nombre: "Enemigo Predilecto", descripcion: "Elige un tipo de enemigo predilecto. Ventaja en rastreo y recordar información sobre ellos.", nivel: 1 },
    { nombre: "Explorador Natural", descripcion: "Elige un tipo de terreno predilecto. Beneficios al viajar y rastrear en él.", nivel: 1 },
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de explorador usando SAB.", nivel: 2 },
    { nombre: "Estilo de Combate", descripcion: "Elige un Estilo de Combate.", nivel: 2 },
    { nombre: "Arquetipo de Explorador", descripcion: "Elige tu Arquetipo de Explorador (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Consciencia Primordial", descripcion: "Puedes detectar ciertos tipos de criaturas en 1 milla (o 6 millas en tu terreno predilecto).", nivel: 3 },
    { nombre: "Ataque Extra", descripcion: "Puedes atacar dos veces al usar la acción de Atacar.", nivel: 5 },
    { nombre: "Enemigo Predilecto adicional", descripcion: "Elige un enemigo predilecto adicional.", nivel: 6 },
    { nombre: "Explorador Natural adicional", descripcion: "Elige un terreno predilecto adicional.", nivel: 6 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Explorador.", nivel: 7, esSubclase: true },
    { nombre: "Zancada Territorial", descripcion: "Moverte por terreno difícil no natural no te cuesta movimiento extra.", nivel: 8 },
    { nombre: "Esconderse a Plena Vista", descripcion: "Puedes intentar esconderte cuando estás ligeramente oscurecido por fenómenos naturales.", nivel: 10 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Explorador.", nivel: 11, esSubclase: true },
    { nombre: "Enemigo Predilecto adicional", descripcion: "Elige otro enemigo predilecto.", nivel: 14 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Explorador.", nivel: 15, esSubclase: true },
    { nombre: "Evasión", descripcion: "Si haces una salvación de DES para mitad de daño, no recibes daño en éxito y mitad en fallo.", nivel: 15 },
    { nombre: "Sentidos Salvajes", descripcion: "No tienes desventaja en tiradas de ataque contra criaturas que no puedas ver, y conoces la ubicación de criaturas invisibles a 30 pies.", nivel: 18 },
    { nombre: "Cazador Implacable", descripcion: "No tienes desventaja en tiradas de ataque contra criaturas a las que estés rastreando.", nivel: 20 },
    { nombre: "Asesino de Enemigos", descripcion: "Una vez por turno, puedes sumar tu mod. SAB al daño contra tu enemigo predilecto.", nivel: 20 },
  ],

  // ─── GUERRERO ──────────────────────────────────────────────────────
  guerrero: [
    { nombre: "Estilo de Combate", descripcion: "Elige un Estilo de Combate: Arquería, Defensa, Duelo, Lucha con Arma a Dos Manos, Protección.", nivel: 1 },
    { nombre: "Tomar Aliento", descripcion: "Puedes usar una acción adicional para recuperar PG = 1d10 + nivel de guerrero. 1 uso por descanso corto o largo.", nivel: 1 },
    { nombre: "Oleada de Acción (1 uso)", descripcion: "En tu turno, puedes realizar una acción adicional. 1 uso por descanso corto o largo.", nivel: 2 },
    { nombre: "Arquetipo Marcial", descripcion: "Elige tu Arquetipo Marcial (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Ataque Extra", descripcion: "Puedes atacar dos veces al usar la acción de Atacar.", nivel: 5 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo Marcial.", nivel: 7, esSubclase: true },
    { nombre: "Indomable (1 uso)", descripcion: "Puedes repetir una tirada de salvación fallida. Debes usar el nuevo resultado. 1 uso por descanso largo.", nivel: 9 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo Marcial.", nivel: 10, esSubclase: true },
    { nombre: "Ataque Extra (2)", descripcion: "Puedes atacar tres veces al usar la acción de Atacar.", nivel: 11 },
    { nombre: "Indomable (2 usos)", descripcion: "Puedes usar Indomable 2 veces entre descansos largos.", nivel: 13 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo Marcial.", nivel: 15, esSubclase: true },
    { nombre: "Oleada de Acción (2 usos)", descripcion: "Puedes usar Oleada de Acción 2 veces entre descansos cortos o largos.", nivel: 17 },
    { nombre: "Indomable (3 usos)", descripcion: "Puedes usar Indomable 3 veces entre descansos largos.", nivel: 17 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo Marcial.", nivel: 18, esSubclase: true },
    { nombre: "Ataque Extra (3)", descripcion: "Puedes atacar cuatro veces al usar la acción de Atacar.", nivel: 20 },
  ],

  // ─── HECHICERO ─────────────────────────────────────────────────────
  hechicero: [
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de hechicero usando CAR como aptitud mágica.", nivel: 1 },
    { nombre: "Origen Mágico", descripcion: "Elige tu Origen Mágico (subclase).", nivel: 1, esSubclase: true },
    { nombre: "Fuente de Magia", descripcion: "Obtienes Puntos de Hechicería = tu nivel de hechicero. Puedes convertir espacios en puntos y viceversa.", nivel: 2 },
    { nombre: "Metamagia (2 opciones)", descripcion: "Elige 2 opciones de Metamagia.", nivel: 3 },
    { nombre: "Rasgo de Origen", descripcion: "Obtienes un rasgo de tu Origen Mágico.", nivel: 6, esSubclase: true },
    { nombre: "Metamagia (1 opción más)", descripcion: "Elige 1 opción de Metamagia adicional.", nivel: 10 },
    { nombre: "Rasgo de Origen", descripcion: "Obtienes un rasgo de tu Origen Mágico.", nivel: 14, esSubclase: true },
    { nombre: "Metamagia (1 opción más)", descripcion: "Elige 1 opción de Metamagia adicional.", nivel: 17 },
    { nombre: "Rasgo de Origen", descripcion: "Obtienes un rasgo de tu Origen Mágico.", nivel: 18, esSubclase: true },
    { nombre: "Restauración Mágica", descripcion: "Recuperas 4 Puntos de Hechicería gastados al terminar un descanso corto.", nivel: 20 },
  ],

  // ─── MAGO ──────────────────────────────────────────────────────────
  mago: [
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de mago usando INT como aptitud mágica. Usas un libro de conjuros.", nivel: 1 },
    { nombre: "Recuperación Arcana", descripcion: "Una vez al día durante un descanso corto, puedes recuperar espacios de conjuro cuyo nivel combinado ≤ mitad de tu nivel de mago (redondeado arriba).", nivel: 1 },
    { nombre: "Tradición Arcana", descripcion: "Elige tu Tradición Arcana (subclase).", nivel: 2, esSubclase: true },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Arcana.", nivel: 6, esSubclase: true },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Arcana.", nivel: 10, esSubclase: true },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Arcana.", nivel: 14, esSubclase: true },
    { nombre: "Dominio de Conjuro", descripcion: "Elige un conjuro de mago de nivel 1. Puedes lanzarlo a nivel 1 sin gastar espacio.", nivel: 18 },
    { nombre: "Dominio de Conjuro (2)", descripcion: "Elige un conjuro de mago de nivel 2. Puedes lanzarlo a nivel 2 sin gastar espacio.", nivel: 20 },
  ],

  // ─── MONJE ─────────────────────────────────────────────────────────
  monje: [
    { nombre: "Defensa sin Armadura", descripcion: "Sin armadura ni escudo, tu CA = 10 + mod. DES + mod. SAB.", nivel: 1 },
    { nombre: "Artes Marciales", descripcion: "Puedes usar DES para golpes desarmados y armas de monje (d4 inicial). Puedes hacer un golpe desarmado como acción adicional.", nivel: 1 },
    { nombre: "Ki (2 puntos)", descripcion: "Obtienes puntos de Ki = tu nivel de monje. Se recuperan en descansos cortos. Ráfaga de Golpes, Paso del Viento, Defensa Paciente.", nivel: 2 },
    { nombre: "Movimiento sin Armadura (+10 pies)", descripcion: "Tu velocidad aumenta 10 pies sin armadura. Aumenta con el nivel.", nivel: 2 },
    { nombre: "Tradición Monástica", descripcion: "Elige tu Tradición Monástica (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Desviar Proyectiles", descripcion: "Puedes usar tu reacción para reducir el daño de un ataque a distancia en 1d10 + mod. DES + nivel de monje.", nivel: 3 },
    { nombre: "Caída Lenta", descripcion: "Puedes usar tu reacción para reducir el daño por caída en 5 × nivel de monje.", nivel: 4 },
    { nombre: "Ataque Extra", descripcion: "Puedes atacar dos veces al usar la acción de Atacar.", nivel: 5 },
    { nombre: "Golpe Aturdidor", descripcion: "Cuando aciertas con un ataque cuerpo a cuerpo, puedes gastar 1 punto de Ki para intentar aturdir al objetivo (salvación de CON).", nivel: 5 },
    { nombre: "Golpes de Ki mágicos", descripcion: "Tus golpes desarmados cuentan como mágicos para superar resistencias.", nivel: 6 },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Monástica.", nivel: 6, esSubclase: true },
    { nombre: "Evasión", descripcion: "Si haces una salvación de DES para mitad de daño, no recibes daño en éxito y mitad en fallo.", nivel: 7 },
    { nombre: "Quietud Mental", descripcion: "Puedes usar tu acción para terminar un efecto de encantado o asustado sobre ti.", nivel: 7 },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Monástica.", nivel: 11, esSubclase: true },
    { nombre: "Lengua del Sol y la Luna", descripcion: "Puedes entender y ser entendido por cualquier criatura que hable un idioma.", nivel: 13 },
    { nombre: "Alma Diamantina", descripcion: "Tienes competencia en todas las tiradas de salvación. Si fallas una, puedes gastar 1 Ki para repetirla.", nivel: 14 },
    { nombre: "Cuerpo Atemporal", descripcion: "Ya no sufres inconvenientes de la vejez y no puedes ser envejecido mágicamente. No necesitas comida ni agua.", nivel: 15 },
    { nombre: "Rasgo de Tradición", descripcion: "Obtienes un rasgo de tu Tradición Monástica.", nivel: 17, esSubclase: true },
    { nombre: "Cuerpo Vacío", descripcion: "Puedes gastar 4 Ki para hacerte invisible durante 1 minuto. También puedes gastar 8 Ki para lanzar Proyección Astral.", nivel: 18 },
    { nombre: "Autoperfección", descripcion: "Cuando tires iniciativa sin puntos de Ki, recuperas 4.", nivel: 20 },
  ],

  // ─── PALADÍN ───────────────────────────────────────────────────────
  paladin: [
    { nombre: "Sentido Divino", descripcion: "Puedes detectar celestiales, demonios y muertos vivientes en 60 pies. Usos = 1 + mod. CAR por descanso largo.", nivel: 1 },
    { nombre: "Imposición de Manos", descripcion: "Tienes una reserva de PG curativos = 5 × nivel de paladín. Puedes gastar 5 puntos para curar una enfermedad o veneno.", nivel: 1 },
    { nombre: "Lanzamiento de Conjuros", descripcion: "Puedes lanzar conjuros de paladín usando CAR.", nivel: 2 },
    { nombre: "Estilo de Combate", descripcion: "Elige un Estilo de Combate.", nivel: 2 },
    { nombre: "Castigo Divino", descripcion: "Al golpear con un arma cuerpo a cuerpo, puedes gastar un espacio de conjuro para infligir 2d8 (+1d8 por nivel de espacio superior) de daño radiante.", nivel: 2 },
    { nombre: "Juramento Sagrado", descripcion: "Elige tu Juramento Sagrado (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Salud Divina", descripcion: "Eres inmune a enfermedades.", nivel: 3 },
    { nombre: "Ataque Extra", descripcion: "Puedes atacar dos veces al usar la acción de Atacar.", nivel: 5 },
    { nombre: "Aura de Protección", descripcion: "Tú y aliados amistosos a 10 pies sumáis tu mod. CAR (mín. +1) a tiradas de salvación.", nivel: 6 },
    { nombre: "Rasgo de Juramento", descripcion: "Obtienes un rasgo de tu Juramento Sagrado.", nivel: 7, esSubclase: true },
    { nombre: "Aura de Coraje", descripcion: "Tú y aliados a 10 pies no podéis ser asustados.", nivel: 10 },
    { nombre: "Castigo Divino Mejorado", descripcion: "Todos tus golpes de arma cuerpo a cuerpo infligen 1d8 adicional de daño radiante.", nivel: 11 },
    { nombre: "Toque Purificador", descripcion: "Puedes gastar 5 puntos de Imposición de Manos para terminar un conjuro sobre ti o un aliado.", nivel: 14 },
    { nombre: "Rasgo de Juramento", descripcion: "Obtienes un rasgo de tu Juramento Sagrado.", nivel: 15, esSubclase: true },
    { nombre: "Aura de Protección (30 pies)", descripcion: "El rango de tu Aura de Protección aumenta a 30 pies.", nivel: 18 },
    { nombre: "Aura de Coraje (30 pies)", descripcion: "El rango de tu Aura de Coraje aumenta a 30 pies.", nivel: 18 },
    { nombre: "Rasgo de Juramento", descripcion: "Obtienes el rasgo culminante de tu Juramento Sagrado.", nivel: 20, esSubclase: true },
  ],

  // ─── PÍCARO ────────────────────────────────────────────────────────
  picaro: [
    { nombre: "Pericia", descripcion: "Elige dos habilidades o herramientas con competencia. Tu bonificador se duplica (Pericia).", nivel: 1 },
    { nombre: "Ataque Furtivo (1d6)", descripcion: "Una vez por turno, puedes infligir 1d6 extra de daño con un ataque con ventaja o cuando un aliado esté adyacente al objetivo. Aumenta con el nivel.", nivel: 1 },
    { nombre: "Jerga de Ladrones", descripcion: "Conoces la jerga secreta de los ladrones: un idioma y señales ocultas.", nivel: 1 },
    { nombre: "Acción Astuta", descripcion: "Puedes usar una acción adicional para Correr, Desengancharte o Esconderte.", nivel: 2 },
    { nombre: "Arquetipo de Pícaro", descripcion: "Elige tu Arquetipo de Pícaro (subclase).", nivel: 3, esSubclase: true },
    { nombre: "Movimiento Esquivo", descripcion: "Si haces una salvación de DES para mitad de daño, recibes 0 en éxito y mitad en fallo (a menos que estés incapacitado).", nivel: 5 },
    { nombre: "Pericia (2 más)", descripcion: "Elige dos habilidades más para Pericia.", nivel: 6 },
    { nombre: "Evasión", descripcion: "Igual que Movimiento Esquivo (consolidado).", nivel: 7 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Pícaro.", nivel: 9, esSubclase: true },
    { nombre: "Talento Fiable", descripcion: "Cuando hagas una prueba de característica con competencia, cualquier resultado de d20 de 9 o menos cuenta como 10.", nivel: 11 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Pícaro.", nivel: 13, esSubclase: true },
    { nombre: "Sentido Ciego", descripcion: "Si puedes oír, conoces la ubicación de cualquier criatura oculta o invisible a 10 pies.", nivel: 14 },
    { nombre: "Mente Escurridiza", descripcion: "Tienes competencia en tiradas de salvación de SAB.", nivel: 15 },
    { nombre: "Rasgo de Arquetipo", descripcion: "Obtienes un rasgo de tu Arquetipo de Pícaro.", nivel: 17, esSubclase: true },
    { nombre: "Esquivo", descripcion: "Ningún ataque puede tener ventaja contra ti mientras no estés incapacitado.", nivel: 18 },
    { nombre: "Golpe de Suerte", descripcion: "Si fallas un ataque, puedes convertir el fallo en acierto. Si fallas una prueba, puedes tratar el d20 como un 20. 1 uso por descanso.", nivel: 20 },
  ],
};

// ─── Dados de Ataque Furtivo del Pícaro por nivel ────────────────────

export const SNEAK_ATTACK_DICE: Record<number, string> = {
  1: "1d6", 2: "1d6",
  3: "2d6", 4: "2d6",
  5: "3d6", 6: "3d6",
  7: "4d6", 8: "4d6",
  9: "5d6", 10: "5d6",
  11: "6d6", 12: "6d6",
  13: "7d6", 14: "7d6",
  15: "8d6", 16: "8d6",
  17: "9d6", 18: "9d6",
  19: "10d6", 20: "10d6",
};

// ─── Usos de Furia del Bárbaro por nivel ─────────────────────────────

export const RAGE_USES: Record<number, number | "ilimitado"> = {
  1: 2, 2: 2,
  3: 3, 4: 3, 5: 3,
  6: 4, 7: 4, 8: 4, 9: 4, 10: 4, 11: 4,
  12: 5, 13: 5, 14: 5, 15: 5, 16: 5,
  17: 6, 18: 6, 19: 6,
  20: "ilimitado",
};

// ─── Daño de Furia del Bárbaro por nivel ─────────────────────────────

export const RAGE_DAMAGE: Record<number, number> = {
  1: 2, 2: 2, 3: 2, 4: 2, 5: 2, 6: 2, 7: 2, 8: 2,
  9: 3, 10: 3, 11: 3, 12: 3, 13: 3, 14: 3, 15: 3,
  16: 4, 17: 4, 18: 4, 19: 4, 20: 4,
};

// ─── Dado de Artes Marciales del Monje por nivel ─────────────────────

export const MARTIAL_ARTS_DIE: Record<number, string> = {
  1: "1d4", 2: "1d4", 3: "1d4", 4: "1d4",
  5: "1d6", 6: "1d6", 7: "1d6", 8: "1d6", 9: "1d6", 10: "1d6",
  11: "1d8", 12: "1d8", 13: "1d8", 14: "1d8", 15: "1d8", 16: "1d8",
  17: "1d10", 18: "1d10", 19: "1d10", 20: "1d10",
};

// ─── Invocaciones Sobrenaturales del Brujo por nivel ─────────────────

export const WARLOCK_INVOCATIONS: Record<number, number> = {
  1: 0, 2: 2, 3: 2, 4: 2,
  5: 3, 6: 3,
  7: 4, 8: 4,
  9: 5, 10: 5, 11: 5,
  12: 6, 13: 6, 14: 6,
  15: 7, 16: 7, 17: 7,
  18: 8, 19: 8, 20: 8,
};

// ─── Funciones utilitarias ───────────────────────────────────────────

/**
 * Calcula el nivel correspondiente a una cantidad de XP.
 */
export function getLevelForXP(xp: number): number {
  let level = 1;
  for (let l = 20; l >= 1; l--) {
    if (xp >= XP_THRESHOLDS[l]) {
      level = l;
      break;
    }
  }
  return level;
}

/**
 * Obtiene la XP necesaria para el siguiente nivel.
 * Retorna null si ya está en nivel 20.
 */
export function getXPForNextLevel(currentLevel: number): number | null {
  if (currentLevel >= MAX_LEVEL) return null;
  return XP_THRESHOLDS[currentLevel + 1];
}

/**
 * Calcula el progreso de XP hacia el siguiente nivel (0 a 1).
 */
export function getXPProgress(xp: number, currentLevel: number): number {
  if (currentLevel >= MAX_LEVEL) return 1;

  const currentThreshold = XP_THRESHOLDS[currentLevel];
  const nextThreshold = XP_THRESHOLDS[currentLevel + 1];
  const range = nextThreshold - currentThreshold;

  if (range <= 0) return 1;

  return Math.min(1, Math.max(0, (xp - currentThreshold) / range));
}

/**
 * Comprueba si el personaje tiene suficiente XP para subir de nivel.
 */
export function canLevelUp(xp: number, currentLevel: number): boolean {
  if (currentLevel >= MAX_LEVEL) return false;
  return xp >= XP_THRESHOLDS[currentLevel + 1];
}

/**
 * Obtiene los rasgos de clase que se ganan al subir a un nivel concreto.
 */
export function getFeaturesForLevel(
  classId: ClassId,
  level: number
): LevelFeature[] {
  const features = CLASS_LEVEL_FEATURES[classId];
  return features.filter((f) => f.nivel === level);
}

/**
 * Comprueba si un nivel concreto otorga ASI para una clase.
 */
export function isASILevel(classId: ClassId, level: number): boolean {
  return ASI_LEVELS[classId].includes(level);
}

/**
 * Comprueba si un nivel concreto requiere elegir subclase.
 */
export function isSubclassLevel(classId: ClassId, level: number): boolean {
  const features = CLASS_LEVEL_FEATURES[classId];
  return features.some(
    (f) => f.nivel === level && f.esSubclase === true && f.descripcion.toLowerCase().includes("elige")
  );
}

/**
 * Obtiene un resumen de lo que ocurre al subir a un nivel concreto.
 */
export interface LevelUpSummary {
  newLevel: number;
  /** Rasgos ganados */
  features: LevelFeature[];
  /** Si obtiene ASI (Mejora de Característica) */
  hasASI: boolean;
  /** Si debe elegir subclase */
  choosesSubclass: boolean;
  /** Nuevo bonificador de competencia */
  proficiencyBonus: number;
  /** XP necesaria para el nivel actual */
  xpThreshold: number;
  /** Información sobre hechizos que se aprenden al subir */
  spellLearning: SpellLearningInfo | null;
  /** Número de opciones de Metamagia nuevas que se eligen (solo hechicero) */
  newMetamagicChoices: number;
}

/**
 * Información sobre hechizos que se aprenden al subir de nivel.
 */
export interface SpellLearningInfo {
  /** Trucos nuevos que se pueden aprender */
  newCantrips: number;
  /** Hechizos nuevos que se pueden aprender (clases que "conocen") */
  newSpellsKnown: number;
  /** Si el personaje puede intercambiar un hechizo conocido por otro */
  canSwapSpell: boolean;
  /** Hechizos nuevos en el libro de conjuros (solo mago: +2 por nivel) */
  newSpellbookSpells: number;
  /** Nivel máximo de hechizo al que tiene acceso */
  maxSpellLevel: number;
  /** Tipo de preparación de la clase */
  preparationType: "known" | "prepared" | "spellbook" | "pact" | "none";
  /** Si gana acceso a un nuevo nivel de hechizo en este nivel */
  gainsNewSpellLevel: boolean;
  /** Trucos totales que debería tener */
  totalCantrips: number;
  /** Hechizos conocidos totales que debería tener */
  totalSpellsKnown: number;
}

export function getLevelUpSummary(
  classId: ClassId,
  newLevel: number
): LevelUpSummary {
  // Metamagia: hechicero gana 2 opciones al nivel 3, 1 más al 10 y 17
  let newMetamagicChoices = 0;
  if (classId === "hechicero") {
    if (newLevel === 3) newMetamagicChoices = 2;
    else if (newLevel === 10 || newLevel === 17) newMetamagicChoices = 1;
  }

  return {
    newLevel,
    features: getFeaturesForLevel(classId, newLevel),
    hasASI: isASILevel(classId, newLevel),
    choosesSubclass: isSubclassLevel(classId, newLevel),
    proficiencyBonus: Math.floor((newLevel - 1) / 4) + 2,
    xpThreshold: XP_THRESHOLDS[newLevel],
    spellLearning: getSpellLearningInfo(classId, newLevel),
    newMetamagicChoices,
  };
}

/**
 * Formatea un número de XP con separadores de miles.
 */
export function formatXP(xp: number): string {
  return xp.toLocaleString("es-ES");
}

/**
 * Comprueba si el bonificador de competencia cambia al subir de nivel.
 */
export function proficiencyBonusChanges(
  oldLevel: number,
  newLevel: number
): boolean {
  const oldBonus = Math.floor((oldLevel - 1) / 4) + 2;
  const newBonus = Math.floor((newLevel - 1) / 4) + 2;
  return oldBonus !== newBonus;
}

/**
 * Obtiene todos los niveles de ASI restantes por encima del nivel actual.
 */
export function getRemainingASILevels(
  classId: ClassId,
  currentLevel: number
): number[] {
  return ASI_LEVELS[classId].filter((l) => l > currentLevel);
}

// ─── Aprendizaje de hechizos al subir de nivel ──────────────────────

/**
 * Calcula el nivel máximo de hechizo al que una clase tiene acceso a un nivel dado.
 */
export function getMaxSpellLevelForClass(
  classId: ClassId,
  classLevel: number
): number {
  const casterType = CLASS_CASTER_TYPE[classId];

  if (casterType === "none") return 0;

  if (casterType === "pact") {
    // Brujo: el nivel de espacio de pacto
    const pactData = WARLOCK_PACT_SLOTS[classLevel];
    return pactData ? pactData[1] : 0;
  }

  const table = casterType === "full" ? FULL_CASTER_SLOTS : HALF_CASTER_SLOTS;
  const slots = table[classLevel];
  if (!slots) return 0;

  // El nivel máximo es el índice más alto con espacios > 0 (+ 1 porque es 0-indexed)
  for (let i = slots.length - 1; i >= 0; i--) {
    if (slots[i] > 0) return i + 1;
  }
  return 0;
}

/**
 * Calcula la información de aprendizaje de hechizos al subir a un nivel dado.
 * Retorna null si la clase no es lanzadora de conjuros.
 */
export function getSpellLearningInfo(
  classId: ClassId,
  newLevel: number
): SpellLearningInfo | null {
  const casterType = CLASS_CASTER_TYPE[classId];
  if (casterType === "none") return null;

  const oldLevel = newLevel - 1;
  const prepType = CLASS_SPELL_PREPARATION[classId];

  // ── Trucos ──
  const cantripsTable = CANTRIPS_KNOWN[classId];
  const totalCantrips = cantripsTable?.[newLevel] ?? 0;
  const oldCantrips = cantripsTable?.[oldLevel] ?? 0;
  const newCantrips = Math.max(0, totalCantrips - oldCantrips);

  // ── Hechizos conocidos (para clases que "conocen": bardo, brujo, hechicero, explorador) ──
  const spellsTable = SPELLS_KNOWN[classId];
  const totalSpellsKnown = spellsTable?.[newLevel] ?? 0;
  const oldSpellsKnown = spellsTable?.[oldLevel] ?? 0;
  const newSpellsKnown = Math.max(0, totalSpellsKnown - oldSpellsKnown);

  // ── Libro de conjuros del mago: +2 conjuros al libro por nivel ──
  const newSpellbookSpells = classId === "mago" ? 2 : 0;

  // ── ¿Puede intercambiar un hechizo? (bardo, hechicero, brujo, explorador al subir de nivel) ──
  const canSwapSpell = prepType === "known" && newLevel > 1;

  // ── Nivel máximo de hechizo ──
  const maxSpellLevel = getMaxSpellLevelForClass(classId, newLevel);
  const oldMaxSpellLevel = getMaxSpellLevelForClass(classId, oldLevel);
  const gainsNewSpellLevel = maxSpellLevel > oldMaxSpellLevel;

  // Determinar tipo de preparación para mostrar en la UI
  let preparationType: SpellLearningInfo["preparationType"];
  if (casterType === "pact") {
    preparationType = "pact";
  } else if (prepType === "spellbook") {
    preparationType = "spellbook";
  } else if (prepType === "prepared") {
    preparationType = "prepared";
  } else if (prepType === "known") {
    preparationType = "known";
  } else {
    preparationType = "none";
  }

  // Si no hay nada que aprender ni cambiar, y la clase no es lanzadora, retornar null
  const hasAnySpellChange =
    newCantrips > 0 ||
    newSpellsKnown > 0 ||
    newSpellbookSpells > 0 ||
    canSwapSpell ||
    gainsNewSpellLevel ||
    totalCantrips > 0 ||
    totalSpellsKnown > 0;

  if (!hasAnySpellChange) return null;

  return {
    newCantrips,
    newSpellsKnown,
    canSwapSpell,
    newSpellbookSpells,
    maxSpellLevel,
    preparationType,
    gainsNewSpellLevel,
    totalCantrips,
    totalSpellsKnown,
  };
}
