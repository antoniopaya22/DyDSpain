/**
 * Tipos para el sistema de inventario y equipamiento de D&D 5e en español (HU-07)
 */

import type { AbilityKey, DamageType } from "./character";

// ─── Categorías de objetos ───────────────────────────────────────────

export type ItemCategory =
  | "arma"
  | "armadura"
  | "escudo"
  | "equipo_aventurero"
  | "herramienta"
  | "montura_vehiculo"
  | "consumible"
  | "objeto_magico"
  | "municion"
  | "otro";

export const ITEM_CATEGORY_NAMES: Record<ItemCategory, string> = {
  arma: "Arma",
  armadura: "Armadura",
  escudo: "Escudo",
  equipo_aventurero: "Equipo de aventurero",
  herramienta: "Herramienta",
  montura_vehiculo: "Montura / Vehículo",
  consumible: "Consumible",
  objeto_magico: "Objeto mágico",
  municion: "Munición",
  otro: "Otro",
};

export const ITEM_CATEGORY_ICONS: Record<ItemCategory, string> = {
  arma: "⚔️",
  armadura: "🛡️",
  escudo: "🛡️",
  equipo_aventurero: "🎒",
  herramienta: "🔧",
  montura_vehiculo: "🐴",
  consumible: "🧪",
  objeto_magico: "✨",
  municion: "🏹",
  otro: "📦",
};

// ─── Armas ───────────────────────────────────────────────────────────

export type WeaponType = "sencilla_cuerpo" | "sencilla_distancia" | "marcial_cuerpo" | "marcial_distancia";

export const WEAPON_TYPE_NAMES: Record<WeaponType, string> = {
  sencilla_cuerpo: "Arma sencilla cuerpo a cuerpo",
  sencilla_distancia: "Arma sencilla a distancia",
  marcial_cuerpo: "Arma marcial cuerpo a cuerpo",
  marcial_distancia: "Arma marcial a distancia",
};

export type WeaponProperty =
  | "ligera"
  | "pesada"
  | "sutil"
  | "arrojadiza"
  | "municion"
  | "alcance"
  | "a_dos_manos"
  | "versatil"
  | "recarga"
  | "especial";

export const WEAPON_PROPERTY_NAMES: Record<WeaponProperty, string> = {
  ligera: "Ligera",
  pesada: "Pesada",
  sutil: "Sutil",
  arrojadiza: "Arrojadiza",
  municion: "Munición",
  alcance: "Alcance",
  a_dos_manos: "A dos manos",
  versatil: "Versátil",
  recarga: "Recarga",
  especial: "Especial",
};

export interface WeaponRange {
  /** Alcance normal en pies */
  normal: number;
  /** Alcance largo en pies */
  long: number;
}

export interface WeaponDamage {
  /** Dado(s) de daño, ej: "1d8", "2d6" */
  dice: string;
  /** Tipo de daño */
  damageType: DamageType;
}

export interface WeaponDetails {
  /** Tipo de arma */
  weaponType: WeaponType;
  /** Daño base */
  damage: WeaponDamage;
  /** Daño versátil (a dos manos), si aplica */
  versatileDamage?: WeaponDamage;
  /** Propiedades del arma */
  properties: WeaponProperty[];
  /** Alcance (para armas arrojadizas o de munición) */
  range?: WeaponRange;
  /** Si es cuerpo a cuerpo o a distancia */
  melee: boolean;
}

// ─── Armaduras ───────────────────────────────────────────────────────

export type ArmorType = "ligera" | "intermedia" | "pesada" | "escudo";

export const ARMOR_TYPE_NAMES: Record<ArmorType, string> = {
  ligera: "Armadura ligera",
  intermedia: "Armadura intermedia",
  pesada: "Armadura pesada",
  escudo: "Escudo",
};

export interface ArmorDetails {
  /** Tipo de armadura */
  armorType: ArmorType;
  /** CA base que otorga */
  baseAC: number;
  /** Si aplica modificador de Destreza a la CA */
  addDexModifier: boolean;
  /** Máximo de modificador de Destreza aplicable (null = sin límite) */
  maxDexBonus: number | null;
  /** Requisito de Fuerza mínima (null = sin requisito) */
  strengthRequirement: number | null;
  /** Si impone desventaja en pruebas de Sigilo */
  stealthDisadvantage: boolean;
  /** Tiempo para ponérsela */
  donTime?: string;
  /** Tiempo para quitársela */
  doffTime?: string;
}

