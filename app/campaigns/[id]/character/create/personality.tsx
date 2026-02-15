import { useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
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
import {
  getBackgroundData,
  generateRandomPersonality,
} from "@/data/srd";
import {
  ALIGNMENT_NAMES,
  type Alignment,
  type Personality,
} from "@/types/character";

const CURRENT_STEP = 9;

const ALIGNMENT_KEYS: Alignment[] = [
  "legal_bueno",
  "neutral_bueno",
  "caotico_bueno",
  "legal_neutral",
  "neutral",
  "caotico_neutral",
  "legal_malvado",
  "neutral_malvado",
  "caotico_malvado",
];

const ALIGNMENT_COLORS: Record<string, string> = {
  legal_bueno: "#3b82f6",
  neutral_bueno: "#22c55e",
  caotico_bueno: "#f59e0b",
  legal_neutral: "#6366f1",
  neutral: "#9ca3af",
  caotico_neutral: "#f97316",
  legal_malvado: "#8b5cf6",
  neutral_malvado: "#ef4444",
  caotico_malvado: "#dc2626",
};

const ALIGNMENT_DESCRIPTIONS: Record<Alignment, string> = {
  legal_bueno: "Actúa con compasión y honor, respetando la ley y ayudando a los demás.",
  neutral_bueno: "Hace lo mejor que puede para ayudar a otros según sus necesidades.",
  caotico_bueno: "Actúa según su conciencia, con poca consideración por las expectativas ajenas.",
  legal_neutral: "Actúa de acuerdo con la ley, la tradición o códigos personales.",
  neutral: "No se siente obligado hacia ningún alineamiento en particular.",
  caotico_neutral: "Sigue sus caprichos, valorando su libertad por encima de todo.",
  legal_malvado: "Toma metódicamente lo que quiere, dentro de un código de tradición o lealtad.",
  neutral_malvado: "Hace lo que quiere sin compasión ni escrúpulos.",
  caotico_malvado: "Actúa con violencia arbitraria, estimulado por su codicia o crueldad.",
};

export default function PersonalityStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const {
    draft,
    setPersonality,
    setAlineamiento,
    saveDraft,
    loadDraft,
  } = useCreationStore();

  const [traits, setTraits] = useState("");
  const [ideals, setIdeals] = useState("");
  const [bonds, setBonds] = useState("");
  const [flaws, setFlaws] = useState("");
  const [backstory, setBackstory] = useState("");
  const [alignment, setAlignment] = useState<Alignment | null>(null);
  const [showAlignmentDetails, setShowAlignmentDetails] = useState<Alignment | null>(null);

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;
        await loadDraft(campaignId);
        const currentDraft = useCreationStore.getState().draft;
        if (currentDraft?.personality) {
          setTraits(currentDraft.personality.traits?.join("\n") ?? "");
          setIdeals(currentDraft.personality.ideals ?? "");
          setBonds(currentDraft.personality.bonds ?? "");
          setFlaws(currentDraft.personality.flaws ?? "");
          setBackstory(currentDraft.personality.backstory ?? "");
        }
        if (currentDraft?.alineamiento) {
          setAlignment(currentDraft.alineamiento);
        }
      };
      init();
    }, [campaignId])
  );

  const backgroundId = draft?.trasfondo;
  const backgroundData = backgroundId ? getBackgroundData(backgroundId) : null;

  const isValid =
    traits.trim().length > 0 &&
    ideals.trim().length > 0 &&
    bonds.trim().length > 0 &&
    flaws.trim().length > 0 &&
    alignment !== null;

  const handleRandomize = () => {
    if (!backgroundId) return;
    const random = generateRandomPersonality(backgroundId);
    setTraits(random.traits.join("\n"));
    setIdeals(random.ideals);
    setBonds(random.bonds);
    setFlaws(random.flaws);
  };

  const handleNext = async () => {
    if (!isValid || !alignment) return;
    const personality: Personality = {
      traits: traits
        .split("\n")
        .map((t) => t.trim())
        .filter((t) => t.length > 0),
      ideals: ideals.trim(),
      bonds: bonds.trim(),
      flaws: flaws.trim(),
      backstory: backstory.trim() || undefined,
    };
    setPersonality(personality);
    setAlineamiento(alignment);
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/appearance",
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    if (alignment) {
      setAlineamiento(alignment);
    }
    if (traits.trim().length > 0) {
      const personality: Personality = {
        traits: traits
          .split("\n")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        ideals: ideals.trim(),
        bonds: bonds.trim(),
        flaws: flaws.trim(),
        backstory: backstory.trim() || undefined,
      };
      setPersonality(personality);
    }
    router.back();
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
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
            <View
              style={[styles.progressFill, { width: `${progressPercent}%` }]}
            />
          </View>
        </View>

        {/* Title */}
        <View style={styles.titleSection}>
          <View style={styles.iconCircle}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={40}
              color="#c62828"
            />
          </View>
          <Text style={styles.title}>Personalidad y Alineamiento</Text>
          <Text style={styles.subtitle}>
            Define la personalidad de tu personaje: cómo actúa, qué valora y
            cuáles son sus defectos. También elige su alineamiento moral.
          </Text>
        </View>

        {/* Randomize button */}
        {backgroundData && (
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.randomButton}
              onPress={handleRandomize}
            >
              <Ionicons name="dice-outline" size={20} color="#fbbf24" />
              <Text style={styles.randomButtonText}>
                Generar aleatoriamente (según {backgroundData.nombre})
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Personality Traits */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Rasgos de Personalidad{" "}
            <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            ¿Cómo se comporta tu personaje? Describe uno o dos rasgos
            distintivos. Separa cada rasgo en una línea diferente.
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ej: Siempre tengo una historia relevante para cada situación."
            placeholderTextColor="#666699"
            value={traits}
            onChangeText={setTraits}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Ideals */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Ideales <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            ¿Qué principios guían a tu personaje? ¿Qué es lo más importante
            para él/ella?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ej: La verdad. Siempre busco la verdad por encima de todo."
            placeholderTextColor="#666699"
            value={ideals}
            onChangeText={setIdeals}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Bonds */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Vínculos <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            ¿Qué personas, lugares o cosas son más importantes para tu
            personaje?
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ej: Protegeré a mi pueblo natal cueste lo que cueste."
            placeholderTextColor="#666699"
            value={bonds}
            onChangeText={setBonds}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Flaws */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Defectos <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            ¿Cuál es la debilidad o vicio de tu personaje? Algo que pueda ser
            usado en su contra.
          </Text>
          <TextInput
            style={styles.textArea}
            placeholder="Ej: Mi orgullo me impide pedir ayuda, incluso cuando la necesito."
            placeholderTextColor="#666699"
            value={flaws}
            onChangeText={setFlaws}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>

        {/* Backstory (optional) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Historia de Fondo{" "}
            <Text style={styles.optional}>(opcional)</Text>
          </Text>
          <Text style={styles.fieldHint}>
            Escribe brevemente la historia de tu personaje antes de convertirse
            en aventurero. Puedes ampliarla más tarde.
          </Text>
          <TextInput
            style={[styles.textArea, styles.textAreaLarge]}
            placeholder="Cuenta la historia de tu personaje..."
            placeholderTextColor="#666699"
            value={backstory}
            onChangeText={setBackstory}
            multiline
            numberOfLines={5}
            maxLength={2000}
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>{backstory.length}/2000</Text>
        </View>

        {/* Alignment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Alineamiento <Text style={styles.required}>*</Text>
          </Text>
          <Text style={styles.fieldHint}>
            El alineamiento describe la brújula moral de tu personaje en dos
            ejes: ley/caos y bien/mal.
          </Text>

          {/* Alignment Grid */}
          <View style={styles.alignmentGrid}>
            {/* Column headers */}
            <View style={styles.alignmentHeaderRow}>
              <View style={styles.alignmentHeaderSpacer} />
              <View style={styles.alignmentHeaderCell}>
                <Text style={styles.alignmentHeaderText}>Bueno</Text>
              </View>
              <View style={styles.alignmentHeaderCell}>
                <Text style={styles.alignmentHeaderText}>Neutral</Text>
              </View>
              <View style={styles.alignmentHeaderCell}>
                <Text style={styles.alignmentHeaderText}>Malvado</Text>
              </View>
            </View>

            {/* Legal row */}
            <View style={styles.alignmentRow}>
              <View style={styles.alignmentRowLabel}>
                <Text style={styles.alignmentRowText}>Legal</Text>
              </View>
              {(["legal_bueno", "legal_neutral", "legal_malvado"] as Alignment[]).map(
                (a) => renderAlignmentCell(a)
              )}
            </View>

            {/* Neutral row */}
            <View style={styles.alignmentRow}>
              <View style={styles.alignmentRowLabel}>
                <Text style={styles.alignmentRowText}>Neutral</Text>
              </View>
              {(["neutral_bueno", "neutral", "neutral_malvado"] as Alignment[]).map(
                (a) => renderAlignmentCell(a)
              )}
            </View>

            {/* Chaotic row */}
            <View style={styles.alignmentRow}>
              <View style={styles.alignmentRowLabel}>
                <Text style={styles.alignmentRowText}>Caótico</Text>
              </View>
              {(["caotico_bueno", "caotico_neutral", "caotico_malvado"] as Alignment[]).map(
                (a) => renderAlignmentCell(a)
              )}
            </View>
          </View>

          {/* Selected alignment description */}
          {alignment && (
            <View style={styles.alignmentDescBox}>
              <View style={styles.alignmentDescHeader}>
                <View
                  style={[
                    styles.alignmentDot,
                    {
                      backgroundColor:
                        ALIGNMENT_COLORS[alignment] ?? "#9ca3af",
                    },
                  ]}
                />
                <Text style={styles.alignmentDescName}>
                  {ALIGNMENT_NAMES[alignment]}
                </Text>
              </View>
              <Text style={styles.alignmentDescText}>
                {ALIGNMENT_DESCRIPTIONS[alignment]}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.nextButton, !isValid && styles.nextButtonDisabled]}
          onPress={handleNext}
          disabled={!isValid}
        >
          <Text style={styles.nextButtonText}>Siguiente: Apariencia</Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  function renderAlignmentCell(a: Alignment) {
    const isSelected = alignment === a;
    const color = ALIGNMENT_COLORS[a] ?? "#9ca3af";

    return (
      <TouchableOpacity
        key={a}
        style={[
          styles.alignmentCell,
          isSelected && { borderColor: color, backgroundColor: `${color}20` },
        ]}
        onPress={() => {
          setAlignment(a);
          setShowAlignmentDetails(a);
        }}
      >
        {isSelected ? (
          <Ionicons name="checkmark-circle" size={22} color={color} />
        ) : (
          <View
            style={[
              styles.alignmentCellDot,
              { borderColor: `${color}60` },
            ]}
          />
        )}
      </TouchableOpacity>
    );
  }
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
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },
  required: {
    color: "#c62828",
    fontSize: 14,
  },
  optional: {
    color: "#666699",
    fontSize: 12,
    fontWeight: "400",
  },
  fieldHint: {
    color: "#8c8cb3",
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  textArea: {
    backgroundColor: "#1e1e38",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: "#ffffff",
    fontSize: 15,
    lineHeight: 22,
    minHeight: 80,
  },
  textAreaLarge: {
    minHeight: 130,
  },
  charCount: {
    color: "#666699",
    fontSize: 12,
    textAlign: "right",
    marginTop: 4,
  },
  randomButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(251,191,36,0.1)",
    borderRadius: 12,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.25)",
  },
  randomButtonText: {
    color: "#fbbf24",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  alignmentGrid: {
    backgroundColor: "#23233d",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#3a3a5c",
    padding: 10,
    marginBottom: 12,
  },
  alignmentHeaderRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  alignmentHeaderSpacer: {
    width: 64,
  },
  alignmentHeaderCell: {
    flex: 1,
    alignItems: "center",
  },
  alignmentHeaderText: {
    color: "#666699",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  alignmentRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  alignmentRowLabel: {
    width: 64,
  },
  alignmentRowText: {
    color: "#666699",
    fontSize: 12,
    fontWeight: "700",
  },
  alignmentCell: {
    flex: 1,
    height: 48,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#3a3a5c",
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 3,
    backgroundColor: "#1e1e38",
  },
  alignmentCellDot: {
    height: 18,
    width: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  alignmentDescBox: {
    backgroundColor: "#1e1e38",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#3a3a5c",
  },
  alignmentDescHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  alignmentDot: {
    height: 10,
    width: 10,
    borderRadius: 5,
    marginRight: 8,
  },
  alignmentDescName: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  alignmentDescText: {
    color: "#b3b3cc",
    fontSize: 14,
    lineHeight: 20,
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
