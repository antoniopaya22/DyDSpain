/**
 * Mode Selection Screen (HU-10.1)
 *
 * Shown after first login or accessible from Settings.
 * Lets the user choose between "Modo Jugador" and "Modo Master".
 */

import { useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore, selectIsPremium } from "@/stores/authStore";
import { useTheme } from "@/hooks";
import { AppHeader } from "@/components/ui";
import type { AppMode } from "@/types/master";

// ─── Component ───────────────────────────────────────────────────────

export default function ModeSelectionScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { setAppMode } = useAuthStore();
  const isPremium = useAuthStore(selectIsPremium);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const cardLeftAnim = useRef(new Animated.Value(-40)).current;
  const cardRightAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(cardLeftAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(cardRightAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, cardLeftAnim, cardRightAnim]);

  const handleSelectMode = async (mode: AppMode) => {
    await setAppMode(mode);
    if (mode === "master") {
      router.push("/master" as any);
    } else {
      router.push("/");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <LinearGradient
        colors={[colors.gradientMain[0], colors.gradientMain[3]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Shared header */}
      <AppHeader />

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        {/* Header */}
        <Text style={[styles.question, { color: colors.textPrimary }]}>
          ¿Cómo quieres usar la app?
        </Text>
        <Text style={[styles.hint, { color: colors.textMuted }]}>
          Puedes cambiar de modo en cualquier momento desde Ajustes
        </Text>

        {/* Mode Cards */}
        <View style={styles.cardsRow}>
          {/* Player Mode */}
          <Animated.View
            style={[
              styles.cardWrapper,
              { transform: [{ translateX: cardLeftAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderSubtle,
                },
              ]}
              onPress={() => handleSelectMode("jugador")}
              activeOpacity={0.85}
            >
              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: `${colors.accentRed}20` },
                ]}
              >
                <Ionicons
                  name="shield-outline"
                  size={36}
                  color={colors.accentRed}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Jugador
              </Text>
              <Text
                style={[styles.cardDesc, { color: colors.textSecondary }]}
              >
                Crea y gestiona tus personajes de D&D
              </Text>
            </TouchableOpacity>
          </Animated.View>

          {/* Master Mode */}
          <Animated.View
            style={[
              styles.cardWrapper,
              { transform: [{ translateX: cardRightAnim }] },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.card,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: isPremium
                    ? colors.accentGold
                    : colors.borderSubtle,
                },
              ]}
              onPress={() => handleSelectMode("master")}
              activeOpacity={0.85}
            >
              {/* Premium badge */}
              <View
                style={[
                  styles.premiumBadge,
                  {
                    backgroundColor: isPremium
                      ? colors.accentGold
                      : colors.textMuted,
                  },
                ]}
              >
                <Ionicons name="star" size={10} color="#FFF" />
                <Text style={styles.premiumBadgeText}>
                  Premium
                </Text>
              </View>

              <View
                style={[
                  styles.cardIcon,
                  { backgroundColor: `${colors.accentGold}20` },
                ]}
              >
                <Ionicons
                  name="trophy-outline"
                  size={36}
                  color={colors.accentGold}
                />
              </View>
              <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                Master
              </Text>
              <Text
                style={[styles.cardDesc, { color: colors.textSecondary }]}
              >
                Dirige campañas y monitoriza jugadores en tiempo real
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    maxWidth: 400,
    width: "100%",
    alignSelf: "center",
    paddingHorizontal: 24,
  },
  question: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  hint: {
    fontSize: 13,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 18,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 16,
    width: "100%",
  },
  cardWrapper: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1.5,
    padding: 20,
    alignItems: "center",
    minHeight: 200,
    justifyContent: "center",
  },
  cardIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
    letterSpacing: -0.2,
  },
  cardDesc: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
    minHeight: 34,
  },
  premiumBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  premiumBadgeText: {
    color: "#FFF",
    fontSize: 9,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});