// ─── Rareza de objetos mágicos ───────────────────────────────────────

export type ItemRarity =
  | "comun"
  | "poco_comun"
  | "raro"
  | "muy_raro"
  | "legendario"
  | "artefacto";

export const ITEM_RARITY_NAMES: Record<ItemRarity, string> = {
  comun: "Común",
  poco_comun: "Poco común",
  raro: "Raro",
  muy_raro: "Muy raro",
  legendario: "Legendario",
  artefacto: "Artefacto",
};

export const ITEM_RARITY_COLORS: Record<ItemRarity, string> = {
  comun: "#9ca3af",
  poco_comun: "#22c55e",
  raro: "#3b82f6",
  muy_raro: "#a855f7",
  legendario: "#f59e0b",
  artefacto: "#ef4444",
};

// ─── Propiedades de objeto mágico ────────────────────────────────────

export interface MagicItemDetails {
  /** Rareza del objeto */
  rarity: ItemRarity;
  /** Si requiere sintonización */
  requiresAttunement: boolean;
  /** Restricciones de sintonización (ej: "solo clérigos") */
  attunementRestriction?: string;
  /** Si está actualmente sintonizado con el personaje */
  attuned: boolean;
  /** Descripción de las propiedades mágicas */
  magicDescription?: string;
  /** Cargas (si el objeto tiene cargas) */
  charges?: {
    max: number;
    current: number;
    rechargeDescription?: string;
  };
}

// ─── Objeto de inventario ────────────────────────────────────────────

export interface InventoryItem {
  /** UUID del objeto en el inventario */
  id: string;
  /** Nombre del objeto */
  nombre: string;
  /** Descripción completa */
  descripcion?: string;
  /** Categoría del objeto */
  categoria: ItemCategory;
  /** Cantidad */
  cantidad: number;
  /** Peso individual en libras */
  peso: number;
  /** Valor en monedas de oro (1 = 1 po) */
  valor?: number;
  /** Si el objeto está equipado */
  equipado: boolean;
  /** Si es un objeto personalizado (no del SRD) */
  custom: boolean;
  /** ID de referencia al catálogo SRD (null si es custom) */
  srdId?: string;

  /** Detalles de arma (solo si categoria === 'arma') */
  weaponDetails?: WeaponDetails;
  /** Detalles de armadura (solo si categoria === 'armadura' o 'escudo') */
  armorDetails?: ArmorDetails;
  /** Detalles de objeto mágico (si es mágico) */
  magicDetails?: MagicItemDetails;

  /** Notas adicionales del jugador sobre este objeto */
  notas?: string;
}

// ─── Monedas ─────────────────────────────────────────────────────────

export type CoinType = "mc" | "mp" | "me" | "mo" | "mpl";

export const COIN_NAMES: Record<CoinType, string> = {
  mc: "Monedas de cobre",
  mp: "Monedas de plata",
  me: "Monedas de electro",
  mo: "Monedas de oro",
  mpl: "Monedas de platino",
};

export const COIN_ABBR: Record<CoinType, string> = {
  mc: "MC",
  mp: "MP",
  me: "ME",
  mo: "MO",
  mpl: "MPl",
};

export const COIN_ICONS: Record<CoinType, string> = {
  mc: "🟤",
  mp: "⚪",
  me: "🔵",
  mo: "🟡",
  mpl: "⚜️",
};

/**
 * Tasa de conversión a monedas de oro.
 * Ejemplo: 1 MC = 0.01 MO
 */
export const COIN_TO_GOLD_RATE: Record<CoinType, number> = {
  mc: 0.01,
  mp: 0.1,
  me: 0.5,
  mo: 1,
  mpl: 10,
};

export type Coins = Record<CoinType, number>;

export const DEFAULT_COINS: Coins = {
  mc: 0,
  mp: 0,
  me: 0,
  mo: 0,
  mpl: 0,
};

// ─── Transacción de monedas ──────────────────────────────────────────

export interface CoinTransaction {
  id: string;
  timestamp: string;
  type: "income" | "expense" | "conversion";
  coins: Partial<Coins>;
  description?: string;
}

// ─── Inventario completo ─────────────────────────────────────────────

