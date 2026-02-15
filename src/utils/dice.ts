/**
 * Utilidades de dados para D&D 5e.
 * Funciones para tirar dados, calcular modificadores y formatear resultados.
 */

// ─── Tipos ───────────────────────────────────────────────────────────

/** Tipos de dados estándar de D&D */
export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";

/** Resultado de una tirada individual */
export interface DieRollResult {
  /** Tipo de dado tirado */
  die: DieType;
  /** Valor obtenido */
  value: number;
}

/** Resultado completo de una tirada (puede incluir múltiples dados y modificador) */
export interface RollResult {
  /** Expresión original de la tirada (ej: "2d6+3") */
  expression: string;
  /** Resultados individuales de cada dado */
  rolls: DieRollResult[];
  /** Modificador aplicado (puede ser 0) */
  modifier: number;
  /** Suma de todos los dados (sin modificador) */
  subtotal: number;
  /** Total final (subtotal + modificador) */
  total: number;
  /** Si la tirada fue un crítico natural (solo para 1d20) */
  isCritical: boolean;
  /** Si la tirada fue una pifia natural (solo para 1d20) */
  isFumble: boolean;
  /** Timestamp de la tirada */
  timestamp: string;
}

/** Resultado de una tirada de característica (4d6 descartando el menor) */
export interface AbilityRollResult {
  /** Los 4 valores individuales obtenidos */
  allRolls: number[];
  /** El valor descartado (el menor) */
  discarded: number;
  /** Los 3 valores conservados */
  kept: number[];
  /** Suma de los 3 valores conservados */
  total: number;
}

/** Resultado de tirada de ataque */
export interface AttackRollResult {
  /** Tirada del d20 */
  d20Roll: number;
  /** Modificador de ataque */
  attackModifier: number;
  /** Total de la tirada de ataque */
  attackTotal: number;
  /** Si fue golpe crítico (20 natural) */
  isCritical: boolean;
  /** Si fue pifia (1 natural) */
  isFumble: boolean;
  /** Tirada de daño (si se solicitó) */
  damageRoll?: {
    rolls: number[];
    modifier: number;
    total: number;
    damageType: string;
  };
}

/** Resultado de tirada de salvación contra muerte */
export interface DeathSaveRollResult {
  /** Valor del d20 */
  roll: number;
  /** Si es éxito (10+) */
  isSuccess: boolean;
  /** Si es pifia (1 natural, cuenta como 2 fracasos) */
  isFumble: boolean;
  /** Si es crítico (20 natural, recupera 1 PG) */
  isCritical: boolean;
}

// ─── Valores de dados ────────────────────────────────────────────────

/** Número máximo de cada tipo de dado */
export const DIE_MAX_VALUES: Record<DieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
  d100: 100,
};

// ─── Generación de números aleatorios ────────────────────────────────

/**
 * Genera un número entero aleatorio entre min y max (ambos incluidos).
 * Usa Math.random() como fuente de aleatoriedad.
 * @param min - Valor mínimo (incluido)
 * @param max - Valor máximo (incluido)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// ─── Tiradas básicas ─────────────────────────────────────────────────

/**
 * Tira un dado del tipo especificado.
 * @param die - Tipo de dado (d4, d6, d8, d10, d12, d20, d100)
 * @returns Valor obtenido (entre 1 y el máximo del dado)
 */
export function rollDie(die: DieType): number {
  return randomInt(1, DIE_MAX_VALUES[die]);
}

/**
 * Tira múltiples dados del mismo tipo.
 * @param count - Cantidad de dados a tirar
 * @param die - Tipo de dado
 * @returns Array con los resultados individuales
 */
export function rollDice(count: number, die: DieType): number[] {
  const results: number[] = [];
  for (let i = 0; i < count; i++) {
    results.push(rollDie(die));
  }
  return results;
}

/**
 * Tira múltiples dados y suma un modificador.
 * @param count - Cantidad de dados
 * @param die - Tipo de dado
 * @param modifier - Modificador a sumar (puede ser negativo)
 * @returns Resultado completo de la tirada
 */
