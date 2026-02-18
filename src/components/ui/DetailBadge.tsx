/**
 * DetailBadge
 *
 * Small badge that displays a label above a value, tinted with a given color.
 * Useful for stats like "Tamaño: Mediano", "Velocidad: 30 pies", etc.
 *
 * Extracted from the local `DetailBadge` sub-component in compendium.tsx.
 *
 * @example
 * <DetailBadge label="Tamaño" value="Mediano" color={colors.accentPurple} />
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";

export interface DetailBadgeProps {
  label: string;
  value: string;
  /** Tint color for the badge border, text and background */
  color: string;
}

export default function DetailBadge({ label, value, color }: DetailBadgeProps) {
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: color + "15", borderColor: color + "30" },
      ]}
    >
      <Text style={[styles.label, { color: color + "99" }]}>{label}</Text>
      <Text style={[styles.value, { color }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    minWidth: 80,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
