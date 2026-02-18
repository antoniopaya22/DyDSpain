/**
 * InfoBadge
 *
 * Small pill-shaped badge with an icon and text label.
 * Used to show character meta-info like class, alignment, XP, proficiency, etc.
 *
 * Extracted from the local `InfoBadge` sub-component in OverviewTab.tsx.
 *
 * @example
 * <InfoBadge icon="book-outline" label="Acolito" color={colors.accentGold} />
 */

import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface InfoBadgeProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  /** Tint color for the icon and text */
  color: string;
}

export default function InfoBadge({ icon, label, color }: InfoBadgeProps) {
  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1.5 mr-2 mb-2"
      style={{ backgroundColor: `${color}15` }}
    >
      <Ionicons name={icon} size={12} color={color} />
      <Text className="text-xs ml-1.5 font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}