export function roll(
  count: number,
  die: DieType,
  modifier: number = 0
): RollResult {
  const rolls: DieRollResult[] = [];

  for (let i = 0; i < count; i++) {
    const value = rollDie(die);
    rolls.push({ die, value });
  }

  const subtotal = rolls.reduce((sum, r) => sum + r.value, 0);
  const total = Math.max(0, subtotal + modifier);

  // Detectar crítico/pifia solo para 1d20
  const isSingleD20 = count === 1 && die === "d20";
  const isCritical = isSingleD20 && rolls[0].value === 20;
  const isFumble = isSingleD20 && rolls[0].value === 1;

  const modStr =
    modifier > 0
      ? `+${modifier}`
      : modifier < 0
        ? `${modifier}`
        : "";
  const expression = `${count}${die}${modStr}`;

  return {
    expression,
    rolls,
    modifier,
    subtotal,
    total,
    isCritical,
    isFumble,
    timestamp: new Date().toISOString(),
  };
}

// ─── Tiradas especiales de D&D ───────────────────────────────────────

/**
 * Tira un d20 con un modificador.
 * @param modifier - Modificador a sumar
 * @returns Resultado de la tirada
 */
export function rollD20(modifier: number = 0): RollResult {
  return roll(1, "d20", modifier);
}

/**
 * Realiza una tirada con ventaja (tira 2d20 y toma el mayor).
 * @param modifier - Modificador a sumar al resultado
 * @returns Resultado de la tirada con ambos valores
 */
export function rollWithAdvantage(modifier: number = 0): RollResult & {
  allRolls: [number, number];
  chosenRoll: number;
} {
  const roll1 = rollDie("d20");
  const roll2 = rollDie("d20");
  const chosenRoll = Math.max(roll1, roll2);
  const total = chosenRoll + modifier;

  const isCritical = chosenRoll === 20;
  const isFumble = chosenRoll === 1;

  const modStr =
    modifier > 0
      ? `+${modifier}`
      : modifier < 0
        ? `${modifier}`
        : "";

  return {
    expression: `2d20kh1${modStr} (ventaja)`,
    rolls: [
      { die: "d20", value: roll1 },
      { die: "d20", value: roll2 },
    ],
    modifier,
    subtotal: chosenRoll,
    total: Math.max(0, total),
    isCritical,
    isFumble,
    timestamp: new Date().toISOString(),
    allRolls: [roll1, roll2],
    chosenRoll,
  };
}

/**
 * Realiza una tirada con desventaja (tira 2d20 y toma el menor).
 * @param modifier - Modificador a sumar al resultado
 * @returns Resultado de la tirada con ambos valores
 */
export function rollWithDisadvantage(modifier: number = 0): RollResult & {
  allRolls: [number, number];
  chosenRoll: number;
} {
  const roll1 = rollDie("d20");
  const roll2 = rollDie("d20");
  const chosenRoll = Math.min(roll1, roll2);
  const total = chosenRoll + modifier;

  const isCritical = chosenRoll === 20;
  const isFumble = chosenRoll === 1;

  const modStr =
    modifier > 0
      ? `+${modifier}`
      : modifier < 0
        ? `${modifier}`
        : "";

  return {
    expression: `2d20kl1${modStr} (desventaja)`,
    rolls: [
      { die: "d20", value: roll1 },
      { die: "d20", value: roll2 },
    ],
    modifier,
    subtotal: chosenRoll,
    total: Math.max(0, total),
    isCritical,
    isFumble,
    timestamp: new Date().toISOString(),
    allRolls: [roll1, roll2],
    chosenRoll,
  };
}

/**
 * Tira 4d6 y descarta el menor (método estándar para generar características).
 * @returns Resultado con todos los dados, el descartado y el total
 */
export function rollAbilityScore(): AbilityRollResult {
  const allRolls = rollDice(4, "d6");
  const sorted = [...allRolls].sort((a, b) => a - b);
  const discarded = sorted[0];
  const kept = sorted.slice(1);
  const total = kept.reduce((sum, v) => sum + v, 0);

  return {
    allRolls,
    discarded,
    kept,
    total,
  };
}

/**
 * Genera un set completo de 6 características usando el método 4d6 descartando el menor.
 * @returns Array de 6 resultados de tiradas de característica
 */
export function rollAbilityScoreSet(): AbilityRollResult[] {
  return Array.from({ length: 6 }, () => rollAbilityScore());
}

/**
 * Realiza una tirada de iniciativa.
 * @param dexModifier - Modificador de Destreza
 * @param bonusModifier - Bonificadores adicionales (ej: dote Alerta +5)
 * @returns Resultado de la tirada de iniciativa
 */
export function rollInitiative(
  dexModifier: number,
  bonusModifier: number = 0
): RollResult {
  return rollD20(dexModifier + bonusModifier);
}

