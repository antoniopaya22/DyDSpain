import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useCreationStore,
  TOTAL_STEPS,
} from "@/stores/creationStore";
import { getClassData, getBackgroundData } from "@/data/srd";
import type { EquipmentChoice } from "@/data/srd";

const CURRENT_STEP = 8;

export default function EquipmentStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const {
    draft,
    setEquipmentChoices,
    saveDraft,
    loadDraft,
  } = useCreationStore();

  const [choices, setChoices] = useState<Record<string, string>>({});

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        await loadDraft(campaignId);
        const currentDraft = useCreationStore.getState().draft;
        if (currentDraft?.equipmentChoices) {
          setChoices({ ...currentDraft.equipmentChoices });
        }
      };
      init();
    }, [campaignId])
  );

  const classId = draft?.clase;
  const backgroundId = draft?.trasfondo;
  const classData = classId ? getClassData(classId) : null;
  const backgroundData = backgroundId ? getBackgroundData(backgroundId) : null;

  const equipmentChoices: EquipmentChoice[] = classData?.equipmentChoices ?? [];
  const defaultEquipment: string[] = classData?.defaultEquipment ?? [];
  const backgroundEquipment: string[] = backgroundData?.equipment ?? [];
  const backgroundGold: number = backgroundData?.startingGold ?? 0;

  const isValid = equipmentChoices.every((ec) => !!choices[ec.id]);

  const handleSelect = (choiceId: string, optionId: string) => {
    setChoices((prev) => ({ ...prev, [choiceId]: optionId }));
  };

  const handleNext = async () => {
    if (!isValid) return;
    setEquipmentChoices(choices);
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/personality",
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    if (Object.keys(choices).length > 0) {
      setEquipmentChoices(choices);
    }
    router.back();
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.backButton} onPress={handleBack}>
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text style={styles.stepText}>
              Paso {CURRENT_STEP} de {TOTAL_STEPS}
            </Text>
            <View style={{ height: 40, width: 40 }} />
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconCircle}>
            <Ionicons name="bag-outline" size={40} color="#c62828" />
          </View>
          <Text style={styles.title}>Equipamiento Inicial</Text>
          <Text style={styles.subtitle}>
            Elige tu equipamiento de partida según las opciones de tu clase.
            También recibirás equipo de tu trasfondo.
          </Text>
        </View>

        {/* Equipment Choices */}
        {equipmentChoices.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Opciones de Clase</Text>

            {equipmentChoices.map((ec) => {
              const selectedOption = choices[ec.id];

              return (
                <View key={ec.id} style={styles.choiceGroup}>
                  <Text style={styles.choiceLabel}>{ec.label}</Text>
                  {ec.options.map((option) => {
                    const isSelected = selectedOption === option.id;

                    return (
                      <TouchableOpacity
                        key={option.id}
                        style={[
                          styles.optionCard,
                          isSelected && styles.optionCardSelected,
                        ]}
                        onPress={() => handleSelect(ec.id, option.id)}
                      >
                        <View style={styles.optionRow}>
                          <View
                            style={[
                              styles.radio,
                              isSelected && styles.radioSelected,
                            ]}
                          >
                            {isSelected && <View style={styles.radioInner} />}
                          </View>
                          <View style={styles.optionInfo}>
                            <Text
                              style={[
                                styles.optionLabel,
                                isSelected && styles.optionLabelSelected,
                              ]}
                            >
                              {option.label}
                            </Text>
                            <Text style={styles.optionItems} numberOfLines={2}>
                              {option.items.join(", ")}
                            </Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </View>
        )}

        {/* Default class equipment */}
        {defaultEquipment.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Equipo Incluido (Clase)</Text>
            <View style={styles.includedCard}>
              {defaultEquipment.map((item, index) => (
                <View key={index} style={styles.includedRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  <Text style={styles.includedText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Background equipment */}
        {(backgroundEquipment.length > 0 || backgroundGold > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Equipo de Trasfondo ({backgroundData?.nombre ?? "Trasfondo"})
            </Text>
            <View style={styles.includedCard}>
              {backgroundEquipment.map((item, index) => (
                <View key={index} style={styles.includedRow}>
                  <Ionicons name="checkmark-circle" size={18} color="#fbbf24" />
                  <Text style={styles.includedText}>{item}</Text>
                </View>
              ))}
              {backgroundGold > 0 && (
                <View style={styles.includedRow}>
                  <Ionicons name="cash-outline" size={18} color="#fbbf24" />
                  <Text style={styles.includedText}>
                    {backgroundGold} po (piezas de oro)
                  </Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Summary hint */}
        <View style={styles.section}>
          <View style={styles.hintBox}>
            <Ionicons name="information-circle" size={20} color="#fbbf24" />
            <Text style={styles.hintText}>
              Podrás gestionar tu inventario completo desde la hoja de personaje
              una vez finalizada la creación.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>Siguiente: Personalidad</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  scroll: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 64,
    paddingBottom: 16,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "#1e1e38",
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    color: "#8c8cb3",
    fontSize: 14,
    fontWeight: "600",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#1e1e38",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#c62828",
    borderRadius: 3,
  },
  titleSection: {
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  iconCircle: {
    height: 80,
    width: 80,
    borderRadius: 40,
    backgroundColor: "rgba(198,40,40,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: "#8c8cb3",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    color: "#d9d9e6",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  choiceGroup: {
    marginBottom: 16,
  },
  choiceLabel: {
    color: "#fbbf24",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionCard: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#3a3a5c",
  },
  optionCardSelected: {
    borderColor: "#c62828",
    backgroundColor: "#2a1a2e",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  radio: {
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#666699",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  radioSelected: {
    borderColor: "#c62828",
  },
  radioInner: {
    height: 12,
    width: 12,
    borderRadius: 6,
    backgroundColor: "#c62828",
  },
  optionInfo: {
    flex: 1,
  },
  optionLabel: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
  },
  optionLabelSelected: {
    color: "#ffffff",
  },
  optionItems: {
    color: "#8c8cb3",
    fontSize: 13,
    lineHeight: 18,
  },
  includedCard: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3a3a5c",
  },
  includedRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
  },
  includedText: {
    color: "#d9d9e6",
    fontSize: 14,
    marginLeft: 10,
    flex: 1,
    lineHeight: 19,
  },
  hintBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(251,191,36,0.1)",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.2)",
  },
  hintText: {
    color: "#d9d9e6",
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5c",
  },
  nextButton: {
    backgroundColor: "#c62828",
    borderRadius: 12,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  nextButtonDisabled: {
    backgroundColor: "#2d2d44",
    opacity: 0.5,
  },
  nextButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
});
