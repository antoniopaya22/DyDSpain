/**
 * Toast - Non-blocking notification component
 *
 * Slides down from the top of the screen with smooth animations.
 * Auto-dismisses after a configurable duration.
 * Supports success, error, warning, and info variants.
 *
 * ✅ Theme-aware: adapts to light/dark mode via useTheme()
 */

import { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

// ─── Types ───────────────────────────────────────────────────────────

export type ToastType = "success" | "error" | "warning" | "info";

export interface ToastProps {
  /** Whether the toast is visible */
  visible: boolean;
  /** Toast variant determines icon and colors */
  type?: ToastType;
  /** Main message text */
  message: string;
  /** Optional subtitle / secondary text */
  subtitle?: string;
  /** Auto-dismiss duration in ms (default: 3000, set 0 to disable) */
  duration?: number;
  /** Callback when toast is dismissed */
  onDismiss: () => void;
  /** Custom icon (overrides type-based icon) */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Whether the toast can be dismissed by tapping (default: true) */
  dismissOnPress?: boolean;
  /** Position of the toast (default: 'top') */
  position?: "top" | "bottom";
}

// ─── Type Config (resolved from theme at render time) ────────────────

interface ToastTypeEntry {
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

function getTypeConfig(
  colors: import("@/utils/theme").ThemeColors,
): Record<ToastType, ToastTypeEntry> {
  return {
    success: {
      icon: "checkmark-circle",
      color: colors.accentGreen,
    },
    error: {
      icon: "close-circle",
      color: colors.accentDanger,
    },
    warning: {
      icon: "alert-circle",
      color: colors.accentGold,
    },
    info: {
      icon: "information-circle",
      color: colors.accentLightBlue,
    },
  };
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const TOAST_WIDTH = Math.min(SCREEN_WIDTH - 32, 420);
const TOAST_OFFSET_TOP = Platform.OS === "ios" ? 56 : 44;
const TOAST_OFFSET_BOTTOM = Platform.OS === "ios" ? 40 : 32;

// ─── Component ───────────────────────────────────────────────────────

export default function Toast({
  visible,
  type = "info",
  message,
  subtitle,
  duration = 3000,
  onDismiss,
  icon: customIcon,
  dismissOnPress = true,
  position = "top",
}: ToastProps) {
  const { colors, isDark } = useTheme();

  const translateY = useRef(
    new Animated.Value(position === "top" ? -120 : 120),
  ).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingOut = useRef(false);

  const TYPE_CONFIG = getTypeConfig(colors);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const iconName = customIcon || config.icon;
  const accentColor = config.color;

  // Derived theme-aware colors
  const toastBg = isDark ? colors.bgCard : colors.bgElevated;
  const toastBorder = `${accentColor}40`;
  const toastInnerGlow = `${accentColor}${isDark ? "0D" : "08"}`;
  const iconBg = `${accentColor}${isDark ? "26" : "1A"}`;
  const messageColor = colors.textPrimary;
  const subtitleColor = colors.textSecondary;
  const dismissIconColor = colors.textMuted;
  const dismissBtnBg = colors.bgSubtle;
  const progressTrackBg = isDark
    ? "rgba(255,255,255,0.04)"
    : "rgba(0,0,0,0.04)";

  // ── Clear timer on unmount ──
  useEffect(() => {
    return () => {
      if (dismissTimer.current) {
        clearTimeout(dismissTimer.current);
      }
    };
  }, []);

  // ── Entrance / Exit ──
  useEffect(() => {
    if (visible) {
      isAnimatingOut.current = false;

      // Reset values
      translateY.setValue(position === "top" ? -120 : 120);
      opacity.setValue(0);
      scaleX.setValue(0.95);
      progressAnim.setValue(1);

      // Entrance animation
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          friction: 9,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 250,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleX, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // Progress bar animation (visual countdown)
      if (duration > 0) {
        Animated.timing(progressAnim, {
          toValue: 0,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: false, // width animation can't use native driver
        }).start();

        // Auto-dismiss timer
        if (dismissTimer.current) {
          clearTimeout(dismissTimer.current);
        }
        dismissTimer.current = setTimeout(() => {
          animateOut();
        }, duration);
      }
    } else {
      // Immediate hide if not visible
      translateY.setValue(position === "top" ? -120 : 120);
      opacity.setValue(0);
    }
  }, [visible, duration, position, translateY, opacity, scaleX, progressAnim]);

  // ── Exit animation ──
  const animateOut = useCallback(() => {
    if (isAnimatingOut.current) return;
    isAnimatingOut.current = true;

    if (dismissTimer.current) {
      clearTimeout(dismissTimer.current);
      dismissTimer.current = null;
    }

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: position === "top" ? -120 : 120,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [translateY, opacity, position, onDismiss]);

  const handlePress = useCallback(() => {
    if (dismissOnPress) {
      animateOut();
    }
  }, [dismissOnPress, animateOut]);

  // ── Don't render when not visible ──
  if (!visible) return null;

  // Progress bar width interpolation
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        styles.wrapper,
        position === "top"
          ? { top: TOAST_OFFSET_TOP }
          : { bottom: TOAST_OFFSET_BOTTOM },
      ]}
      pointerEvents="box-none"
    >
      <Animated.View
        style={[
          styles.toastContainer,
          {
            backgroundColor: toastBg,
            borderColor: toastBorder,
            opacity,
            transform: [{ translateY }, { scaleX }],
            // Shadow adapts to theme
            shadowColor: isDark ? colors.shadowColor : accentColor,
            shadowOpacity: isDark ? 0.3 : 0.12,
          },
        ]}
      >
        <TouchableOpacity
          style={styles.touchable}
          activeOpacity={dismissOnPress ? 0.8 : 1}
          onPress={handlePress}
        >
          {/* Inner glow overlay */}
          <View
            style={[styles.innerGlow, { backgroundColor: toastInnerGlow }]}
          />

          {/* Icon */}
          <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
            <Ionicons name={iconName} size={22} color={accentColor} />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text
              style={[styles.message, { color: messageColor }]}
              numberOfLines={2}
            >
              {message}
            </Text>
            {subtitle ? (
              <Text
                style={[styles.subtitle, { color: subtitleColor }]}
                numberOfLines={1}
              >
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Dismiss X button */}
          {dismissOnPress && (
            <TouchableOpacity
              style={[styles.dismissButton, { backgroundColor: dismissBtnBg }]}
              onPress={handlePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color={dismissIconColor} />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Progress bar */}
        {duration > 0 && (
          <View
            style={[
              styles.progressBarContainer,
              { backgroundColor: progressTrackBg },
            ]}
          >
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: accentColor,
                  width: progressWidth,
                },
              ]}
            />
          </View>
        )}
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 9999,
    elevation: 9999,
  },
  toastContainer: {
    width: TOAST_WIDTH,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    // Shadow (base values — color/opacity set dynamically)
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 16,
    elevation: 12,
  },
  touchable: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
  },
  innerGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 14,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
    marginRight: 8,
  },
  message: {
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    lineHeight: 16,
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
