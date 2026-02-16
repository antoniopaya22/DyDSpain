/**
 * LevelUpModal - Modal wizard para subir de nivel.
 * Pasos:
 *   1. Resumen de lo que se gana al subir de nivel
 *   2. Método de PG (tirar dado o valor fijo)
 *   3. Mejora de Puntuación de Característica (ASI) si aplica
 *   4. Elección de subclase si aplica
 *   5. Confirmación final
 */

import { useState, useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Animated,
  Easing,
  TextInput,
  Platform,
  Dimensions,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useCharacterStore,
  type LevelUpOptions,
} from "@/stores/characterStore";
import {
  getLevelUpSummary,
  isASILevel,
  isSubclassLevel,
  getFeaturesForLevel,
  formatXP,
  XP_THRESHOLDS,
  ASI_POINTS,
  MAX_ABILITY_SCORE,
  type LevelUpSummary,
  type LevelFeature,
} from "@/data/srd/leveling";
import { getClassData } from "@/data/srd/classes";
import { getSubclassOptions, type SubclassOption } from "@/data/srd/subclasses";
import {
  getCantripsForClass,
  getSpellsForClassUpToLevel,
  getSpellById,
  type SrdSpell,
} from "@/data/srd/spells";
import { getSpellDescription } from "@/data/srd/spellDescriptions";
import {
  SPELL_LEVEL_NAMES,
  type SpellLevel,
  type MetamagicOption,
  METAMAGIC_NAMES,
  METAMAGIC_DESCRIPTIONS,
  METAMAGIC_COSTS,
  ALL_METAMAGIC_OPTIONS,
} from "@/types/spell";
import {
  ABILITY_NAMES,
  ABILITY_ABBR,
  calcModifier,
  formatModifier,
  calcProficiencyBonus,
  hitDieFixedValue,
  hitDieValue,
  type AbilityKey,
  type AbilityScores,
} from "@/types/character";
import { useTheme } from "@/hooks/useTheme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const ABILITY_KEYS: AbilityKey[] = ["fue", "des", "con", "int", "sab", "car"];

// Note: ABILITY_COLORS are kept as a static fallback. Prefer using
// getAbilityColors(colors) below when inside a component with theme access.
const ABILITY_COLORS: Record<AbilityKey, string> = {
  fue: "#dc2626",
  des: "#16a34a",
  con: "#f59e0b",
  int: "#3b82f6",
  sab: "#8b5cf6",
  car: "#ec4899",
};

// ─── Step identifiers ────────────────────────────────────────────────

type StepId = "summary" | "hp" | "asi" | "spells" | "subclass" | "metamagic" | "confirm";

interface StepDef {
  id: StepId;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
}

// ─── Props ───────────────────────────────────────────────────────────

