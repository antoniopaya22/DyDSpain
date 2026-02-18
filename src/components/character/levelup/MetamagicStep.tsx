import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  METAMAGIC_NAMES,
  METAMAGIC_DESCRIPTIONS,
  METAMAGIC_COSTS,
  ALL_METAMAGIC_OPTIONS,
  type MetamagicOption,
} from "@/types/spell";
import { useTheme } from "@/hooks";
import type { LevelUpSummary } from "@/data/srd/leveling";

interface MetamagicStepProps {
  summary: LevelUpSummary;
  selectedMetamagic: string[];
  setSelectedMetamagic: (value: string[] | ((prev: string[]) => string[])) => void;
  getMagicState: () => any;
}

export default function MetamagicStep({
  summary,
  selectedMetamagic,
  setSelectedMetamagic,
  getMagicState,
}: MetamagicStepProps) {
  const { colors } = useTheme();

  const magicState = getMagicState();
  const alreadyChosen = magicState?.metamagicChosen ?? [];
  const available = ALL_METAMAGIC_OPTIONS.filter(
    (id) => !alreadyChosen.includes(id),
  );
  const needed = summary?.newMetamagicChoices ?? 0;

  const toggleOption = (id: string) => {
    setSelectedMetamagic((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= needed) return prev;
      return [...prev, id];
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Header */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "rgba(168, 85, 247, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(168, 85, 247, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="flash" size={28} color={colors.accentPurple} />
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Elige tu Metamagia
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: "500",
            textAlign: "center",
            marginTop: 6,
            lineHeight: 20,
            paddingHorizontal: 20,
          }}
        >
          Selecciona {needed} {needed === 1 ? "opción" : "opciones"} de
          Metamagia. Gastarás Puntos de Hechicería (PH) al usarlas.
        </Text>
        <Text
          style={{
            color: colors.textMuted,
            fontSize: 13,
            fontWeight: "600",
            textAlign: "center",
            marginTop: 8,
          }}
        >
          {selectedMetamagic.length} / {needed} seleccionadas
        </Text>
      </View>

      {/* Already chosen info */}
      {alreadyChosen.length > 0 && (
        <View
          style={{
            backgroundColor: colors.borderSubtle,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
            borderWidth: 1,
            borderColor: colors.borderSeparator,
          }}
        >
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 12,
              fontWeight: "600",
              textTransform: "uppercase",
              letterSpacing: 0.5,
              marginBottom: 4,
            }}
          >
            Ya posees
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontWeight: "500",
            }}
          >
            {alreadyChosen
              .map((id: string) => METAMAGIC_NAMES[id as MetamagicOption] ?? id)
              .join(", ")}
          </Text>
        </View>
      )}

      {/* Metamagic option cards */}
      <View style={{ gap: 8 }}>
        {available.map((id) => {
          const isSelected = selectedMetamagic.includes(id);
          const isFull = selectedMetamagic.length >= needed && !isSelected;

          return (
            <TouchableOpacity
              key={id}
              onPress={() => toggleOption(id)}
              activeOpacity={0.7}
              disabled={isFull}
              style={{
                backgroundColor: isSelected
                  ? "rgba(168, 85, 247, 0.1)"
                  : isFull
                    ? colors.borderSubtle + "88"
                    : colors.borderSubtle,
                borderRadius: 14,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected
                  ? "rgba(168, 85, 247, 0.5)"
                  : colors.borderSeparator,
                padding: 14,
                opacity: isFull ? 0.5 : 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                }}
              >
                {/* Checkbox indicator */}
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    borderWidth: 2,
                    borderColor: isSelected
                      ? colors.accentPurple
                      : colors.textMuted + "55",
                    backgroundColor: isSelected
                      ? colors.accentPurple
                      : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {isSelected && (
                    <Ionicons name="checkmark" size={14} color="#fff" />
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        color: isSelected
                          ? colors.accentPurple
                          : colors.textPrimary,
                        fontSize: 15,
                        fontWeight: "700",
                      }}
                    >
                      {METAMAGIC_NAMES[id]}
                    </Text>
                    <View
                      style={{
                        backgroundColor: isSelected
                          ? "rgba(168, 85, 247, 0.15)"
                          : colors.borderSeparator,
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: isSelected
                            ? colors.accentPurple
                            : colors.textMuted,
                          fontSize: 11,
                          fontWeight: "700",
                        }}
                      >
                        {METAMAGIC_COSTS[id]} PH
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 6,
                  marginLeft: 34,
                  lineHeight: 17,
                }}
              >
                {METAMAGIC_DESCRIPTIONS[id]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </ScrollView>
  );
}
