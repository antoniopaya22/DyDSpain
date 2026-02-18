/**
 * PageHeader
 *
 * Reusable animated header used across secondary screens.
 * Renders a back button, top label, main title, optional right action,
 * and a bottom gradient border.
 *
 * Extracted from the duplicated header pattern in:
 * - settings.tsx
 * - compendium.tsx
 * - campaigns/new.tsx
 *
 * @example
 * <PageHeader
 *   title="Ajustes"
 *   label="D&D Español"
 *   onBack={() => router.back()}
 * />
 */

import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Platform,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

export interface PageHeaderProps {
  /** Main screen title */
  title: string;
  /** Small top label (defaults to "D&D Español") */
  label?: string;
  /** Called when the back button is pressed */
  onBack: () => void;
  /** Optional subtitle below the title area */
  subtitle?: string;
  /** Content rendered on the right side of the header row */
  rightAction?: React.ReactNode;
  /** Content rendered below the header row (e.g. search bar) */
  children?: React.ReactNode;
  /** Whether to animate entrance (default: true) */
  animated?: boolean;
  /** Additional container styles */
  style?: StyleProp<ViewStyle>;
}

export default function PageHeader({
  title,
  label = "D&D Español",
  onBack,
  subtitle,
  rightAction,
  children,
  animated = true,
  style,
}: PageHeaderProps) {
  const { colors } = useTheme();
  const headerFade = useRef(new Animated.Value(animated ? 0 : 1)).current;
  const headerSlide = useRef(new Animated.Value(animated ? 12 : 0)).current;

  useEffect(() => {
    if (!animated) return;
    Animated.parallel([
      Animated.timing(headerFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(headerSlide, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [animated, headerFade, headerSlide]);

  return (
    <Animated.View
      style={[
        styles.header,
        {
          opacity: headerFade,
          transform: [{ translateY: headerSlide }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={colors.gradientHeader}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.headerRow}>
        {/* Back button */}
        <TouchableOpacity
          onPress={onBack}
          style={[
            styles.backButton,
            {
              backgroundColor: colors.headerButtonBg,
              borderColor: colors.headerButtonBorder,
            },
          ]}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </TouchableOpacity>

        {/* Label + Title */}
        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.headerLabel,
              {
                color: colors.headerLabelColor,
                textShadowColor: colors.accentGoldGlow,
              },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[styles.headerTitle, { color: colors.headerTitleColor }]}
          >
            {title}
          </Text>
        </View>

        {/* Optional right action */}
        {rightAction ?? null}
      </View>

      {/* Optional subtitle */}
      {subtitle ? (
        <Text
          style={[styles.headerSubtitle, { color: colors.sectionDescColor }]}
        >
          {subtitle}
        </Text>
      ) : null}

      {/* Optional children (e.g. SearchBar) */}
      {children}

      {/* Bottom border gradient */}
      <View style={styles.headerBorder}>
        <LinearGradient
          colors={[
            "transparent",
            colors.borderDefault + "66",
            colors.borderDefault,
            colors.borderDefault + "66",
            "transparent",
          ]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ height: 1, width: "100%" }}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 16,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});
