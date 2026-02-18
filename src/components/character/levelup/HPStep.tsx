import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";
import { formatModifier, type Character } from "@/types/character";

interface HPStepProps {
  hpMethod: "fixed" | "roll";
  setHpMethod: (m: "fixed" | "roll") => void;
  hpRolled: number | null;
  setHpRolled: (v: number | null) => void;
  isRolling: boolean;
  rollHPDie: () => void;
  dieSides: number;
  fixedHP: number;
  conMod: number;
  hpGainTotal: number;
  newMaxHP: number;
  character: Character;
  classData: any;
}

export default function HPStep({
  hpMethod,
  setHpMethod,
  hpRolled,
  setHpRolled,
  isRolling,
  rollHPDie,
  dieSides,
  fixedHP,
  conMod,
  hpGainTotal,
  newMaxHP,
  character,
  classData,
}: HPStepProps) {
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
          marginBottom: 20,
          lineHeight: 20,
        }}
      >
        Al subir de nivel, ganas Puntos de Golpe adicionales. Elige cómo
        determinar los PG ganados.
      </Text>

      {/* Method selection */}
      <View style={{ gap: 12, marginBottom: 20 }}>
        {/* Fixed option */}
        <TouchableOpacity
          onPress={() => {
            setHpMethod("fixed");
            setHpRolled(null);
          }}
          activeOpacity={0.7}
          style={{
            borderRadius: 14,
            borderWidth: 2,
            borderColor:
              hpMethod === "fixed"
                ? "rgba(34, 197, 94, 0.5)"
                : colors.borderSeparator,
            backgroundColor:
              hpMethod === "fixed"
                ? "rgba(34, 197, 94, 0.08)"
                : colors.borderSubtle,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor:
                  hpMethod === "fixed"
                    ? "rgba(34, 197, 94, 0.2)"
                    : colors.borderSeparator,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={
                  hpMethod === "fixed" ? colors.accentGreen : colors.textMuted
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color:
                    hpMethod === "fixed"
                      ? colors.accentGreen
                      : colors.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Valor Fijo
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontWeight: "500",
                  marginTop: 2,
                }}
              >
                {fixedHP} (promedio de {classData?.hitDie ?? "d8"}) + CON (
                {formatModifier(conMod)})
              </Text>
            </View>
            <View
              style={{
                backgroundColor:
                  hpMethod === "fixed"
                    ? "rgba(34, 197, 94, 0.2)"
                    : colors.borderSeparator,
                borderRadius: 10,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Text
                style={{
                  color:
                    hpMethod === "fixed"
                      ? colors.accentGreen
                      : colors.textSecondary,
                  fontSize: 18,
                  fontWeight: "800",
                }}
              >
                +{Math.max(1, fixedHP + conMod)}
              </Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Roll option */}
        <TouchableOpacity
          onPress={() => setHpMethod("roll")}
          activeOpacity={0.7}
          style={{
            borderRadius: 14,
            borderWidth: 2,
            borderColor:
              hpMethod === "roll"
                ? "rgba(251, 191, 36, 0.5)"
                : colors.borderSeparator,
            backgroundColor:
              hpMethod === "roll"
                ? "rgba(251, 191, 36, 0.08)"
                : colors.borderSubtle,
            padding: 16,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor:
                  hpMethod === "roll"
                    ? "rgba(251, 191, 36, 0.2)"
                    : colors.borderSeparator,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons
                name="dice-outline"
                size={20}
                color={
                  hpMethod === "roll" ? colors.accentGold : colors.textMuted
                }
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color:
                    hpMethod === "roll"
                      ? colors.accentGold
                      : colors.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                Tirar Dado
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  fontWeight: "500",
                  marginTop: 2,
                }}
              >
                1{classData?.hitDie ?? "d8"} (1-{dieSides}) + CON (
                {formatModifier(conMod)})
              </Text>
            </View>
            {hpMethod === "roll" && hpRolled !== null && (
              <View
                style={{
                  backgroundColor: "rgba(251, 191, 36, 0.2)",
                  borderRadius: 10,
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                }}
              >
                <Text
                  style={{
                    color: colors.accentGold,
                    fontSize: 18,
                    fontWeight: "800",
                  }}
                >
                  +{Math.max(1, hpRolled + conMod)}
                </Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </View>

      {/* Roll dice button */}
      {hpMethod === "roll" && (
        <View style={{ alignItems: "center", gap: 12 }}>
          <TouchableOpacity
            onPress={rollHPDie}
            disabled={isRolling}
            activeOpacity={0.7}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              opacity: isRolling ? 0.7 : 1,
            }}
          >
            <LinearGradient
              colors={[colors.accentAmber, "#d97706"]}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                paddingHorizontal: 32,
                gap: 8,
              }}
            >
              <Ionicons name="dice" size={22} color={colors.textPrimary} />
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {isRolling
                  ? "Tirando..."
                  : hpRolled !== null
                    ? "Volver a tirar"
                    : `Tirar ${classData?.hitDie ?? "d8"}`}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {hpRolled !== null && !isRolling && (
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  Dado:
                </Text>
                <View
                  style={{
                    backgroundColor: colors.borderSubtle,
                    borderRadius: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderWidth: 1,
                    borderColor: colors.borderSeparator,
                  }}
                >
                  <Text
                    style={{
                      color: colors.accentGold,
                      fontSize: 20,
                      fontWeight: "900",
                    }}
                  >
                    {hpRolled}
                  </Text>
                </View>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 14,
                    fontWeight: "500",
                  }}
                >
                  + CON ({formatModifier(conMod)}) ={" "}
                </Text>
                <Text
                  style={{
                    color: colors.accentGreen,
                    fontSize: 18,
                    fontWeight: "800",
                  }}
                >
                  {Math.max(1, hpRolled + conMod)} PG
                </Text>
              </View>
            </View>
          )}
        </View>
      )}

      {/* HP Preview */}
      {(hpMethod === "fixed" || hpRolled !== null) && (
        <View
          style={{
            marginTop: 20,
            backgroundColor: colors.borderSubtle,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: colors.borderSeparator,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
            <Ionicons name="heart" size={20} color={colors.accentDanger} />
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              PG Máximos
            </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: "500",
              }}
            >
              {character.hp.max}{" "}
            </Text>
            <Text
              style={{
                color: colors.accentGreen,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              → {newMaxHP}
            </Text>
            <Text
              style={{
                color: colors.accentGreen,
                fontSize: 12,
                fontWeight: "600",
              }}
            >
              {" "}
              (+{hpGainTotal})
            </Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