/**
 * Realiza una tirada de ataque.
 * @param attackModifier - Bonificador total de ataque (competencia + mod. característica)
 * @param damageDice - Expresión de dados de daño (ej: "1d8", "2d6")
 * @param damageModifier - Modificador de daño
 * @param damageType - Tipo de daño (ej: "cortante")
 * @param rollDamage - Si se debe tirar el daño automáticamente
 * @returns Resultado completo de la tirada de ataque
 */
export function rollAttack(
  attackModifier: number,
  damageDice: string,
  damageModifier: number = 0,
  damageType: string = "",
  rollDamage: boolean = true
): AttackRollResult {
  const d20Value = rollDie("d20");
  const isCritical = d20Value === 20;
  const isFumble = d20Value === 1;

  const result: AttackRollResult = {
    d20Roll: d20Value,
    attackModifier,
    attackTotal: d20Value + attackModifier,
    isCritical,
    isFumble,
  };

  if (rollDamage) {
    const parsed = parseDiceExpression(damageDice);
    if (parsed) {
      const diceCount = isCritical ? parsed.count * 2 : parsed.count;
      const damageRolls = rollDice(diceCount, parsed.die);
      const damageTotal =
        damageRolls.reduce((sum, v) => sum + v, 0) + damageModifier;

      result.damageRoll = {
        rolls: damageRolls,
        modifier: damageModifier,
        total: Math.max(0, damageTotal),
        damageType,
      };
    }
  }

  return result;
}

/**
 * Realiza una tirada de salvación contra muerte.
 * @returns Resultado de la tirada
 */
export function rollDeathSave(): DeathSaveRollResult {
  const value = rollDie("d20");

  return {
    roll: value,
    isSuccess: value >= 10,
    isFumble: value === 1,
    isCritical: value === 20,
  };
}

/**
 * Realiza una tirada de dado de golpe para recuperar vida en un descanso corto.
 * @param die - Tipo de dado de golpe de la clase (d6, d8, d10, d12)
 * @param conModifier - Modificador de Constitución
 * @returns Puntos de vida recuperados (mínimo 0)
 */
export function rollHitDie(
  die: DieType,
  conModifier: number
): { roll: number; modifier: number; total: number } {
  const rollValue = rollDie(die);
  const total = Math.max(0, rollValue + conModifier);

  return {
    roll: rollValue,
    modifier: conModifier,
    total,
  };
}

// ─── Parseo de expresiones de dados ──────────────────────────────────

/**
 * Representa una expresión de dados parseada (ej: "2d6+3").
 */
export interface ParsedDiceExpression {
  /** Cantidad de dados */
  count: number;
  /** Tipo de dado */
  die: DieType;
  /** Modificador */
  modifier: number;
  /** Expresión original */
  original: string;
}

/**
 * Parsea una expresión de dados en formato estándar (ej: "2d6+3", "1d20-1", "d8").
 * @param expression - Expresión a parsear
 * @returns La expresión parseada, o null si no es válida
 */
export function parseDiceExpression(
  expression: string
): ParsedDiceExpression | null {
  const cleaned = expression.trim().toLowerCase().replace(/\s/g, "");

  // Regex: (count)d(sides)(+/-modifier)
  const match = cleaned.match(/^(\d*)d(\d+)([+-]\d+)?$/);
  if (!match) return null;

  const count = match[1] ? parseInt(match[1], 10) : 1;
  const sides = parseInt(match[2], 10);
  const modifier = match[3] ? parseInt(match[3], 10) : 0;

  // Validar que el tipo de dado sea válido
  const dieKey = `d${sides}` as DieType;
  if (!(dieKey in DIE_MAX_VALUES)) return null;

  if (count < 1 || count > 100) return null;

  return {
    count,
    die: dieKey,
    modifier,
    original: expression,
  };
}

/**
 * Evalúa una expresión de dados y retorna el resultado.
 * @param expression - Expresión de dados (ej: "2d6+3")
 * @returns Resultado de la tirada, o null si la expresión es inválida
 */
export function evaluateDiceExpression(expression: string): RollResult | null {
  const parsed = parseDiceExpression(expression);
  if (!parsed) return null;

  return roll(parsed.count, parsed.die, parsed.modifier);
}

// ─── Funciones de formato ────────────────────────────────────────────

/**
 * Formatea un resultado de tirada para mostrar al usuario.
 * Ejemplo: "🎲 2d6+3 → [4, 5] + 3 = 12"
 */