interface LevelUpModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function LevelUpModal({
  visible,
  onClose,
  onComplete,
}: LevelUpModalProps) {
  const { isDark, colors } = useTheme();
  const { character, levelUp, getMagicState } = useCharacterStore();

  // ── Wizard state ──
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [steps, setSteps] = useState<StepDef[]>([]);
  const [summary, setSummary] = useState<LevelUpSummary | null>(null);

  // ── HP state ──
  const [hpMethod, setHpMethod] = useState<"fixed" | "roll">("fixed");
  const [hpRolled, setHpRolled] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  // ── ASI state ──
  const [asiPoints, setAsiPoints] = useState<Record<AbilityKey, number>>({
    fue: 0,
    des: 0,
    con: 0,
    int: 0,
    sab: 0,
    car: 0,
  });

  // ── Subclass state ──
  const [subclassName, setSubclassName] = useState("");
  const [selectedSubclassId, setSelectedSubclassId] = useState<string | null>(null);
  const [isCustomSubclass, setIsCustomSubclass] = useState(false);

  // ── Spell learning state ──
  const [newCantrips, setNewCantrips] = useState<string[]>([]);
  const [newSpells, setNewSpells] = useState<string[]>([]);
  const [newSpellbook, setNewSpellbook] = useState<string[]>([]);
  const [swapOldSpell, setSwapOldSpell] = useState("");
  const [swapNewSpell, setSwapNewSpell] = useState("");
  const [wantsToSwap, setWantsToSwap] = useState(false);
  const [spellSearch, setSpellSearch] = useState("");

  // ── Metamagic state ──
  const [selectedMetamagic, setSelectedMetamagic] = useState<string[]>([]);

  // ── Spell description expand state ──
  const [expandedSpellIds, setExpandedSpellIds] = useState<Set<string>>(new Set());

  // ── Animations ──
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const diceRollAnim = useRef(new Animated.Value(0)).current;
  const [isProcessing, setIsProcessing] = useState(false);

  // ── Computed values ──
  const newLevel = character ? character.nivel + 1 : 1;
  const classData = character ? getClassData(character.clase) : null;
  const dieSides = classData ? hitDieValue(classData.hitDie) : 8;
  const fixedHP = classData ? hitDieFixedValue(classData.hitDie) : 5;
  const conMod = character
    ? calcModifier(character.abilityScores.con.total)
    : 0;

  const totalASIUsed = Object.values(asiPoints).reduce((s, v) => s + v, 0);
  const asiRemaining = ASI_POINTS - totalASIUsed;

  // ── Build steps on open ──
  useEffect(() => {
    if (visible && character) {
      const s = getLevelUpSummary(character.clase, newLevel);
      setSummary(s);

      const buildSteps: StepDef[] = [
        { id: "summary", title: "Resumen", icon: "list-outline" },
        { id: "hp", title: "Puntos de Golpe", icon: "heart-outline" },
      ];

      if (s.hasASI) {
        buildSteps.push({
          id: "asi",
          title: "Mejora de Característica",
          icon: "trending-up-outline",
        });
      }

      // Paso de hechizos: si la clase aprende hechizos nuevos al subir
      if (s.spellLearning) {
        const sl = s.spellLearning;
        const hasNewSpells =
          sl.newCantrips > 0 ||
          sl.newSpellsKnown > 0 ||
          sl.newSpellbookSpells > 0 ||
          sl.canSwapSpell;
        if (hasNewSpells) {
          buildSteps.push({
            id: "spells",
            title: "Hechizos",
            icon: "sparkles-outline",
          });
        }
      }

      if (s.choosesSubclass && !character.subclase) {
        buildSteps.push({
          id: "subclass",
          title: classData?.subclassLabel ?? "Subclase",
          icon: "git-branch-outline",
        });
      }

      if (s.newMetamagicChoices > 0) {
        buildSteps.push({
          id: "metamagic",
          title: "Metamagia",
          icon: "flash-outline",
        });
      }

      buildSteps.push({
        id: "confirm",
        title: "Confirmar",
        icon: "checkmark-circle-outline",
      });

      setSteps(buildSteps);
      setCurrentStepIndex(0);

      // Reset all state
      setHpMethod("fixed");
      setHpRolled(null);
      setIsRolling(false);
      setAsiPoints({ fue: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 });
      setSubclassName("");
      setSelectedSubclassId(null);
      setIsCustomSubclass(false);
      setIsProcessing(false);

      // Reset spell learning state
      setNewCantrips([]);
      setNewSpells([]);
      setNewSpellbook([]);
      setSwapOldSpell("");
      setSwapNewSpell("");
      setWantsToSwap(false);
      setSpellSearch("");
      setSelectedMetamagic([]);
      setExpandedSpellIds(new Set());
    }
  }, [visible, character]);

  // ── Step transition animation ──
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentStepIndex, fadeAnim, slideAnim]);

  // ── Handlers ──
  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const isFirstStep = currentStepIndex === 0;

  const goNext = () => {
    if (isLastStep) {
      handleConfirm();
    } else {
      setCurrentStepIndex((i) => Math.min(i + 1, steps.length - 1));
    }
  };

  const goBack = () => {
    if (isFirstStep) {
      onClose();
    } else {
      setCurrentStepIndex((i) => Math.max(i - 1, 0));
    }
  };

  const canProceed = (): boolean => {
    if (!currentStep) return false;
    switch (currentStep.id) {
      case "summary":
        return true;
      case "hp":
        return hpMethod === "fixed" || hpRolled !== null;
      case "asi":
        return totalASIUsed === ASI_POINTS;
      case "spells": {
        if (!summary?.spellLearning) return true;
        const sl = summary.spellLearning;
        // All cantrip slots filled
        if (sl.newCantrips > 0 && newCantrips.length < sl.newCantrips) return false;
        // All spell slots filled
        if (sl.newSpellsKnown > 0 && newSpells.length < sl.newSpellsKnown) return false;
        // All spellbook slots filled
        if (sl.newSpellbookSpells > 0 && newSpellbook.length < sl.newSpellbookSpells) return false;
        // If user wants to swap, both fields required
        if (wantsToSwap && sl.canSwapSpell) {
          if (!swapOldSpell || !swapNewSpell) return false;
        }
        return true;
      }
      case "subclass":
        return subclassName.trim().length > 0;
      case "metamagic":
        return summary ? selectedMetamagic.length === summary.newMetamagicChoices : false;
      case "confirm":
        return true;
      default:
        return true;
    }
  };

  const rollHPDie = () => {
    if (isRolling) return;
    setIsRolling(true);
    setHpRolled(null);

    // Dice animation
    let count = 0;
    const maxCount = 12;
    const interval = setInterval(() => {
      const fakeRoll = Math.floor(Math.random() * dieSides) + 1;
      setHpRolled(fakeRoll);
      count++;
      if (count >= maxCount) {
        clearInterval(interval);
        const finalRoll = Math.floor(Math.random() * dieSides) + 1;
        setHpRolled(finalRoll);
        setIsRolling(false);
      }
    }, 80);
  };

  const incrementASI = (key: AbilityKey) => {
    if (asiRemaining <= 0) return;
    if (!character) return;
    const currentTotal = character.abilityScores[key].total + asiPoints[key];
    if (currentTotal >= MAX_ABILITY_SCORE) return;
    setAsiPoints((prev) => ({ ...prev, [key]: prev[key] + 1 }));
  };

  const decrementASI = (key: AbilityKey) => {
    if (asiPoints[key] <= 0) return;
    setAsiPoints((prev) => ({ ...prev, [key]: prev[key] - 1 }));
  };

  const handleConfirm = async () => {
    if (!character || isProcessing) return;
    setIsProcessing(true);

    try {
      const options: LevelUpOptions = {
        hpMethod,
        hpRolled: hpMethod === "roll" && hpRolled ? hpRolled : undefined,
        abilityImprovements:
          summary?.hasASI && totalASIUsed > 0
            ? Object.fromEntries(
                Object.entries(asiPoints).filter(([_, v]) => v > 0),
              )
            : undefined,
        subclassChosen:
          summary?.choosesSubclass && subclassName.trim()
            ? subclassName.trim()
            : undefined,
        // Spell learning options
        cantripsLearned:
          newCantrips.length > 0 ? newCantrips : undefined,
        spellsLearned:
          newSpells.length > 0 ? newSpells : undefined,
        spellbookAdded:
          newSpellbook.length > 0 ? newSpellbook : undefined,
        spellSwapped:
          wantsToSwap && swapOldSpell && swapNewSpell
            ? [swapOldSpell, swapNewSpell]
            : undefined,
        metamagicChosen:
          selectedMetamagic.length > 0 ? selectedMetamagic : undefined,
      };

      await levelUp(options);
      onComplete();
    } catch (err) {
      console.error("[LevelUpModal] Error:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!character || !summary || steps.length === 0) return null;

  // ── Compute HP preview ──
  const hpGainBase = hpMethod === "fixed" ? fixedHP : (hpRolled ?? 0);
  const hpGainTotal = Math.max(1, hpGainBase + conMod);
  const newMaxHP = character.hp.max + hpGainTotal;

  const newProfBonus = calcProficiencyBonus(newLevel);
  const oldProfBonus = character.proficiencyBonus;
  const profChanged = newProfBonus !== oldProfBonus;

  // ─── Render step content ───────────────────────────────────────────

  const renderSummaryStep = () => (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 20 }}
    >
      {/* Level badge */}
      <View style={{ alignItems: "center", marginBottom: 20 }}>
        <View
          style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: "rgba(251, 191, 36, 0.15)",
            borderWidth: 2,
            borderColor: colors.accentGold + "66",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 8,
          }}
        >
          <Text
            style={{
              color: colors.accentGold,
              fontSize: 32,
              fontWeight: "900",
            }}
          >
            {newLevel}
          </Text>
        </View>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 20,
            fontWeight: "800",
            textAlign: "center",
          }}
        >
          Nivel {newLevel}
        </Text>
        <Text
          style={{
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: "500",
            textAlign: "center",
            marginTop: 2,
          }}
        >
          {classData?.nombre} · XP necesaria: {formatXP(summary.xpThreshold)}
        </Text>
      </View>

      {/* Proficiency bonus change */}
      {profChanged && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(59, 130, 246, 0.12)",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(59, 130, 246, 0.3)",
            padding: 12,
            marginBottom: 12,
            gap: 10,
          }}
        >
          <Ionicons name="ribbon-outline" size={20} color={colors.accentBlue} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Bonificador de Competencia
            </Text>
            <Text
              style={{
                color: colors.accentBlue,
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              +{oldProfBonus} → +{newProfBonus}
            </Text>
          </View>
        </View>
      )}

      {/* ASI notification */}
      {summary.hasASI && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(139, 92, 246, 0.12)",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(139, 92, 246, 0.3)",
            padding: 12,
            marginBottom: 12,
            gap: 10,
          }}
        >
          <Ionicons name="trending-up" size={20} color={colors.accentPurple} />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              Mejora de Característica
            </Text>
            <Text
              style={{
                color: colors.accentPurple,
                fontSize: 13,
                fontWeight: "500",
              }}
            >
              Puedes repartir +{ASI_POINTS} puntos entre tus características
            </Text>
          </View>
        </View>
      )}

      {/* Subclass notification */}
      {summary.choosesSubclass && !character.subclase && (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "rgba(236, 72, 153, 0.12)",
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(236, 72, 153, 0.3)",
            padding: 12,
            marginBottom: 12,
            gap: 10,
          }}
        >
          <Ionicons name="git-branch" size={20} color="#ec4899" />
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "700",
              }}
            >
              {classData?.subclassLabel ?? "Subclase"}
            </Text>
            <Text style={{ color: "#ec4899", fontSize: 13, fontWeight: "500" }}>
              ¡Debes elegir tu especialización!
            </Text>
          </View>
        </View>
      )}

      {/* Spell learning notification */}
      {summary.spellLearning && (() => {
        const sl = summary.spellLearning;
        const parts: string[] = [];
        if (sl.newCantrips > 0) parts.push(`${sl.newCantrips} truco${sl.newCantrips > 1 ? "s" : ""}`);
        if (sl.newSpellsKnown > 0) parts.push(`${sl.newSpellsKnown} hechizo${sl.newSpellsKnown > 1 ? "s" : ""}`);
        if (sl.newSpellbookSpells > 0) parts.push(`${sl.newSpellbookSpells} hechizo${sl.newSpellbookSpells > 1 ? "s" : ""} al libro`);
        if (sl.canSwapSpell) parts.push("intercambiar 1 hechizo");
        if (parts.length === 0) return null;
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(59, 130, 246, 0.12)",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(59, 130, 246, 0.3)",
              padding: 12,
              marginBottom: 12,
              gap: 10,
            }}
          >
            <Ionicons name="sparkles" size={20} color={colors.accentBlue} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                Hechizos
              </Text>
              <Text
                style={{
                  color: colors.accentBlue,
                  fontSize: 13,
                  fontWeight: "500",
                }}
              >
                Puedes aprender: {parts.join(", ")}
              </Text>
            </View>
          </View>
        );
      })()}

      {/* Features */}
      {summary.features.length > 0 && (
        <View style={{ marginTop: 4 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 12,
              fontWeight: "700",
              textTransform: "uppercase",
              letterSpacing: 1,
              marginBottom: 8,
            }}
          >
            Rasgos Obtenidos
          </Text>
          {summary.features.map((feature, index) => (
            <FeatureCard key={`${feature.nombre}-${index}`} feature={feature} />
          ))}
        </View>
      )}

      {summary.features.length === 0 &&
        !summary.hasASI &&
        !summary.choosesSubclass &&
        !summary.spellLearning && (
          <View
            style={{
              alignItems: "center",
              padding: 20,
              backgroundColor: colors.borderSubtle,
              borderRadius: 12,
            }}
          >
            <Ionicons name="heart" size={24} color={colors.accentDanger} />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 14,
                fontWeight: "500",
                textAlign: "center",
                marginTop: 8,
              }}
            >
              En este nivel ganas Puntos de Golpe adicionales y tus dados de
              golpe aumentan.
            </Text>
          </View>
        )}
    </ScrollView>
  );

  const renderHPStep = () => (
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

  const renderASIStep = () => (
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

  // ─── Spell Learning Step ─────────────────────────────────────────────

  const renderSpellsStep = () => {
    if (!summary?.spellLearning || !character) return null;
    const sl = summary.spellLearning;
    const classId = character.clase as any;
    const magicState = getMagicState();
    const alreadyKnown = new Set([
      ...(magicState?.knownSpellIds ?? []),
      ...(magicState?.spellbookIds ?? []),
    ]);

    const prepLabel: Record<string, string> = {
      known: "Aprendes hechizos automáticamente",
      prepared: "Preparas hechizos de tu lista de clase",
      spellbook: "Anotas hechizos en tu libro de conjuros",
      pact: "Aprendes hechizos de pacto",
      none: "",
    };

    // ── Helpers ──

    const toggleSpell = (
      id: string,
      list: string[],
      setList: React.Dispatch<React.SetStateAction<string[]>>,
      max: number,
    ) => {
      if (list.includes(id)) {
        setList(list.filter((s) => s !== id));
      } else if (list.length < max) {
        setList([...list, id]);
      }
    };

    const matchesSearch = (spell: SrdSpell) => {
      if (!spellSearch.trim()) return true;
      const q = spellSearch.toLowerCase();
      return (
        spell.nombre.toLowerCase().includes(q) ||
        spell.escuela.toLowerCase().includes(q)
      );
    };

    // IDs already chosen in another section (prevent duplicates across sections)
    const allChosenIds = new Set([
      ...newCantrips,
      ...newSpells,
      ...newSpellbook,
      ...(swapNewSpell ? [swapNewSpell] : []),
    ]);

    const renderSpellCard = (
      spell: SrdSpell,
      selected: boolean,
      onPress: () => void,
      disabled: boolean,
    ) => {
      const bgColor = selected ? "rgba(59, 130, 246, 0.12)" : colors.bgCard;
      const cardBorderColor = selected ? colors.accentBlue : colors.borderSubtle;
      const isExpanded = expandedSpellIds.has(spell.id);
      const desc = getSpellDescription(spell.id);

      const toggleExpand = () => {
        setExpandedSpellIds((prev) => {
          const next = new Set(prev);
          if (next.has(spell.id)) next.delete(spell.id);
          else next.add(spell.id);
          return next;
        });
      };

      return (
        <View
          key={spell.id}
          style={{
            backgroundColor: bgColor,
            borderRadius: 12,
            borderWidth: selected ? 2 : 1,
            borderColor: cardBorderColor,
            marginBottom: 8,
            opacity: disabled && !selected ? 0.45 : 1,
          }}
        >
          <TouchableOpacity
            onPress={disabled && !selected ? undefined : onPress}
            activeOpacity={0.7}
            style={{
              padding: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
            }}
          >
            {/* Check indicator */}
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selected
                  ? colors.accentBlue
                  : colors.textMuted + "44",
                backgroundColor: selected ? colors.accentBlue : "transparent",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {selected && (
                <Ionicons name="checkmark" size={14} color="#fff" />
              )}
            </View>
            {/* Spell info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: selected ? colors.accentBlue : colors.textPrimary,
                  fontSize: 14,
                  fontWeight: "700",
                }}
              >
                {spell.nombre}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                  marginTop: 2,
                }}
              >
                {spell.escuela}
                {spell.nivel > 0
                  ? ` — ${SPELL_LEVEL_NAMES[spell.nivel as SpellLevel]}`
                  : " — Truco"}
                {desc ? `  ·  ⏱ ${desc.tiempo}` : ""}
              </Text>
            </View>
            {/* Expand/collapse */}
            {desc && (
              <TouchableOpacity
                onPress={toggleExpand}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                style={{ padding: 4 }}
              >
                <Ionicons
                  name={isExpanded ? "chevron-up" : "information-circle-outline"}
                  size={18}
                  color={colors.textMuted}
                />
              </TouchableOpacity>
            )}
          </TouchableOpacity>

          {/* Expanded description */}
          {isExpanded && desc && (
            <View
              style={{
                paddingHorizontal: 12,
                paddingBottom: 12,
                paddingTop: 0,
                borderTopWidth: 1,
                borderTopColor: colors.borderSubtle,
                marginHorizontal: 8,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 8,
                  marginBottom: 6,
                }}
              >
                {desc.alcance ? (
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    📏 {desc.alcance}
                  </Text>
                ) : null}
                {desc.duracion ? (
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    · ⏳ {desc.duracion}
                  </Text>
                ) : null}
                {desc.componentes ? (
                  <Text style={{ color: colors.textMuted, fontSize: 11 }}>
                    · 🧩 {desc.componentes}
                  </Text>
                ) : null}
              </View>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {desc.descripcion}
              </Text>
            </View>
          )}
        </View>
      );
    };

    // Helper to build spell cards for a list, avoiding deep nesting
    const buildSpellCards = (
      spellsInLevel: SrdSpell[],
      selected: string[],
      setSelected: React.Dispatch<React.SetStateAction<string[]>>,
      max: number,
    ) =>
      spellsInLevel.map((spell) =>
        renderSpellCard(
          spell,
          selected.includes(spell.id),
          () => toggleSpell(spell.id, selected, setSelected, max),
          selected.length >= max && !selected.includes(spell.id),
        ),
      );

    // ── Section: Selectable spell list ──
    const renderSpellSection = (opts: {
      title: string;
      subtitle: string;
      spells: SrdSpell[];
      selected: string[];
      setSelected: React.Dispatch<React.SetStateAction<string[]>>;
      max: number;
      accentColor: string;
      excludeIds?: Set<string>;
    }) => {
      const { title, subtitle, spells, selected, setSelected, max, accentColor, excludeIds } = opts;
      const filteredSpells = spells.filter(
        (s) => matchesSearch(s) && !alreadyKnown.has(s.id) && !(excludeIds?.has(s.id)),
      );

      // Group by level for non-cantrip sections
      const grouped = new Map<number, SrdSpell[]>();
      for (const s of filteredSpells) {
        const key = s.nivel;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(s);
      }
      const sortedLevels = Array.from(grouped.keys()).sort((a, b) => a - b);

      const levelCards = sortedLevels.map((lvl) => ({
        lvl,
        cards: buildSpellCards(grouped.get(lvl)!, selected, setSelected, max),
      }));

      return (
        <View style={{ marginBottom: 20 }}>
          {/* Section header */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: "700",
                textTransform: "uppercase",
                letterSpacing: 1,
              }}
            >
              {title}
            </Text>
            <View
              style={{
                backgroundColor:
                  selected.length === max
                    ? "rgba(34, 197, 94, 0.15)"
                    : "rgba(59, 130, 246, 0.12)",
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 10,
              }}
            >
              <Text
                style={{
                  color:
                    selected.length === max
                      ? colors.accentGreen
                      : colors.accentBlue,
                  fontSize: 12,
                  fontWeight: "700",
                }}
              >
                {selected.length}/{max}
              </Text>
            </View>
          </View>
          {subtitle ? (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                fontWeight: "500",
                marginBottom: 10,
                lineHeight: 18,
              }}
            >
              {subtitle}
            </Text>
          ) : null}

          {/* Spell list grouped by level */}
          {levelCards.map(({ lvl, cards }) => (
            <View key={`lvl-${lvl}`}>
              {sortedLevels.length > 1 && (
                <Text
                  style={{
                    color: accentColor,
                    fontSize: 11,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginTop: 8,
                    marginBottom: 6,
                    paddingLeft: 4,
                  }}
                >
                  {lvl === 0 ? "Trucos" : SPELL_LEVEL_NAMES[lvl as SpellLevel]}
                </Text>
              )}
              {cards}
            </View>
          ))}

          {filteredSpells.length === 0 && (
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 13,
                fontWeight: "500",
                textAlign: "center",
                paddingVertical: 16,
              }}
            >
              No se encontraron hechizos
            </Text>
          )}
        </View>
      );
    };

    // ── Available spell lists ──
    const availableCantrips = getCantripsForClass(classId);
    const availableSpells = getSpellsForClassUpToLevel(classId, sl.maxSpellLevel);

    // Exclude IDs already selected in other sections
    const cantripExclude = new Set([...newSpells, ...newSpellbook]);
    const spellExclude = new Set([...newCantrips, ...newSpellbook]);
    const bookExclude = new Set([...newCantrips, ...newSpells]);

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
              backgroundColor: "rgba(59, 130, 246, 0.1)",
              borderWidth: 1,
              borderColor: "rgba(59, 130, 246, 0.2)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="sparkles" size={28} color={colors.accentBlue} />
          </View>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            Hechizos Nuevos
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
            {prepLabel[sl.preparationType] ?? ""}
          </Text>
        </View>

        {/* Spell level info badge */}
        {sl.gainsNewSpellLevel && (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "rgba(251, 191, 36, 0.12)",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "rgba(251, 191, 36, 0.3)",
              padding: 12,
              marginBottom: 16,
              gap: 10,
            }}
          >
            <Ionicons name="star" size={18} color={colors.accentGold} />
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 14,
                fontWeight: "600",
                flex: 1,
              }}
            >
              ¡Desbloqueas hechizos de{" "}
              {SPELL_LEVEL_NAMES[sl.maxSpellLevel as SpellLevel]}!
            </Text>
          </View>
        )}

        {/* Max spell level info */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: colors.borderSubtle,
            borderRadius: 10,
            padding: 10,
            marginBottom: 16,
            gap: 8,
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={16}
            color={colors.textMuted}
          />
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 13,
              fontWeight: "500",
              flex: 1,
            }}
          >
            Nivel máximo de hechizo disponible:{" "}
            {SPELL_LEVEL_NAMES[sl.maxSpellLevel as SpellLevel]}
          </Text>
        </View>

        {/* Search filter */}
        <View
          style={{
            backgroundColor: colors.borderSubtle,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: spellSearch
              ? "rgba(59, 130, 246, 0.4)"
              : colors.borderSeparator,
            paddingHorizontal: 14,
            paddingVertical: Platform.OS === "ios" ? 10 : 4,
            marginBottom: 16,
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
          }}
        >
          <Ionicons
            name="search-outline"
            size={16}
            color={colors.textMuted}
          />
          <TextInput
            value={spellSearch}
            onChangeText={setSpellSearch}
            placeholder="Buscar hechizo..."
            placeholderTextColor={colors.textMuted}
            autoCapitalize="none"
            style={{
              color: colors.textPrimary,
              fontSize: 14,
              fontWeight: "500",
              flex: 1,
              paddingVertical: Platform.OS === "ios" ? 0 : 6,
            }}
          />
          {spellSearch.length > 0 && (
            <TouchableOpacity onPress={() => setSpellSearch("")}>
              <Ionicons
                name="close-circle"
                size={18}
                color={colors.textMuted}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* ── New Cantrips ── */}
        {sl.newCantrips > 0 &&
          renderSpellSection({
            title: "Trucos Nuevos",
            subtitle: "",
            spells: availableCantrips,
            selected: newCantrips,
            setSelected: setNewCantrips,
            max: sl.newCantrips,
            accentColor: colors.accentBlue,
            excludeIds: cantripExclude,
          })}

        {/* ── New Spells Known ── */}
        {sl.newSpellsKnown > 0 &&
          renderSpellSection({
            title: "Hechizos Nuevos",
            subtitle: `Elige hechizos de hasta ${SPELL_LEVEL_NAMES[sl.maxSpellLevel as SpellLevel]}.`,
            spells: availableSpells,
            selected: newSpells,
            setSelected: setNewSpells,
            max: sl.newSpellsKnown,
            accentColor: colors.accentBlue,
            excludeIds: spellExclude,
          })}

        {/* ── New Spellbook Spells (Wizard only) ── */}
        {sl.newSpellbookSpells > 0 &&
          renderSpellSection({
            title: "Libro de Conjuros",
            subtitle: "Añade hechizos de mago a tu libro de conjuros.",
            spells: availableSpells,
            selected: newSpellbook,
            setSelected: setNewSpellbook,
            max: sl.newSpellbookSpells,
            accentColor: colors.accentPurple,
            excludeIds: bookExclude,
          })}

        {/* ── Spell Swap ── */}
        {sl.canSwapSpell && (
          <View style={{ marginBottom: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setWantsToSwap(!wantsToSwap);
                if (wantsToSwap) {
                  setSwapOldSpell("");
                  setSwapNewSpell("");
                }
              }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: wantsToSwap
                  ? "rgba(251, 146, 60, 0.12)"
                  : colors.borderSubtle,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: wantsToSwap
                  ? "rgba(251, 146, 60, 0.4)"
                  : colors.borderSeparator,
                padding: 14,
                gap: 10,
              }}
            >
              <Ionicons
                name={wantsToSwap ? "swap-horizontal" : "swap-horizontal-outline"}
                size={20}
                color={wantsToSwap ? colors.accentOrange : colors.textMuted}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontWeight: "700",
                  }}
                >
                  Intercambiar un hechizo
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 12,
                    fontWeight: "500",
                    marginTop: 2,
                  }}
                >
                  Reemplaza un hechizo conocido por otro
                </Text>
              </View>
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  borderWidth: 2,
                  borderColor: wantsToSwap
                    ? colors.accentOrange
                    : colors.textMuted + "44",
                  backgroundColor: wantsToSwap
                    ? colors.accentOrange
                    : "transparent",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {wantsToSwap && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </View>
            </TouchableOpacity>

            {wantsToSwap && (
              <View style={{ marginTop: 12, gap: 8 }}>
                {/* Select spell to forget */}
                <Text
                  style={{
                    color: colors.accentDanger,
                    fontSize: 12,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  Hechizo a olvidar
                </Text>
                {(magicState?.knownSpellIds ?? [])
                  .filter((id) => {
                    // Only show non-cantrip spells that can be swapped
                    const sp = getSpellById(id);
                    return sp ? sp.nivel > 0 : true;
                  })
                  .map((id) => {
                    const sp = getSpellById(id);
                    const isSelected = swapOldSpell === id;
                    return (
                      <TouchableOpacity
                        key={`swap-old-${id}`}
                        onPress={() => setSwapOldSpell(isSelected ? "" : id)}
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(239, 68, 68, 0.12)"
                            : colors.bgCard,
                          borderRadius: 12,
                          borderWidth: isSelected ? 2 : 1,
                          borderColor: isSelected
                            ? colors.accentDanger
                            : colors.borderSubtle,
                          padding: 12,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: isSelected
                              ? colors.accentDanger
                              : colors.textMuted + "44",
                            backgroundColor: isSelected
                              ? colors.accentDanger
                              : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <Ionicons name="close" size={12} color="#fff" />
                          )}
                        </View>
                        <Text
                          style={{
                            color: isSelected
                              ? colors.accentDanger
                              : colors.textPrimary,
                            fontSize: 14,
                            fontWeight: "600",
                          }}
                        >
                          {sp?.nombre ?? id}
                        </Text>
                        {sp && (
                          <Text
                            style={{
                              color: colors.textMuted,
                              fontSize: 12,
                              fontWeight: "500",
                            }}
                          >
                            {sp.escuela} — {SPELL_LEVEL_NAMES[sp.nivel as SpellLevel]}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}

                {(magicState?.knownSpellIds ?? []).filter((id) => {
                  const sp = getSpellById(id);
                  return sp ? sp.nivel > 0 : true;
                }).length === 0 && (
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 13,
                      textAlign: "center",
                      paddingVertical: 12,
                    }}
                  >
                    No tienes hechizos conocidos para intercambiar
                  </Text>
                )}

                <View style={{ alignItems: "center", marginVertical: 4 }}>
                  <Ionicons
                    name="arrow-down"
                    size={18}
                    color={colors.textMuted}
                  />
                </View>

                {/* Select new spell */}
                <Text
                  style={{
                    color: colors.accentGreen,
                    fontSize: 12,
                    fontWeight: "700",
                    textTransform: "uppercase",
                    letterSpacing: 0.8,
                    marginBottom: 4,
                  }}
                >
                  Hechizo nuevo
                </Text>
                {availableSpells
                  .filter(
                    (s) =>
                      matchesSearch(s) &&
                      !alreadyKnown.has(s.id) &&
                      !allChosenIds.has(s.id),
                  )
                  .map((spell) => {
                    const isSelected = swapNewSpell === spell.id;
                    return (
                      <TouchableOpacity
                        key={`swap-new-${spell.id}`}
                        onPress={() =>
                          setSwapNewSpell(isSelected ? "" : spell.id)
                        }
                        activeOpacity={0.7}
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(34, 197, 94, 0.12)"
                            : colors.bgCard,
                          borderRadius: 12,
                          borderWidth: isSelected ? 2 : 1,
                          borderColor: isSelected
                            ? colors.accentGreen
                            : colors.borderSubtle,
                          padding: 12,
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <View
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: 10,
                            borderWidth: 2,
                            borderColor: isSelected
                              ? colors.accentGreen
                              : colors.textMuted + "44",
                            backgroundColor: isSelected
                              ? colors.accentGreen
                              : "transparent",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={12}
                              color="#fff"
                            />
                          )}
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: isSelected
                                ? colors.accentGreen
                                : colors.textPrimary,
                              fontSize: 14,
                              fontWeight: "600",
                            }}
                          >
                            {spell.nombre}
                          </Text>
                          <Text
                            style={{
                              color: colors.textMuted,
                              fontSize: 12,
                              fontWeight: "500",
                              marginTop: 1,
                            }}
                          >
                            {spell.escuela} —{" "}
                            {SPELL_LEVEL_NAMES[spell.nivel as SpellLevel]}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </View>
            )}
          </View>
        )}
      </ScrollView>
    );
  };

  const renderSubclassStep = () => {
    const options = character ? getSubclassOptions(character.clase as any) : [];

    const handleSelectSubclass = (opt: SubclassOption) => {
      setSelectedSubclassId(opt.id);
      setSubclassName(opt.nombre);
      setIsCustomSubclass(false);
    };

    const handleCustomToggle = () => {
      setSelectedSubclassId(null);
      setIsCustomSubclass(true);
      setSubclassName("");
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
      </ScrollView>
    );
  };

  const renderMetamagicStep = () => {
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
                .map((id) => METAMAGIC_NAMES[id as MetamagicOption] ?? id)
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
  };

  const renderConfirmStep = () => {
    // Compute all changes for review
    const changes: Array<{
      icon: string;
      color: string;
      label: string;
      detail: string;
    }> = [];

    // Level
    changes.push({
      icon: "star",
      color: colors.accentGold,
      label: "Nivel",
      detail: `${character.nivel} → ${newLevel}`,
    });

    // HP
    changes.push({
      icon: "heart",
      color: colors.accentDanger,
      label: "Puntos de Golpe",
      detail: `${character.hp.max} → ${newMaxHP} (+${hpGainTotal}, ${hpMethod === "fixed" ? "fijo" : "dado"})`,
    });

    // Hit Dice
    changes.push({
      icon: "cube-outline",
      color: colors.accentGreen,
      label: "Dados de Golpe",
      detail: `${character.hitDice.total}${classData?.hitDie ?? "d8"} → ${newLevel}${classData?.hitDie ?? "d8"}`,
    });

    // Proficiency
    if (profChanged) {
      changes.push({
        icon: "ribbon",
        color: colors.accentBlue,
        label: "Bonificador de Competencia",
        detail: `+${oldProfBonus} → +${newProfBonus}`,
      });
    }

    // ASI
    if (summary?.hasASI && totalASIUsed > 0) {
      const asiDetails = ABILITY_KEYS.filter((k) => asiPoints[k] > 0)
        .map((k) => `${ABILITY_ABBR[k]} +${asiPoints[k]}`)
        .join(", ");
      changes.push({
        icon: "trending-up",
        color: colors.accentPurple,
        label: "Mejora de Característica",
        detail: asiDetails,
      });
    }

    // Subclass
    if (subclassName.trim()) {
      changes.push({
        icon: "git-branch",
        color: "#ec4899",
        label: classData?.subclassLabel ?? "Subclase",
        detail: subclassName.trim(),
      });
    }

    // Features
    if (summary && summary.features.length > 0) {
      changes.push({
        icon: "flash",
        color: colors.accentOrange,
        label: "Nuevos Rasgos",
        detail: summary.features.map((f) => f.nombre).join(", "),
      });
    }

    // Spells learned — resolve IDs to display names
    const resolveSpellName = (id: string) =>
      getSpellById(id)?.nombre ?? id;

    if (newCantrips.length > 0) {
      changes.push({
        icon: "sparkles",
        color: colors.accentBlue,
        label: "Trucos Nuevos",
        detail: newCantrips.map(resolveSpellName).join(", "),
      });
    }

    if (newSpells.length > 0) {
      changes.push({
        icon: "book",
        color: colors.accentBlue,
        label: "Hechizos Nuevos",
        detail: newSpells.map(resolveSpellName).join(", "),
      });
    }

    if (newSpellbook.length > 0) {
      changes.push({
        icon: "document-text",
        color: colors.accentPurple,
        label: "Libro de Conjuros",
        detail: `+${newSpellbook.length}: ${newSpellbook.map(resolveSpellName).join(", ")}`,
      });
    }

    if (wantsToSwap && swapOldSpell && swapNewSpell) {
      changes.push({
        icon: "swap-horizontal",
        color: colors.accentOrange,
        label: "Intercambio",
        detail: `${resolveSpellName(swapOldSpell)} → ${resolveSpellName(swapNewSpell)}`,
      });
    }

    // Metamagic
    if (selectedMetamagic.length > 0) {
      changes.push({
        icon: "flash",
        color: colors.accentPurple,
        label: "Metamagia",
        detail: selectedMetamagic
          .map((id) => METAMAGIC_NAMES[id as MetamagicOption] ?? id)
          .join(", "),
      });
    }

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
              backgroundColor: "rgba(34, 197, 94, 0.15)",
              borderWidth: 2,
              borderColor: "rgba(34, 197, 94, 0.3)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <Ionicons
              name="checkmark-circle"
              size={32}
              color={colors.accentGreen}
            />
          </View>
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            ¿Todo listo?
          </Text>
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: "500",
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Revisa los cambios antes de confirmar
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          {changes.map((change, index) => (
            <View
              key={index}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.borderSubtle,
                borderRadius: 12,
                padding: 12,
                gap: 10,
                borderWidth: 1,
                borderColor: colors.borderSeparator,
              }}
            >
              <Ionicons
                name={change.icon as any}
                size={18}
                color={change.color}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 12,
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: 0.5,
                  }}
                >
                  {change.label}
                </Text>
                <Text
                  style={{
                    color: colors.textPrimary,
                    fontSize: 14,
                    fontWeight: "600",
                    marginTop: 1,
                  }}
                >
                  {change.detail}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  };

  const renderStepContent = () => {
    if (!currentStep) return null;
    switch (currentStep.id) {
      case "summary":
        return renderSummaryStep();
      case "hp":
        return renderHPStep();
      case "asi":
        return renderASIStep();
      case "spells":
        return renderSpellsStep();
      case "subclass":
        return renderSubclassStep();
      case "metamagic":
        return renderMetamagicStep();
      case "confirm":
        return renderConfirmStep();
      default:
        return null;
    }
  };

  // ─── Main render ───────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: colors.bgSecondary }}
      >
        <LinearGradient
          colors={[
            colors.gradientMain[0],
            colors.gradientMain[1],
            colors.gradientMain[2],
          ]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Header */}
        <View
          style={{
            paddingTop: Platform.OS === "ios" ? 56 : 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          {/* Close & title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.headerButtonBg,
                borderWidth: 1,
                borderColor: colors.headerButtonBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: colors.accentGold,
                  fontSize: 17,
                  fontWeight: "800",
                  letterSpacing: 0.5,
                }}
              >
                Subir de Nivel
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {character.nombre} · {classData?.nombre}
              </Text>
            </View>

            {/* Spacer */}
            <View style={{ width: 36 }} />
          </View>

          {/* Step indicator */}
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            {steps.map((step, index) => {
              const isActive = index === currentStepIndex;
              const isDone = index < currentStepIndex;

              return (
                <View key={step.id} style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={{
                      height: 4,
                      width: "100%",
                      borderRadius: 2,
                      backgroundColor: isDone
                        ? colors.accentGold
                        : isActive
                          ? "rgba(251, 191, 36, 0.5)"
                          : colors.borderSeparator,
                    }}
                  />
                  {isActive && (
                    <Text
                      style={{
                        color: colors.accentGold,
                        fontSize: 10,
                        fontWeight: "700",
                        marginTop: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                      numberOfLines={1}
                    >
                      {step.title}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Step content */}
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          }}
        >
          {/* Step title */}
          {currentStep && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "rgba(251, 191, 36, 0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={currentStep.icon}
                  size={18}
                  color={colors.accentGold}
                />
              </View>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 20,
                  fontWeight: "800",
                }}
              >
                {currentStep.title}
              </Text>
            </View>
          )}

          {renderStepContent()}
        </Animated.View>

        {/* Footer buttons */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === "ios" ? 34 : 20,
            paddingTop: 12,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: colors.borderSeparator,
          }}
        >
          <TouchableOpacity
            onPress={goBack}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: colors.borderSeparator,
              borderWidth: 1,
              borderColor: colors.borderDefault,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <Ionicons
              name={isFirstStep ? "close-outline" : "arrow-back-outline"}
              size={18}
              color={colors.textSecondary}
            />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              {isFirstStep ? "Cancelar" : "Atrás"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={goNext}
            disabled={!canProceed() || isProcessing}
            activeOpacity={0.8}
            style={{
              flex: 2,
              borderRadius: 14,
              overflow: "hidden",
              opacity: canProceed() && !isProcessing ? 1 : 0.5,
            }}
          >
            <LinearGradient
              colors={
                isLastStep
                  ? [colors.accentGreen, "#16a34a"]
                  : [colors.accentAmber, "#d97706"]
              }
              style={{
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              {isProcessing ? (
                <Text
                  style={{
                    color: colors.textInverted,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Aplicando...
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: colors.textInverted,
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    {isLastStep ? "¡Confirmar Nivel!" : "Siguiente"}
                  </Text>
                  <Ionicons
                    name={isLastStep ? "checkmark-circle" : "arrow-forward"}
                    size={18}
                    color={colors.textInverted}
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ─── Feature Card sub-component ──────────────────────────────────────

function FeatureCard({ feature }: { feature: LevelFeature }) {
  const { colors: fcColors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
      style={{
        backgroundColor: feature.esSubclase
          ? "rgba(236, 72, 153, 0.08)"
          : "rgba(245, 158, 11, 0.08)",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: feature.esSubclase
          ? "rgba(236, 72, 153, 0.2)"
          : "rgba(245, 158, 11, 0.2)",
        padding: 12,
        marginBottom: 8,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            backgroundColor: feature.esSubclase
              ? "rgba(236, 72, 153, 0.15)"
              : "rgba(245, 158, 11, 0.15)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons
            name={feature.esSubclase ? "git-branch-outline" : "flash-outline"}
            size={16}
            color={feature.esSubclase ? "#ec4899" : fcColors.accentAmber}
          />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: fcColors.textPrimary,
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            {feature.nombre}
          </Text>
          {feature.esSubclase && (
            <Text
              style={{
                color: "#ec4899",
                fontSize: 11,
                fontWeight: "600",
                marginTop: 1,
              }}
            >
              Rasgo de Subclase
            </Text>
          )}
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={fcColors.textMuted}
        />
      </View>

      {expanded && (
        <Text
          style={{
            color: fcColors.textSecondary,
            fontSize: 13,
            fontWeight: "500",
            lineHeight: 19,
            marginTop: 8,
            paddingLeft: 42,
          }}
        >
          {feature.descripcion}
        </Text>
      )}
    </TouchableOpacity>
  );
}
