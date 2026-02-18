/**
 * ThemeSection - Theme selection settings
 * Extracted from settings.tsx
 */

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore, type ThemeMode } from "@/stores/settingsStore";
import { useTheme } from "@/hooks";

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "oscuro", label: "Oscuro", icon: "moon" },
  { value: "claro", label: "Claro", icon: "sunny" },
  { value: "auto", label: "Automático", icon: "phone-portrait-outline" },
];

export function ThemeSection() {
  const { colors, mode } = useTheme();
  const { settings, setTheme } = useSettingsStore();

  return (
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      <Text
        style={[styles.sectionDescription, { color: colors.sectionDescColor }]}
      >
        Elige el tema visual de la aplicación.
        {settings.tema === "auto" &&
          `\nModo actual: ${mode === "oscuro" ? "Oscuro" : "Claro"} (del sistema)`}
      </Text>
      <View style={styles.optionGroup}>
        {THEME_OPTIONS.map((opt) => {
          const isSelected = settings.tema === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              style={[
                styles.themeOption,
                {
                  backgroundColor: colors.optionBg,
                  borderColor: colors.optionBorder,
                },
                isSelected && {
                  backgroundColor: colors.optionSelectedBg,
                  borderColor: colors.optionSelectedBorder,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={opt.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={isSelected ? colors.accentGold : colors.chevronColor}
              />
              <Text
                style={[
                  styles.themeOptionLabel,
                  { color: colors.textSecondary },
                  isSelected && { color: colors.accentGold },
                ]}
              >
                {opt.label}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.accentGold}
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContent: {},
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 12,
  },
  optionGroup: {
    gap: 8,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
});
