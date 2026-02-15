/**
 * DndLogo - Animated D&D themed logo with D20 dice icon,
 * glowing effects, and pulsating animation.
 *
 * Used in the home screen header for branding.
 */

import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ViewStyle,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ─── Props ───────────────────────────────────────────────────────────

interface DndLogoProps {
  /** Size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether to show the text label below */
  showLabel?: boolean;
  /** Whether to animate (pulse/glow) */
  animated?: boolean;
  /** Custom container style */
  style?: ViewStyle;
}

// ─── Size Presets ────────────────────────────────────────────────────

const SIZE_PRESETS = {
  sm: {
    container: 48,
    icon: 22,
    outerRing: 56,
    fontSize: 11,
    subtitleSize: 8,
    glowRadius: 10,
  },
  md: {
    container: 64,
    icon: 30,
    outerRing: 74,
    fontSize: 13,
    subtitleSize: 9,
    glowRadius: 16,
  },
  lg: {
    container: 80,
    icon: 38,
    outerRing: 92,
    fontSize: 15,
    subtitleSize: 10,
    glowRadius: 20,
  },
  xl: {
    container: 104,
    icon: 48,
    outerRing: 118,
    fontSize: 18,
    subtitleSize: 12,
    glowRadius: 28,
  },
};

// ─── Component ───────────────────────────────────────────────────────

export default function DndLogo({
  size = "md",
  showLabel = true,
  animated = true,
  style,
}: DndLogoProps) {
  const preset = SIZE_PRESETS[size];

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance animation
    Animated.spring(entranceAnim, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    if (!animated) return;

    // Pulse animation loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Glow opacity animation loop
    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.25,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    // Subtle rotation
    const rotate = Animated.loop(
      Animated.sequence([
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(rotateAnim, {
          toValue: 0,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();
    rotate.start();

    return () => {
      pulse.stop();
      glow.stop();
      rotate.stop();
    };
  }, [animated, pulseAnim, glowAnim, rotateAnim, entranceAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-4deg", "4deg"],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: entranceAnim,
          transform: [
            {
              scale: Animated.multiply(entranceAnim, pulseAnim),
            },
          ],
        },
        style,
      ]}
    >
      {/* Outer glow ring */}
      <Animated.View
        style={[
          styles.glowRing,
          {
            width: preset.outerRing,
            height: preset.outerRing,
            borderRadius: preset.outerRing / 2,
            opacity: glowAnim,
            shadowColor: "#c62828",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.8,
            shadowRadius: preset.glowRadius,
            elevation: 12,
          },
        ]}
      />

      {/* Decorative corner accents (diamond shape using rotation) */}
      <Animated.View
        style={[
          styles.diamondAccent,
          {
            width: preset.outerRing * 0.85,
            height: preset.outerRing * 0.85,
            borderRadius: preset.outerRing * 0.12,
            transform: [{ rotate: "45deg" }],
          },
        ]}
      />

      {/* Main dice container with gradient */}
      <Animated.View
        style={[
          styles.diceContainer,
          {
            width: preset.container,
            height: preset.container,
            borderRadius: preset.container * 0.25,
            transform: [{ rotate: rotateInterpolate }],
          },
        ]}
      >
        <LinearGradient
          colors={["#d32f2f", "#c62828", "#8e0000"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.gradient,
            {
              borderRadius: preset.container * 0.25,
            },
          ]}
        >
          {/* Inner border accent */}
          <View
            style={[
              styles.innerBorder,
              {
                width: preset.container - 6,
                height: preset.container - 6,
                borderRadius: preset.container * 0.22,
              },
            ]}
          >
            {/* D20 number */}
            <Text
              style={[
                styles.diceNumber,
                {
                  fontSize: preset.icon * 0.65,
                },
              ]}
            >
              20
            </Text>

            {/* Small dice icon overlay */}
            <View style={styles.diceIconOverlay}>
              <Ionicons
                name="dice"
                size={preset.icon * 0.35}
                color="rgba(255,255,255,0.3)"
              />
            </View>
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Sparkle accents */}
      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkleTopRight,
          {
            opacity: glowAnim,
            top: -2,
            right: preset.outerRing * 0.12,
          },
        ]}
      >
        <Ionicons name="sparkles" size={preset.icon * 0.32} color="#fbbf24" />
      </Animated.View>

      <Animated.View
        style={[
          styles.sparkle,
          styles.sparkleBottomLeft,
          {
            opacity: Animated.subtract(1, glowAnim),
            bottom: 0,
            left: preset.outerRing * 0.1,
          },
        ]}
      >
        <Ionicons name="star" size={preset.icon * 0.22} color="#fbbf24" />
      </Animated.View>

      {/* Label */}
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text
            style={[
              styles.labelTitle,
              { fontSize: preset.fontSize },
            ]}
          >
            D&D
          </Text>
          <Text
            style={[
              styles.labelSubtitle,
              { fontSize: preset.subtitleSize },
            ]}
          >
            ESPAÑOL
          </Text>
        </View>
      )}
    </Animated.View>
  );
}

// ─── Compact Inline Logo (for headers) ──────────────────────────────

interface InlineLogoProps {
  style?: ViewStyle;
}

export function InlineDndLogo({ style }: InlineLogoProps) {
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(entranceAnim, {
      toValue: 1,
      friction: 6,
      tension: 100,
      useNativeDriver: true,
    }).start();
  }, [entranceAnim]);

  return (
    <Animated.View
      style={[
        styles.inlineWrapper,
        {
          opacity: entranceAnim,
          transform: [{ scale: entranceAnim }],
        },
        style,
      ]}
    >
      <LinearGradient
        colors={["#d32f2f", "#c62828", "#8e0000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.inlineGradient}
      >
        <Text style={styles.inlineDiceText}>20</Text>
      </LinearGradient>
      <View style={styles.inlineTextContainer}>
        <Text style={styles.inlineTitle}>D&D Español</Text>
        <Text style={styles.inlineSubtitle}>5ª Edición</Text>
      </View>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  glowRing: {
    position: "absolute",
    backgroundColor: "rgba(198, 40, 40, 0.08)",
    borderWidth: 1,
    borderColor: "rgba(198, 40, 40, 0.2)",
  },
  diamondAccent: {
    position: "absolute",
    borderWidth: 1,
    borderColor: "rgba(251, 191, 36, 0.12)",
    backgroundColor: "transparent",
  },
  diceContainer: {
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 10,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  innerBorder: {
    borderWidth: 1.5,
    borderColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  diceNumber: {
    color: "#ffffff",
    fontWeight: "900",
    letterSpacing: -1,
    textShadowColor: "rgba(0, 0, 0, 0.4)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  diceIconOverlay: {
    position: "absolute",
    bottom: 2,
    right: 2,
  },
  sparkle: {
    position: "absolute",
  },
  sparkleTopRight: {},
  sparkleBottomLeft: {},
  labelContainer: {
    marginTop: 10,
    alignItems: "center",
  },
  labelTitle: {
    color: "#fbbf24",
    fontWeight: "900",
    letterSpacing: 3,
    textShadowColor: "rgba(251, 191, 36, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  labelSubtitle: {
    color: "rgba(251, 191, 36, 0.6)",
    fontWeight: "700",
    letterSpacing: 5,
    marginTop: 2,
  },

  // Inline logo styles
  inlineWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  inlineGradient: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  inlineDiceText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  inlineTextContainer: {
    marginLeft: 10,
  },
  inlineTitle: {
    color: "#fbbf24",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  inlineSubtitle: {
    color: "rgba(251, 191, 36, 0.5)",
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginTop: -1,
  },
});
