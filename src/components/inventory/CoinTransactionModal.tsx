/**
 * CoinTransactionModal - Bottom-sheet modal for adding/spending coins
 *
 * Toggle between add/remove, shows current coin balances,
 * inputs for each coin type, and optional description.
 * Extracted from InventoryTab.tsx
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import {
  COIN_NAMES,
  COIN_ABBR,
  COIN_ICONS,
  type CoinType,
} from "@/types/item";
import { useTheme } from "@/hooks";

const COIN_ORDER: CoinType[] = ["mpl", "mo", "me", "mp", "mc"];

// Real-world metal colors for coin badges (theme-independent)
const COIN_COLORS: Record<CoinType, string> = {
  mc: "#b45309",
  mp: "#9ca3af",
  me: "#3b82f6",
  mo: "#f59e0b",
  mpl: "#a78bfa",
};

interface CoinTransactionModalProps {
  visible: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export function CoinTransactionModal({
  visible,
  onClose,
  onShowToast,
}: CoinTransactionModalProps) {
  const { colors } = useTheme();
  const { inventory, addCoinTransaction } = useCharacterStore();

  const [operation, setOperation] = useState<"add" | "remove">("add");
  const [amounts, setAmounts] = useState<Record<CoinType, string>>({
    mc: "",
    mp: "",
    me: "",
    mo: "",
    mpl: "",
  });
  const [description, setDescription] = useState("");

  const handleSubmit = async () => {
    const coins: Partial<Record<CoinType, number>> = {};
    let hasAny = false;

    for (const type of COIN_ORDER) {
      const amount = parseInt(amounts[type], 10);
      if (!isNaN(amount) && amount > 0) {
        coins[type] = amount;
        hasAny = true;
      }
    }

    if (!hasAny) {
      onShowToast("Introduce al menos una cantidad");
      return;
    }

    await addCoinTransaction({
      type: operation === "add" ? "income" : "expense",
      coins,
      description:
        description.trim() || (operation === "add" ? "Ingreso" : "Gasto"),
    });

    // Reset
    setAmounts({ mc: "", mp: "", me: "", mo: "", mpl: "" });
    setDescription("");
    onClose();
    onShowToast(
      operation === "add" ? "Monedas añadidas" : "Monedas gastadas",
    );
  };

  if (!inventory) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-gray-50 dark:bg-dark-800 rounded-t-3xl border-t border-dark-100 dark:border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-dark-900 dark:text-white text-lg font-bold">
              Gestionar Monedas
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center"
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Operation toggle */}
            <View className="flex-row mb-4 bg-gray-200 dark:bg-dark-700 rounded-xl p-1">
              <TouchableOpacity
                className={`flex-1 rounded-lg py-2.5 items-center ${
                  operation === "add" ? "bg-green-600/80" : "bg-transparent"
                }`}
                onPress={() => setOperation("add")}
              >
                <Text
                  className={`text-sm font-semibold ${
                    operation === "add"
                      ? "text-dark-900 dark:text-white"
                      : "text-dark-400"
                  }`}
                >
                  Añadir
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-lg py-2.5 items-center ${
                  operation === "remove" ? "bg-red-600/80" : "bg-transparent"
                }`}
                onPress={() => setOperation("remove")}
              >
                <Text
                  className={`text-sm font-semibold ${
                    operation === "remove"
                      ? "text-dark-900 dark:text-white"
                      : "text-dark-400"
                  }`}
                >
                  Gastar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Current coins display */}
            <View className="bg-gray-200 dark:bg-dark-700 rounded-xl p-3 mb-4 border border-dark-100 dark:border-surface-border">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-2">
                Monedas actuales
              </Text>
              <View className="flex-row justify-between">
                {COIN_ORDER.map((type) => (
                  <View key={type} className="items-center">
                    <Text className="text-xs mb-0.5">{COIN_ICONS[type]}</Text>
                    <Text
                      className="text-sm font-bold"
                      style={{ color: COIN_COLORS[type] }}
                    >
                      {inventory.coins[type]}
                    </Text>
                    <Text className="text-dark-300 dark:text-dark-500 text-[9px]">
                      {COIN_ABBR[type]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Coin inputs */}
            <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Cantidades a {operation === "add" ? "añadir" : "gastar"}
            </Text>
            {COIN_ORDER.map((type) => (
              <View key={type} className="flex-row items-center mb-2">
                <View className="flex-row items-center w-28">
                  <Text className="text-base mr-1.5">{COIN_ICONS[type]}</Text>
                  <Text
                    className="text-sm font-medium"
                    style={{ color: COIN_COLORS[type] }}
                  >
                    {COIN_NAMES[type]}
                  </Text>
                </View>
                <TextInput
                  className="flex-1 bg-gray-100 dark:bg-surface rounded-xl px-4 py-2.5 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border ml-3"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={amounts[type]}
                  onChangeText={(val) =>
                    setAmounts({ ...amounts, [type]: val })
                  }
                />
              </View>
            ))}

            {/* Description */}
            <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5 mt-3">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-6"
              placeholder="Ej: Recompensa por misión"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              maxLength={100}
            />

            {/* Submit */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                operation === "add"
                  ? "bg-green-600 active:bg-green-700"
                  : "bg-red-600 active:bg-red-700"
              }`}
              onPress={handleSubmit}
            >
              <Text className="text-dark-900 dark:text-white font-bold text-base">
                {operation === "add" ? "Añadir Monedas" : "Gastar Monedas"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3 items-center active:bg-gray-50 dark:active:bg-surface-light"
              onPress={onClose}
            >
              <Text className="text-dark-500 dark:text-dark-300 font-semibold text-sm">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
