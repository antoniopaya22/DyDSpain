import React from "react";
import { View, StyleSheet, ViewStyle, useWindowDimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";
import { D20Watermark } from "../D20Icon";
import { TorchGlow } from "./TorchGlow";
import { MagicCircle } from "./MagicCircle";
import { FloatingParticles } from "./FloatingParticles";

interface DndBackdropProps {
  /** Optional container style */
  style?: ViewStyle;
  /** Base glow intensity */
  intensity?: number;
  /** Show floating particles */
  showParticles?: boolean;
  /** Show arcane circle */
  showMagicCircle?: boolean;
}

export function DndBackdrop({
  style,
  intensity,
  showParticles = true,
  showMagicCircle = true,
}: DndBackdropProps) {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const glowIntensity = intensity ?? (isDark ? 0.06 : 0.04);
  const watermarkOpacity = isDark ? 0.05 : 0.06;

  return (
    <View pointerEvents="none" style={[styles.container, style]}>
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle texture overlay */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(255,255,255,0.03)", "transparent", "rgba(0,0,0,0.08)"]
            : ["rgba(0,0,0,0.03)", "transparent", "rgba(255,255,255,0.12)"]
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow */}
      <TorchGlow
        color={colors.accentGold}
        position="top-left"
        size={160}
        intensity={glowIntensity}
        animated
      />
      <TorchGlow
        color={colors.accentRed}
        position="bottom-right"
        size={200}
        intensity={glowIntensity * 0.9}
        animated
      />

      {/* Watermark dice */}
      <View style={styles.topLeft}>
        <D20Watermark
          size={140}
          variant={isDark ? "dark" : "silver"}
          opacity={watermarkOpacity}
        />
      </View>
      <View style={styles.bottomRight}>
        <D20Watermark
          size={220}
          variant={isDark ? "dark" : "silver"}
          opacity={watermarkOpacity}
        />
      </View>

      {/* Arcane circle */}
      {showMagicCircle && (
        <MagicCircle
          size={220}
          color={isDark ? colors.accentGold : colors.accentDeepPurple}
          opacity={isDark ? 0.08 : 0.06}
          animated
          style={styles.magicCircle}
        />
      )}

      {/* Floating particles */}
      {showParticles && (
        <FloatingParticles
          count={8}
          color={colors.accentGold}
          width={width}
          height={Math.min(height, 700)}
          maxSize={3}
          opacity={isDark ? 0.25 : 0.15}
          style={styles.particles}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  topLeft: {
    position: "absolute",
    top: -40,
    left: -40,
  },
  bottomRight: {
    position: "absolute",
    bottom: -60,
    right: -60,
  },
  magicCircle: {
    position: "absolute",
    top: 80,
    right: -40,
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});
