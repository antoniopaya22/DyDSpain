/**
 * GradientButton
 *
 * Primary CTA button with a LinearGradient background.
 * Supports enabled/disabled states with different gradient colors.
 *
 * Extracted from the repeated gradient-button pattern in:
 * - index.tsx (empty state "Crear primera partida" button, header add button)
 * - campaigns/new.tsx ("Crear Partida" button)
 *
 * @example
 * <GradientButton
 *   label="Crear Partida"
 *   icon="add-circle"
 *   onPress={handleCreate}
 *   disabled={!isValid}
 * />
 */

import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

export interface GradientButtonProps {
  /** Button label */
  label: string;
  /** Called on press */
  onPress: () => void;
  /** Optional leading Ionicon name */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Gradient colors when enabled (defaults to red gradient) */
  colors?: readonly [string, string, ...string[]];
  /** Whether the button is disabled */
  disabled?: boolean;
  /** Loading / in-progress label override */
  loadingLabel?: string;
  /** Whether the button is in loading state */
  loading?: boolean;
  /** Additional container styles */
  style?: StyleProp<ViewStyle>;
}

export default function GradientButton({
  label,
  onPress,
  icon,
  colors: gradientColors,
  disabled = false,
  loadingLabel,
  loading = false,
  style,
}: GradientButtonProps) {
  const { colors, isDark } = useTheme();

  const enabledColors = gradientColors ?? [
    "#d32f2f",
    colors.accentRed,
    "#a51c1c",
  ];

  const disabledColors: readonly [string, string, ...string[]] = isDark
    ? [colors.bgElevated, colors.bgCard, colors.bgSecondary]
    : ["#C5C1A6", "#B9B393", "#AAA37B"];

  const isDisabled = disabled || loading;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={isDisabled ? disabledColors : enabledColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {loading && loadingLabel ? (
          <Text style={styles.label}>{loadingLabel}</Text>
        ) : (
          <>
            {icon && (
              <Ionicons name={icon} size={22} color="white" />
            )}
            <Text style={[styles.label, icon ? { marginLeft: 8 } : undefined]}>
              {label}
            </Text>
          </>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#8f3d38",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.5,
  },
  gradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
  },
  label: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.2,
  },
});