export function formatRollResult(result: RollResult): string {
  const diceValues = result.rolls.map((r) => r.value).join(", ");
  const modStr =
    result.modifier > 0
      ? ` + ${result.modifier}`
      : result.modifier < 0
        ? ` - ${Math.abs(result.modifier)}`
        : "";

  let text = `🎲 ${result.expression} → [${diceValues}]${modStr} = ${result.total}`;

  if (result.isCritical) {
    text += " ✨ ¡CRÍTICO!";
  } else if (result.isFumble) {
    text += " 💀 ¡PIFIA!";
  }

  return text;
}

/**
 * Formatea un resultado de tirada de característica.
 * Ejemplo: "4d6: [3, 4, 5, 6] → descarta 3 → 15"
 */
export function formatAbilityRoll(result: AbilityRollResult): string {
  const allStr = result.allRolls.join(", ");
  return `4d6: [${allStr}] → descarta ${result.discarded} → ${result.total}`;
}

/**
 * Formatea un resultado de tirada de ataque.
 * Ejemplo: "⚔️ Ataque: 1d20+5 → 18 (13+5) | Daño: 1d8+3 → 7 cortante"
 */
export function formatAttackResult(result: AttackRollResult): string {
  let text = `⚔️ Ataque: d20${result.attackModifier >= 0 ? "+" : ""}${result.attackModifier} → ${result.attackTotal} (${result.d20Roll}${result.attackModifier >= 0 ? "+" : ""}${result.attackModifier})`;

  if (result.isCritical) {
    text += " ✨ ¡CRÍTICO!";
  } else if (result.isFumble) {
    text += " 💀 ¡PIFIA!";
  }

  if (result.damageRoll) {
    const dmg = result.damageRoll;
    const rollsStr = dmg.rolls.join("+");
    const modStr =
      dmg.modifier > 0
        ? `+${dmg.modifier}`
        : dmg.modifier < 0
          ? `${dmg.modifier}`
          : "";
    text += ` | Daño: [${rollsStr}]${modStr} = ${dmg.total}`;
    if (dmg.damageType) {
      text += ` ${dmg.damageType}`;
    }
  }

  return text;
}

/**
 * Formatea un resultado de tirada de salvación contra muerte.
 */
export function formatDeathSaveResult(result: DeathSaveRollResult): string {
  if (result.isCritical) {
    return `💚 ¡20 natural! Tu personaje recupera 1 PG y vuelve en sí.`;
  }
  if (result.isFumble) {
    return `💀 ¡1 natural! Cuenta como 2 fracasos.`;
  }
  if (result.isSuccess) {
    return `✅ Éxito (${result.roll}) — Tirada de salvación contra muerte superada.`;
  }
  return `❌ Fracaso (${result.roll}) — Tirada de salvación contra muerte fallida.`;
}

/**
 * Formatea un modificador con signo.
 * Ejemplo: formatModifier(3) → "+3", formatModifier(-1) → "-1"
 */
export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : `${modifier}`;
}

// ─── Constantes útiles ───────────────────────────────────────────────

/** Conjunto estándar de puntuaciones de característica (Standard Array) */
export const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8] as const;

/** Tabla de costes para el método de compra por puntos */
export const POINT_BUY_COSTS: Record<number, number> = {
  8: 0,
  9: 1,
  10: 2,
  11: 3,
  12: 4,
  13: 5,
  14: 7,
  15: 9,
};

/** Puntos totales disponibles para compra por puntos */
export const POINT_BUY_TOTAL = 27;

/** Puntuación mínima en compra por puntos */
export const POINT_BUY_MIN = 8;

/** Puntuación máxima en compra por puntos */
export const POINT_BUY_MAX = 15;

/**
 * Calcula los puntos restantes en el método de compra por puntos.
 * @param scores - Array de las 6 puntuaciones actuales
 * @returns Puntos restantes para gastar
 */
export function calcPointBuyRemaining(scores: number[]): number {
  const spent = scores.reduce((total, score) => {
    const clamped = Math.max(POINT_BUY_MIN, Math.min(POINT_BUY_MAX, score));
    return total + (POINT_BUY_COSTS[clamped] ?? 0);
  }, 0);

  return POINT_BUY_TOTAL - spent;
}

/**
 * Valida si una distribución de puntuaciones es válida para compra por puntos.
 * @param scores - Array de 6 puntuaciones
 * @returns true si la distribución es válida
 */
export function isValidPointBuy(scores: number[]): boolean {
  if (scores.length !== 6) return false;

  // Todas las puntuaciones deben estar entre 8 y 15
  if (scores.some((s) => s < POINT_BUY_MIN || s > POINT_BUY_MAX)) return false;

  // El coste total no debe exceder los puntos disponibles
  return calcPointBuyRemaining(scores) >= 0;
}
