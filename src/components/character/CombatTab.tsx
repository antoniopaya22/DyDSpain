/**
 * CombatTab - Pestaña de combate del personaje
 * Muestra: HP tracker, clase de armadura, velocidad, salvaciones de muerte,
 * dados de golpe, condiciones activas, concentración, y log de combate.
 *
 * Sub-components extracted to src/components/combat/:
 *   HPTracker, DeathSavesTracker, HitDiceSection, ConditionsSection, CombatLog
 */

import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import { formatModifier } from "@/types/character";

// Extracted sub-components
import {
  HPTracker,
  DeathSavesTracker,
  HitDiceSection,
  ConditionsSection,
  CombatLog,
} from "@/components/combat";

// ─── Main Component ──────────────────────────────────────────────────

export default function CombatTab() {
  const { colors } = useTheme();
  const { dialogProps, showAlert, showConfirm } = useDialog();
  const {
    toastProps,
    showSuccess: toastSuccess,
    showInfo: toastInfo,
  } = useToast();

  const showToast = (message: string) => {
    toastInfo(message);
  };

  const {
    character,
    shortRest,
    longRest,
    clearConcentration,
    getArmorClass,
  } = useCharacterStore();

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-500 dark:text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  const { hp, hitDice, speed, concentration } = character;
  const ac = getArmorClass();

  // ── Actions ──

  const handleShortRest = () => {
    const buttons: Array<{
      text: string;
      style?: "default" | "cancel" | "destructive";
      onPress?: () => void;
    }> = [
      { text: "Cancelar", style: "cancel" as const },
      {
        text: "Ninguno",
        style: "default" as const,
        onPress: async () => {
          await shortRest(0);
          toastSuccess("Descanso corto completado");
        },
      },
    ];

    if (hitDice.remaining > 0) {
      buttons.push({
        text: `Usar 1`,
        style: "default" as const,
        onPress: async () => {
          const result = await shortRest(1);
          toastSuccess(
            `Descanso corto: +${result.hpRestored} PG`,
            `${result.diceUsed} dado(s) de golpe usados`,
          );
        },
      });
    }

    if (hitDice.remaining > 1) {
      buttons.push({
        text: `Usar todos (${hitDice.remaining})`,
        style: "default" as const,
        onPress: async () => {
          const result = await shortRest(hitDice.remaining);
          toastSuccess(
            `Descanso corto: +${result.hpRestored} PG`,
            `${result.diceUsed} dado(s) de golpe usados`,
          );
        },
      });
    }

    showConfirm(
      "Descanso Corto",
      `Tienes ${hitDice.remaining} dado(s) de golpe disponibles. ¿Cuántos quieres usar?`,
      async () => {
        await shortRest(0);
        toastSuccess("Descanso corto completado");
      },
      {
        confirmText: "Descansar sin dados",
        cancelText: "Cancelar",
        type: "info",
      },
    );
  };

  const handleLongRest = () => {
    showConfirm(
      "Descanso Largo",
      "¿Realizar un descanso largo?\n\n• Recuperas todos los PG\n• Recuperas la mitad de tus dados de golpe\n• Se restauran espacios de conjuro\n• Se restauran rasgos con recarga",
      async () => {
        await longRest();
        toastSuccess("Descanso largo completado", "¡PG al máximo!");
      },
      { confirmText: "Descansar", cancelText: "Cancelar", type: "info" },
    );
  };

  // ── Render Sections (kept inline — small enough) ──

  const renderStatsRow = () => (
    <View className="flex-row mb-4">
      {/* Armor Class */}
      <View className="flex-1 bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mr-2 items-center">
        <View className="h-14 w-14 rounded-full bg-blue-500/15 items-center justify-center mb-1">
          <Ionicons name="shield" size={28} color={colors.accentBlue} />
        </View>
        <Text className="text-dark-900 dark:text-white text-2xl font-bold">
          {ac}
        </Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Clase de Armadura
        </Text>
      </View>

      {/* Initiative */}
      <View className="flex-1 bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mx-1 items-center">
        <View className="h-14 w-14 rounded-full bg-amber-500/15 items-center justify-center mb-1">
          <Ionicons name="flash" size={28} color={colors.accentAmber} />
        </View>
        <Text className="text-dark-900 dark:text-white text-2xl font-bold">
          {formatModifier(character.abilityScores.des.modifier)}
        </Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Iniciativa
        </Text>
      </View>

      {/* Speed */}
      <View className="flex-1 bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 ml-2 items-center">
        <View className="h-14 w-14 rounded-full bg-green-500/15 items-center justify-center mb-1">
          <Ionicons name="footsteps" size={28} color={colors.accentGreen} />
        </View>
        <Text className="text-dark-900 dark:text-white text-2xl font-bold">
          {speed.walk}
        </Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Velocidad (pies)
        </Text>
      </View>
    </View>
  );

  const renderConcentration = () => {
    if (!concentration) return null;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-purple-500/30 p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="eye" size={20} color={colors.accentPurple} />
            <View className="ml-3 flex-1">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider">
                Concentración
              </Text>
              <Text className="text-purple-300 text-sm font-semibold">
                {concentration.spellName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-1.5 active:bg-gray-300 dark:active:bg-dark-600"
            onPress={() => {
              showConfirm(
                "Romper Concentración",
                `¿Dejar de concentrarte en "${concentration.spellName}"?`,
                clearConcentration,
                {
                  confirmText: "Romper",
                  cancelText: "Cancelar",
                  type: "danger",
                },
              );
            }}
          >
            <Text className="text-red-400 text-xs font-semibold">Romper</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRestButtons = () => (
    <View className="flex-row mb-4">
      <TouchableOpacity
        className="flex-1 bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mr-2 items-center active:bg-gray-50 dark:active:bg-surface-light"
        onPress={handleShortRest}
      >
        <Ionicons name="cafe-outline" size={24} color={colors.accentAmber} />
        <Text className="text-dark-900 dark:text-white text-sm font-semibold mt-1">
          Descanso Corto
        </Text>
        <Text className="text-dark-400 text-[10px] mt-0.5">
          Usa dados de golpe
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 ml-2 items-center active:bg-gray-50 dark:active:bg-surface-light"
        onPress={handleLongRest}
      >
        <Ionicons name="moon-outline" size={24} color={colors.accentBlue} />
        <Text className="text-dark-900 dark:text-white text-sm font-semibold mt-1">
          Descanso Largo
        </Text>
        <Text className="text-dark-400 text-[10px] mt-0.5">Recupera todo</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <HPTracker onShowToast={showToast} />
        {renderStatsRow()}
        <DeathSavesTracker
          onShowAlert={showAlert}
          onShowConfirm={showConfirm}
        />
        {renderConcentration()}
        <HitDiceSection onShowToast={showToast} />
        <ConditionsSection
          onShowToast={showToast}
          onShowConfirm={showConfirm}
        />
        {renderRestButtons()}
        <CombatLog />
      </ScrollView>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </View>
  );
}
