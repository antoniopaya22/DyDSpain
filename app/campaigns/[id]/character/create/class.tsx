import { useState, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCreationStore, TOTAL_STEPS } from "@/stores/creationStore";
import {
  getClassList,
  getClassData,
  CLASS_ICONS,
  SPELLCASTING_DESCRIPTIONS,
  isSpellcaster,
} from "@/data/srd/classes";
import type { ClassData } from "@/data/srd/classes";
import type { ClassId, AbilityKey } from "@/types/character";
import { ABILITY_NAMES } from "@/types/character";
import { useTheme } from "@/hooks/useTheme";
import type { ThemeColors } from "@/utils/theme";

const CURRENT_STEP = 3;

export default function ClassSelectionStep() {
  const { colors, isDark } = useTheme();
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const { draft, setClase, saveDraft, loadDraft } = useCreationStore();

  const [selectedClass, setSelectedClass] = useState<ClassId | null>(
    draft?.clase ?? null,
  );
  const [showDetails, setShowDetails] = useState(!!draft?.clase);

  const classes = getClassList();

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        if (!draft) {
          await loadDraft(campaignId);
        }
        const currentDraft = useCreationStore.getState().draft;
        if (currentDraft?.clase) {
          setSelectedClass(currentDraft.clase);
          setShowDetails(true);
        }
      };
      init();
    }, [campaignId]),
  );

  const currentClassData = selectedClass ? getClassData(selectedClass) : null;

  const handleSelectClass = (classId: ClassId) => {
    setSelectedClass(classId);
    setShowDetails(true);
  };

  const handleNext = async () => {
    if (!selectedClass) return;
    setClase(selectedClass);
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/abilities",
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    if (selectedClass) {
      setClase(selectedClass);
    }
    router.back();
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  const getCasterLabel = (cls: ClassData): string => {
    switch (cls.casterType) {
      case "full":
        return "Lanzador completo";
      case "half":
        return "Semi-lanzador";
      case "pact":
        return "Magia de pacto";
      default:
        return "Sin magia";
    }
  };

  const getCasterColor = (cls: ClassData): string => {
    switch (cls.casterType) {
      case "full":
        return colors.accentPurple;
      case "half":
        return colors.accentBlue;
      case "pact":
        return colors.accentDeepPurple;
      default:
        return colors.textMuted;
    }
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-dark-800">
      {/* Header with progress */}
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className="h-10 w-10 rounded-full bg-gray-100 dark:bg-surface items-center justify-center active:bg-gray-50 dark:active:bg-surface-light"
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          <Text className="text-dark-500 dark:text-dark-300 text-sm font-semibold">
            Paso {CURRENT_STEP} de {TOTAL_STEPS}
          </Text>

          <View className="h-10 w-10" />
        </View>

        {/* Progress bar */}
        <View className="h-1.5 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="px-5 mb-6">
          <Text className="text-dark-900 dark:text-white text-2xl font-bold mb-2">
            Elige tu clase
          </Text>
          <Text className="text-dark-500 dark:text-dark-300 text-base leading-6">
            Tu clase define las habilidades de combate, la magia y los rasgos
            especiales de tu personaje. Es la elección más importante en la
            creación.
          </Text>
        </View>

        {/* Class list */}
        {!showDetails && (
          <View className="px-5">
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                className={`mb-3 rounded-card border p-4 active:opacity-80 ${
                  selectedClass === cls.id
                    ? "bg-primary-500/15 border-primary-500/50"
                    : "bg-white dark:bg-surface-card border-dark-100 dark:border-surface-border"
                }`}
                onPress={() => handleSelectClass(cls.id)}
              >
                <View className="flex-row items-center">
                  <View
                    className={`h-14 w-14 rounded-xl items-center justify-center mr-4`}
                    style={{
                      backgroundColor:
                        selectedClass === cls.id
                          ? `${cls.color}30`
                          : colors.bgCard,
                    }}
                  >
                    <Ionicons
                      name={cls.iconName as any}
                      size={28}
                      color={
                        selectedClass === cls.id ? cls.color : colors.textMuted
                      }
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="text-dark-900 dark:text-white text-lg font-bold">
                      {cls.nombre}
                    </Text>
                    <Text
                      className="text-dark-500 dark:text-dark-300 text-sm mt-0.5"
                      numberOfLines={2}
                    >
                      {cls.descripcion}
                    </Text>
                    {/* Quick info pills */}
                    <View className="flex-row flex-wrap mt-2">
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-0.5 mr-1.5 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          ❤️ {cls.hitDie}
                        </Text>
                      </View>
                      <View
                        className="rounded-full px-2.5 py-0.5 mr-1.5 mb-1"
                        style={{
                          backgroundColor: `${getCasterColor(cls)}15`,
                        }}
                      >
                        <Text
                          className="text-xs font-medium"
                          style={{ color: getCasterColor(cls) }}
                        >
                          {getCasterLabel(cls)}
                        </Text>
                      </View>
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-0.5 mr-1.5 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          Salv: {ABILITY_NAMES[cls.savingThrows[0]]},{" "}
                          {ABILITY_NAMES[cls.savingThrows[1]]}
                        </Text>
                      </View>
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={
                      selectedClass === cls.id ? cls.color : colors.textMuted
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Class Details */}
        {showDetails && currentClassData && (
          <View className="px-5">
            {/* Back to list */}
            <TouchableOpacity
              className="flex-row items-center mb-4 active:opacity-70"
              onPress={() => setShowDetails(false)}
            >
              <Ionicons name="arrow-back" size={16} color={colors.textMuted} />
              <Text className="text-dark-400 text-sm ml-1">
                Ver todas las clases
              </Text>
            </TouchableOpacity>

            {/* Class Header */}
            <View
              className="rounded-card border p-5 mb-5"
              style={{
                backgroundColor: `${currentClassData.color}10`,
                borderColor: `${currentClassData.color}40`,
              }}
            >
              <View className="flex-row items-center mb-4">
                <View
                  className="h-16 w-16 rounded-xl items-center justify-center mr-4"
                  style={{
                    backgroundColor: `${currentClassData.color}25`,
                  }}
                >
                  <Ionicons
                    name={currentClassData.iconName as any}
                    size={32}
                    color={currentClassData.color}
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-dark-900 dark:text-white text-2xl font-bold">
                    {currentClassData.nombre}
                  </Text>
                  <Text className="text-dark-500 dark:text-dark-300 text-sm mt-1">
                    Dado de golpe: {currentClassData.hitDie} · PG nivel 1:{" "}
                    {currentClassData.hitDieMax} + mod. CON
                  </Text>
                </View>
              </View>

              <Text className="text-dark-600 dark:text-dark-200 text-sm leading-5">
                {currentClassData.descripcion}
              </Text>
            </View>

            {/* Hit Points Summary */}
            <View className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-card p-4 mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Puntos de Golpe
              </Text>
              <View className="flex-row items-center mb-2">
                <View className="h-8 w-8 rounded-full bg-hp-full/20 items-center justify-center mr-3">
                  <Ionicons name="heart" size={16} color={colors.accentGreen} />
                </View>
                <View className="flex-1">
                  <Text className="text-dark-900 dark:text-white text-sm font-semibold">
                    Nivel 1: {currentClassData.hitDieMax} + mod. Constitución
                  </Text>
                  <Text className="text-dark-400 text-xs mt-0.5">
                    Niveles superiores: {currentClassData.hitDie} (o{" "}
                    {currentClassData.hitDieFixed}) + mod. CON por nivel
                  </Text>
                </View>
              </View>
            </View>

            {/* Saving Throws */}
            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Tiradas de Salvación
              </Text>
              <View className="flex-row">
                {currentClassData.savingThrows.map((save, idx) => (
                  <View
                    key={save}
                    className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-xl px-4 py-3 mr-2 items-center min-w-[100px]"
                  >
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={colors.accentGreen}
                    />
                    <Text className="text-dark-900 dark:text-white text-sm font-semibold mt-1">
                      {ABILITY_NAMES[save]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Armor & Weapon Proficiencies */}
            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Competencias con Armadura
              </Text>
              <View className="flex-row flex-wrap">
                {currentClassData.armorProficiencies.length > 0 ? (
                  currentClassData.armorProficiencies.map((armor, idx) => (
                    <View
                      key={idx}
                      className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                    >
                      <Text className="text-dark-600 dark:text-dark-200 text-sm">
                        {armor}
                      </Text>
                    </View>
                  ))
                ) : (
                  <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-3 py-1.5">
                    <Text className="text-dark-400 text-sm">Ninguna</Text>
                  </View>
                )}
              </View>
            </View>

            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Competencias con Armas
              </Text>
              <View className="flex-row flex-wrap">
                {currentClassData.weaponProficiencies.map((weapon, idx) => (
                  <View
                    key={idx}
                    className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                  >
                    <Text className="text-dark-600 dark:text-dark-200 text-sm">
                      {weapon}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Tool Proficiencies */}
            {(currentClassData.toolProficiencies.length > 0 ||
              (currentClassData.toolChoices &&
                currentClassData.toolChoices.length > 0)) && (
              <View className="mb-5">
                <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Competencias con Herramientas
                </Text>
                <View className="flex-row flex-wrap">
                  {currentClassData.toolProficiencies.map((tool, idx) => (
                    <View
                      key={idx}
                      className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                    >
                      <Text className="text-dark-600 dark:text-dark-200 text-sm">
                        {tool}
                      </Text>
                    </View>
                  ))}
                  {currentClassData.toolChoices && (
                    <View className="bg-gold-500/10 border border-gold-500/30 rounded-full px-3 py-1.5 mr-2 mb-2">
                      <Text className="text-gold-700 dark:text-gold-400 text-sm">
                        +{currentClassData.toolChoiceCount ?? 1} a elegir
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Skill Choices */}
            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Habilidades (elige {currentClassData.skillChoiceCount})
              </Text>
              <View className="flex-row flex-wrap">
                {currentClassData.skillChoicePool.map((skillKey, idx) => {
                  const { SKILLS } = require("@/types/character");
                  const skillDef = SKILLS[skillKey];
                  return (
                    <View
                      key={idx}
                      className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                    >
                      <Text className="text-dark-600 dark:text-dark-200 text-sm">
                        {skillDef?.nombre ?? skillKey}
                      </Text>
                    </View>
                  );
                })}
              </View>
              <Text className="text-dark-400 text-xs mt-1">
                Se elegirán en el paso de Habilidades.
              </Text>
            </View>

            {/* Spellcasting */}
            {isSpellcaster(currentClassData.id) && (
              <View className="mb-5">
                <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Lanzamiento de Conjuros
                </Text>

                <View
                  className="rounded-card border p-4 mb-3"
                  style={{
                    backgroundColor: `${getCasterColor(currentClassData)}10`,
                    borderColor: `${getCasterColor(currentClassData)}30`,
                  }}
                >
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="sparkles"
                      size={18}
                      color={getCasterColor(currentClassData)}
                    />
                    <Text
                      className="text-sm font-bold ml-2"
                      style={{ color: getCasterColor(currentClassData) }}
                    >
                      {getCasterLabel(currentClassData)}
                    </Text>
                  </View>

                  {SPELLCASTING_DESCRIPTIONS[currentClassData.id] && (
                    <Text className="text-dark-500 dark:text-dark-300 text-sm leading-5">
                      {SPELLCASTING_DESCRIPTIONS[currentClassData.id]}
                    </Text>
                  )}

                  {/* Spellcasting details */}
                  <View className="mt-3 flex-row flex-wrap">
                    {currentClassData.spellcastingAbility && (
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-1 mr-2 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          Aptitud:{" "}
                          {ABILITY_NAMES[currentClassData.spellcastingAbility]}
                        </Text>
                      </View>
                    )}
                    {currentClassData.cantripsAtLevel1 > 0 && (
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-1 mr-2 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          Trucos: {currentClassData.cantripsAtLevel1}
                        </Text>
                      </View>
                    )}
                    {currentClassData.spellsAtLevel1 > 0 && (
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-1 mr-2 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          Conjuros nv.1: {currentClassData.spellsAtLevel1}
                        </Text>
                      </View>
                    )}
                    {currentClassData.preparesSpells && (
                      <View className="bg-gray-200 dark:bg-dark-700 rounded-full px-2.5 py-1 mr-2 mb-1">
                        <Text className="text-dark-600 dark:text-dark-200 text-xs">
                          Prepara conjuros
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            )}

            {/* Level 1 Features */}
            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Rasgos de Nivel 1
              </Text>

              {currentClassData.level1Features.map((feature, idx) => (
                <View
                  key={idx}
                  className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-card p-4 mb-2"
                >
                  <View className="flex-row items-center mb-2">
                    <Ionicons
                      name="star"
                      size={14}
                      color={currentClassData.color}
                    />
                    <Text className="text-dark-900 dark:text-white text-sm font-bold ml-2">
                      {feature.nombre}
                    </Text>
                  </View>
                  <Text className="text-dark-500 dark:text-dark-300 text-sm leading-5">
                    {feature.descripcion}
                  </Text>
                </View>
              ))}
            </View>

            {/* Subclass info */}
            <View className="bg-white dark:bg-surface-card border border-gold-600/20 rounded-card p-4 mb-5">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="git-branch-outline"
                  size={16}
                  color={colors.accentGold}
                />
                <Text className="text-gold-700 dark:text-gold-400 text-sm font-bold ml-2">
                  {currentClassData.subclassLabel}
                </Text>
              </View>
              <Text className="text-dark-500 dark:text-dark-300 text-sm leading-5">
                Al nivel {currentClassData.subclassLevel}, elegirás tu{" "}
                {currentClassData.subclassLabel.toLowerCase()}, que define la
                especialización de tu personaje dentro de esta clase.
              </Text>
            </View>

            {/* Equipment Preview */}
            <View className="mb-5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Equipo Inicial
              </Text>

              {currentClassData.equipmentChoices.map((choice, idx) => (
                <View
                  key={idx}
                  className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-card p-3 mb-2"
                >
                  <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    {choice.label}
                  </Text>
                  {choice.options.map((option, optIdx) => (
                    <View
                      key={optIdx}
                      className="flex-row items-center mb-1 last:mb-0"
                    >
                      <Text className="text-dark-400 text-xs mr-1.5">
                        {String.fromCharCode(97 + optIdx)})
                      </Text>
                      <Text className="text-dark-600 dark:text-dark-200 text-sm">
                        {option.label}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}

              {currentClassData.defaultEquipment.length > 0 && (
                <View className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-card p-3 mb-2">
                  <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-2">
                    Siempre incluido
                  </Text>
                  {currentClassData.defaultEquipment.map((item, idx) => (
                    <View key={idx} className="flex-row items-center mb-1">
                      <Text className="text-dark-400 text-xs mr-1.5">•</Text>
                      <Text className="text-dark-600 dark:text-dark-200 text-sm">
                        {item}
                      </Text>
                    </View>
                  ))}
                </View>
              )}

              <Text className="text-dark-400 text-xs mt-1">
                Las opciones de equipo se seleccionarán en el paso de
                Equipamiento.
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer with navigation buttons */}
      <View className="px-5 pb-10 pt-4 bg-gray-50 dark:bg-dark-800 border-t border-dark-100 dark:border-surface-border">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center flex-row justify-center mb-3 ${
            selectedClass
              ? "bg-primary-500 active:bg-primary-600"
              : "bg-gray-300 dark:bg-dark-600 opacity-50"
          }`}
          onPress={handleNext}
          disabled={!selectedClass}
        >
          <Text className="text-white font-bold text-base mr-2">
            Siguiente: Estadísticas
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-xl py-3.5 items-center active:bg-gray-50 dark:active:bg-surface-light"
          onPress={handleBack}
        >
          <Text className="text-dark-500 dark:text-dark-300 font-semibold text-base">
            Atrás
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
