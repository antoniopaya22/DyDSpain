import { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { ConfirmDialog } from "@/components/ui";
import { useDialog } from "@/hooks/useDialog";
import {
  useCreationStore,
  TOTAL_STEPS,
  STEP_NAMES,
  calcTotalScoresPreview,
} from "@/stores/creationStore";
import { useCampaignStore } from "@/stores/campaignStore";
import { getRaceData, getClassData, getBackgroundData } from "@/data/srd";
import {
  ABILITY_ABBR,
  ABILITY_NAMES,
  ALIGNMENT_NAMES,
  SKILLS,
  calcModifier,
  type AbilityKey,
} from "@/types/character";

const CURRENT_STEP = 11;

const ABILITY_KEYS: AbilityKey[] = ["fue", "des", "con", "int", "sab", "car"];

function formatMod(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export default function SummaryStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();
  const { dialogProps, showConfirm, showSuccess, showError } = useDialog();

  const {
    draft,
    isStepValid,
    getCompletedSteps,
    buildCharacter,
    discardDraft,
    saveDraft,
    loadDraft,
  } = useCreationStore();

  const { linkCharacter, loadCampaigns } = useCampaignStore();

  const [creating, setCreating] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        await loadDraft(campaignId);
        setInitialized(true);
      };
      init();
    }, [campaignId])
  );

  const completedSteps = initialized ? getCompletedSteps() : [];
  const allRequiredComplete = completedSteps.length >= 9;

  // Draft data
  const raceData = draft?.raza ? getRaceData(draft.raza) : null;
  const classData = draft?.clase ? getClassData(draft.clase) : null;
  const backgroundData = draft?.trasfondo ? getBackgroundData(draft.trasfondo) : null;

  // Ability scores preview
  const baseScores = draft?.abilityScoresBase;
  const totalScores =
    baseScores && draft?.raza
      ? calcTotalScoresPreview(baseScores, draft.raza, draft.subraza ?? null, draft.freeAbilityBonuses)
      : null;

  // Granted + chosen skills
  const allSkills = draft?.skillChoices ?? [];

  const handleCreate = async () => {
    if (!allRequiredComplete || creating) return;

    showConfirm(
      "Crear Personaje",
      "¿Estás seguro de que quieres crear este personaje? Podrás editar sus datos desde la hoja de personaje después.",
      async () => {
        setCreating(true);
        try {
          const character = buildCharacter();
          if (!character) {
            throw new Error("No se pudo construir el personaje. Revisa todos los pasos.");
          }

          // Save character to AsyncStorage
          const { setItem } = await import("@/utils/storage");
          const { STORAGE_KEYS } = await import("@/utils/storage");
          const { createDefaultInventory } = await import("@/types/item");

          await setItem(STORAGE_KEYS.CHARACTER(character.id), character);

          // Create default inventory
          const inventory = createDefaultInventory(character.inventoryId, character.id);
          await setItem(STORAGE_KEYS.INVENTORY(character.id), inventory);

          // Link character to campaign
          await linkCharacter(campaignId!, character.id);

          // Discard the draft
          await discardDraft(campaignId!);

          // Reload campaigns
          await loadCampaigns();

          // Navigate back to campaign detail
          showSuccess(
            "¡Personaje Creado!",
            `${character.nombre} ha sido creado exitosamente. ¡Buena aventura!`,
            () => {
              router.dismissAll();
              router.replace(`/campaigns/${campaignId}`);
            },
          );
        } catch (error) {
          const message =
            error instanceof Error
              ? error.message
              : "Error desconocido al crear el personaje";
          showError("Error", message);
        } finally {
          setCreating(false);
        }
      },
      { confirmText: "¡Crear!", cancelText: "Revisar", type: "confirm" },
    );
  };

  const handleBack = () => {
    router.back();
  };

  const handleGoToStep = (step: number) => {
    const routes: Record<number, string> = {
      1: "index",
      2: "race",
      3: "class",
      4: "abilities",
      5: "background",
      6: "skills",
      7: "spells",
      8: "equipment",
      9: "personality",
      10: "appearance",
    };
    const route = routes[step];
    if (route) {
      router.push({
        pathname: `/campaigns/[id]/character/create/${route}` as any,
        params: { id: campaignId },
      });
    }
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  if (!initialized) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#c62828" />
        <Text style={styles.loadingText}>Cargando resumen...</Text>
      </View>
    );
  }

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
            <Ionicons name="checkmark-circle-outline" size={44} color="#c62828" />
          </View>
          <Text style={styles.title}>Resumen del Personaje</Text>
          <Text style={styles.subtitle}>
            Revisa todos los datos de tu personaje antes de crearlo.
            Pulsa en cualquier sección para editarla.
          </Text>
        </View>

        {/* Steps completion checklist */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado de Pasos</Text>
          <View style={styles.checklistCard}>
            {Array.from({ length: 10 }, (_, i) => i + 1).map((step) => {
              const valid = isStepValid(step);
              const stepName = STEP_NAMES[step] ?? `Paso ${step}`;
              return (
                <TouchableOpacity
                  key={step}
                  style={styles.checklistRow}
                  onPress={() => handleGoToStep(step)}
                >
                  <Ionicons
                    name={valid ? "checkmark-circle" : "ellipse-outline"}
                    size={22}
                    color={valid ? "#22c55e" : "#666699"}
                  />
                  <Text
                    style={[
                      styles.checklistText,
                      valid && styles.checklistTextDone,
                    ]}
                  >
                    {step}. {stepName}
                  </Text>
                  <Ionicons name="chevron-forward" size={18} color="#666699" />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Character Summary Card */}
        {draft && (
          <>
            {/* Basic Info */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Información Básica</Text>
              <View style={styles.summaryCard}>
                {draft.nombre && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Nombre</Text>
                    <Text style={styles.summaryValue}>{draft.nombre}</Text>
                  </View>
                )}

                {raceData && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Raza</Text>
                    <Text style={styles.summaryValue}>
                      {raceData.nombre}
                      {draft.subraza
                        ? ` (${raceData.subraces.find((s) => s.id === draft.subraza)?.nombre ?? draft.subraza})`
                        : ""}
                    </Text>
                  </View>
                )}

                {classData && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Clase</Text>
                    <Text style={styles.summaryValue}>
                      {classData.nombre} (Nivel 1)
                    </Text>
                  </View>
                )}

                {backgroundData && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Trasfondo</Text>
                    <Text style={styles.summaryValue}>
                      {backgroundData.nombre}
                    </Text>
                  </View>
                )}

                {draft.alineamiento && (
                  <View style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>Alineamiento</Text>
                    <Text style={styles.summaryValue}>
                      {ALIGNMENT_NAMES[draft.alineamiento]}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Ability Scores */}
            {totalScores && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Puntuaciones de Característica</Text>
                <View style={styles.scoresGrid}>
                  {ABILITY_KEYS.map((key) => {
                    const total = totalScores[key];
                    const mod = calcModifier(total);
                    return (
                      <View key={key} style={styles.scoreCard}>
                        <Text style={styles.scoreAbbr}>{ABILITY_ABBR[key]}</Text>
                        <Text style={styles.scoreTotal}>{total}</Text>
                        <Text style={styles.scoreMod}>{formatMod(mod)}</Text>
                      </View>
                    );
                  })}
                </View>

                {/* HP Preview */}
                {classData && totalScores && (
                  <View style={styles.hpPreview}>
                    <View style={styles.hpIcon}>
                      <Ionicons name="heart" size={20} color="#22c55e" />
                    </View>
                    <View style={styles.hpInfo}>
                      <Text style={styles.hpLabel}>Puntos de Golpe a Nivel 1</Text>
                      <Text style={styles.hpValue}>
                        {classData.hitDieMax + calcModifier(totalScores.con)} PG
                      </Text>
                    </View>
                    <View style={styles.hitDieBadge}>
                      <Text style={styles.hitDieText}>
                        Dado: {classData.hitDie}
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Skills */}
            {allSkills.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Competencias en Habilidades</Text>
                <View style={styles.skillsGrid}>
                  {allSkills.map((sk) => {
                    const def = SKILLS[sk];
                    return (
                      <View key={sk} style={styles.skillBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#22c55e"
                        />
                        <Text style={styles.skillBadgeText}>
                          {def?.nombre ?? sk}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Spells */}
            {draft.spellChoices &&
              (draft.spellChoices.cantrips.length > 0 ||
                draft.spellChoices.spells.length > 0) && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Hechizos</Text>
                  <View style={styles.summaryCard}>
                    {draft.spellChoices.cantrips.length > 0 && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Trucos</Text>
                        <Text style={styles.summaryValue}>
                          {draft.spellChoices.cantrips.length} seleccionados
                        </Text>
                      </View>
                    )}
                    {draft.spellChoices.spells.length > 0 && (
                      <View style={styles.summaryRow}>
                        <Text style={styles.summaryLabel}>Conjuros Nv.1</Text>
                        <Text style={styles.summaryValue}>
                          {draft.spellChoices.spells.length} seleccionados
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

            {/* Personality */}
            {draft.personality && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Personalidad</Text>
                <View style={styles.summaryCard}>
                  {draft.personality.traits && draft.personality.traits.length > 0 && (
                    <View style={styles.personalityRow}>
                      <Text style={styles.personalityLabel}>Rasgos</Text>
                      <Text style={styles.personalityValue}>
                        {Array.isArray(draft.personality.traits)
                          ? draft.personality.traits.join("; ")
                          : draft.personality.traits}
                      </Text>
                    </View>
                  )}
                  {draft.personality.ideals && (
                    <View style={styles.personalityRow}>
                      <Text style={styles.personalityLabel}>Ideales</Text>
                      <Text style={styles.personalityValue}>
                        {draft.personality.ideals}
                      </Text>
                    </View>
                  )}
                  {draft.personality.bonds && (
                    <View style={styles.personalityRow}>
                      <Text style={styles.personalityLabel}>Vínculos</Text>
                      <Text style={styles.personalityValue}>
                        {draft.personality.bonds}
                      </Text>
                    </View>
                  )}
                  {draft.personality.flaws && (
                    <View style={styles.personalityRow}>
                      <Text style={styles.personalityLabel}>Defectos</Text>
                      <Text style={styles.personalityValue}>
                        {draft.personality.flaws}
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Appearance */}
            {draft.appearance && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Apariencia</Text>
                <View style={styles.summaryCard}>
                  {draft.appearance.age && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Edad</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.age}</Text>
                    </View>
                  )}
                  {draft.appearance.height && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Altura</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.height}</Text>
                    </View>
                  )}
                  {draft.appearance.weight && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Peso</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.weight}</Text>
                    </View>
                  )}
                  {draft.appearance.hairColor && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Pelo</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.hairColor}</Text>
                    </View>
                  )}
                  {draft.appearance.eyeColor && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Ojos</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.eyeColor}</Text>
                    </View>
                  )}
                  {draft.appearance.skinColor && (
                    <View style={styles.summaryRow}>
                      <Text style={styles.summaryLabel}>Piel</Text>
                      <Text style={styles.summaryValue}>{draft.appearance.skinColor}</Text>
                    </View>
                  )}
                  {draft.appearance.description && (
                    <View style={styles.personalityRow}>
                      <Text style={styles.personalityLabel}>Descripción</Text>
                      <Text style={styles.personalityValue}>
                        {draft.appearance.description}
                      </Text>
                    </View>
                  )}
                  {!draft.appearance.age &&
                    !draft.appearance.height &&
                    !draft.appearance.weight &&
                    !draft.appearance.hairColor &&
                    !draft.appearance.eyeColor &&
                    !draft.appearance.skinColor &&
                    !draft.appearance.description && (
                      <Text style={styles.emptyNote}>
                        Sin datos de apariencia (se puede rellenar después)
                      </Text>
                    )}
                </View>
              </View>
            )}
          </>
        )}

        {/* Validation warning */}
        {!allRequiredComplete && (
          <View style={styles.section}>
            <View style={styles.warningBox}>
              <Ionicons name="warning" size={22} color="#f59e0b" />
              <View style={styles.warningContent}>
                <Text style={styles.warningTitle}>Pasos incompletos</Text>
                <Text style={styles.warningText}>
                  Debes completar al menos los pasos 1-9 antes de crear el
                  personaje. Pulsa en los pasos marcados con ○ para completarlos.
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.createButton,
            (!allRequiredComplete || creating) && styles.createButtonDisabled,
          ]}
          onPress={handleCreate}
          disabled={!allRequiredComplete || creating}
        >
          {creating ? (
            <>
              <ActivityIndicator size="small" color="white" />
              <Text style={styles.createButtonText}>Creando personaje...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={22} color="white" />
              <Text style={styles.createButtonText}>
                ¡Crear Personaje!
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a2e",
  },
  centerContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    flex: 1,
  },
  loadingText: {
    color: "#8c8cb3",
    fontSize: 16,
    marginTop: 16,
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
  checklistCard: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    overflow: "hidden",
  },
  checklistRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d52",
  },
  checklistText: {
    flex: 1,
    color: "#8c8cb3",
    fontSize: 15,
    marginLeft: 12,
  },
  checklistTextDone: {
    color: "#d9d9e6",
    fontWeight: "600",
  },
  summaryCard: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    padding: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d52",
  },
  summaryLabel: {
    color: "#8c8cb3",
    fontSize: 14,
    fontWeight: "600",
  },
  summaryValue: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
    marginLeft: 12,
  },
  scoresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  scoreCard: {
    width: "30%",
    backgroundColor: "#23233d",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    padding: 12,
    alignItems: "center",
    marginBottom: 10,
  },
  scoreAbbr: {
    color: "#fbbf24",
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 4,
  },
  scoreTotal: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "bold",
  },
  scoreMod: {
    color: "#8c8cb3",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 2,
  },
  hpPreview: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23233d",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    padding: 14,
  },
  hpIcon: {
    height: 40,
    width: 40,
    borderRadius: 20,
    backgroundColor: "rgba(34,197,94,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  hpInfo: {
    flex: 1,
  },
  hpLabel: {
    color: "#8c8cb3",
    fontSize: 13,
  },
  hpValue: {
    color: "#22c55e",
    fontSize: 20,
    fontWeight: "bold",
  },
  hitDieBadge: {
    backgroundColor: "#2d2d52",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  hitDieText: {
    color: "#b3b3cc",
    fontSize: 13,
    fontWeight: "600",
  },
  skillsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23233d",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(34,197,94,0.3)",
  },
  skillBadgeText: {
    color: "#d9d9e6",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  personalityRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#2d2d52",
  },
  personalityLabel: {
    color: "#fbbf24",
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 4,
  },
  personalityValue: {
    color: "#d9d9e6",
    fontSize: 14,
    lineHeight: 20,
  },
  emptyNote: {
    color: "#666699",
    fontSize: 14,
    fontStyle: "italic",
    paddingVertical: 8,
  },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "rgba(245,158,11,0.1)",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
  },
  warningContent: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    color: "#f59e0b",
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 4,
  },
  warningText: {
    color: "#d9d9e6",
    fontSize: 13,
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#3a3a5c",
  },
  createButton: {
    backgroundColor: "#c62828",
    borderRadius: 12,
    paddingVertical: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  createButtonDisabled: {
    backgroundColor: "#2d2d44",
    opacity: 0.5,
  },
  createButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
