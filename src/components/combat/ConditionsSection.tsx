/**
 * ConditionsSection - Active conditions display and picker
 *
 * Shows active D&D conditions as removable chips and an inline picker.
 * Extracted from CombatTab.tsx
 */

import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { useTheme } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import { CONDITION_NAMES, type Condition } from "@/types/character";
import { ALL_CONDITIONS } from "@/utils/combat";
import type { DialogType } from "@/components/ui/ConfirmDialog";

interface ConditionsSectionProps {
  onShowToast: (message: string) => void;
  onShowConfirm: (
    title: string,
    message?: string,
    onConfirm?: () => void,
    options?: {
      confirmText?: string;
      cancelText?: string;
      type?: DialogType;
    },
  ) => void;
}

export function ConditionsSection({
  onShowToast,
  onShowConfirm,
}: ConditionsSectionProps) {
  const { colors } = useTheme();
  const { character, addCondition, removeCondition, clearConditions } =
    useCharacterStore();
  const [showPicker, setShowPicker] = useState(false);

  if (!character) return null;

  const { conditions } = character;

  const handleAddCondition = (condition: Condition) => {
    addCondition(condition);
    setShowPicker(false);
    onShowToast(`Condición añadida: ${CONDITION_NAMES[condition]}`);
  };

  return (
    <View className="rounded-card border p-4 mb-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons
            name="warning-outline"
            size={20}
            color={colors.accentAmber}
          />
          <Text className="text-xs font-semibold uppercase tracking-wider ml-2" style={{ color: colors.textSecondary }}>
            Condiciones
          </Text>
        </View>
        <View className="flex-row">
          {conditions.length > 0 && (
            <TouchableOpacity
              className="mr-2 px-2 py-1 rounded-md"
              onPress={() => {
                onShowConfirm(
                  "Limpiar condiciones",
                  "¿Eliminar todas las condiciones?",
                  clearConditions,
                  {
                    confirmText: "Limpiar",
                    cancelText: "Cancelar",
                    type: "warning",
                  },
                );
              }}
            >
              <Text className="text-xs font-semibold" style={{ color: colors.accentDanger }}>
                Limpiar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="rounded-lg px-3 py-1"
            style={{ backgroundColor: withAlpha(colors.accentAmber, 0.8) }}
            onPress={() => setShowPicker(!showPicker)}
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active conditions */}
      {conditions.length === 0 ? (
        <Text className="text-sm italic" style={{ color: colors.textMuted }}>
          Sin condiciones activas
        </Text>
      ) : (
        <View className="flex-row flex-wrap">
          {conditions.map((c) => (
            <TouchableOpacity
              key={c.condition}
              className="flex-row items-center border rounded-full px-3 py-1.5 mr-2 mb-2"
              style={{ backgroundColor: withAlpha(colors.accentAmber, 0.15), borderColor: withAlpha(colors.accentAmber, 0.3) }}
              onPress={() => removeCondition(c.condition)}
            >
              <Text className="text-xs font-semibold" style={{ color: colors.accentAmber }}>
                {CONDITION_NAMES[c.condition]}
              </Text>
              <Ionicons
                name="close-circle"
                size={14}
                color={colors.accentAmber}
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Condition Picker */}
      {showPicker && (
        <View className="mt-3 pt-3 border-t" style={{ borderColor: colors.borderDefault }}>
          <Text className="text-xs mb-2" style={{ color: colors.textSecondary }}>
            Pulsa para añadir una condición:
          </Text>
          <View className="flex-row flex-wrap">
            {ALL_CONDITIONS.filter(
              (c) => !conditions.some((ac) => ac.condition === c),
            ).map((c) => (
              <TouchableOpacity
                key={c}
                className="border rounded-full px-3 py-1.5 mr-2 mb-2"
                style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}
                onPress={() => handleAddCondition(c)}
              >
                <Text className="text-xs" style={{ color: colors.textSecondary }}>
                  {CONDITION_NAMES[c]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}
