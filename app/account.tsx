/**
 * Account Screen
 *
 * Dedicated page for user profile, player code, mode switching and sign-out.
 * Accessible via the avatar button in the AppHeader.
 */

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  StyleSheet,
  Share,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  useAuthStore,
  selectPlayerCode,
  selectAppMode,
  selectIsPremium,
} from "@/stores/authStore";
import {
  ScreenContainer,
  PageHeader,
} from "@/components/ui";
import { useTheme, useEntranceAnimation } from "@/hooks";

// ─── Component ───────────────────────────────────────────────────────

export default function AccountScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { profile, signOut, user } = useAuthStore();
  const playerCode = useAuthStore(selectPlayerCode);
  const appMode = useAuthStore(selectAppMode);
  const isPremium = useAuthStore(selectIsPremium);

  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { opacity: contentFade } = useEntranceAnimation({ delay: 120 });

  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // ── Not logged in ──
  if (!user || !profile) {
    return (
      <ScreenContainer>
        <PageHeader title="Cuenta" onBack={() => router.back()} />
        <View style={styles.centeredContainer}>
          <View
            style={[
              styles.bigAvatar,
              { backgroundColor: `${colors.accentGold}15` },
            ]}
          >
            <Ionicons
              name="person-outline"
              size={48}
              color={colors.accentGold}
            />
          </View>
          <Text style={[styles.notLoggedTitle, { color: colors.textPrimary }]}>
            No has iniciado sesión
          </Text>
          <Text style={[styles.notLoggedDesc, { color: colors.textMuted }]}>
            Inicia sesión para sincronizar datos y usar el Modo Master
          </Text>
          <TouchableOpacity
            style={[
              styles.signInBtn,
              { backgroundColor: `${colors.accentGold}15` },
            ]}
            onPress={() => router.push("/login" as any)}
          >
            <Ionicons
              name="log-in-outline"
              size={20}
              color={colors.accentGold}
            />
            <Text style={[styles.signInText, { color: colors.accentGold }]}>
              Iniciar sesión
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenContainer>
    );
  }

  // ── Helpers ──
  const avatarUrl = profile.avatar_url ?? null;
  const displayName = profile.nombre || user.email?.split("@")[0] || "Usuario";
  const initials = displayName
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleCopyCode = async () => {
    if (!playerCode) return;
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(playerCode);
    }
    setCopied(true);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopied(false), 2000);
  };

  const handleShareCode = async () => {
    if (!playerCode) return;
    try {
      await Share.share({
        message: `Mi código de jugador en D&D Español: ${playerCode}`,
      });
    } catch {
      // User cancelled
    }
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login" as any);
  };

  return (
    <ScreenContainer>
      <PageHeader title="Cuenta" onBack={() => router.back()} />

      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Profile Card ── */}
          <View
            style={[
              styles.profileCard,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            {/* Avatar */}
            <View style={styles.profileAvatarRow}>
              {avatarUrl ? (
                <Image
                  source={{ uri: avatarUrl }}
                  style={styles.profileAvatar}
                />
              ) : (
                <View
                  style={[
                    styles.profileAvatar,
                    { backgroundColor: `${colors.accentGold}20` },
                  ]}
                >
                  <Text
                    style={[
                      styles.profileInitials,
                      { color: colors.accentGold },
                    ]}
                  >
                    {initials}
                  </Text>
                </View>
              )}

              {/* Premium badge */}
              {isPremium && (
                <View
                  style={[
                    styles.premiumBadge,
                    { backgroundColor: colors.accentGold },
                  ]}
                >
                  <Ionicons name="star" size={10} color="#FFF" />
                  <Text style={styles.premiumBadgeText}>Premium</Text>
                </View>
              )}
            </View>

            {/* Name & email */}
            <Text style={[styles.profileName, { color: colors.textPrimary }]}>
              {displayName}
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textMuted }]}>
              {user.email}
            </Text>

            {/* Current mode badge */}
            <View
              style={[
                styles.modeBadge,
                {
                  backgroundColor:
                    appMode === "master"
                      ? `${colors.accentGold}15`
                      : `${colors.accentRed}15`,
                },
              ]}
            >
              <Ionicons
                name={appMode === "master" ? "trophy" : "shield"}
                size={14}
                color={
                  appMode === "master" ? colors.accentGold : colors.accentRed
                }
              />
              <Text
                style={[
                  styles.modeBadgeText,
                  {
                    color:
                      appMode === "master"
                        ? colors.accentGold
                        : colors.accentRed,
                  },
                ]}
              >
                Modo {appMode === "master" ? "Master" : "Jugador"}
              </Text>
            </View>
          </View>

          {/* ── Player Code ── */}
          {playerCode ? (
            <View
              style={[
                styles.codeCard,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderSubtle,
                },
              ]}
            >
              <Text style={[styles.codeLabel, { color: colors.textMuted }]}>
                Tu código de jugador
              </Text>
              <View style={styles.codeRow}>
                <Text
                  style={[styles.codeValue, { color: colors.accentGold }]}
                >
                  {playerCode}
                </Text>
                <View style={styles.codeActions}>
                  <TouchableOpacity
                    style={[
                      styles.codeBtn,
                      { backgroundColor: `${colors.accentGold}15` },
                    ]}
                    onPress={handleCopyCode}
                  >
                    <Ionicons
                      name={copied ? "checkmark" : "copy-outline"}
                      size={16}
                      color={colors.accentGold}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.codeBtn,
                      { backgroundColor: `${colors.accentBlue}15` },
                    ]}
                    onPress={handleShareCode}
                  >
                    <Ionicons
                      name="share-outline"
                      size={16}
                      color={colors.accentBlue}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.codeHint, { color: colors.textMuted }]}>
                Comparte este código con tu Master para unirte a su campaña
              </Text>
            </View>
          ) : null}

          {/* ── Actions ── */}
          <View
            style={[
              styles.actionsCard,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            {/* Change Mode */}
            <TouchableOpacity
              style={[
                styles.actionRow,
                { borderBottomColor: colors.borderSeparator },
              ]}
              onPress={() => router.push("/mode-select" as any)}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: `${colors.accentGold}15` },
                  ]}
                >
                  <Ionicons
                    name="swap-horizontal-outline"
                    size={20}
                    color={colors.accentGold}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Cambiar modo
                  </Text>
                  <Text
                    style={[
                      styles.actionSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Alterna entre Jugador y Master
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.chevronColor}
              />
            </TouchableOpacity>

            {/* Settings shortcut */}
            <TouchableOpacity
              style={styles.actionRow}
              onPress={() => router.push("/settings")}
            >
              <View style={styles.actionLeft}>
                <View
                  style={[
                    styles.actionIcon,
                    { backgroundColor: `${colors.accentPurple}15` },
                  ]}
                >
                  <Ionicons
                    name="settings-outline"
                    size={20}
                    color={colors.accentPurple}
                  />
                </View>
                <View>
                  <Text
                    style={[
                      styles.actionTitle,
                      { color: colors.textPrimary },
                    ]}
                  >
                    Ajustes
                  </Text>
                  <Text
                    style={[
                      styles.actionSubtitle,
                      { color: colors.textMuted },
                    ]}
                  >
                    Tema, reglas, datos y más
                  </Text>
                </View>
              </View>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={colors.chevronColor}
              />
            </TouchableOpacity>
          </View>

          {/* ── Sign Out ── */}
          <TouchableOpacity
            style={[
              styles.signOutCard,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderSubtle,
              },
            ]}
            onPress={handleSignOut}
          >
            <Ionicons
              name="log-out-outline"
              size={20}
              color={colors.accentDanger}
            />
            <Text
              style={[styles.signOutText, { color: colors.accentDanger }]}
            >
              Cerrar sesión
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </ScreenContainer>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    gap: 12,
  },
  bigAvatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  notLoggedTitle: {
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
  },
  notLoggedDesc: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginTop: 8,
  },
  signInText: {
    fontSize: 15,
    fontWeight: "700",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    gap: 16,
  },

  // ── Profile Card ──
  profileCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 24,
    alignItems: "center",
  },
  profileAvatarRow: {
    position: "relative",
    marginBottom: 12,
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  profileInitials: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  premiumBadge: {
    position: "absolute",
    bottom: -4,
    right: -8,
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
  profileName: {
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.3,
    textAlign: "center",
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
    textAlign: "center",
  },
  modeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
  },
  modeBadgeText: {
    fontSize: 12,
    fontWeight: "700",
  },

  // ── Code Card ──
  codeCard: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  codeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  codeValue: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 6,
    fontFamily: "monospace",
  },
  codeActions: {
    flexDirection: "row",
    gap: 8,
  },
  codeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  codeHint: {
    fontSize: 11,
    marginTop: 8,
    lineHeight: 15,
  },

  // ── Actions Card ──
  actionsCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
  },
  actionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  actionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  actionSubtitle: {
    fontSize: 12,
    marginTop: 1,
  },

  // ── Sign Out ──
  signOutCard: {
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
