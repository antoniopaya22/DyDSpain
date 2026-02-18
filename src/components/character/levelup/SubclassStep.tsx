import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";
import { getSubclassOptions, type SubclassOption } from "@/data/srd/subclasses";
import {
  getSubclassFeaturesForLevel,
  getSubclassChoicesForLevel,
  type SubclassLevelBlock,
  type SubclassFeatureChoice,
  type SubclassFeatureDetail,
} from "@/data/srd/subclassFeatures";
import type { LevelUpSummary } from "@/data/srd/leveling";
import type { Character } from "@/types/character";

interface SubclassStepProps {
  summary: LevelUpSummary;
  character: Character;
  newLevel: number;
  classData: any;
  subclassName: string;
  setSubclassName: (v: string) => void;
  selectedSubclassId: string | null;
  setSelectedSubclassId: (v: string | null) => void;
  isCustomSubclass: boolean;
  setIsCustomSubclass: (v: boolean) => void;
  featureChoices: Record<string, string[]>;
  setFeatureChoices: React.Dispatch<React.SetStateAction<Record<string, string[]>>>;
}

export default function SubclassStep({
  summary,
  character,
  newLevel,
  classData,
  subclassName,
  setSubclassName,
  selectedSubclassId,
  setSelectedSubclassId,
  isCustomSubclass,
  setIsCustomSubclass,
  featureChoices,
  setFeatureChoices,
}: SubclassStepProps) {
  const { colors } = useTheme();

  const options = character ? getSubclassOptions(character.clase as any) : [];

  // Get detailed features for selected subclass at this level
  const subLevelBlock: SubclassLevelBlock | null =
    selectedSubclassId && !isCustomSubclass && character
      ? getSubclassFeaturesForLevel(character.clase as any, selectedSubclassId, newLevel)
      : null;

  const pendingChoices: SubclassFeatureChoice[] =
    selectedSubclassId && !isCustomSubclass && character
      ? getSubclassChoicesForLevel(character.clase as any, selectedSubclassId, newLevel)
      : [];

  const handleSelectSubclass = (opt: SubclassOption) => {
    setSelectedSubclassId(opt.id);
    setSubclassName(opt.nombre);
    setIsCustomSubclass(false);
    setFeatureChoices({}); // Reset choices when switching subclass
  };

  const handleCustomToggle = () => {
    setSelectedSubclassId(null);
    setIsCustomSubclass(true);
    setSubclassName("");
    setFeatureChoices({});
  };

  const handleFeatureChoiceSelect = (choiceId: string, optionId: string, tipo: "single" | "multi", cantidad: number) => {
    setFeatureChoices((prev) => {
      const current = prev[choiceId] ?? [];
      if (tipo === "single") {
        return { ...prev, [choiceId]: [optionId] };
      }
      // Multi-select
      if (current.includes(optionId)) {
        return { ...prev, [choiceId]: current.filter((id) => id !== optionId) };
      }
      if (current.length >= cantidad) return prev;
      return { ...prev, [choiceId]: [...current, optionId] };
    });
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: "rgba(139, 92, 246, 0.1)",
            borderWidth: 1,
            borderColor: "rgba(139, 92, 246, 0.2)",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 12,
          }}
        >
          <Ionicons name="git-branch" size={28} color={"#ec4899"} />
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "700",
            textAlign: "center",
          }}
        >
          Elige tu {classData?.subclassLabel ?? "Subclase"}
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
          Al nivel {newLevel}, los personajes de la clase{" "}
          {classData?.nombre ?? ""} eligen su especialización.
        </Text>
      </View>

      {/* Subclass options */}
      <View style={{ gap: 8 }}>
        {options.map((opt) => {
          const isSelected = selectedSubclassId === opt.id && !isCustomSubclass;
          return (
            <TouchableOpacity
              key={opt.id}
              onPress={() => handleSelectSubclass(opt)}
              activeOpacity={0.7}
              style={{
                backgroundColor: isSelected
                  ? "rgba(236, 72, 153, 0.1)"
                  : colors.borderSubtle,
                borderRadius: 14,
                borderWidth: isSelected ? 2 : 1,
                borderColor: isSelected
                  ? "rgba(236, 72, 153, 0.5)"
                  : colors.borderSeparator,
                padding: 14,
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Radio indicator */}
              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 2,
                  borderColor: isSelected ? "#ec4899" : colors.textMuted + "55",
                  backgroundColor: isSelected ? "#ec4899" : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {isSelected && (
                  <View
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: 4,
                      backgroundColor: "#fff",
                    }}
                  />
                )}
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: isSelected ? "#ec4899" : colors.textPrimary,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  {opt.nombre}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 2,
                    lineHeight: 16,
                  }}
                  numberOfLines={2}
                >
                  {opt.descripcion}
                </Text>
                {opt.fuente !== "SRD 5.1" && (
                  <Text
                    style={{
                      color: colors.textMuted + "88",
                      fontSize: 11,
                      fontWeight: "500",
                      marginTop: 2,
                      fontStyle: "italic",
                    }}
                  >
                    {opt.fuente}
                  </Text>
                )}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Custom / Homebrew option */}
        <TouchableOpacity
          onPress={handleCustomToggle}
          activeOpacity={0.7}
          style={{
            backgroundColor: isCustomSubclass
              ? "rgba(251, 191, 36, 0.1)"
              : colors.borderSubtle,
            borderRadius: 14,
            borderWidth: isCustomSubclass ? 2 : 1,
            borderColor: isCustomSubclass
              ? "rgba(251, 191, 36, 0.5)"
              : colors.borderSeparator,
            padding: 14,
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
          }}
        >
          <View
            style={{
              width: 22,
              height: 22,
              borderRadius: 11,
              borderWidth: 2,
              borderColor: isCustomSubclass
                ? colors.accentGold
                : colors.textMuted + "55",
              backgroundColor: isCustomSubclass
                ? colors.accentGold
                : "transparent",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {isCustomSubclass && (
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: "#fff",
                }}
              />
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: isCustomSubclass
                  ? colors.accentGold
                  : colors.textPrimary,
                fontSize: 15,
                fontWeight: "700",
              }}
            >
              Personalizada / Homebrew
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 12,
                fontWeight: "500",
                marginTop: 2,
              }}
            >
              Escribe el nombre de una subclase personalizada
            </Text>
          </View>
        </TouchableOpacity>

        {/* Custom input field */}
        {isCustomSubclass && (
          <View
            style={{
              backgroundColor: colors.borderSubtle,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: subclassName.trim()
                ? "rgba(251, 191, 36, 0.4)"
                : colors.borderSeparator,
              paddingHorizontal: 16,
              paddingVertical: 4,
              marginTop: 4,
            }}
          >
            <TextInput
              value={subclassName}
              onChangeText={setSubclassName}
              placeholder={`Nombre de ${classData?.subclassLabel ?? "subclase"}...`}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="words"
              autoFocus
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: "600",
                paddingVertical: 12,
              }}
            />
          </View>
        )}
      </View>

      {/* ── Subclass Features Detail ── */}
      {subLevelBlock && selectedSubclassId && !isCustomSubclass && (
        <View style={{ marginTop: 20 }}>
          {/* Section header */}
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 10,
            }}
          >
            Rasgos que obtienes
          </Text>

          {/* Proficiencies gained */}
          {subLevelBlock.competenciasGanadas && (
            <View
              style={{
                backgroundColor: "rgba(34, 197, 94, 0.08)",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(34, 197, 94, 0.25)",
                padding: 12,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Ionicons name="shield-checkmark" size={18} color="#22c55e" style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>
                  Competencias Ganadas
                </Text>
                {subLevelBlock.competenciasGanadas.armaduras && (
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    Armaduras: {subLevelBlock.competenciasGanadas.armaduras.join(", ")}
                  </Text>
                )}
                {subLevelBlock.competenciasGanadas.armas && (
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    Armas: {subLevelBlock.competenciasGanadas.armas.join(", ")}
                  </Text>
                )}
                {subLevelBlock.competenciasGanadas.herramientas && (
                  <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2 }}>
                    Herramientas: {subLevelBlock.competenciasGanadas.herramientas.join(", ")}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Extra skill proficiencies */}
          {subLevelBlock.habilidadesExtra && (
            <View
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.08)",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "rgba(59, 130, 246, 0.25)",
                padding: 12,
                marginBottom: 10,
                flexDirection: "row",
                alignItems: "flex-start",
                gap: 10,
              }}
            >
              <Ionicons name="school" size={18} color={colors.accentBlue} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.textPrimary, fontSize: 14, fontWeight: "700" }}>
                  Habilidades Adicionales
                </Text>
                <Text style={{ color: colors.textSecondary, fontSize: 13, marginTop: 2, lineHeight: 18 }}>
                  Ganas competencia en {subLevelBlock.habilidadesExtra.cantidad} habilidad
                  {subLevelBlock.habilidadesExtra.cantidad > 1 ? "es" : ""}
                  {subLevelBlock.habilidadesExtra.cualquiera
                    ? " cualesquiera"
                    : subLevelBlock.habilidadesExtra.entre
                      ? ` de entre: ${subLevelBlock.habilidadesExtra.entre.join(", ")}`
                      : ""
                  }.
                </Text>
              </View>
            </View>
          )}

          {/* Feature cards */}
          {subLevelBlock.rasgos.map((rasgo, idx) => (
            <View
              key={`rasgo-${idx}`}
              style={{
                backgroundColor: colors.borderSubtle,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: rasgo.elecciones && rasgo.elecciones.length > 0
                  ? "rgba(251, 191, 36, 0.3)"
                  : colors.borderSeparator,
                padding: 14,
                marginBottom: 10,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <Ionicons
                  name={rasgo.elecciones && rasgo.elecciones.length > 0 ? "options" : "flash"}
                  size={16}
                  color={rasgo.elecciones && rasgo.elecciones.length > 0 ? colors.accentGold : colors.accentOrange}
                />
                <Text style={{
                  color: colors.textPrimary,
                  fontSize: 15,
                  fontWeight: "700",
                  flex: 1,
                }}>
                  {rasgo.nombre}
                </Text>
              </View>
              <Text style={{
                color: colors.textSecondary,
                fontSize: 13,
                fontWeight: "500",
                lineHeight: 19,
              }}>
                {rasgo.descripcion}
              </Text>

              {/* Render choices for this feature */}
              {rasgo.elecciones && rasgo.elecciones.map((eleccion) => {
                const selectedIds = featureChoices[eleccion.id] ?? [];
                const needed = eleccion.tipo === "multi" ? (eleccion.cantidad ?? 1) : 1;

                return (
                  <View key={eleccion.id} style={{ marginTop: 12 }}>
                    <View
                      style={{
                        backgroundColor: "rgba(251, 191, 36, 0.08)",
                        borderRadius: 10,
                        padding: 10,
                        borderWidth: 1,
                        borderColor: "rgba(251, 191, 36, 0.2)",
                      }}
                    >
                      <Text style={{
                        color: colors.accentGold,
                        fontSize: 13,
                        fontWeight: "700",
                        marginBottom: 4,
                      }}>
                        {eleccion.instruccion}
                        {eleccion.tipo === "multi" && ` (${selectedIds.length}/${needed})`}
                      </Text>

                      <View style={{ gap: 6, marginTop: 4 }}>
                        {eleccion.opciones.map((opcion) => {
                          const isOptSelected = selectedIds.includes(opcion.id);
                          const isRadio = eleccion.tipo === "single";
                          return (
                            <TouchableOpacity
                              key={opcion.id}
                              onPress={() => handleFeatureChoiceSelect(
                                eleccion.id,
                                opcion.id,
                                eleccion.tipo,
                                needed,
                              )}
                              activeOpacity={0.7}
                              style={{
                                backgroundColor: isOptSelected
                                  ? "rgba(251, 191, 36, 0.12)"
                                  : "rgba(0, 0, 0, 0.05)",
                                borderRadius: 10,
                                borderWidth: isOptSelected ? 2 : 1,
                                borderColor: isOptSelected
                                  ? "rgba(251, 191, 36, 0.5)"
                                  : colors.borderSeparator,
                                padding: 10,
                                flexDirection: "row",
                                alignItems: "flex-start",
                                gap: 10,
                              }}
                            >
                              {/* Radio or checkbox indicator */}
                              <View
                                style={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: isRadio ? 10 : 4,
                                  borderWidth: 2,
                                  borderColor: isOptSelected
                                    ? colors.accentGold
                                    : colors.textMuted + "55",
                                  backgroundColor: isOptSelected
                                    ? colors.accentGold
                                    : "transparent",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  marginTop: 1,
                                }}
                              >
                                {isOptSelected && (
                                  isRadio ? (
                                    <View
                                      style={{
                                        width: 6,
                                        height: 6,
                                        borderRadius: 3,
                                        backgroundColor: "#fff",
                                      }}
                                    />
                                  ) : (
                                    <Ionicons
                                      name="checkmark"
                                      size={14}
                                      color="#fff"
                                    />
                                  )
                                )}
                              </View>
                              <View style={{ flex: 1 }}>
                                <Text style={{
                                  color: isOptSelected ? colors.accentGold : colors.textPrimary,
                                  fontSize: 14,
                                  fontWeight: "700",
                                }}>
                                  {opcion.nombre}
                                </Text>
                                <Text style={{
                                  color: colors.textMuted,
                                  fontSize: 12,
                                  fontWeight: "500",
                                  marginTop: 2,
                                  lineHeight: 17,
                                }}>
                                  {opcion.descripcion}
                                </Text>
                              </View>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
