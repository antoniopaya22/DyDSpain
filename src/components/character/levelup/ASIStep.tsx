import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import {
  ABILITY_NAMES,
  ABILITY_ABBR,
  calcModifier,
  formatModifier,
  type AbilityKey,
} from "@/types/character";
import { ASI_POINTS, MAX_ABILITY_SCORE } from "@/data/srd/leveling";
import { ABILITY_KEYS, ABILITY_COLORS } from "./useLevelUpWizard";
import type { Character } from "@/types/character";

interface ASIStepProps {
  asiPoints: Record<AbilityKey, number>;
  asiRemaining: number;
  totalASIUsed: number;
  incrementASI: (key: AbilityKey) => void;
  decrementASI: (key: AbilityKey) => void;
  character: Character;
}

export default function ASIStep({
  asiPoints,
  asiRemaining,
  totalASIUsed,
  incrementASI,
  decrementASI,
  character,
}: ASIStepProps) {
  const { colors } = useTheme();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 14,
          fontWeight: "500",
          textAlign: "center",
          marginBottom: 8,
          lineHeight: 20,
        }}
      >
        Reparte {ASI_POINTS} puntos entre tus características.{"\n"}
        Puedes poner ambos en una o repartirlos.
      </Text>

      {/* Points remaining */}
      <View
        style={{
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor:
              asiRemaining > 0
                ? "rgba(251, 191, 36, 0.12)"
                : "rgba(34, 197, 94, 0.12)",
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 6,
            borderWidth: 1,
            borderColor:
              asiRemaining > 0
                ? "rgba(251, 191, 36, 0.3)"
                : "rgba(34, 197, 94, 0.3)",
            gap: 6,
          }}
        >
          <Ionicons
            name={asiRemaining > 0 ? "ellipsis-horizontal" : "checkmark-circle"}
            size={16}
            color={asiRemaining > 0 ? colors.accentGold : colors.accentGreen}
          />
          <Text
            style={{
              color: asiRemaining > 0 ? colors.accentGold : colors.accentGreen,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {asiRemaining > 0
              ? `${asiRemaining} punto${asiRemaining > 1 ? "s" : ""} restante${asiRemaining > 1 ? "s" : ""}`
              : "¡Puntos repartidos!"}
          </Text>
        </View>
      </View>

      {/* Ability score list */}
      <View style={{ gap: 8 }}>
        {ABILITY_KEYS.map((key) => {
          const score = character.abilityScores[key];
          const bonus = asiPoints[key];
          const newTotal = Math.min(MAX_ABILITY_SCORE, score.total + bonus);
          const newMod = calcModifier(newTotal);
          const atMax = newTotal >= MAX_ABILITY_SCORE;
          const color = ABILITY_COLORS[key];

          return (
            <View
              key={key}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: bonus > 0 ? `${color}15` : colors.borderSubtle,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: bonus > 0 ? `${color}40` : colors.borderSeparator,
                padding: 12,
              }}
            >
              {/* Ability info */}
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  backgroundColor: `${color}20`,
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 10,
                }}
              >
                <Text
                  style={{
                    color: color,
                    fontSize: 13,
                    fontWeight: "800",
                  }}
                >
                  {ABILITY_ABBR[key]}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontWeight: "600",
                  }}
                >
                  {ABILITY_NAMES[key]}
                </Text>
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontSize: 13,
                      fontWeight: "500",
                    }}
                  >
                    {score.total}
                  </Text>
                  {bonus > 0 && (
                    <>
                      <Ionicons
                        name="arrow-forward"
                        size={10}
                        color={colors.accentGreen}
                      />
                      <Text
                        style={{
                          color: colors.accentGreen,
                          fontSize: 11,
                          fontWeight: "700" as const,
                        }}
                      >
                        {newTotal}
                      </Text>
                    </>
                  )}
                  <Text
                    style={{
                      color: bonus > 0 ? colors.accentGreen : colors.textMuted,
                      fontSize: 12,
                      fontWeight: "500",
                    }}
                  >
                    ({formatModifier(bonus > 0 ? newMod : score.modifier)})
                  </Text>
                </View>
              </View>

              {/* Controls */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <TouchableOpacity
                  onPress={() => decrementASI(key)}
                  disabled={bonus <= 0}
                  activeOpacity={0.6}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor:
                      bonus > 0
                        ? "rgba(239, 68, 68, 0.2)"
                        : colors.borderSubtle,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor:
                      bonus > 0
                        ? "rgba(239, 68, 68, 0.3)"
                        : colors.borderSubtle,
                    opacity: bonus > 0 ? 1 : 0.4,
                  }}
                >
                  <Ionicons
                    name="remove"
                    size={18}
                    color={bonus > 0 ? colors.accentDanger : colors.textMuted}
                  />
                </TouchableOpacity>

                <View
                  style={{
                    width: 30,
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: bonus > 0 ? colors.accentGreen : colors.textMuted,
                      fontSize: 16,
                      fontWeight: "800",
                    }}
                  >
                    {bonus > 0 ? `+${bonus}` : "0"}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => incrementASI(key)}
                  disabled={asiRemaining <= 0 || atMax}
                  activeOpacity={0.6}
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 10,
                    backgroundColor:
                      asiRemaining > 0 && !atMax
                        ? "rgba(34, 197, 94, 0.2)"
                        : colors.borderSubtle,
                    alignItems: "center",
                    justifyContent: "center",
                    borderWidth: 1,
                    borderColor:
                      asiRemaining > 0 && !atMax
                        ? "rgba(34, 197, 94, 0.3)"
                        : colors.borderSubtle,
                    opacity: asiRemaining > 0 && !atMax ? 1 : 0.4,
                  }}
                >
                  <Ionicons
                    name="add"
                    size={18}
                    color={
                      asiRemaining > 0 && !atMax
                        ? colors.accentGreen
                        : colors.textMuted
                    }
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
}
