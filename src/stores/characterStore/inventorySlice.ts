/**
 * Inventory Slice — Items, coins, transactions.
 * Handles all inventory-related state management for the character store.
 */

import { randomUUID } from "expo-crypto";
import type { Inventory, InventoryItem, Coins, CoinType, CoinTransaction } from "@/types/item";
import { STORAGE_KEYS, getItem } from "@/utils/storage";
import { now } from "@/utils/providers";
import { safeSetItem } from "./helpers";
import type { CharacterStore, InventorySliceState, InventoryActions } from "./types";

type SetState = (partial: Partial<CharacterStore>) => void;
type GetState = () => CharacterStore;

export const INVENTORY_INITIAL_STATE: InventorySliceState = {
  inventory: null,
};

export function createInventorySlice(
  set: SetState,
  get: GetState,
): InventoryActions {
  return {
    loadInventory: async (characterId: string) => {
      try {
        const invKey = STORAGE_KEYS.INVENTORY(characterId);
        const inventory = await getItem<Inventory>(invKey);
        if (inventory) {
          set({ inventory });
        }
      } catch (err) {
        console.error("[InventorySlice] loadInventory:", err);
      }
    },

    addItem: async (item: Omit<InventoryItem, "id">) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const newItem: InventoryItem = {
        ...item,
        id: randomUUID(),
      };

      const updatedInventory: Inventory = {
        ...inventory,
        items: [...inventory.items, newItem],
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },

    updateItem: async (itemId: string, updates: Partial<InventoryItem>) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const updatedItems = inventory.items.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      );

      const updatedInventory: Inventory = {
        ...inventory,
        items: updatedItems,
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },

    removeItem: async (itemId: string) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const updatedInventory: Inventory = {
        ...inventory,
        items: inventory.items.filter((item) => item.id !== itemId),
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },

    toggleEquipItem: async (itemId: string) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const updatedItems = inventory.items.map((item) =>
        item.id === itemId ? { ...item, equipado: !item.equipado } : item,
      );

      const updatedInventory: Inventory = {
        ...inventory,
        items: updatedItems,
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },

    updateCoins: async (coins: Partial<Coins>) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const updatedCoins: Coins = {
        ...inventory.coins,
        ...coins,
      };

      // Clamp to 0
      for (const key of Object.keys(updatedCoins) as CoinType[]) {
        updatedCoins[key] = Math.max(0, updatedCoins[key]);
      }

      const updatedInventory: Inventory = {
        ...inventory,
        coins: updatedCoins,
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },

    addCoinTransaction: async (
      transaction: Omit<CoinTransaction, "id" | "timestamp">,
    ) => {
      const { character, inventory } = get();
      if (!character || !inventory) return;

      const newTransaction: CoinTransaction = {
        ...transaction,
        id: randomUUID(),
        timestamp: now(),
      };

      // Apply the transaction to coins
      const updatedCoins = { ...inventory.coins };
      if (transaction.coins) {
        for (const [type, amount] of Object.entries(transaction.coins)) {
          const coinType = type as CoinType;
          if (transaction.type === "income") {
            updatedCoins[coinType] =
              (updatedCoins[coinType] ?? 0) + (amount ?? 0);
          } else if (transaction.type === "expense") {
            updatedCoins[coinType] = Math.max(
              0,
              (updatedCoins[coinType] ?? 0) - (amount ?? 0),
            );
          }
        }
      }

      const updatedInventory: Inventory = {
        ...inventory,
        coins: updatedCoins,
        coinTransactions: [newTransaction, ...inventory.coinTransactions].slice(
          0,
          50,
        ),
      };

      set({ inventory: updatedInventory });
      await safeSetItem(STORAGE_KEYS.INVENTORY(character.id), updatedInventory);
    },
  };
}
