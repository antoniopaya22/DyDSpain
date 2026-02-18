/**
 * EmptyState
 *
 * Generic empty-state placeholder with icon, title and subtitle.
 * Optionally shows a CTA button.
 *
 * Extracted from the repeated empty-state patterns in:
 * - index.tsx (EmptyState with CTA)
 * - compendium.tsx (renderEmpty for no search results)
 *
 * @example
 * // Simple "no results" state
 * <EmptyState
 *   icon="search"
 *   title='No se encontraron razas con "xyz"'
 * />
 *
 * // Full CTA state
 * <EmptyState
 *   icon="add-circle-outline"
 *   title="¡Bienvenido, aventurero!"
 *   subtitle="No tienes ninguna partida todavía."
 *   ctaLabel="Crear primera partida"
 *   onCtaPress={() => router.push("/campaigns/new")}
 * />
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

export interface EmptyStateProps {
  /** Ionicons icon name displayed prominently */
  icon: keyof typeof Ionicons.glyphMap;
  /** Primary heading */
  title: string;
  /** Optional secondary text */
  subtitle?: string;
  /** Custom content rendered instead of the default icon */
  customIcon?: React.ReactNode;
  /** CTA button label */
  ctaLabel?: string;
  /** Called when the CTA button is pressed */
  onCtaPress?: () => void;
  /** Gradient colors for the CTA button (defaults to red gradient) */
  ctaColors?: readonly [string, string, ...string[]];
}

export default function EmptyState({
  icon,
  title,
  subtitle,
  customIcon,
  ctaLabel,
  onCtaPress,
  ctaColors,
}: EmptyStateProps) {
  const { colors } = useTheme();

  const defaultCtaColors = ["#d32f2f", colors.accentRed, "#a51c1c"] as const;
  const resolvedCtaColors = ctaColors ?? defaultCtaColors;

  return (
    <View style={styles.container}>
      {/* Icon */}
      {customIcon ?? (
        <Ionicons
          name={icon}
          size={40}
          color={colors.textMuted}
          style={styles.icon}
        />
      )}

      {/* Title */}
      <Text style={[styles.title, { color: colors.emptyTitle ?? colors.textPrimary }]}>
        {title}
      </Text>

      {/* Subtitle */}
      {subtitle ? (
        <Text
          style={[
            styles.subtitle,
            { color: colors.emptySubtitle ?? colors.textSecondary },
          ]}
        >
          {subtitle}
        </Text>
      ) : null}

      {/* Optional CTA */}
      {ctaLabel && onCtaPress ? (
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={onCtaPress}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={resolvedCtaColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <Ionicons name="add" size={22} color="white" />
            <Text style={styles.ctaText}>{ctaLabel}</Text>
          </LinearGradient>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingVertical: 48,
    paddingHorizontal: 28,
  },
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 16,
  },
  ctaButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#8f3d38",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    marginTop: 8,
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
});
