/**
 * AccountSection — User profile, player code, mode switching, sign-out.
 * Shown in the Settings screen (HU-10.5, HU-14).
 */

import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore, selectPlayerCode, selectAppMode } from "@/stores/authStore";
import { useTheme } from "@/hooks";

export function AccountSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile, signOut, user } = useAuthStore();
  const playerCode = useAuthStore(selectPlayerCode);
  const appMode = useAuthStore(selectAppMode);
  const [copied, setCopied] = useState(false);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  if (!user || !profile) {
    return (
      <View
        style={[
          styles.sectionContent,
          { borderTopColor: colors.borderSeparator },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.signInBtn,
            { backgroundColor: `${colors.accentGold}15` },
          ]}
          onPress={() => router.push("/login" as any)}
        >
          <Ionicons name="log-in-outline" size={20} color={colors.accentGold} />
          <Text style={[styles.signInText, { color: colors.accentGold }]}>
            Iniciar sesión
          </Text>
        </TouchableOpacity>
        <Text style={[styles.signInHint, { color: colors.textMuted }]}>
          Inicia sesión para sincronizar datos y usar el Modo Master
        </Text>
      </View>
    );
  }

  const handleCopyCode = async () => {
    if (!playerCode) return;
    if (Platform.OS === "web") {
      await navigator.clipboard.writeText(playerCode);
    } else {
      // Clipboard API: expo-clipboard doesn't need import workaround
      // For now, use Share
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
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      {/* User info */}
      <View style={styles.userRow}>
        <View
          style={[
            styles.avatar,
            { backgroundColor: `${colors.accentBlue}20` },
          ]}
        >
          <Ionicons name="person" size={24} color={colors.accentBlue} />
        </View>
        <View style={styles.userInfo}>
          <Text style={[styles.userName, { color: colors.textPrimary }]}>
            {profile.nombre || "Usuario"}
          </Text>
          <Text style={[styles.userEmail, { color: colors.textMuted }]}>
            {user.email}
          </Text>
        </View>
      </View>

      {/* Player Code */}
      {playerCode && (
        <View
          style={[
            styles.codeCard,
            { backgroundColor: colors.bgSubtle, borderColor: colors.borderSubtle },
          ]}
        >
          <Text style={[styles.codeLabel, { color: colors.textMuted }]}>
            Tu código de jugador
          </Text>
          <View style={styles.codeRow}>
            <Text style={[styles.codeValue, { color: colors.accentGold }]}>
              {playerCode}
            </Text>
            <View style={styles.codeActions}>
              <TouchableOpacity
                style={[styles.codeBtn, { backgroundColor: `${colors.accentGold}15` }]}
                onPress={handleCopyCode}
              >
                <Ionicons
                  name={copied ? "checkmark" : "copy-outline"}
                  size={16}
                  color={colors.accentGold}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.codeBtn, { backgroundColor: `${colors.accentBlue}15` }]}
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
      )}

      {/* Mode Switch */}
      <TouchableOpacity
        style={[styles.row, { borderBottomColor: colors.borderSeparator }]}
        onPress={() => router.push("/mode-select" as any)}
      >
        <View style={styles.rowLeft}>
          <Ionicons
            name="swap-horizontal-outline"
            size={20}
            color={colors.accentGold}
          />
          <View>
            <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>
              Cambiar modo
            </Text>
            <Text style={[styles.rowValue, { color: colors.textMuted }]}>
              Modo actual: {appMode === "master" ? "Master" : "Jugador"}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={16} color={colors.chevronColor} />
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={18} color={colors.accentDanger} />
        <Text style={[styles.signOutText, { color: colors.accentDanger }]}>
          Cerrar sesión
        </Text>
      </TouchableOpacity>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionContent: {
    borderTopWidth: 1,
    paddingTop: 14,
    gap: 14,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "700",
  },
  userEmail: {
    fontSize: 12,
    marginTop: 2,
  },
  codeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
  },
  codeLabel: {
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 6,
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  rowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowValue: {
    fontSize: 12,
    marginTop: 1,
  },
  signOutBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
  },
  signOutText: {
    fontSize: 14,
    fontWeight: "600",
  },
  signInBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  signInText: {
    fontSize: 15,
    fontWeight: "700",
  },
  signInHint: {
    fontSize: 12,
    textAlign: "center",
    lineHeight: 17,
  },
});
