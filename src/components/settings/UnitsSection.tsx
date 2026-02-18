/**
 * UnitsSection - Unit system selection
 * Extracted from settings.tsx
 */

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSettingsStore, type UnitSystem } from "@/stores/settingsStore";
import { useTheme } from "@/hooks";

const UNIT_OPTIONS: { value: UnitSystem; label: string; desc: string }[] = [
  { value: "imperial", label: "Imperial", desc: "Pies, libras" },
  { value: "metrico", label: "Métrico", desc: "Metros, kilogramos" },
];

export function UnitsSection() {
  const { colors } = useTheme();
  const { settings, setUnits } = useSettingsStore();

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
        Los datos se almacenan en imperial (estándar de D&D). La conversión es
        solo visual.
      </Text>
      <View style={styles.optionGroup}>
        {UNIT_OPTIONS.map((opt) => {
          const isSelected = settings.unidades === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setUnits(opt.value)}
              style={[
                styles.unitOption,
                {
                  backgroundColor: colors.optionBg,
                  borderColor: colors.optionBorder,
                },
                isSelected && {
                  borderColor: `${colors.accentGreen}66`,
                  backgroundColor: `${colors.accentGreen}14`,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.unitLabel,
                    { color: colors.sectionDescColor },
                    isSelected && { color: colors.accentGreen },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={[styles.unitDesc, { color: colors.textMuted }]}>
                  {opt.desc}
                </Text>
              </View>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.accentGreen}
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
  unitOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  unitLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  unitDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