export interface Inventory {
  /** UUID del inventario */
  id: string;
  /** UUID del personaje asociado */
  characterId: string;
  /** Lista de objetos */
  items: InventoryItem[];
  /** Monedas del personaje */
  coins: Coins;
  /** Historial de transacciones de monedas */
  coinTransactions: CoinTransaction[];
  /** Máximo de sintonizaciones activas (por defecto 3) */
  maxAttunements: number;
}

// ─── Packs de equipo predefinidos ────────────────────────────────────

export interface EquipmentPack {
  id: string;
  nombre: string;
  precio: number;
  descripcion: string;
  items: {
    srdId: string;
    nombre: string;
    cantidad: number;
  }[];
}

export const EQUIPMENT_PACK_IDS = [
  "pack_explorador_mazmorras",
  "pack_diplomatico",
  "pack_entretenedor",
  "pack_explorador",
  "pack_sacerdote",
  "pack_estudioso",
  "pack_ladron",
] as const;

export type EquipmentPackId = (typeof EQUIPMENT_PACK_IDS)[number];

// ─── Funciones utilitarias de inventario ─────────────────────────────

/**
 * Calcula el peso total de una lista de objetos.
 */
export function calcTotalWeight(items: InventoryItem[]): number {
  return items.reduce((total, item) => total + item.peso * item.cantidad, 0);
}

/**
 * Calcula el peso de las monedas (50 monedas = 1 lb).
 */
export function calcCoinWeight(coins: Coins): number {
  const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
  return totalCoins / 50;
}

/**
 * Calcula el peso total del inventario (objetos + monedas).
 */
export function calcInventoryWeight(inventory: Inventory): number {
  return calcTotalWeight(inventory.items) + calcCoinWeight(inventory.coins);
}

/**
 * Calcula la capacidad de carga máxima en libras.
 * Capacidad = Fuerza × 15
 */
export function calcCarryingCapacity(strengthScore: number): number {
  return strengthScore * 15;
}

/**
 * Determina si el personaje está sobrecargado.
 */
export function isEncumbered(currentWeight: number, strengthScore: number): boolean {
  return currentWeight > calcCarryingCapacity(strengthScore);
}

/**
 * Calcula el porcentaje de carga actual respecto al máximo.
 */
export function calcEncumbrancePercentage(
  currentWeight: number,
  strengthScore: number
): number {
  const capacity = calcCarryingCapacity(strengthScore);
  if (capacity === 0) return 0;
  return Math.min(100, Math.round((currentWeight / capacity) * 100));
}

/**
 * Convierte monedas a su equivalente total en monedas de oro.
 */
export function calcTotalGoldValue(coins: Coins): number {
  return Object.entries(coins).reduce((total, [type, count]) => {
    return total + count * COIN_TO_GOLD_RATE[type as CoinType];
  }, 0);
}

/**
 * Cuenta las sintonizaciones activas en el inventario.
 */
export function countActiveAttunements(items: InventoryItem[]): number {
  return items.filter(
    (item) => item.magicDetails?.requiresAttunement && item.magicDetails?.attuned
  ).length;
}

/**
 * Verifica si se puede sintonizar otro objeto.
 */
export function canAttune(inventory: Inventory): boolean {
  return countActiveAttunements(inventory.items) < inventory.maxAttunements;
}

/**
 * Obtiene los objetos equipados del inventario.
 */
export function getEquippedItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => item.equipado);
}

/**
 * Obtiene las armas equipadas.
 */
export function getEquippedWeapons(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => item.equipado && item.categoria === "arma");
}

/**
 * Obtiene la armadura equipada (solo puede haber una).
 */
export function getEquippedArmor(items: InventoryItem[]): InventoryItem | null {
  return (
    items.find((item) => item.equipado && item.categoria === "armadura") ?? null
  );
}

/**
 * Obtiene el escudo equipado (solo puede haber uno).
 */
export function getEquippedShield(items: InventoryItem[]): InventoryItem | null {
  return (
    items.find((item) => item.equipado && item.categoria === "escudo") ?? null
  );
}

/**
 * Calcula la CA basada en la armadura y el modificador de Destreza.
 *
 * - Sin armadura: 10 + mod. Destreza
 * - Armadura ligera: base + mod. Destreza
 * - Armadura intermedia: base + mod. Destreza (máx. +2)
 * - Armadura pesada: base fija
 * - Escudo: +2
 */
