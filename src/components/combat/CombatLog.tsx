/**
 * CombatLog - Collapsible combat history log
 *
 * Shows timestamped entries of damage, healing, rests, death saves, etc.
 * Extracted from CombatTab.tsx
 */

import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { useTheme } from "@/hooks";
import type { ThemeColors } from "@/utils/theme";

// ─── Static config (hoisted out of render) ───────────────────────────

type LogTypeConfig = { icon: keyof typeof Ionicons.glyphMap; color: string };

const COMBAT_LOG_TYPE_KEYS: Record<string, { icon: keyof typeof Ionicons.glyphMap; colorKey: keyof ThemeColors }> = {
  damage:     { icon: "flash",  colorKey: "accentDanger" },
  healing:    { icon: "heart",  colorKey: "accentGreen" },
  temp_hp:    { icon: "shield", colorKey: "accentBlue" },
  hit_dice:   { icon: "dice",   colorKey: "accentPurple" },
  death_save: { icon: "skull",  colorKey: "accentAmber" },
  rest:       { icon: "moon",   colorKey: "accentLightBlue" },
};

function getLogTypeConfig(
  type: string,
  colors: ThemeColors,
): LogTypeConfig {
  const entry = COMBAT_LOG_TYPE_KEYS[type];
  if (entry) return { icon: entry.icon, color: colors[entry.colorKey] as string };
  return { icon: "ellipse", color: colors.textMuted };
}

// ─── Component ───────────────────────────────────────────────────────

export function CombatLog() {
  const { colors } = useTheme();
  const { character } = useCharacterStore();
  const [showLog, setShowLog] = useState(false);

  if (!character) return null;

  const { combatLog } = character;

  return (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4 active:bg-gray-50 dark:active:bg-surface-light"
        onPress={() => setShowLog(!showLog)}
      >
        <Ionicons
          name="document-text-outline"
          size={20}
          color={colors.accentGold}
        />
        <Text className="text-dark-900 dark:text-white text-sm font-semibold flex-1 ml-3">
          Registro de Combate
        </Text>
        <Text className="text-dark-400 text-xs mr-2">
          {combatLog.length} entradas
        </Text>
        <Ionicons
          name={showLog ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>

      {showLog && (
        <View className="px-4 pb-4 border-t border-dark-100 dark:border-surface-border/50">
          {combatLog.length === 0 ? (
            <Text className="text-dark-400 text-sm italic mt-3">
              Sin entradas en el registro
            </Text>
          ) : (
            combatLog.slice(0, 20).map((entry) => {
              const cfg = getLogTypeConfig(entry.type, colors);

              return (
                <View
                  key={entry.id}
                  className="flex-row items-start py-2 border-b border-dark-100 dark:border-surface-border/30"
                >
                  <Ionicons
                    name={cfg.icon}
                    size={14}
                    color={cfg.color}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1 ml-2">
                    <Text className="text-dark-600 dark:text-dark-200 text-xs">
                      {entry.description ?? entry.type}
                    </Text>
                    <Text className="text-dark-300 dark:text-dark-500 text-[10px]">
                      PG después: {entry.hpAfter} ·{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );
}
