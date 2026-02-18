/**
 * DataSection - Data management (delete all)
 * Extracted from settings.tsx
 */

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

interface DataSectionProps {
  onDeleteAll: () => void;
}

export function DataSection({ onDeleteAll }: DataSectionProps) {
  const { colors } = useTheme();

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
        Gestiona los datos almacenados en la aplicación.
      </Text>

      <TouchableOpacity
        onPress={onDeleteAll}
        style={[
          styles.dangerButton,
          {
            backgroundColor: colors.dangerBg,
            borderColor: colors.dangerBorder,
          },
        ]}
        activeOpacity={0.7}
      >
        <Ionicons name="trash" size={20} color={colors.dangerText} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text
            style={[styles.dangerButtonTitle, { color: colors.dangerText }]}
          >
            Borrar todos los datos
          </Text>
          <Text
            style={[styles.dangerButtonDesc, { color: colors.dangerTextMuted }]}
          >
            Elimina personajes, partidas, notas y configuración
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.dangerText} />
      </TouchableOpacity>
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
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
  },
  dangerButtonTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dangerButtonDesc: {
    fontSize: 12,
    marginTop: 2,
  },
});
