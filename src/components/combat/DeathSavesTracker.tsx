/**
 * DeathSavesTracker - Death saving throw tracker
 *
 * Shows success/failure circles and +1 buttons, only visible when unconscious.
 * Extracted from CombatTab.tsx
 */

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { useTheme } from "@/hooks";
import type { DialogType } from "@/components/ui/ConfirmDialog";

/** D&D 5e: 3 death saves needed to stabilize or die */
const MAX_DEATH_SAVES = 3;
const DEATH_SAVE_INDICES = Array.from({ length: MAX_DEATH_SAVES }, (_, i) => i);

interface DeathSavesTrackerProps {
  onShowAlert: (
    title: string,
    message?: string,
    options?: { type?: DialogType; buttonText?: string },
  ) => void;
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

export function DeathSavesTracker({
  onShowAlert,
  onShowConfirm,
}: DeathSavesTrackerProps) {
  const { colors } = useTheme();
  const { character, addDeathSuccess, addDeathFailure, resetDeathSaves } =
    useCharacterStore();

  if (!character) return null;

  const { hp, deathSaves } = character;
  const isUnconscious = hp.current === 0;

  if (!isUnconscious) return null;

  const handleDeathSuccess = async () => {
    const result = await addDeathSuccess();
    if (result === "stable") {
      onShowAlert(
        "¡Estabilizado!",
        "Has conseguido 3 éxitos. Tu personaje se estabiliza con 1 PG.",
        { type: "success", buttonText: "OK" },
      );
    }
  };

  const handleDeathFailure = async () => {
    const result = await addDeathFailure();
    if (result === "dead") {
      onShowAlert(
        "Muerte",
        "Has acumulado 3 fallos. Tu personaje ha muerto.",
        { type: "danger", buttonText: "OK" },
      );
    }
  };

  return (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-red-500/30 p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons
          name="skull-outline"
          size={20}
          color={colors.accentDanger}
        />
        <Text className="text-red-400 text-sm font-semibold ml-2 uppercase tracking-wider">
          Salvaciones de Muerte
        </Text>
      </View>

      {/* Successes */}
      <View className="flex-row items-center mb-3">
        <Text className="text-green-600 dark:text-green-400 text-sm font-medium w-16">
          Éxitos
        </Text>
        <View className="flex-row flex-1 justify-center">
          {DEATH_SAVE_INDICES.map((i) => (
            <View
              key={`s-${i}`}
              className="h-8 w-8 rounded-full mx-1 items-center justify-center border-2"
              style={{
                backgroundColor:
                  i < deathSaves.successes
                    ? colors.accentGreen
                    : "transparent",
                borderColor:
                  i < deathSaves.successes
                    ? colors.accentGreen
                    : colors.borderDefault,
              }}
            >
              {i < deathSaves.successes && (
                <Ionicons name="checkmark" size={18} color="white" />
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="bg-green-600/80 rounded-lg px-3 py-2 active:bg-green-700"
          onPress={handleDeathSuccess}
        >
          <Text className="text-dark-900 dark:text-white text-xs font-bold">
            +1
          </Text>
        </TouchableOpacity>
      </View>

      {/* Failures */}
      <View className="flex-row items-center mb-3">
        <Text className="text-red-400 text-sm font-medium w-16">Fallos</Text>
        <View className="flex-row flex-1 justify-center">
          {DEATH_SAVE_INDICES.map((i) => (
            <View
              key={`f-${i}`}
              className="h-8 w-8 rounded-full mx-1 items-center justify-center border-2"
              style={{
                backgroundColor:
                  i < deathSaves.failures
                    ? colors.accentDanger
                    : "transparent",
                borderColor:
                  i < deathSaves.failures
                    ? colors.accentDanger
                    : colors.borderDefault,
              }}
            >
              {i < deathSaves.failures && (
                <Ionicons name="close" size={18} color="white" />
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          className="bg-red-600/80 rounded-lg px-3 py-2 active:bg-red-700"
          onPress={handleDeathFailure}
        >
          <Text className="text-dark-900 dark:text-white text-xs font-bold">
            +1
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        className="bg-gray-200 dark:bg-dark-700 rounded-lg py-2 items-center active:bg-gray-300 dark:active:bg-dark-600"
        onPress={() => {
          onShowConfirm(
            "Reiniciar Salvaciones",
            "¿Reiniciar las salvaciones de muerte?",
            resetDeathSaves,
            {
              confirmText: "Reiniciar",
              cancelText: "Cancelar",
              type: "warning",
            },
          );
        }}
      >
        <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold">
          Reiniciar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
