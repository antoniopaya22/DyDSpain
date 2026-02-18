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
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons
            name="warning-outline"
            size={20}
            color={colors.accentAmber}
          />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Condiciones
          </Text>
        </View>
        <View className="flex-row">
          {conditions.length > 0 && (
            <TouchableOpacity
              className="mr-2 px-2 py-1 rounded-md active:bg-gray-300 dark:active:bg-dark-600"
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
              <Text className="text-red-400 text-xs font-semibold">
                Limpiar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-amber-600/80 rounded-lg px-3 py-1 active:bg-amber-700"
            onPress={() => setShowPicker(!showPicker)}
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active conditions */}
      {conditions.length === 0 ? (
        <Text className="text-dark-400 text-sm italic">
          Sin condiciones activas
        </Text>
      ) : (
        <View className="flex-row flex-wrap">
          {conditions.map((c) => (
            <TouchableOpacity
              key={c.condition}
              className="flex-row items-center bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1.5 mr-2 mb-2"
              onPress={() => removeCondition(c.condition)}
            >
              <Text className="text-amber-400 text-xs font-semibold">
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
        <View className="mt-3 pt-3 border-t border-dark-100 dark:border-surface-border/50">
          <Text className="text-dark-500 dark:text-dark-300 text-xs mb-2">
            Pulsa para añadir una condición:
          </Text>
          <View className="flex-row flex-wrap">
            {ALL_CONDITIONS.filter(
              (c) => !conditions.some((ac) => ac.condition === c),
            ).map((c) => (
              <TouchableOpacity
                key={c}
                className="bg-gray-200 dark:bg-dark-700 border border-dark-100 dark:border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2 active:bg-gray-300 dark:active:bg-dark-600"
                onPress={() => handleAddCondition(c)}
              >
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
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
