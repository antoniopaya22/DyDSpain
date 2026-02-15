/**
 * Toast - Non-blocking notification component
 *
 * Slides down from the top of the screen with smooth animations.
 * Auto-dismisses after a configurable duration.
 * Supports success, error, warning, and info variants.
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

// ─── Theme Config ────────────────────────────────────────────────────

const TYPE_CONFIG: Record<
  ToastType,
  {
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
    bgColor: string;
    borderColor: string;
    iconBg: string;
  }
> = {
  success: {
    icon: "checkmark-circle",
    color: "#22c55e",
    bgColor: "rgba(34,197,94,0.08)",
    borderColor: "rgba(34,197,94,0.25)",
    iconBg: "rgba(34,197,94,0.15)",
  },
  error: {
    icon: "close-circle",
    color: "#ef4444",
    bgColor: "rgba(239,68,68,0.08)",
    borderColor: "rgba(239,68,68,0.25)",
    iconBg: "rgba(239,68,68,0.15)",
  },
  warning: {
    icon: "alert-circle",
    color: "#fbbf24",
    bgColor: "rgba(251,191,36,0.08)",
    borderColor: "rgba(251,191,36,0.25)",
    iconBg: "rgba(251,191,36,0.15)",
  },
  info: {
    icon: "information-circle",
    color: "#60a5fa",
    bgColor: "rgba(96,165,250,0.08)",
    borderColor: "rgba(96,165,250,0.25)",
    iconBg: "rgba(96,165,250,0.15)",
  },
};

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
  const translateY = useRef(new Animated.Value(position === "top" ? -120 : 120)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(0.95)).current;
  const progressAnim = useRef(new Animated.Value(1)).current;
  const dismissTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isAnimatingOut = useRef(false);

  const config = TYPE_CONFIG[type] || TYPE_CONFIG.info;
  const iconName = customIcon || config.icon;

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
            backgroundColor: "#1e1e38",
            borderColor: config.borderColor,
            opacity,
            transform: [
              { translateY },
              { scaleX },
            ],
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
            style={[
              styles.innerGlow,
              { backgroundColor: config.bgColor },
            ]}
          />

          {/* Icon */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: config.iconBg },
            ]}
          >
            <Ionicons name={iconName} size={22} color={config.color} />
          </View>

          {/* Text content */}
          <View style={styles.textContainer}>
            <Text style={styles.message} numberOfLines={2}>
              {message}
            </Text>
            {subtitle ? (
              <Text style={styles.subtitle} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>

          {/* Dismiss X button */}
          {dismissOnPress && (
            <TouchableOpacity
              style={styles.dismissButton}
              onPress={handlePress}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name="close" size={16} color="#555577" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>

        {/* Progress bar */}
        {duration > 0 && (
          <View style={styles.progressBarContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                {
                  backgroundColor: config.color,
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
    // Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
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
    color: "#e4e4f0",
    fontSize: 14,
    fontWeight: "700",
    lineHeight: 19,
    letterSpacing: -0.1,
  },
  subtitle: {
    color: "#8c8cb3",
    fontSize: 12,
    fontWeight: "500",
    marginTop: 2,
    lineHeight: 16,
  },
  dismissButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
  },
  progressBarContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2.5,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
  },
});
