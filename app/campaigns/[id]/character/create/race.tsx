import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCreationStore, TOTAL_STEPS } from "@/stores/creationStore";
import {
  getRaceList,
  getRaceData,
  RACE_ICONS,
  getTotalRacialBonuses,
} from "@/data/srd/races";
import type { RaceData, SubraceData } from "@/data/srd/races";
import type { RaceId, SubraceId, AbilityKey } from "@/types/character";
import { ABILITY_NAMES } from "@/types/character";

const CURRENT_STEP = 2;

export default function RaceSelectionStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const { draft, setRaza, saveDraft, loadDraft } = useCreationStore();

  const [selectedRace, setSelectedRace] = useState<RaceId | null>(
    draft?.raza ?? null
  );
  const [selectedSubrace, setSelectedSubrace] = useState<SubraceId>(
    draft?.subraza ?? null
  );
  const [showDetails, setShowDetails] = useState(false);

  const races = getRaceList();

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        if (!draft) {
          await loadDraft(campaignId);
        }
        const currentDraft = useCreationStore.getState().draft;
        if (currentDraft?.raza) {
          setSelectedRace(currentDraft.raza);
          setSelectedSubrace(currentDraft.subraza ?? null);
        }
      };
      init();
    }, [campaignId])
  );

  const currentRaceData = selectedRace ? getRaceData(selectedRace) : null;
  const hasSubraces = currentRaceData
    ? currentRaceData.subraces.length > 0
    : false;

  const isValid = (): boolean => {
    if (!selectedRace) return false;
    if (hasSubraces && !selectedSubrace) return false;
    return true;
  };

  const handleSelectRace = (raceId: RaceId) => {
    setSelectedRace(raceId);
    const race = getRaceData(raceId);
    // Auto-select subrace if there's only one
    if (race.subraces.length === 1) {
      setSelectedSubrace(race.subraces[0].id);
    } else if (race.subraces.length === 0) {
      setSelectedSubrace(null);
    } else {
      setSelectedSubrace(null);
    }
    setShowDetails(true);
  };

  const handleSelectSubrace = (subraceId: SubraceId) => {
    setSelectedSubrace(subraceId);
  };

  const handleNext = async () => {
    if (!isValid() || !selectedRace) return;
    setRaza(selectedRace, selectedSubrace);
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/class",
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    if (selectedRace) {
      setRaza(selectedRace, selectedSubrace);
    }
    router.back();
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  // Get racial bonuses for display
  const racialBonuses = selectedRace
    ? getTotalRacialBonuses(selectedRace, selectedSubrace)
    : {};

  const formatBonus = (value: number) => (value > 0 ? `+${value}` : `${value}`);

  return (
    <View className="flex-1 bg-dark-800">
      {/* Header with progress */}
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity
            className="h-10 w-10 rounded-full bg-surface items-center justify-center active:bg-surface-light"
            onPress={handleBack}
          >
            <Ionicons name="arrow-back" size={22} color="white" />
          </TouchableOpacity>

          <Text className="text-dark-300 text-sm font-semibold">
            Paso {CURRENT_STEP} de {TOTAL_STEPS}
          </Text>

          <View className="h-10 w-10" />
        </View>

        {/* Progress bar */}
        <View className="h-1.5 bg-surface rounded-full overflow-hidden">
          <View
            className="h-full bg-primary-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </View>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <View className="px-5 mb-6">
          <Text className="text-white text-2xl font-bold mb-2">
            Elige tu raza
          </Text>
          <Text className="text-dark-300 text-base leading-6">
            La raza de tu personaje determina sus rasgos innatos, bonificadores
            de característica y habilidades especiales.
          </Text>
        </View>

        {/* Race Cards Grid */}
        {!showDetails && (
          <View className="px-5">
            {races.map((race) => (
              <TouchableOpacity
                key={race.id}
                className={`mb-3 rounded-card border p-4 active:opacity-80 ${
                  selectedRace === race.id
                    ? "bg-primary-500/15 border-primary-500/50"
                    : "bg-surface-card border-surface-border"
                }`}
                onPress={() => handleSelectRace(race.id)}
              >
                <View className="flex-row items-center">
                  <View
                    className={`h-14 w-14 rounded-xl items-center justify-center mr-4 ${
                      selectedRace === race.id
                        ? "bg-primary-500/20"
                        : "bg-dark-700"
                    }`}
                  >
                    <Text className="text-2xl">
                      {RACE_ICONS[race.id]}
                    </Text>
                  </View>

                  <View className="flex-1">
                    <Text className="text-white text-lg font-bold">
                      {race.nombre}
                    </Text>
                    <Text
                      className="text-dark-300 text-sm mt-0.5"
                      numberOfLines={2}
                    >
                      {race.descripcion}
                    </Text>
                    {/* Quick bonus preview */}
                    <View className="flex-row flex-wrap mt-2">
                      {Object.entries(race.abilityBonuses).map(
                        ([key, value]) => (
                          <View
                            key={key}
                            className="bg-dark-700 rounded-full px-2.5 py-0.5 mr-1.5 mb-1"
                          >
                            <Text className="text-gold-400 text-xs font-semibold">
                              {ABILITY_NAMES[key as AbilityKey]}{" "}
                              {formatBonus(value as number)}
                            </Text>
                          </View>
                        )
                      )}
                      {race.darkvision && (
                        <View className="bg-dark-700 rounded-full px-2.5 py-0.5 mr-1.5 mb-1">
                          <Text className="text-dark-200 text-xs">
                            👁️ Visión osc.
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={
                      selectedRace === race.id ? "#c62828" : "#666699"
                    }
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Race Details View */}
        {showDetails && currentRaceData && (
          <View className="px-5">
            {/* Back to list button */}
            <TouchableOpacity
              className="flex-row items-center mb-4 active:opacity-70"
              onPress={() => setShowDetails(false)}
            >
              <Ionicons name="arrow-back" size={16} color="#666699" />
              <Text className="text-dark-400 text-sm ml-1">
                Ver todas las razas
              </Text>
            </TouchableOpacity>

            {/* Selected Race Header */}
            <View className="rounded-card bg-surface-card border border-primary-500/30 p-5 mb-5">
              <View className="flex-row items-center mb-4">
                <View className="h-16 w-16 rounded-xl bg-primary-500/20 items-center justify-center mr-4">
                  <Text className="text-3xl">
                    {RACE_ICONS[currentRaceData.id]}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white text-2xl font-bold">
                    {currentRaceData.nombre}
                  </Text>
                  <Text className="text-dark-300 text-sm mt-1">
                    Tamaño: {currentRaceData.size === "mediano" ? "Mediano" : "Pequeño"}{" "}
                    · Velocidad: {currentRaceData.speed} pies
                  </Text>
                </View>
              </View>

              <Text className="text-dark-200 text-sm leading-5">
                {currentRaceData.descripcion}
              </Text>
            </View>

            {/* Ability Bonuses */}
            <View className="mb-5">
              <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Bonificadores de Característica
              </Text>
              <View className="flex-row flex-wrap">
                {Object.entries(racialBonuses).map(([key, value]) => (
                  <View
                    key={key}
                    className="bg-surface-card border border-surface-border rounded-xl px-4 py-3 mr-2 mb-2 items-center min-w-[80px]"
                  >
                    <Text className="text-gold-400 text-lg font-bold">
                      {formatBonus(value as number)}
                    </Text>
                    <Text className="text-dark-300 text-xs mt-0.5">
                      {ABILITY_NAMES[key as AbilityKey]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Subrace Selection */}
            {hasSubraces && (
              <View className="mb-5">
                <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Subraza{" "}
                  <Text className="text-primary-500">*</Text>
                </Text>

                {currentRaceData.subraces.map((subrace) => (
                  <TouchableOpacity
                    key={subrace.id}
                    className={`mb-2 rounded-card border p-4 active:opacity-80 ${
                      selectedSubrace === subrace.id
                        ? "bg-primary-500/10 border-primary-500/40"
                        : "bg-surface-card border-surface-border"
                    }`}
                    onPress={() => handleSelectSubrace(subrace.id)}
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <Text className="text-white text-base font-bold flex-1">
                        {subrace.nombre}
                      </Text>
                      <View
                        className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                          selectedSubrace === subrace.id
                            ? "border-primary-500 bg-primary-500"
                            : "border-dark-400"
                        }`}
                      >
                        {selectedSubrace === subrace.id && (
                          <Ionicons
                            name="checkmark"
                            size={14}
                            color="white"
                          />
                        )}
                      </View>
                    </View>

                    <Text className="text-dark-300 text-sm leading-5 mb-2">
                      {subrace.descripcion}
                    </Text>

                    {/* Subrace bonuses */}
                    <View className="flex-row flex-wrap">
                      {Object.entries(subrace.abilityBonuses).map(
                        ([key, value]) => (
                          <View
                            key={key}
                            className="bg-dark-700 rounded-full px-2.5 py-0.5 mr-1.5"
                          >
                            <Text className="text-gold-400 text-xs font-semibold">
                              {ABILITY_NAMES[key as AbilityKey]}{" "}
                              {formatBonus(value as number)}
                            </Text>
                          </View>
                        )
                      )}
                    </View>

                    {/* Subrace traits */}
                    {subrace.traits.length > 0 && (
                      <View className="mt-2">
                        {subrace.traits.map((trait, idx) => (
                          <View key={idx} className="flex-row items-start mt-1">
                            <Text className="text-dark-400 text-xs mr-1">
                              •
                            </Text>
                            <Text className="text-dark-300 text-xs flex-1">
                              <Text className="font-semibold text-dark-200">
                                {trait.nombre}:
                              </Text>{" "}
                              {trait.descripcion}
                            </Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Race Traits */}
            {currentRaceData.traits.length > 0 && (
              <View className="mb-5">
                <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                  Rasgos Raciales
                </Text>

                {currentRaceData.traits.map((trait, index) => (
                  <View
                    key={index}
                    className="bg-surface-card border border-surface-border rounded-card p-4 mb-2"
                  >
                    <Text className="text-white text-sm font-bold mb-1">
                      {trait.nombre}
                    </Text>
                    <Text className="text-dark-300 text-sm leading-5">
                      {trait.descripcion}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Languages */}
            <View className="mb-5">
              <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                Idiomas
              </Text>
              <View className="flex-row flex-wrap">
                {currentRaceData.languages.map((lang, idx) => (
                  <View
                    key={idx}
                    className="bg-surface-card border border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                  >
                    <Text className="text-dark-200 text-sm">{lang}</Text>
                  </View>
                ))}
                {currentRaceData.extraLanguages
                  ? Array.from(
                      { length: currentRaceData.extraLanguages },
                      (_, i) => (
                        <View
                          key={`extra_${i}`}
                          className="bg-gold-500/10 border border-gold-500/30 rounded-full px-3 py-1.5 mr-2 mb-2"
                        >
                          <Text className="text-gold-400 text-sm">
                            +1 a elegir
                          </Text>
                        </View>
                      )
                    )
                  : null}
              </View>
            </View>

            {/* Other Proficiencies */}
            {currentRaceData.darkvision && (
              <View className="bg-surface-card border border-surface-border rounded-card p-4 mb-5">
                <View className="flex-row items-center">
                  <Text className="text-lg mr-2">👁️</Text>
                  <View className="flex-1">
                    <Text className="text-white text-sm font-bold">
                      Visión en la Oscuridad
                    </Text>
                    <Text className="text-dark-300 text-xs mt-0.5">
                      Alcance: {currentRaceData.darkvisionRange ?? 60} pies (
                      {((currentRaceData.darkvisionRange ?? 60) * 0.3).toFixed(
                        0
                      )}{" "}
                      m)
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Weapon Proficiencies from race */}
            {currentRaceData.weaponProficiencies &&
              currentRaceData.weaponProficiencies.length > 0 && (
                <View className="mb-5">
                  <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
                    Competencias con Armas
                  </Text>
                  <View className="flex-row flex-wrap">
                    {currentRaceData.weaponProficiencies.map((weapon, idx) => (
                      <View
                        key={idx}
                        className="bg-surface-card border border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                      >
                        <Text className="text-dark-200 text-sm">
                          {weapon}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Tool choices */}
            {currentRaceData.toolChoices &&
              currentRaceData.toolChoices.length > 0 && (
                <View className="mb-5">
                  <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
                    Herramientas (elige {currentRaceData.toolChoiceCount ?? 1})
                  </Text>
                  <Text className="text-dark-400 text-xs mb-2">
                    Se seleccionará durante el paso de equipamiento.
                  </Text>
                  <View className="flex-row flex-wrap">
                    {currentRaceData.toolChoices.map((tool, idx) => (
                      <View
                        key={idx}
                        className="bg-surface-card border border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2"
                      >
                        <Text className="text-dark-300 text-xs">{tool}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

            {/* Skill proficiencies from race */}
            {currentRaceData.skillProficiencies &&
              currentRaceData.skillProficiencies.length > 0 && (
                <View className="mb-5">
                  <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
                    Competencias en Habilidades
                  </Text>
                  <View className="flex-row flex-wrap">
                    {currentRaceData.skillProficiencies.map((skill, idx) => {
                      const { SKILLS } = require("@/types/character");
                      const skillDef = SKILLS[skill];
                      return (
                        <View
                          key={idx}
                          className="bg-hp-full/10 border border-hp-full/30 rounded-full px-3 py-1.5 mr-2 mb-2"
                        >
                          <Text className="text-hp-full text-sm">
                            {skillDef?.nombre ?? skill}
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}
          </View>
        )}
      </ScrollView>

      {/* Footer with navigation buttons */}
      <View className="absolute bottom-0 left-0 right-0 px-5 pb-10 pt-4 bg-dark-800 border-t border-surface-border">
        <TouchableOpacity
          className={`rounded-xl py-4 items-center flex-row justify-center mb-3 ${
            isValid()
              ? "bg-primary-500 active:bg-primary-600"
              : "bg-dark-600 opacity-50"
          }`}
          onPress={handleNext}
          disabled={!isValid()}
        >
          <Text className="text-white font-bold text-base mr-2">
            Siguiente: Clase
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="rounded-xl py-3.5 items-center active:bg-surface-light"
          onPress={handleBack}
        >
          <Text className="text-dark-300 font-semibold text-base">Atrás</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
