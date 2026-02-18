/**
 * usePulseAnimation - Reusable hook for pulse/glow loop animations
 *
 * Used for attention-grabbing effects like "Level Up" button glow.
 *
 * Usage:
 *   const { scale, glowOpacity } = usePulseAnimation({ active: canLevel });
 *
 *   <Animated.View style={{ transform: [{ scale }] }}>
 */

import { useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";

interface PulseAnimationOptions {
  /** Whether the pulse is active. Default: true */
  active?: boolean;
  /** Max scale value. Default: 1.05 */
  maxScale?: number;
  /** Min scale value. Default: 1 */
  minScale?: number;
  /** Duration of one pulse cycle (ms). Default: 2000 */
  duration?: number;
  /** Whether to include a glow opacity animation. Default: false */
  glow?: boolean;
  /** Duration of one glow cycle (ms). Default: 3000 */
  glowDuration?: number;
  /** Use native driver. Default: true */
  useNativeDriver?: boolean;
}

export function usePulseAnimation(options: PulseAnimationOptions = {}) {
  const {
    active = true,
    maxScale = 1.05,
    minScale = 1,
    duration = 2000,
    glow = false,
    glowDuration = 3000,
    useNativeDriver = true,
  } = options;

  const scale = useRef(new Animated.Value(minScale)).current;
  const glowOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!active) {
      scale.setValue(minScale);
      glowOpacity.setValue(0);
      return;
    }

    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(scale, {
          toValue: maxScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
        Animated.timing(scale, {
          toValue: minScale,
          duration: duration / 2,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver,
        }),
      ])
    );
    pulseLoop.start();

    let glowLoop: Animated.CompositeAnimation | null = null;
    if (glow) {
      glowLoop = Animated.loop(
        Animated.sequence([
          Animated.timing(glowOpacity, {
            toValue: 1,
            duration: glowDuration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false, // glow often animates non-transform properties
          }),
          Animated.timing(glowOpacity, {
            toValue: 0,
            duration: glowDuration / 2,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: false,
          }),
        ])
      );
      glowLoop.start();
    }

    return () => {
      pulseLoop.stop();
      glowLoop?.stop();
    };
  }, [active]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    /** Animated scale value for transform */
    scale,
    /** Animated glow opacity (0 → 1 → 0 loop). Only active when glow=true */
    glowOpacity,
  };
}
