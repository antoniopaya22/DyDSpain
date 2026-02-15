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
import { useDialog, useToast } from "@/hooks/useDialog";

// ─── Types ───────────────────────────────────────────────────────────

type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20" | "d100";
type AdvantageMode = "normal" | "ventaja" | "desventaja";

interface DieRollResult {
  die: DieType;
  value: number;
  discarded?: boolean;
}

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

const DIE_PRESETS: { die: DieType; sides: number; color: string }[] = [
  { die: "d4", sides: 4, color: "#22c55e" },
  { die: "d6", sides: 6, color: "#3b82f6" },
  { die: "d8", sides: 8, color: "#a855f7" },
  { die: "d10", sides: 10, color: "#f59e0b" },
  { die: "d12", sides: 12, color: "#ef4444" },
  { die: "d20", sides: 20, color: "#ec4899" },
  { die: "d100", sides: 100, color: "#6366f1" },
];

const MAX_HISTORY = 50;

const ADVANTAGE_LABELS: Record<AdvantageMode, string> = {
  normal: "Normal",
  ventaja: "Ventaja",
  desventaja: "Desventaja",
};

const ADVANTAGE_COLORS: Record<AdvantageMode, string> = {
  normal: "#6b7280",
  ventaja: "#22c55e",
  desventaja: "#ef4444",
};

// ─── Dice Logic ──────────────────────────────────────────────────────

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rollDie(sides: number): number {
  return randomInt(1, sides);
}

function parseDieType(sides: number): DieType {
  const map: Record<number, DieType> = {
    4: "d4",
    6: "d6",
    8: "d8",
    10: "d10",
    12: "d12",
    20: "d20",
    100: "d100",
  };
  return map[sides] || "d20";
}

interface ParsedFormula {
  groups: { count: number; sides: number; keepHighest?: number; keepLowest?: number }[];
  modifier: number;
}

function parseFormula(formula: string): ParsedFormula | null {
  const cleaned = formula.replace(/\s+/g, "").toLowerCase();
  if (!cleaned) return null;

  const groups: ParsedFormula["groups"] = [];
  let modifier = 0;

  // Split by + or -, keeping the sign
  const tokens = cleaned.match(/[+-]?[^+-]+/g);
  if (!tokens) return null;

  for (const token of tokens) {
    const sign = token.startsWith("-") ? -1 : 1;
    const abs = token.replace(/^[+-]/, "");

    // Check if it's a dice expression: NdX, NdXkhY, NdXklY
    const diceMatch = abs.match(/^(\d*)d(\d+)(?:kh(\d+)|kl(\d+))?$/);
    if (diceMatch) {
      const count = parseInt(diceMatch[1] || "1", 10);
      const sides = parseInt(diceMatch[2], 10);
      const keepHighest = diceMatch[3] ? parseInt(diceMatch[3], 10) : undefined;
      const keepLowest = diceMatch[4] ? parseInt(diceMatch[4], 10) : undefined;

      if (sides <= 0 || count <= 0 || count > 100 || sides > 1000) return null;
      if (keepHighest && keepHighest > count) return null;
      if (keepLowest && keepLowest > count) return null;

      groups.push({
        count: count * sign,
        sides,
        keepHighest,
        keepLowest,
      });
    } else {
      // It's a flat modifier
      const num = parseInt(abs, 10);
      if (isNaN(num)) return null;
      modifier += num * sign;
    }
  }

  if (groups.length === 0 && modifier === 0) return null;

  return { groups, modifier };
}