export function calcArmorClass(
  equippedArmor: InventoryItem | null,
  equippedShield: InventoryItem | null,
  dexModifier: number,
  miscBonus: number = 0
): {
  total: number;
  base: number;
  dexBonus: number;
  shieldBonus: number;
  miscBonus: number;
  breakdown: string;
} {
  let base: number;
  let dexBonus: number;
  let breakdownParts: string[] = [];

  if (!equippedArmor || !equippedArmor.armorDetails) {
    // Sin armadura: 10 + mod. Destreza
    base = 10;
    dexBonus = dexModifier;
    breakdownParts.push(`10 + DES (${dexModifier >= 0 ? "+" : ""}${dexModifier})`);
  } else {
    const armor = equippedArmor.armorDetails;
    base = armor.baseAC;

    if (!armor.addDexModifier) {
      // Armadura pesada: sin modificador de Destreza
      dexBonus = 0;
      breakdownParts.push(`${equippedArmor.nombre} (${base})`);
    } else if (armor.maxDexBonus !== null) {
      // Armadura intermedia: mod. Destreza con límite
      dexBonus = Math.min(dexModifier, armor.maxDexBonus);
      breakdownParts.push(
        `${equippedArmor.nombre} (${base}) + DES (${dexBonus >= 0 ? "+" : ""}${dexBonus}, máx. +${armor.maxDexBonus})`
      );
    } else {
      // Armadura ligera: mod. Destreza completo
      dexBonus = dexModifier;
      breakdownParts.push(
        `${equippedArmor.nombre} (${base}) + DES (${dexBonus >= 0 ? "+" : ""}${dexBonus})`
      );
    }
  }

  const shieldBonus = equippedShield?.armorDetails?.baseAC ?? 0;
  if (shieldBonus > 0) {
    breakdownParts.push(`Escudo (+${shieldBonus})`);
  }

  if (miscBonus !== 0) {
    breakdownParts.push(`Varios (${miscBonus >= 0 ? "+" : ""}${miscBonus})`);
  }

  const total = base + dexBonus + shieldBonus + miscBonus;

  return {
    total,
    base,
    dexBonus,
    shieldBonus,
    miscBonus,
    breakdown: breakdownParts.join(" + ") + ` = ${total}`,
  };
}

/**
 * Calcula el bonificador de ataque de un arma.
 *
 * - Arma cuerpo a cuerpo: mod. Fuerza + competencia
 * - Arma a distancia: mod. Destreza + competencia
 * - Arma sutil: usa el mayor entre Fuerza y Destreza
 */
export function calcWeaponAttackBonus(
  weapon: WeaponDetails,
  strModifier: number,
  dexModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  let abilityMod: number;

  if (weapon.properties.includes("sutil")) {
    // Armas sutiles: usar el mayor modificador
    abilityMod = Math.max(strModifier, dexModifier);
  } else if (weapon.melee) {
    abilityMod = strModifier;
  } else {
    abilityMod = dexModifier;
  }

  return abilityMod + (isProficient ? proficiencyBonus : 0);
}

/**
 * Calcula el modificador de daño de un arma.
 */
export function calcWeaponDamageModifier(
  weapon: WeaponDetails,
  strModifier: number,
  dexModifier: number
): number {
  if (weapon.properties.includes("sutil")) {
    return Math.max(strModifier, dexModifier);
  }
  return weapon.melee ? strModifier : dexModifier;
}

/**
 * Formatea el daño de un arma para mostrar.
 * Ejemplo: "1d8+3 cortante"
 */
export function formatWeaponDamage(
  damage: WeaponDamage,
  modifier: number
): string {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  return `${damage.dice}${modStr} ${damage.damageType}`;
}

/**
 * Crea un inventario vacío por defecto para un nuevo personaje.
 */
export function createDefaultInventory(
  inventoryId: string,
  characterId: string
): Inventory {
  return {
    id: inventoryId,
    characterId,
    items: [],
    coins: { ...DEFAULT_COINS },
    coinTransactions: [],
    maxAttunements: 3,
  };
}

/**
 * Crea un objeto de inventario vacío por defecto.
 */
export function createEmptyItem(id: string): InventoryItem {
  return {
    id,
    nombre: "",
    categoria: "otro",
    cantidad: 1,
    peso: 0,
    equipado: false,
    custom: true,
  };
}
