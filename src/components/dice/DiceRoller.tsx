/**
 * DiceRoller - Tirador de dados integrado para D&D 5e (HU-11)
 *
 * Features:
 * - Preset dice buttons (d4, d6, d8, d10, d12, d20, d100)
 * - Custom formula input (2d6+3, 4d6kh3, etc.)
 * - Advantage / Disadvantage toggle
 * - Critical (nat 20) and Fumble (nat 1) visual effects
 * - Modifier quick-adjust
 * - Re-roll last roll
 * - Roll history (last 50 rolls)
 */

import { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Modal,
  Animated,
  Easing,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import {
  type DieType,
  type DieRollResultEx as DieRollResult,
  type ParsedFormula,
  type AdvantageMode,
  parseFormula,
  executeFormula,
} from "@/utils/dice";

// ─── Types ───────────────────────────────────────────────────────────

interface RollHistoryEntry {
  id: string;
  formula: string;
  nombre: string | null;
  rolls: DieRollResult[];
  modifier: number;
  subtotal: number;
  total: number;
  isCritical: boolean;
  isFumble: boolean;
  advantageMode: AdvantageMode;
  timestamp: string;
}

// ─── Constants ───────────────────────────────────────────────────────

// Die preset base config (colors are resolved at render-time via getDiePresets)
const DIE_PRESET_SIDES: { die: DieType; sides: number }[] = [
  { die: "d4", sides: 4 },
  { die: "d6", sides: 6 },
  { die: "d8", sides: 8 },
  { die: "d10", sides: 10 },
  { die: "d12", sides: 12 },
  { die: "d20", sides: 20 },
  { die: "d100", sides: 100 },
];

const MAX_HISTORY = 50;

const ADVANTAGE_LABELS: Record<AdvantageMode, string> = {
  normal: "Normal",
  ventaja: "Ventaja",
  desventaja: "Desventaja",
};

/** Resolve die-preset colors from the active theme */
function getDiePresets(
  colors: import("@/utils/theme").ThemeColors,
): { die: DieType; sides: number; color: string }[] {
  const palette = [
    colors.accentGreen, // d4
    colors.accentBlue, // d6
    colors.accentPurple, // d8
    colors.accentAmber, // d10
    colors.accentDanger, // d12
    colors.accentPink, // d20
    colors.accentIndigo, // d100
  ];
  return DIE_PRESET_SIDES.map((p, i) => ({ ...p, color: palette[i] }));
}

/** Resolve advantage-mode colors from the active theme */
function getAdvantageColors(
  colors: import("@/utils/theme").ThemeColors,
): Record<AdvantageMode, string> {
  return {
    normal: colors.textMuted,
    ventaja: colors.accentGreen,
    desventaja: colors.accentDanger,
  };
}

// ─── Component ───────────────────────────────────────────────────────

interface DiceRollerProps {
  visible: boolean;
  onClose: () => void;
  /** Optional character name for labeling rolls */
  characterName?: string;
  /** Optional preset label (e.g. "Percepción", "Ataque con espada") */
  presetLabel?: string;
  /** Optional preset formula */
  presetFormula?: string;
  /** Optional preset modifier */
  presetModifier?: number;
}

export default function DiceRoller({
  visible,
  onClose,
  characterName,
  presetLabel,
  presetFormula,
  presetModifier,
}: DiceRollerProps) {
  const { colors, isDark } = useTheme();

  // Resolve theme-aware constants
  const DIE_PRESETS = getDiePresets(colors);
  const ADVANTAGE_COLORS = getAdvantageColors(colors);

  // ── State ──
  const [formula, setFormula] = useState(presetFormula || "");
  const [modifier, setModifier] = useState(presetModifier || 0);
  const [diceCount, setDiceCount] = useState(1);
  const [advantageMode, setAdvantageMode] = useState<AdvantageMode>("normal");
  const [lastResult, setLastResult] = useState<RollHistoryEntry | null>(null);
  const { dialogProps, showDestructive } = useDialog();
  const { toastProps, showError: toastError } = useToast();

  const [history, setHistory] = useState<RollHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [lastFormula, setLastFormula] = useState<string | null>(null);

  // Animation
  const shakeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const criticalGlow = useRef(new Animated.Value(0)).current;

  const animateRoll = useCallback(() => {
    // Reset
    shakeAnim.setValue(0);
    scaleAnim.setValue(0.8);
    criticalGlow.setValue(0);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(shakeAnim, {
          toValue: 1,
          duration: 150,
          easing: Easing.elastic(4),
          useNativeDriver: true,
        }),
        Animated.timing(shakeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnim, scaleAnim]);

  const animateCritical = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(criticalGlow, {
          toValue: 1,
          duration: 500,
          useNativeDriver: false,
        }),
        Animated.timing(criticalGlow, {
          toValue: 0,
          duration: 500,
          useNativeDriver: false,
        }),
      ]),
      { iterations: 3 },
    ).start();
  }, [criticalGlow]);

  // ── Roll Functions ──

  const doRoll = useCallback(
    (formulaStr: string, label?: string) => {
      const parsed = parseFormula(formulaStr);
      if (!parsed) {
        toastError(
          "Fórmula inválida",
          `No se pudo interpretar: "${formulaStr}"`,
        );
        return;
      }

      const result = executeFormula(parsed, advantageMode, modifier);

      const entry: RollHistoryEntry = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 4),
        formula: formulaStr,
        nombre: label || presetLabel || null,
        rolls: result.rolls,
        modifier: parsed.modifier + modifier,
        subtotal: result.subtotal,
        total: result.total,
        isCritical: result.isCritical,
        isFumble: result.isFumble,
        advantageMode,
        timestamp: new Date().toISOString(),
      };

      setLastResult(entry);
      setLastFormula(formulaStr);
      setHistory((prev) => [entry, ...prev].slice(0, MAX_HISTORY));

      animateRoll();
      if (result.isCritical || result.isFumble) {
        animateCritical();
      }

      // Reset advantage after rolling
      setAdvantageMode("normal");
    },
    [advantageMode, modifier, presetLabel, animateRoll, animateCritical],
  );

  const handlePresetRoll = useCallback(
    (die: DieType) => {
      const formulaStr = diceCount > 1 ? `${diceCount}${die}` : `1${die}`;
      doRoll(formulaStr);
    },
    [diceCount, doRoll],
  );

  const handleFormulaRoll = useCallback(() => {
    if (!formula.trim()) return;
    doRoll(formula.trim());
  }, [formula, doRoll]);

  const handleReroll = useCallback(() => {
    if (lastFormula) {
      doRoll(lastFormula, lastResult?.nombre || undefined);
    }
  }, [lastFormula, lastResult, doRoll]);

  const handleClearHistory = useCallback(() => {
    showDestructive(
      "Limpiar historial",
      "¿Borrar todo el historial de tiradas?",
      () => {
        setHistory([]);
        setLastResult(null);
      },
      { confirmText: "Limpiar", cancelText: "Cancelar" },
    );
  }, [showDestructive]);

  const cycleAdvantage = useCallback(() => {
    setAdvantageMode((prev) => {
      if (prev === "normal") return "ventaja";
      if (prev === "ventaja") return "desventaja";
      return "normal";
    });
  }, []);

  // ── Render Helpers ──

  const renderAdvantageToggle = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 12,
      }}
    >
      {(["normal", "ventaja", "desventaja"] as AdvantageMode[]).map((mode) => {
        const isActive = advantageMode === mode;
        return (
          <TouchableOpacity
            key={mode}
            onPress={() => setAdvantageMode(mode)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              marginHorizontal: 4,
              backgroundColor: isActive
                ? ADVANTAGE_COLORS[mode] + "30"
                : "transparent",
              borderWidth: 1,
              borderColor: isActive
                ? ADVANTAGE_COLORS[mode]
                : colors.borderDefault,
            }}
          >
            <Text
              style={{
                color: isActive ? ADVANTAGE_COLORS[mode] : colors.textSecondary,
                fontSize: 13,
                fontWeight: isActive ? "700" : "500",
              }}
            >
              {ADVANTAGE_LABELS[mode]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderDicePresets = () => (
    <View style={{ marginBottom: 12 }}>
      {/* Dice count selector */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setDiceCount((c) => Math.max(1, c - 1))}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.bgSecondary,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="remove" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
        <Text
          style={{
            color: colors.textPrimary,
            fontSize: 18,
            fontWeight: "bold",
            marginHorizontal: 16,
            minWidth: 24,
            textAlign: "center",
          }}
        >
          {diceCount}
        </Text>
        <TouchableOpacity
          onPress={() => setDiceCount((c) => Math.min(20, c + 1))}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: colors.bgSecondary,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={18} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Dice buttons */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: 8,
        }}
      >
        {DIE_PRESETS.map((preset) => (
          <TouchableOpacity
            key={preset.die}
            onPress={() => handlePresetRoll(preset.die)}
            style={{
              width: 60,
              height: 60,
              borderRadius: 12,
              backgroundColor: preset.color + "20",
              borderWidth: 1.5,
              borderColor: preset.color + "60",
              alignItems: "center",
              justifyContent: "center",
            }}
            activeOpacity={0.6}
          >
            <Ionicons name="dice-outline" size={18} color={preset.color} />
            <Text
              style={{
                color: preset.color,
                fontSize: 13,
                fontWeight: "bold",
                marginTop: 2,
              }}
            >
              {preset.die}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderFormulaInput = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
        paddingHorizontal: 4,
      }}
    >
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: colors.bgSecondary,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: colors.borderDefault,
          paddingHorizontal: 14,
          paddingVertical: 4,
        }}
      >
        <Ionicons name="create-outline" size={18} color={colors.textMuted} />
        <TextInput
          style={{
            flex: 1,
            color: colors.textPrimary,
            fontSize: 16,
            marginLeft: 10,
            paddingVertical: 10,
          }}
          placeholder="Fórmula: 2d6+3, 4d6kh3..."
          placeholderTextColor={colors.textMuted}
          value={formula}
          onChangeText={setFormula}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="go"
          onSubmitEditing={handleFormulaRoll}
        />
      </View>
      <TouchableOpacity
        onPress={handleFormulaRoll}
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          backgroundColor: colors.accentRed,
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="dice" size={24} color={colors.textInverted} />
      </TouchableOpacity>
    </View>
  );

  const renderModifier = () => (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
      }}
    >
      <Text
        style={{ color: colors.textSecondary, fontSize: 14, marginRight: 10 }}
      >
        Modificador:
      </Text>
      <TouchableOpacity
        onPress={() => setModifier((m) => m - 1)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.bgSecondary,
          borderWidth: 1,
          borderColor: colors.borderDefault,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="remove" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
      <Text
        style={{
          color:
            modifier > 0
              ? colors.accentGreen
              : modifier < 0
                ? colors.dangerText
                : colors.textPrimary,
          fontSize: 18,
          fontWeight: "bold",
          marginHorizontal: 12,
          minWidth: 36,
          textAlign: "center",
        }}
      >
        {modifier >= 0 ? `+${modifier}` : modifier}
      </Text>
      <TouchableOpacity
        onPress={() => setModifier((m) => m + 1)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: colors.bgSecondary,
          borderWidth: 1,
          borderColor: colors.borderDefault,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={16} color={colors.textSecondary} />
      </TouchableOpacity>
      {modifier !== 0 && (
        <TouchableOpacity
          onPress={() => setModifier(0)}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="close-circle" size={20} color={colors.textMuted} />
        </TouchableOpacity>
      )}
    </View>
  );

  const renderResult = () => {
    if (!lastResult) {
      return (
        <View
          style={{
            alignItems: "center",
            paddingVertical: 32,
          }}
        >
          <View
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: colors.bgElevated,
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="dice-outline" size={40} color={colors.textMuted} />
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 16 }}>
            ¡Tira los dados!
          </Text>
        </View>
      );
    }

    const {
      isCritical,
      isFumble,
      total,
      rolls,
      modifier: totalMod,
      formula: rollFormula,
      nombre,
    } = lastResult;

    const bgColor = isCritical
      ? `${colors.accentGold}20`
      : isFumble
        ? `${colors.dangerText}20`
        : colors.bgSecondary;

    const borderColor = isCritical
      ? colors.accentGold
      : isFumble
        ? colors.dangerText
        : colors.borderDefault;

    const critGlowColor = criticalGlow.interpolate({
      inputRange: [0, 1],
      outputRange: [
        borderColor,
        isCritical ? colors.accentGold : colors.dangerText,
      ],
    });

    const shakeTranslate = shakeAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -8, 8, -4, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [{ translateX: shakeTranslate }, { scale: scaleAnim }],
        }}
      >
        <View
          style={{
            backgroundColor: bgColor,
            borderRadius: 16,
            borderWidth: 2,
            borderColor: borderColor,
            padding: 20,
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {/* Critical / Fumble label */}
          {isCritical && (
            <Text
              style={{
                color: colors.accentGold,
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              ✨ ¡CRÍTICO! ✨
            </Text>
          )}
          {isFumble && (
            <Text
              style={{
                color: colors.dangerText,
                fontSize: 18,
                fontWeight: "900",
                letterSpacing: 2,
                marginBottom: 4,
              }}
            >
              💀 ¡PIFIA! 💀
            </Text>
          )}

          {/* Roll name */}
          {nombre && (
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 13,
                marginBottom: 4,
              }}
            >
              {nombre}
            </Text>
          )}

          {/* Total */}
          <Text
            style={{
              color: isCritical
                ? colors.accentGold
                : isFumble
                  ? colors.accentDanger
                  : colors.textPrimary,
              fontSize: 56,
              fontWeight: "900",
              lineHeight: 64,
            }}
          >
            {total}
          </Text>

          {/* Formula */}
          <Text
            style={{ color: colors.textSecondary, fontSize: 14, marginTop: 4 }}
          >
            {rollFormula}
            {totalMod > 0
              ? ` (+${totalMod})`
              : totalMod < 0
                ? ` (${totalMod})`
                : ""}
          </Text>

          {/* Individual dice */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 10,
              gap: 6,
            }}
          >
            {rolls.map((roll, i) => (
              <View
                key={i}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                  backgroundColor: roll.discarded
                    ? colors.bgPrimary
                    : roll.value === 20 && roll.die === "d20"
                      ? `${colors.accentGold}30`
                      : roll.value === 1 && roll.die === "d20"
                        ? `${colors.accentDanger}30`
                        : colors.bgElevated,
                  borderWidth: 1,
                  borderColor: roll.discarded
                    ? colors.bgSecondary
                    : colors.borderDefault,
                  opacity: roll.discarded ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: roll.discarded
                      ? colors.textMuted
                      : roll.value === 20 && roll.die === "d20"
                        ? colors.accentGold
                        : roll.value === 1 && roll.die === "d20"
                          ? colors.accentDanger
                          : colors.textPrimary,
                    fontSize: 14,
                    fontWeight: "600",
                    textDecorationLine: roll.discarded
                      ? "line-through"
                      : "none",
                  }}
                >
                  {roll.die}:{roll.value}
                </Text>
              </View>
            ))}
          </View>

          {/* Advantage mode indicator */}
          {lastResult.advantageMode !== "normal" && (
            <View
              style={{
                marginTop: 8,
                paddingHorizontal: 10,
                paddingVertical: 3,
                borderRadius: 10,
                backgroundColor:
                  ADVANTAGE_COLORS[lastResult.advantageMode] + "20",
              }}
            >
              <Text
                style={{
                  color: ADVANTAGE_COLORS[lastResult.advantageMode],
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {ADVANTAGE_LABELS[lastResult.advantageMode]}
              </Text>
            </View>
          )}

          {/* Action buttons */}
          <View
            style={{
              flexDirection: "row",
              marginTop: 14,
              gap: 10,
            }}
          >
            <TouchableOpacity
              onPress={handleReroll}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: colors.bgElevated,
                borderWidth: 1,
                borderColor: colors.borderDefault,
              }}
            >
              <Ionicons name="refresh" size={16} color={colors.textSecondary} />
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 13,
                  marginLeft: 6,
                  fontWeight: "600",
                }}
              >
                Repetir
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    );
  };

  const renderHistoryEntry = (entry: RollHistoryEntry) => {
    const time = new Date(entry.timestamp);
    const timeStr = time.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <View
        key={entry.id}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 8,
          paddingHorizontal: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.bgSecondary,
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: entry.isCritical
              ? `${colors.accentGold}20`
              : entry.isFumble
                ? `${colors.accentDanger}20`
                : colors.bgElevated,
            alignItems: "center",
            justifyContent: "center",
            marginRight: 10,
          }}
        >
          <Ionicons
            name={
              entry.isCritical
                ? "star"
                : entry.isFumble
                  ? "skull"
                  : "dice-outline"
            }
            size={16}
            color={
              entry.isCritical
                ? colors.accentGold
                : entry.isFumble
                  ? colors.accentDanger
                  : colors.textMuted
            }
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {entry.nombre && (
              <Text
                style={{
                  color: colors.textSecondary,
                  fontSize: 12,
                  marginRight: 6,
                }}
              >
                {entry.nombre}:
              </Text>
            )}
            <Text
              style={{
                color: entry.isCritical
                  ? colors.accentGold
                  : entry.isFumble
                    ? colors.accentDanger
                    : colors.textPrimary,
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {entry.total}
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontSize: 11 }}>
            {entry.formula}
            {entry.modifier !== 0
              ? entry.modifier > 0
                ? ` +${entry.modifier}`
                : ` ${entry.modifier}`
              : ""}
            {" · "}[
            {entry.rolls
              .filter((r) => !r.discarded)
              .map((r) => r.value)
              .join(", ")}
            ]
            {entry.advantageMode !== "normal"
              ? ` · ${ADVANTAGE_LABELS[entry.advantageMode]}`
              : ""}
          </Text>
        </View>

        {/* Time */}
        <Text style={{ color: colors.textMuted, fontSize: 11 }}>{timeStr}</Text>
      </View>
    );
  };

  const renderHistory = () => (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: 16,
          paddingVertical: 12,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderDefault,
        }}
      >
        <TouchableOpacity
          onPress={() => setShowHistory(false)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textSecondary} />
          <Text
            style={{
              color: colors.textPrimary,
              fontSize: 18,
              fontWeight: "bold",
              marginLeft: 10,
            }}
          >
            📜 Historial ({history.length})
          </Text>
        </TouchableOpacity>
        {history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory}>
            <Ionicons
              name="trash-outline"
              size={20}
              color={colors.accentDanger}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {history.length === 0 ? (
          <View style={{ alignItems: "center", paddingVertical: 40 }}>
            <Text style={{ color: colors.textMuted, fontSize: 15 }}>
              No hay tiradas recientes
            </Text>
          </View>
        ) : (
          history.map(renderHistoryEntry)
        )}
      </ScrollView>
    </View>
  );

  // ── Main Render ──

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: colors.backdrop,
          justifyContent: "flex-end",
        }}
      >
        {/* Tap to close backdrop */}
        <TouchableOpacity
          style={{ flex: 1 }}
          activeOpacity={1}
          onPress={onClose}
        />

        {/* Bottom sheet */}
        <View
          style={{
            backgroundColor: colors.bgCard,
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: Dimensions.get("window").height * 0.88,
            borderTopWidth: 1,
            borderColor: colors.borderDefault,
          }}
        >
          {/* Handle */}
          <View
            style={{
              alignItems: "center",
              paddingTop: 10,
              paddingBottom: 4,
            }}
          >
            <View
              style={{
                width: 40,
                height: 4,
                borderRadius: 2,
                backgroundColor: colors.borderDefault,
              }}
            />
          </View>

          {showHistory ? (
            renderHistory()
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 32 }}
            >
              {/* Header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingHorizontal: 20,
                  paddingTop: 8,
                  paddingBottom: 14,
                }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={{ fontSize: 22, marginRight: 8 }}>🎲</Text>
                  <Text
                    style={{
                      color: colors.textPrimary,
                      fontSize: 20,
                      fontWeight: "bold",
                    }}
                  >
                    Tirador de Dados
                  </Text>
                </View>
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => setShowHistory(true)}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.bgSecondary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="time-outline"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: colors.bgSecondary,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons
                      name="close"
                      size={20}
                      color={colors.textSecondary}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Character name */}
              {characterName && (
                <Text
                  style={{
                    color: colors.accentGold,
                    fontSize: 13,
                    fontWeight: "600",
                    textAlign: "center",
                    marginBottom: 8,
                    letterSpacing: 0.5,
                  }}
                >
                  {characterName}
                </Text>
              )}

              {/* Content */}
              <View style={{ paddingHorizontal: 16 }}>
                {/* Advantage toggle */}
                {renderAdvantageToggle()}

                {/* Dice presets */}
                {renderDicePresets()}

                {/* Divider */}
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginVertical: 12,
                  }}
                >
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.borderDefault,
                    }}
                  />
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 12,
                      marginHorizontal: 12,
                    }}
                  >
                    o escribe una fórmula
                  </Text>
                  <View
                    style={{
                      flex: 1,
                      height: 1,
                      backgroundColor: colors.borderDefault,
                    }}
                  />
                </View>

                {/* Formula input */}
                {renderFormulaInput()}

                {/* Modifier */}
                {renderModifier()}

                {/* Result */}
                {renderResult()}
              </View>
            </ScrollView>
          )}
        </View>
      </View>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </Modal>
  );
}
