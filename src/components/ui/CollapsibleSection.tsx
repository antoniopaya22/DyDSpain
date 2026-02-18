/**
 * CollapsibleSection
 *
 * Reusable expandable/collapsible section with an icon, title and chevron toggle.
 * Extracted from the repeated pattern in:
 * - OverviewTab.tsx (CollapsibleSection sub-component)
 * - settings.tsx (renderSectionHeader + section content pattern)
 *
 * Two variants:
 * - `CollapsibleSection` — uses NativeWind/className styling (for character tabs)
 * - `CollapsibleCard` — uses StyleSheet styling (for settings-type screens)
 *
 * @example
 * // NativeWind variant
 * <CollapsibleSection
 *   title="Habilidades"
 *   icon="list"
 *   isExpanded={expanded}
 *   onToggle={() => setExpanded(!expanded)}
 * >
 *   <Text>Content</Text>
 * </CollapsibleSection>
 *
 * // StyleSheet variant
 * <CollapsibleCard
 *   id="apariencia"
 *   title="Apariencia"
 *   icon="color-palette"
 *   iconColor={colors.accentPurple}
 *   isExpanded={expandedSection === "apariencia"}
 *   onToggle={() => toggle("apariencia")}
 * >
 *   {renderThemeSection()}
 * </CollapsibleCard>
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

// ─── NativeWind variant (character sheets) ───────────────────────────

export interface CollapsibleSectionProps {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export default function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: CollapsibleSectionProps) {
  const { colors } = useTheme();

  return (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4 active:bg-gray-50 dark:active:bg-surface-light"
        onPress={onToggle}
      >
        <Ionicons name={icon} size={20} color={colors.accentGold} />
        <Text className="text-dark-900 dark:text-white text-base font-semibold flex-1 ml-3">
          {title}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.textMuted}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 border-t border-dark-100 dark:border-surface-border/50 pt-3">
          {children}
        </View>
      )}
    </View>
  );
}

// ─── StyleSheet variant (settings screens) ───────────────────────────

export interface CollapsibleCardProps {
  /** Section identifier (used for expand/collapse logic) */
  id: string;
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  /** Tint color for the icon background and icon */
  iconColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function CollapsibleCard({
  title,
  icon,
  iconColor,
  isExpanded,
  onToggle,
  children,
}: CollapsibleCardProps) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.section,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.borderDefault,
        },
      ]}
    >
      {/* Header row */}
      <TouchableOpacity
        onPress={onToggle}
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: iconColor + colors.iconBgAlpha },
            ]}
          >
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          <Text
            style={[styles.sectionTitle, { color: colors.sectionTitleColor }]}
          >
            {title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.chevronColor}
        />
      </TouchableOpacity>

      {/* Expandable content */}
      {isExpanded && (
        <View
          style={[
            styles.sectionContent,
            { borderTopColor: colors.borderSeparator },
          ]}
        >
          {children}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
});
