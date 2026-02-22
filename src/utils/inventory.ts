/**
 * Inventory utility functions — weight, encumbrance, AC, weapon calcs.
 * Extracted from types/item.ts for separation of concerns.
 */
import type {
  InventoryItem,
  Inventory,
  Coins,
  CoinType,
  WeaponDetails,
  WeaponDamage,
} from "@/types/item";
import { COIN_TO_GOLD_RATE, DEFAULT_COINS } from "@/constants/items";

// ─── Peso y carga ────────────────────────────────────────────────────

export function calcTotalWeight(items: InventoryItem[]): number {
  return items.reduce((total, item) => total + item.peso * item.cantidad, 0);
}

export function calcCoinWeight(coins: Coins): number {
  const totalCoins = Object.values(coins).reduce((sum, count) => sum + count, 0);
  return totalCoins / 50;
}

export function calcInventoryWeight(inventory: Inventory): number {
  return calcTotalWeight(inventory.items) + calcCoinWeight(inventory.coins);
}

export function calcCarryingCapacity(strengthScore: number): number {
  return strengthScore * 15;
}

export function isEncumbered(currentWeight: number, strengthScore: number): boolean {
  return currentWeight > calcCarryingCapacity(strengthScore);
}

export function calcEncumbrancePercentage(
  currentWeight: number,
  strengthScore: number
): number {
  const capacity = calcCarryingCapacity(strengthScore);
  if (capacity === 0) return 0;
  return Math.min(100, Math.round((currentWeight / capacity) * 100));
}

// ─── Monedas ─────────────────────────────────────────────────────────

export function calcTotalGoldValue(coins: Coins): number {
  return Object.entries(coins).reduce((total, [type, count]) => {
    return total + count * COIN_TO_GOLD_RATE[type as CoinType];
  }, 0);
}

// ─── Sintonización ───────────────────────────────────────────────────

export function countActiveAttunements(items: InventoryItem[]): number {
  return items.filter(
    (item) => item.magicDetails?.requiresAttunement && item.magicDetails?.attuned
  ).length;
}

export function canAttune(inventory: Inventory): boolean {
  return countActiveAttunements(inventory.items) < inventory.maxAttunements;
}

// ─── Equipamiento ────────────────────────────────────────────────────

export function getEquippedItems(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => item.equipado);
}

export function getEquippedWeapons(items: InventoryItem[]): InventoryItem[] {
  return items.filter((item) => item.equipado && item.categoria === "arma");
}

export function getEquippedArmor(items: InventoryItem[]): InventoryItem | null {
  return (
    items.find((item) => item.equipado && item.categoria === "armadura") ?? null
  );
}

export function getEquippedShield(items: InventoryItem[]): InventoryItem | null {
  return (
    items.find((item) => item.equipado && item.categoria === "escudo") ?? null
  );
}

// ─── Clase de armadura ───────────────────────────────────────────────

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
    base = 10;
    dexBonus = dexModifier;
    breakdownParts.push(`10 + DES (${dexModifier >= 0 ? "+" : ""}${dexModifier})`);
  } else {
    const armor = equippedArmor.armorDetails;
    base = armor.baseAC;

    if (!armor.addDexModifier) {
      dexBonus = 0;
      breakdownParts.push(`${equippedArmor.nombre} (${base})`);
    } else if (armor.maxDexBonus !== null) {
      dexBonus = Math.min(dexModifier, armor.maxDexBonus);
      breakdownParts.push(
        `${equippedArmor.nombre} (${base}) + DES (${dexBonus >= 0 ? "+" : ""}${dexBonus}, máx. +${armor.maxDexBonus})`
      );
    } else {
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

// ─── Armas ───────────────────────────────────────────────────────────

export function calcWeaponAttackBonus(
  weapon: WeaponDetails,
  strModifier: number,
  dexModifier: number,
  proficiencyBonus: number,
  isProficient: boolean
): number {
  let abilityMod: number;

  if (weapon.properties.includes("sutil")) {
    abilityMod = Math.max(strModifier, dexModifier);
  } else if (weapon.melee) {
    abilityMod = strModifier;
  } else {
    abilityMod = dexModifier;
  }

  return abilityMod + (isProficient ? proficiencyBonus : 0);
}

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

export function formatWeaponDamage(
  damage: WeaponDamage,
  modifier: number,
  bonusDamage?: WeaponDamage,
): string {
  const modStr = modifier >= 0 ? `+${modifier}` : `${modifier}`;
  let result = `${damage.dice}${modStr} ${damage.damageType}`;
  if (bonusDamage) {
    result += ` +${bonusDamage.dice} ${bonusDamage.damageType}`;
  }
  return result;
}

// ─── Factoría ────────────────────────────────────────────────────────

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
