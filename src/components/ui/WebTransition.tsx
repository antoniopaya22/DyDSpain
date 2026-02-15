/**
 * WebTransition - Animated overlay shown before opening external web links
 *
 * Displays a beautiful D&D-themed transition screen with:
 * - Animated globe/link icon with pulse effect
 * - "Opening in browser..." text
 * - Progress indicator animation
 * - Auto-opens the URL after a brief delay then dismisses
 *
 * This gives the user visual feedback instead of an abrupt browser switch.
 */

import { useEffect, useRef, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Easing,
  StyleSheet,
  Linking,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// ─── Types ───────────────────────────────────────────────────────────

export interface WebTransitionProps {
  /** Whether the transition overlay is visible */
  visible: boolean;
  /** The URL to open */
  url: string;
  /** Display label for the URL (optional, shows a friendly name) */
  label?: string;
  /** Delay in ms before opening the URL (default: 1200) */
  delay?: number;
  /** Callback when the transition is complete and overlay should close */
  onDismiss: () => void;
  /** Callback if the URL fails to open */
  onError?: (error: Error) => void;
  /** Custom icon (default: 'globe-outline') */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Accent color for the transition (default: '#60a5fa') */
  accentColor?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Component ───────────────────────────────────────────────────────

export default function WebTransition({
  visible,
  url,
  label,
  delay = 1200,
  onDismiss,
  onError,
  icon = "globe-outline",
  accentColor = "#60a5fa",
}: WebTransitionProps) {
  // Animation refs
  const backdropAnim = useRef(new Animated.Value(0)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentScale = useRef(new Animated.Value(0.8)).current;
  const iconRotate = useRef(new Animated.Value(0)).current;
  const iconPulse = useRef(new Animated.Value(1)).current;
  const ringScale1 = useRef(new Animated.Value(0.6)).current;
  const ringOpacity1 = useRef(new Animated.Value(0.6)).current;
  const ringScale2 = useRef(new Animated.Value(0.6)).current;
  const ringOpacity2 = useRef(new Animated.Value(0.4)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const textFade = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;

  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasOpened = useRef(false);

  // ── Cleanup ──
  useEffect(() => {
    return () => {
      if (openTimer.current) {
        clearTimeout(openTimer.current);
      }
    };
  }, []);

  // ── Main animation logic ──
  useEffect(() => {
    if (visible) {
      hasOpened.current = false;

      // Reset all values
      backdropAnim.setValue(0);
      contentFade.setValue(0);
      contentScale.setValue(0.8);
      iconRotate.setValue(0);
      iconPulse.setValue(1);
      ringScale1.setValue(0.6);
      ringOpacity1.setValue(0.6);
      ringScale2.setValue(0.6);
      ringOpacity2.setValue(0.4);
      progressAnim.setValue(0);
      textFade.setValue(0);
      dotAnim.setValue(0);

      // 1. Backdrop fade in
      Animated.timing(backdropAnim, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // 2. Content entrance
      Animated.parallel([
        Animated.spring(contentScale, {
          toValue: 1,
          friction: 7,
          tension: 100,
          useNativeDriver: true,
        }),
        Animated.timing(contentFade, {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();

      // 3. Icon rotation (subtle continuous spin)
      const rotation = Animated.loop(
        Animated.timing(iconRotate, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      );
      rotation.start();

      // 4. Icon pulse
      const pulse = Animated.loop(
        Animated.sequence([
          Animated.timing(iconPulse, {
            toValue: 1.1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(iconPulse, {
            toValue: 1,
            duration: 800,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      );
      pulse.start();

      // 5. Expanding rings animation
      const ring1 = Animated.loop(
        Animated.parallel([
          Animated.timing(ringScale1, {
            toValue: 1.8,
            duration: 1800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(ringOpacity1, {
            toValue: 0,
            duration: 1800,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
        ])
      );
      ring1.start();

      // Delayed second ring for stagger effect
      setTimeout(() => {
        const ring2 = Animated.loop(
          Animated.parallel([
            Animated.timing(ringScale2, {
              toValue: 1.8,
              duration: 1800,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
            Animated.timing(ringOpacity2, {
              toValue: 0,
              duration: 1800,
              easing: Easing.out(Easing.cubic),
              useNativeDriver: true,
            }),
          ])
        );
        ring2.start();
      }, 600);

      // 6. Text fade in
      Animated.timing(textFade, {
        toValue: 1,
        duration: 400,
        delay: 200,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();

      // 7. Animated dots
      const dots = Animated.loop(
        Animated.timing(dotAnim, {
          toValue: 3,
          duration: 1200,
          easing: Easing.linear,
          useNativeDriver: false,
        })
      );
      dots.start();

      // 8. Progress bar
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: delay,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();

      // 9. Open URL after delay
      openTimer.current = setTimeout(() => {
        if (!hasOpened.current) {
          hasOpened.current = true;
          openUrl();
        }
      }, delay);
    } else {
      // Cleanup animations
      iconRotate.stopAnimation();
      iconPulse.stopAnimation();
      ringScale1.stopAnimation();
      ringOpacity1.stopAnimation();
      ringScale2.stopAnimation();
      ringOpacity2.stopAnimation();
      dotAnim.stopAnimation();

      if (openTimer.current) {
        clearTimeout(openTimer.current);
        openTimer.current = null;
      }
    }
  }, [visible]);

  // ── Open URL and animate out ──
  const openUrl = useCallback(async () => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        throw new Error("No se puede abrir esta URL");
      }
    } catch (error) {
      onError?.(error instanceof Error ? error : new Error("Error al abrir el enlace"));
    }

    // Animate out after opening
    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 1.1,
        duration: 300,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [url, onDismiss, onError, backdropAnim, contentFade, contentScale]);

  // ── Cancel and close ──
  const handleCancel = useCallback(() => {
    hasOpened.current = true; // Prevent URL from opening

    if (openTimer.current) {
      clearTimeout(openTimer.current);
      openTimer.current = null;
    }

    Animated.parallel([
      Animated.timing(backdropAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentFade, {
        toValue: 0,
        duration: 200,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(contentScale, {
        toValue: 0.85,
        duration: 250,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      onDismiss();
    });
  }, [onDismiss, backdropAnim, contentFade, contentScale]);

  // ── Render ──
  if (!visible) return null;

  const spin = iconRotate.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  // Extract a display hostname from the URL
  let displayUrl = label || url;
  try {
    if (!label) {
      const parsed = new URL(url);
      displayUrl = parsed.hostname.replace(/^www\./, "");
    }
  } catch {
    displayUrl = label || url;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={handleCancel}
    >
      {/* Backdrop */}
      <Animated.View style={[styles.backdrop, { opacity: backdropAnim }]}>
        <LinearGradient
          colors={["rgba(13,13,26,0.95)", "rgba(20,20,37,0.97)", "rgba(26,26,46,0.95)"]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Content */}
      <View style={styles.container} pointerEvents="box-none">
        <Animated.View
          style={[
            styles.content,
            {
              opacity: contentFade,
              transform: [{ scale: contentScale }],
            },
          ]}
        >
          {/* Animated rings behind icon */}
          <View style={styles.iconArea}>
            <Animated.View
              style={[
                styles.ring,
                {
                  borderColor: accentColor,
                  transform: [{ scale: ringScale1 }],
                  opacity: ringOpacity1,
                },
              ]}
            />
            <Animated.View
              style={[
                styles.ring,
                {
                  borderColor: accentColor,
                  transform: [{ scale: ringScale2 }],
                  opacity: ringOpacity2,
                },
              ]}
            />

            {/* Icon background glow */}
            <View
              style={[
                styles.iconGlow,
                {
                  backgroundColor: accentColor,
                  shadowColor: accentColor,
                },
              ]}
            />

            {/* Icon container */}
            <Animated.View
              style={[
                styles.iconBg,
                {
                  borderColor: `${accentColor}40`,
                  transform: [
                    { rotate: spin },
                    { scale: iconPulse },
                  ],
                },
              ]}
            >
              <Ionicons name={icon} size={38} color={accentColor} />
            </Animated.View>
          </View>

          {/* Text */}
          <Animated.View style={[styles.textArea, { opacity: textFade }]}>
            <Text style={styles.title}>Abriendo enlace externo</Text>

            <View style={styles.urlContainer}>
              <Ionicons
                name="link-outline"
                size={14}
                color="#555577"
                style={{ marginRight: 6, marginTop: 1 }}
              />
              <Text style={styles.urlText} numberOfLines={1}>
                {displayUrl}
              </Text>
            </View>

            <Text style={[styles.subtitle, { color: accentColor }]}>
              Redirigiendo al navegador...
            </Text>
          </Animated.View>

          {/* Progress bar */}
          <View style={styles.progressContainer}>
            <View style={styles.progressTrack}>
              <Animated.View
                style={[
                  styles.progressBar,
                  {
                    backgroundColor: accentColor,
                    width: progressWidth,
                    shadowColor: accentColor,
                  },
                ]}
              />
            </View>
          </View>

          {/* Cancel button */}
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancel}
            activeOpacity={0.7}
          >
            <Ionicons name="close-circle-outline" size={16} color="#555577" />
            <Text style={styles.cancelText}>Cancelar</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Bottom decoration */}
        <Animated.View style={[styles.bottomDeco, { opacity: textFade }]}>
          <View style={styles.decoLine} />
          <Ionicons name="shield-half-outline" size={14} color="#2a2a44" />
          <View style={styles.decoLine} />
        </Animated.View>
      </View>
    </Modal>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  content: {
    alignItems: "center",
    maxWidth: 320,
    width: "100%",
  },

  // ── Icon area ──
  iconArea: {
    width: 120,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 32,
  },
  ring: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1.5,
  },
  iconGlow: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    opacity: 0.12,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(96,165,250,0.08)",
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Text ──
  textArea: {
    alignItems: "center",
    marginBottom: 28,
  },
  title: {
    color: "#e4e4f0",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.3,
    marginBottom: 12,
    textAlign: "center",
  },
  urlContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginBottom: 16,
    maxWidth: SCREEN_WIDTH - 100,
  },
  urlText: {
    color: "#8c8cb3",
    fontSize: 13,
    fontWeight: "500",
    flex: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 0.2,
  },

  // ── Progress ──
  progressContainer: {
    width: "80%",
    marginBottom: 24,
  },
  progressTrack: {
    height: 4,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 2,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 4,
  },

  // ── Cancel ──
  cancelButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  cancelText: {
    color: "#555577",
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  // ── Bottom decoration ──
  bottomDeco: {
    position: "absolute",
    bottom: 40,
    flexDirection: "row",
    alignItems: "center",
  },
  decoLine: {
    width: 40,
    height: 1,
    backgroundColor: "#2a2a44",
    marginHorizontal: 10,
  },
});
