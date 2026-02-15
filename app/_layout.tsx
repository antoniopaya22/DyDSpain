import "../global.css";

import React, { useEffect, useRef } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";

// ─── Error Boundary ──────────────────────────────────────────────────

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorScreen error={this.state.error} />;
    }
    return this.props.children;
  }
}

// ─── Error Screen (with gradient background & polish) ────────────────

function ErrorScreen({ error }: { error: Error | null }) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, scaleAnim]);

  return (
    <View style={styles.errorContainer}>
      <LinearGradient
        colors={["#0d0d1a", "#141425", "#1a1a2e"]}
        style={StyleSheet.absoluteFill}
      />

      <Animated.View
        style={[
          styles.errorContent,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Error icon with glow ring */}
        <View style={styles.errorIconOuter}>
          <View style={styles.errorIconRing} />
          <View style={styles.errorIconBg}>
            <Ionicons name="warning-outline" size={36} color="#fbbf24" />
          </View>
        </View>

        <Text style={styles.errorTitle}>Error en la aplicación</Text>

        <View style={styles.errorMessageContainer}>
          <Text style={styles.errorMessage}>
            {error?.message || "Error desconocido"}
          </Text>
        </View>

        {error?.stack ? (
          <View style={styles.errorStackContainer}>
            <Text style={styles.errorStackLabel}>Detalles técnicos</Text>
            <View style={styles.errorStackBox}>
              <Text style={styles.errorStack}>
                {error.stack.slice(0, 400)}
                {error.stack.length > 400 ? "..." : ""}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Hint text */}
        <View style={styles.errorHintRow}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color="#555577"
          />
          <Text style={styles.errorHintText}>
            Intenta reiniciar la aplicación. Si el problema persiste, contacta
            con soporte.
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Root Layout ─────────────────────────────────────────────────────

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <LinearGradient
          colors={["#0d0d1a", "#1a1a2e"]}
          style={StyleSheet.absoluteFill}
        />
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: "transparent" },
            animation: "slide_from_right",
            animationDuration: 250,
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="campaigns" />
          <Stack.Screen
            name="settings"
            options={{
              animation: "slide_from_bottom",
              animationDuration: 300,
            }}
          />
          <Stack.Screen
            name="compendium"
            options={{
              animation: "slide_from_right",
              animationDuration: 250,
            }}
          />
        </Stack>
      </View>
    </ErrorBoundary>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0d0d1a",
  },

  // ── Error Screen ──
  errorContainer: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  errorContent: {
    alignItems: "center",
    maxWidth: 360,
    width: "100%",
  },
  errorIconOuter: {
    width: 88,
    height: 88,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  errorIconRing: {
    position: "absolute",
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.15)",
  },
  errorIconBg: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "rgba(251,191,36,0.08)",
    borderWidth: 1,
    borderColor: "rgba(251,191,36,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  errorTitle: {
    color: "#fbbf24",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 12,
    letterSpacing: -0.3,
    textAlign: "center",
  },
  errorMessageContainer: {
    backgroundColor: "rgba(239,68,68,0.08)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.15)",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: "100%",
    marginBottom: 16,
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },
  errorStackContainer: {
    width: "100%",
    marginBottom: 20,
  },
  errorStackLabel: {
    color: "#555577",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  errorStackBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    borderRadius: 10,
    padding: 12,
  },
  errorStack: {
    color: "#666699",
    fontSize: 11,
    fontFamily: "monospace",
    lineHeight: 16,
  },
  errorHintRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingHorizontal: 8,
    gap: 6,
    marginTop: 4,
  },
  errorHintText: {
    color: "#555577",
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
  },
});
