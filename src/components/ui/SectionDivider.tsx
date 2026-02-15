/**
 * SectionDivider - D&D themed decorative divider with diamond center accent,
 * gradient fading lines, and optional label text.
 *
 * Provides visual separation between sections with a fantasy/medieval aesthetic.
 */

import { View, Text, StyleSheet, ViewStyle } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// ─── Props ───────────────────────────────────────────────────────────

interface SectionDividerProps {
  /** Optional label text displayed next to the center diamond */
  label?: string;
  /** Color of the diamond and accents (default: gold) */
  color?: string;
  /** Secondary color for the gradient fade (default: transparent) */
  fadeColor?: string;
  /** Whether to show the center diamond ornament (default: true) */
  showDiamond?: boolean;
  /** Size of the diamond ornament: 'sm' | 'md' | 'lg' (default: 'md') */
  diamondSize?: "sm" | "md" | "lg";
  /** Icon to show inside the diamond instead of the default shape */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Spacing above and below the divider (default: 16) */
  spacing?: number;
  /** Custom style for the outer container */
  style?: ViewStyle;
  /** Whether the divider lines are dashed (default: false) */
  dashed?: boolean;
  /** Variant style: 'ornate' has extra decorative dots, 'simple' is minimal */
  variant?: "simple" | "ornate" | "labeled";
  /** Opacity of the lines (default: 1) */
  lineOpacity?: number;
}

// ─── Diamond Size Presets ────────────────────────────────────────────

const DIAMOND_SIZES = {
  sm: { size: 6, iconSize: 0, outerSize: 10 },
  md: { size: 8, iconSize: 12, outerSize: 14 },
  lg: { size: 12, iconSize: 16, outerSize: 20 },
};

// ─── Component ───────────────────────────────────────────────────────

export default function SectionDivider({
  label,
  color = "#fbbf24",
  fadeColor = "transparent",
  showDiamond = true,
  diamondSize = "md",
  icon,
  spacing = 16,
  style,
  dashed = false,
  variant = "simple",
  lineOpacity = 1,
}: SectionDividerProps) {
  const diamond = DIAMOND_SIZES[diamondSize];
  const hasLabel = !!label || variant === "labeled";

  // Simple line-only divider
  if (!showDiamond && !hasLabel && variant === "simple") {
    return (
      <View style={[styles.container, { marginVertical: spacing }, style]}>
        <View style={[styles.lineContainer, { opacity: lineOpacity }]}>
          <LinearGradient
            colors={[fadeColor, `${color}40`, fadeColor]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.fullLine}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { marginVertical: spacing }, style]}>
      <View style={styles.row}>
        {/* Left line */}
        <View style={[styles.lineContainer, { opacity: lineOpacity }]}>
          <LinearGradient
            colors={[fadeColor, `${color}50`]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.line, dashed && styles.dashedLine]}
          />
        </View>

        {/* Left ornate dots */}
        {variant === "ornate" && (
          <View style={styles.ornateDotsLeft}>
            <View
              style={[
                styles.ornateDot,
                styles.ornateDotSmall,
                { backgroundColor: `${color}30` },
              ]}
            />
            <View
              style={[
                styles.ornateDot,
                styles.ornateDotMedium,
                { backgroundColor: `${color}50` },
              ]}
            />
          </View>
        )}

        {/* Center element */}
        <View style={styles.centerContainer}>
          {showDiamond && (
            <View style={styles.diamondWrapper}>
              {/* Outer diamond (rotated square) */}
              <View
                style={[
                  styles.diamondOuter,
                  {
                    width: diamond.outerSize,
                    height: diamond.outerSize,
                    borderColor: `${color}40`,
                  },
                ]}
              />

              {/* Inner diamond or icon */}
              {icon ? (
                <View
                  style={[
                    styles.diamondIconContainer,
                    {
                      width: diamond.outerSize + 8,
                      height: diamond.outerSize + 8,
                      borderRadius: (diamond.outerSize + 8) / 2,
                      backgroundColor: `${color}15`,
                    },
                  ]}
                >
                  <Ionicons
                    name={icon}
                    size={diamond.iconSize}
                    color={color}
                  />
                </View>
              ) : (
                <View
                  style={[
                    styles.diamondInner,
                    {
                      width: diamond.size,
                      height: diamond.size,
                      backgroundColor: color,
                      shadowColor: color,
                    },
                  ]}
                />
              )}
            </View>
          )}

          {/* Label */}
          {hasLabel && label && (
            <Text
              style={[
                styles.label,
                {
                  color: `${color}CC`,
                  marginLeft: showDiamond ? 8 : 0,
                },
              ]}
              numberOfLines={1}
            >
              {label}
            </Text>
          )}
        </View>

        {/* Right ornate dots */}
        {variant === "ornate" && (
          <View style={styles.ornateDotsRight}>
            <View
              style={[
                styles.ornateDot,
                styles.ornateDotMedium,
                { backgroundColor: `${color}50` },
              ]}
            />
            <View
              style={[
                styles.ornateDot,
                styles.ornateDotSmall,
                { backgroundColor: `${color}30` },
              ]}
            />
          </View>
        )}

        {/* Right line */}
        <View style={[styles.lineContainer, { opacity: lineOpacity }]}>
          <LinearGradient
            colors={[`${color}50`, fadeColor]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={[styles.line, dashed && styles.dashedLine]}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Preset Variants ─────────────────────────────────────────────────

/** A subtle, minimal divider with a thin golden line */
export function SubtleDivider({ style, spacing = 12 }: { style?: ViewStyle; spacing?: number }) {
  return (
    <SectionDivider
      showDiamond={false}
      color="#fbbf2440"
      spacing={spacing}
      lineOpacity={0.5}
      style={style}
    />
  );
}

/** An ornate divider with dots, diamond, and label — great for section headers */
export function OrnateDivider({
  label,
  icon,
  color = "#fbbf24",
  style,
}: {
  label?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <SectionDivider
      label={label}
      icon={icon}
      color={color}
      variant="ornate"
      diamondSize="lg"
      spacing={20}
      style={style}
    />
  );
}

/** A section header divider with a label and icon */
export function SectionHeaderDivider({
  label,
  icon,
  color = "#fbbf24",
  style,
}: {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  color?: string;
  style?: ViewStyle;
}) {
  return (
    <SectionDivider
      label={label}
      icon={icon}
      color={color}
      variant="labeled"
      diamondSize="md"
      spacing={18}
      style={style}
    />
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  lineContainer: {
    flex: 1,
    height: 1,
  },
  line: {
    height: 1,
    width: "100%",
  },
  fullLine: {
    height: 1,
    width: "100%",
  },
  dashedLine: {
    // React Native doesn't natively support dashed gradient lines,
    // so we use reduced opacity to simulate a lighter appearance.
    opacity: 0.6,
  },
  centerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  diamondWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  diamondOuter: {
    position: "absolute",
    borderWidth: 1,
    transform: [{ rotate: "45deg" }],
  },
  diamondInner: {
    transform: [{ rotate: "45deg" }],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },
  diamondIconContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  // Ornate variant dots
  ornateDotsLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 4,
    gap: 3,
  },
  ornateDotsRight: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 4,
    gap: 3,
  },
  ornateDot: {
    borderRadius: 100,
  },
  ornateDotSmall: {
    width: 3,
    height: 3,
  },
  ornateDotMedium: {
    width: 4,
    height: 4,
  },
});
