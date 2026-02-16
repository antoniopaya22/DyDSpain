/**
 * ExperienceSection - Sección de gestión de experiencia y subida de nivel.
 * Muestra: XP actual, barra de progreso al siguiente nivel,
 * botones para añadir/quitar XP, y botón de subir de nivel.
 */

import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCharacterStore } from "@/stores/characterStore";
import {
  XP_THRESHOLDS,
  MAX_LEVEL,
  getXPProgress,
  getXPForNextLevel,
  canLevelUp as canLevelUpCheck,
  formatXP,
  getLevelForXP,
} from "@/data/srd/leveling";
import { useTheme } from "@/hooks/useTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Preset XP amounts for quick add/remove
const XP_PRESETS = [25, 50, 100, 250, 500, 1000];

interface ExperienceSectionProps {
  onLevelUp: () => void;
}

export default function ExperienceSection({
  onLevelUp,
}: ExperienceSectionProps) {
  const { isDark, colors } = useTheme();
  const { character, addExperience, removeExperience, setExperience } =
    useCharacterStore();

  const [showXPInput, setShowXPInput] = useState(false);
  const [xpAmount, setXpAmount] = useState("");
  const [isRemoving, setIsRemoving] = useState(false);
  const [showPresets, setShowPresets] = useState(false);

  // Animations
  const progressAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  if (!character) return null;

  const currentXP = character.experiencia;
  const currentLevel = character.nivel;
  const isMaxLevel = currentLevel >= MAX_LEVEL;
  const nextLevelXP = getXPForNextLevel(currentLevel);
  const currentLevelXP = XP_THRESHOLDS[currentLevel];
  const progress = getXPProgress(currentXP, currentLevel);
  const canLevel = canLevelUpCheck(currentXP, currentLevel);

  // Animate progress bar
  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: progress * 100,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [progress, progressAnim]);

  // Pulse animation for level up button
  useEffect(() => {
    if (canLevel) {
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      );
      pulse.start();

      // Glow
      const glow = Animated.loop(
        Animated.sequence([
          Animated.timing(glowAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
          Animated.timing(glowAnim, {
            toValue: 0,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ]),
      );
      glow.start();

      return () => {
        pulse.stop();
        glow.stop();
      };
    }
  }, [canLevel, pulseAnim, glowAnim]);

  const handleAddXP = async (amount: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await addExperience(amount);
  };

  const handleRemoveXP = async (amount: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    await removeExperience(amount);
  };

  const handleCustomXP = async () => {
    const amount = parseInt(xpAmount, 10);
    if (isNaN(amount) || amount <= 0) return;

    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (isRemoving) {
      await removeExperience(amount);
    } else {
      await addExperience(amount);
    }
    setXpAmount("");
    setShowXPInput(false);
  };

  const toggleXPInput = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowXPInput(!showXPInput);
    setShowPresets(false);
    setXpAmount("");
  };

  const togglePresets = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setShowPresets(!showPresets);
    setShowXPInput(false);
  };

  // Calculate display values
  const xpIntoLevel = currentXP - currentLevelXP;
  const xpNeededForLevel = nextLevelXP ? nextLevelXP - currentLevelXP : 0;
  const xpRemaining = nextLevelXP ? nextLevelXP - currentXP : 0;

  return (
    <View
      style={{
        backgroundColor: colors.bgPrimary,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: canLevel
          ? "rgba(251, 191, 36, 0.4)"
          : colors.borderSeparator,
        padding: 16,
        marginBottom: 16,
      }}
    >
      {/* Header row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              backgroundColor: "rgba(251, 191, 36, 0.15)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name="star" size={18} color={colors.accentGold} />
          </View>
          <View>
            <Text
              style={{
                color: colors.textPrimary,
                fontSize: 16,
                fontWeight: "700",
              }}
            >
              Experiencia
            </Text>
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 12,
                fontWeight: "500",
              }}
            >
              Nivel {currentLevel}
              {!isMaxLevel ? ` → ${currentLevel + 1}` : " (Máximo)"}
            </Text>
          </View>
        </View>

        {/* Quick action buttons */}
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={togglePresets}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: showPresets
                ? "rgba(251, 191, 36, 0.25)"
                : colors.borderSeparator,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: showPresets
                ? "rgba(251, 191, 36, 0.4)"
                : colors.borderSubtle,
            }}
          >
            <Ionicons
              name="flash-outline"
              size={16}
              color={showPresets ? colors.accentGold : colors.textSecondary}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={toggleXPInput}
            activeOpacity={0.7}
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              backgroundColor: showXPInput
                ? "rgba(34, 197, 94, 0.25)"
                : colors.borderSeparator,
              alignItems: "center",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: showXPInput
                ? "rgba(34, 197, 94, 0.4)"
                : colors.borderSubtle,
            }}
          >
            <Ionicons
              name={showXPInput ? "close" : "create-outline"}
              size={16}
              color={showXPInput ? colors.accentGreen : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* XP Display */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 8,
        }}
      >
        <Text
          style={{
            color: colors.accentGold,
            fontSize: 28,
            fontWeight: "800",
            letterSpacing: -0.5,
          }}
        >
          {formatXP(currentXP)}
        </Text>
        {!isMaxLevel && nextLevelXP && (
          <Text
            style={{
              color: colors.textMuted,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            / {formatXP(nextLevelXP)} XP
          </Text>
        )}
        {isMaxLevel && (
          <Text
            style={{
              color: colors.accentGold,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Nivel Máximo ✨
          </Text>
        )}
      </View>

      {/* Progress bar */}
      {!isMaxLevel && (
        <View style={{ marginBottom: 8 }}>
          <View
            style={{
              height: 8,
              backgroundColor: colors.borderSeparator,
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <Animated.View
              style={{
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                width: progressAnim.interpolate({
                  inputRange: [0, 100],
                  outputRange: ["0%", "100%"],
                }),
              }}
            >
              <LinearGradient
                colors={
                  canLevel
                    ? [colors.accentAmber, colors.accentGold, "#fcd34d"]
                    : ["#6366f1", "#818cf8", "#a5b4fc"]
                }
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ flex: 1 }}
              />
            </Animated.View>
          </View>

          {/* Progress text */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 4,
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontSize: 11,
                fontWeight: "500",
              }}
            >
              {formatXP(xpIntoLevel)} / {formatXP(xpNeededForLevel)}
            </Text>
            <Text
              style={{
                color: canLevel ? colors.accentGold : colors.textMuted,
                fontSize: 11,
                fontWeight: canLevel ? "700" : "500",
              }}
            >
              {canLevel
                ? "¡Listo para subir!"
                : `Faltan ${formatXP(xpRemaining)} XP`}
            </Text>
          </View>
        </View>
      )}

      {/* Preset XP buttons */}
      {showPresets && (
        <View style={{ marginTop: 8 }}>
          {/* Mode toggle */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsRemoving(false)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: !isRemoving
                  ? "rgba(34, 197, 94, 0.2)"
                  : colors.borderSeparator,
                borderWidth: 1,
                borderColor: !isRemoving
                  ? "rgba(34, 197, 94, 0.4)"
                  : colors.borderSubtle,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Ionicons
                name="add-circle-outline"
                size={14}
                color={!isRemoving ? colors.accentGreen : colors.textMuted}
              />
              <Text
                style={{
                  color: !isRemoving ? colors.accentGreen : colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Añadir
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsRemoving(true)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: isRemoving
                  ? "rgba(239, 68, 68, 0.2)"
                  : colors.borderSeparator,
                borderWidth: 1,
                borderColor: isRemoving
                  ? "rgba(239, 68, 68, 0.4)"
                  : colors.borderSubtle,
                alignItems: "center",
                flexDirection: "row",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Ionicons
                name="remove-circle-outline"
                size={14}
                color={isRemoving ? colors.accentDanger : colors.textMuted}
              />
              <Text
                style={{
                  color: isRemoving ? colors.accentDanger : colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Quitar
              </Text>
            </TouchableOpacity>
          </View>

          {/* Preset grid */}
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {XP_PRESETS.map((amount) => (
              <TouchableOpacity
                key={amount}
                onPress={() =>
                  isRemoving ? handleRemoveXP(amount) : handleAddXP(amount)
                }
                activeOpacity={0.7}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 10,
                  backgroundColor: isRemoving
                    ? "rgba(239, 68, 68, 0.12)"
                    : "rgba(34, 197, 94, 0.12)",
                  borderWidth: 1,
                  borderColor: isRemoving
                    ? "rgba(239, 68, 68, 0.25)"
                    : "rgba(34, 197, 94, 0.25)",
                }}
              >
                <Text
                  style={{
                    color: isRemoving
                      ? colors.accentDanger
                      : colors.accentGreen,
                    fontSize: 13,
                    fontWeight: "700",
                  }}
                >
                  {isRemoving ? "−" : "+"}
                  {formatXP(amount)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      {/* Custom XP input */}
      {showXPInput && (
        <View style={{ marginTop: 8 }}>
          {/* Mode toggle */}
          <View
            style={{
              flexDirection: "row",
              marginBottom: 8,
              gap: 8,
            }}
          >
            <TouchableOpacity
              onPress={() => setIsRemoving(false)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: !isRemoving
                  ? "rgba(34, 197, 94, 0.2)"
                  : colors.borderSeparator,
                borderWidth: 1,
                borderColor: !isRemoving
                  ? "rgba(34, 197, 94, 0.4)"
                  : colors.borderSubtle,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: !isRemoving ? colors.accentGreen : colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Añadir XP
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setIsRemoving(true)}
              activeOpacity={0.7}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 10,
                backgroundColor: isRemoving
                  ? "rgba(239, 68, 68, 0.2)"
                  : colors.borderSeparator,
                borderWidth: 1,
                borderColor: isRemoving
                  ? "rgba(239, 68, 68, 0.4)"
                  : colors.borderSubtle,
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: isRemoving ? colors.accentDanger : colors.textMuted,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                Quitar XP
              </Text>
            </TouchableOpacity>
          </View>

          {/* Input row */}
          <View
            style={{
              flexDirection: "row",
              gap: 8,
              alignItems: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: colors.borderSeparator,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: isRemoving
                  ? "rgba(239, 68, 68, 0.3)"
                  : "rgba(34, 197, 94, 0.3)",
                paddingHorizontal: 12,
              }}
            >
              <Text
                style={{
                  color: isRemoving ? colors.accentDanger : colors.accentGreen,
                  fontSize: 16,
                  fontWeight: "700",
                  marginRight: 4,
                }}
              >
                {isRemoving ? "−" : "+"}
              </Text>
              <TextInput
                value={xpAmount}
                onChangeText={(text) =>
                  setXpAmount(text.replace(/[^0-9]/g, ""))
                }
                placeholder="Cantidad de XP"
                placeholderTextColor={colors.textMuted}
                keyboardType="number-pad"
                returnKeyType="done"
                onSubmitEditing={handleCustomXP}
                style={{
                  flex: 1,
                  color: colors.textPrimary,
                  fontSize: 16,
                  fontWeight: "600",
                  paddingVertical: 10,
                }}
              />
            </View>
            <TouchableOpacity
              onPress={handleCustomXP}
              activeOpacity={0.7}
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                overflow: "hidden",
              }}
            >
              <LinearGradient
                colors={
                  isRemoving
                    ? [colors.accentDanger, "#dc2626"]
                    : [colors.accentGreen, "#16a34a"]
                }
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name="checkmark"
                  size={20}
                  color={colors.textInverted}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Level Up Button */}
      {canLevel && !isMaxLevel && (
        <Animated.View
          style={{
            marginTop: 12,
            transform: [{ scale: pulseAnim }],
          }}
        >
          <TouchableOpacity
            onPress={onLevelUp}
            activeOpacity={0.8}
            style={{
              borderRadius: 14,
              overflow: "hidden",
              shadowColor: colors.accentGold,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.4,
              shadowRadius: 12,
              elevation: 8,
            }}
          >
            <LinearGradient
              colors={[colors.accentAmber, "#d97706", "#b45309"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 14,
                paddingHorizontal: 24,
                gap: 10,
              }}
            >
              <Ionicons
                name="arrow-up-circle"
                size={24}
                color={colors.textInverted}
              />
              <View>
                <Text
                  style={
                    {
                      color: colors.textInverted,
                      fontSize: 17,
                      fontWeight: "800",
                      letterSpacing: 0.5,
                    } as const
                  }
                >
                  ¡Subir a Nivel {currentLevel + 1}!
                </Text>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontSize: 12,
                    fontWeight: "500",
                  }}
                >
                  Toca para configurar tu subida de nivel
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color="rgba(255,255,255,0.7)"
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Milestone level up button (always visible when not max, but less prominent if not enough XP) */}
      {!canLevel && !isMaxLevel && (
        <TouchableOpacity
          onPress={onLevelUp}
          activeOpacity={0.7}
          style={{
            marginTop: 12,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 12,
            backgroundColor: colors.borderSeparator,
            borderWidth: 1,
            borderColor: colors.borderDefault,
            gap: 8,
          }}
        >
          <Ionicons
            name="arrow-up-circle-outline"
            size={18}
            color={colors.textSecondary}
          />
          <Text
            style={{
              color: colors.textSecondary,
              fontSize: 13,
              fontWeight: "600",
            }}
          >
            Subir de nivel (hito)
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