function executeFormula(
  parsed: ParsedFormula,
  advantageMode: AdvantageMode,
  extraModifier: number
): {
  rolls: DieRollResult[];
  subtotal: number;
  total: number;
  isCritical: boolean;
  isFumble: boolean;
} {
  const allRolls: DieRollResult[] = [];
  let subtotal = 0;

  // Check if it's a single d20 roll (for advantage/disadvantage)
  const isSingleD20 =
    parsed.groups.length === 1 &&
    Math.abs(parsed.groups[0].count) === 1 &&
    parsed.groups[0].sides === 20 &&
    !parsed.groups[0].keepHighest &&
    !parsed.groups[0].keepLowest;

  if (isSingleD20 && advantageMode !== "normal") {
    const roll1 = rollDie(20);
    const roll2 = rollDie(20);
    const sign = parsed.groups[0].count > 0 ? 1 : -1;

    let chosen: number;
    let discardedValue: number;

    if (advantageMode === "ventaja") {
      chosen = Math.max(roll1, roll2);
      discardedValue = Math.min(roll1, roll2);
    } else {
      chosen = Math.min(roll1, roll2);
      discardedValue = Math.max(roll1, roll2);
    }

    // The chosen die
    allRolls.push({ die: "d20", value: chosen, discarded: false });
    // The discarded die
    allRolls.push({ die: "d20", value: discardedValue, discarded: true });

    subtotal = chosen * sign;
  } else {
    for (const group of parsed.groups) {
      const sign = group.count > 0 ? 1 : -1;
      const absCount = Math.abs(group.count);
      const dieType = parseDieType(group.sides);

      const rolledValues: { value: number; index: number }[] = [];
      for (let i = 0; i < absCount; i++) {
        const value = rollDie(group.sides);
        rolledValues.push({ value, index: i });
      }

      if (group.keepHighest || group.keepLowest) {
        const sorted = [...rolledValues].sort((a, b) => b.value - a.value);
        const keepCount = group.keepHighest || group.keepLowest || absCount;

        let kept: Set<number>;
        if (group.keepHighest) {
          kept = new Set(sorted.slice(0, keepCount).map((r) => r.index));
        } else {
          kept = new Set(sorted.slice(sorted.length - keepCount).map((r) => r.index));
        }

        for (const rv of rolledValues) {
          const isKept = kept.has(rv.index);
          allRolls.push({ die: dieType, value: rv.value, discarded: !isKept });
          if (isKept) {
            subtotal += rv.value * sign;
          }
        }
      } else {
        for (const rv of rolledValues) {
          allRolls.push({ die: dieType, value: rv.value, discarded: false });
          subtotal += rv.value * sign;
        }
      }
    }
  }

  const totalModifier = parsed.modifier + extraModifier;
  const total = subtotal + totalModifier;

  // Check for critical/fumble (only on d20 single rolls)
  const mainD20Roll = allRolls.find((r) => r.die === "d20" && !r.discarded);
  const isCritical = isSingleD20 && mainD20Roll?.value === 20;
  const isFumble = isSingleD20 && mainD20Roll?.value === 1;

  return {
    rolls: allRolls,
    subtotal,
    total,
    isCritical,
    isFumble,
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
      { iterations: 3 }
    ).start();
  }, [criticalGlow]);

  // ── Roll Functions ──

  const doRoll = useCallback(
    (formulaStr: string, label?: string) => {
      const parsed = parseFormula(formulaStr);
      if (!parsed) {
        toastError("Fórmula inválida", `No se pudo interpretar: "${formulaStr}"`);
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
    [advantageMode, modifier, presetLabel, animateRoll, animateCritical]
  );

  const handlePresetRoll = useCallback(
    (die: DieType) => {
      const formulaStr = diceCount > 1 ? `${diceCount}${die}` : `1${die}`;
      doRoll(formulaStr);
    },
    [diceCount, doRoll]
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
      { confirmText: "Limpiar", cancelText: "Cancelar" }
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
              borderColor: isActive ? ADVANTAGE_COLORS[mode] : "#3a3a5c",
            }}
          >
            <Text
              style={{
                color: isActive ? ADVANTAGE_COLORS[mode] : "#8c8cb3",
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
            backgroundColor: "#1e1e38",
            borderWidth: 1,
            borderColor: "#3a3a5c",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="remove" size={18} color="#8c8cb3" />
        </TouchableOpacity>
        <Text
          style={{
            color: "#ffffff",
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
            backgroundColor: "#1e1e38",
            borderWidth: 1,
            borderColor: "#3a3a5c",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Ionicons name="add" size={18} color="#8c8cb3" />
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
          backgroundColor: "#1e1e38",
          borderRadius: 12,
          borderWidth: 1,
          borderColor: "#3a3a5c",
          paddingHorizontal: 14,
          paddingVertical: 4,
        }}
      >
        <Ionicons name="create-outline" size={18} color="#666699" />
        <TextInput
          style={{
            flex: 1,
            color: "#ffffff",
            fontSize: 16,
            marginLeft: 10,
            paddingVertical: 10,
          }}
          placeholder="Fórmula: 2d6+3, 4d6kh3..."
          placeholderTextColor="#666699"
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
          backgroundColor: "#c62828",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: 8,
        }}
        activeOpacity={0.7}
      >
        <Ionicons name="dice" size={24} color="#ffffff" />
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
      <Text style={{ color: "#8c8cb3", fontSize: 14, marginRight: 10 }}>
        Modificador:
      </Text>
      <TouchableOpacity
        onPress={() => setModifier((m) => m - 1)}
        style={{
          width: 32,
          height: 32,
          borderRadius: 16,
          backgroundColor: "#1e1e38",
          borderWidth: 1,
          borderColor: "#3a3a5c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="remove" size={16} color="#8c8cb3" />
      </TouchableOpacity>
      <Text
        style={{
          color: modifier > 0 ? "#22c55e" : modifier < 0 ? "#ef4444" : "#ffffff",
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
          backgroundColor: "#1e1e38",
          borderWidth: 1,
          borderColor: "#3a3a5c",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="add" size={16} color="#8c8cb3" />
      </TouchableOpacity>
      {modifier !== 0 && (
        <TouchableOpacity
          onPress={() => setModifier(0)}
          style={{ marginLeft: 8 }}
        >
          <Ionicons name="close-circle" size={20} color="#666699" />
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
              backgroundColor: "#252540",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 12,
            }}
          >
            <Ionicons name="dice-outline" size={40} color="#666699" />
          </View>
          <Text style={{ color: "#666699", fontSize: 16 }}>
            ¡Tira los dados!
          </Text>
        </View>
      );
    }

    const { isCritical, isFumble, total, rolls, modifier: totalMod, formula: rollFormula, nombre } =
      lastResult;

    const bgColor = isCritical
      ? "#fbbf2420"
      : isFumble
      ? "#ef444420"
      : "#1e1e38";

    const borderColor = isCritical
      ? "#fbbf24"
      : isFumble
      ? "#ef4444"
      : "#3a3a5c";

    const critGlowColor = criticalGlow.interpolate({
      inputRange: [0, 1],
      outputRange: [borderColor, isCritical ? "#fbbf24" : "#ef4444"],
    });

    const shakeTranslate = shakeAnim.interpolate({
      inputRange: [0, 0.25, 0.5, 0.75, 1],
      outputRange: [0, -8, 8, -4, 0],
    });

    return (
      <Animated.View
        style={{
          transform: [
            { translateX: shakeTranslate },
            { scale: scaleAnim },
          ],
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
                color: "#fbbf24",
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
                color: "#ef4444",
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
                color: "#8c8cb3",
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
                ? "#fbbf24"
                : isFumble
                ? "#ef4444"
                : "#ffffff",
              fontSize: 56,
              fontWeight: "900",
              lineHeight: 64,
            }}
          >
            {total}
          </Text>

          {/* Formula */}
          <Text style={{ color: "#8c8cb3", fontSize: 14, marginTop: 4 }}>
            {rollFormula}
            {totalMod > 0 ? ` (+${totalMod})` : totalMod < 0 ? ` (${totalMod})` : ""}
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
                    ? "#1a1a2e"
                    : roll.value === 20 && roll.die === "d20"
                    ? "#fbbf2430"
                    : roll.value === 1 && roll.die === "d20"
                    ? "#ef444430"
                    : "#252540",
                  borderWidth: 1,
                  borderColor: roll.discarded ? "#2d2d44" : "#3a3a5c",
                  opacity: roll.discarded ? 0.5 : 1,
                }}
              >
                <Text
                  style={{
                    color: roll.discarded
                      ? "#666699"
                      : roll.value === 20 && roll.die === "d20"
                      ? "#fbbf24"
                      : roll.value === 1 && roll.die === "d20"
                      ? "#ef4444"
                      : "#ffffff",
                    fontSize: 14,
                    fontWeight: "600",
                    textDecorationLine: roll.discarded ? "line-through" : "none",
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
                backgroundColor: ADVANTAGE_COLORS[lastResult.advantageMode] + "20",
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
                backgroundColor: "#252540",
                borderWidth: 1,
                borderColor: "#3a3a5c",
              }}
            >
              <Ionicons name="refresh" size={16} color="#8c8cb3" />
              <Text
                style={{ color: "#8c8cb3", fontSize: 13, marginLeft: 6, fontWeight: "600" }}
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
          borderBottomColor: "#1e1e38",
        }}
      >
        {/* Icon */}
        <View
          style={{
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: entry.isCritical
              ? "#fbbf2420"
              : entry.isFumble
              ? "#ef444420"
              : "#252540",
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
                ? "#fbbf24"
                : entry.isFumble
                ? "#ef4444"
                : "#666699"
            }
          />
        </View>

        {/* Info */}
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "baseline" }}>
            {entry.nombre && (
              <Text
                style={{
                  color: "#8c8cb3",
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
                  ? "#fbbf24"
                  : entry.isFumble
                  ? "#ef4444"
                  : "#ffffff",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              {entry.total}
            </Text>
          </View>
          <Text style={{ color: "#666699", fontSize: 11 }}>
            {entry.formula}
            {entry.modifier !== 0
              ? entry.modifier > 0
                ? ` +${entry.modifier}`
                : ` ${entry.modifier}`
              : ""}
            {" · "}
            [{entry.rolls
              .filter((r) => !r.discarded)
              .map((r) => r.value)
              .join(", ")}]
            {entry.advantageMode !== "normal"
              ? ` · ${ADVANTAGE_LABELS[entry.advantageMode]}`
              : ""}
          </Text>
        </View>

        {/* Time */}
        <Text style={{ color: "#666699", fontSize: 11 }}>{timeStr}</Text>
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
          borderBottomColor: "#3a3a5c",
        }}
      >
        <TouchableOpacity
          onPress={() => setShowHistory(false)}
          style={{ flexDirection: "row", alignItems: "center" }}
        >
          <Ionicons name="arrow-back" size={20} color="#8c8cb3" />
          <Text
            style={{
              color: "#ffffff",
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
            <Ionicons name="trash-outline" size={20} color="#ef4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={{ flex: 1 }}>
        {history.length === 0 ? (
          <View
            style={{ alignItems: "center", paddingVertical: 40 }}
          >
            <Text style={{ color: "#666699", fontSize: 15 }}>
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
          backgroundColor: "rgba(0,0,0,0.5)",
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
            backgroundColor: "#1a1a2e",
            borderTopLeftRadius: 24,
            borderTopRightRadius: 24,
            maxHeight: Dimensions.get("window").height * 0.88,
            borderTopWidth: 1,
            borderColor: "#3a3a5c",
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
                backgroundColor: "#3a3a5c",
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
                      color: "#ffffff",
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
                      backgroundColor: "#252540",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="time-outline" size={20} color="#8c8cb3" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={onClose}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: "#252540",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="close" size={20} color="#8c8cb3" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Character name */}
              {characterName && (
                <Text
                  style={{
                    color: "#fbbf24",
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
                    style={{ flex: 1, height: 1, backgroundColor: "#3a3a5c" }}
                  />
                  <Text
                    style={{
                      color: "#666699",
                      fontSize: 12,
                      marginHorizontal: 12,
                    }}
                  >
                    o escribe una fórmula
                  </Text>
                  <View
                    style={{ flex: 1, height: 1, backgroundColor: "#3a3a5c" }}
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
