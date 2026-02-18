/**
 * ScreenContainer
 *
 * Reusable full-screen wrapper with themed background gradient.
 * Used as the root container for all app screens.
 *
 * @example
 * <ScreenContainer>
 *   <PageHeader title="Ajustes" />
 *   <ScrollView>...</ScrollView>
 * </ScreenContainer>
 */

import React from "react";
import { View, StyleSheet, type ViewStyle, type StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

export interface ScreenContainerProps {
  children: React.ReactNode;
  /** Additional styles for the outer container */
  style?: StyleProp<ViewStyle>;
}

export default function ScreenContainer({
  children,
  style,
}: ScreenContainerProps) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }, style]}>
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
