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
        <View className="rounded-t-3xl border-t" style={{ backgroundColor: colors.bgPrimary, borderColor: colors.borderDefault }}>
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-lg font-bold" style={{ color: colors.textPrimary }}>
              Gestionar Monedas
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full items-center justify-center"
              style={{ backgroundColor: colors.bgSecondary }}
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Operation toggle */}
            <View className="flex-row mb-4 rounded-xl p-1" style={{ backgroundColor: colors.bgSecondary }}>
              <TouchableOpacity
                className="flex-1 rounded-lg py-2.5 items-center"
                style={{ backgroundColor: operation === "add" ? "rgba(22, 163, 74, 0.8)" : "transparent" }}
                onPress={() => setOperation("add")}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: operation === "add" ? colors.textPrimary : colors.textMuted }}
                >
                  Añadir
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 rounded-lg py-2.5 items-center"
                style={{ backgroundColor: operation === "remove" ? "rgba(220, 38, 38, 0.8)" : "transparent" }}
                onPress={() => setOperation("remove")}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: operation === "remove" ? colors.textPrimary : colors.textMuted }}
                >
                  Gastar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Current coins display */}
            <View className="rounded-xl p-3 mb-4 border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}>
              <Text className="text-[10px] uppercase tracking-wider mb-2" style={{ color: colors.textMuted }}>
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
                    <Text className="text-[9px]" style={{ color: colors.textMuted }}>
                      {COIN_ABBR[type]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Coin inputs */}
            <Text className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: colors.textSecondary }}>
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
                  className="flex-1 rounded-xl px-4 py-2.5 text-sm border ml-3"
                  style={{ backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderDefault }}
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
            <Text className="text-xs font-semibold uppercase tracking-wider mb-1.5 mt-3" style={{ color: colors.textSecondary }}>
              Descripción (opcional)
            </Text>
            <TextInput
              className="rounded-xl px-4 py-3 text-sm border mb-6"
              style={{ backgroundColor: colors.bgInput, color: colors.textPrimary, borderColor: colors.borderDefault }}
              placeholder="Ej: Recompensa por misión"
              placeholderTextColor={colors.textMuted}
              value={description}
              onChangeText={setDescription}
              maxLength={100}
            />

            {/* Submit */}
            <TouchableOpacity
              className="rounded-xl py-4 items-center"
              style={{ backgroundColor: operation === "add" ? "#16a34a" : "#dc2626" }}
              onPress={handleSubmit}
            >
              <Text className="font-bold text-base" style={{ color: colors.textPrimary }}>
                {operation === "add" ? "Añadir Monedas" : "Gastar Monedas"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3 items-center"
              onPress={onClose}
            >
              <Text className="font-semibold text-sm" style={{ color: colors.textSecondary }}>
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
