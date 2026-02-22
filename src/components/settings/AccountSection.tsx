/**
 * AccountSection — User profile, character codes for sharing, mode switching, sign-out.
 * Shown in the Settings screen (HU-10.5, HU-14).
 */

import { useEffect, useRef, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Share,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Clipboard from "expo-clipboard";
import { useAuthStore, selectAppMode } from "@/stores/authStore";
import { fetchUserCharacters } from "@/services/supabaseService";
import { useTheme } from "@/hooks";
import type { PersonajeRow } from "@/types/supabase";
import type { Character } from "@/types/character";

export function AccountSection() {
  const { colors } = useTheme();
  const router = useRouter();
  const { profile, signOut, user } = useAuthStore();
  const appMode = useAuthStore(selectAppMode);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [characters, setCharacters] = useState<PersonajeRow[]>([]);
  const [loadingChars, setLoadingChars] = useState(false);

  // Cleanup copy timer on unmount
  useEffect(() => {
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // Fetch synced characters from Supabase
  const loadCharacters = useCallback(async () => {
    if (!user) return;
    setLoadingChars(true);
    try {
      const chars = await fetchUserCharacters(user.id);
      setCharacters(chars);
    } catch (err) {
      console.error("[AccountSection] Error fetching characters:", err);
    } finally {
      setLoadingChars(false);
    }
  }, [user]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

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

  const handleCopyCode = async (code: string, charId: string) => {
    await Clipboard.setStringAsync(code);
    setCopiedId(charId);
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareCode = async (code: string, charName: string) => {
    try {
      await Share.share({
        message: `Código de mi personaje "${charName}" en DyMEs: ${code}`,
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

      {/* Character Codes — for sharing with Master */}
      <View
        style={[
          styles.codeCard,
          { backgroundColor: colors.bgSubtle, borderColor: colors.borderSubtle },
        ]}
      >
        <Text style={[styles.codeLabel, { color: colors.textMuted }]}>
          Códigos de personaje
        </Text>
        <Text style={[styles.codeHint, { color: colors.textMuted }]}>
          Comparte el código de un personaje con tu Master para unirte a su campaña
        </Text>

        {loadingChars && (
          <ActivityIndicator
            size="small"
            color={colors.accentGold}
            style={{ marginTop: 10 }}
          />
        )}

        {!loadingChars && characters.length === 0 && (
          <Text
            style={[
              styles.codeHint,
              { color: colors.textMuted, marginTop: 8, fontStyle: "italic" },
            ]}
          >
            Aún no hay personajes sincronizados. Abre una hoja de personaje para
            sincronizar.
          </Text>
        )}

        {characters.map((char) => {
          const datos = char.datos as unknown as Character | undefined;
          const charName = datos?.nombre ?? "Sin nombre";
          const charClass = datos?.clase ?? "";
          const charLevel = datos?.nivel ?? 0;
          const code = char.codigo_personaje;
          const isCopied = copiedId === char.id;

          return (
            <View
              key={char.id}
              style={[
                styles.charCodeRow,
                { borderTopColor: colors.borderSeparator },
              ]}
            >
              <View style={styles.charCodeInfo}>
                <Text
                  style={[styles.charCodeName, { color: colors.textPrimary }]}
                  numberOfLines={1}
                >
                  {charName}
                </Text>
                {charClass ? (
                  <Text
                    style={[
                      styles.charCodeClass,
                      { color: colors.textMuted },
                    ]}
                  >
                    {charClass} Nv.{charLevel}
                  </Text>
                ) : null}
              </View>
              <Text style={[styles.charCodeValue, { color: colors.accentGold }]}>
                {code}
              </Text>
              <View style={styles.codeActions}>
                <TouchableOpacity
                  style={[
                    styles.codeBtn,
                    { backgroundColor: `${colors.accentGold}15` },
                  ]}
                  onPress={() => handleCopyCode(code, char.id)}
                >
                  <Ionicons
                    name={isCopied ? "checkmark" : "copy-outline"}
                    size={16}
                    color={colors.accentGold}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.codeBtn,
                    { backgroundColor: `${colors.accentBlue}15` },
                  ]}
                  onPress={() => handleShareCode(code, charName)}
                >
                  <Ionicons
                    name="share-outline"
                    size={16}
                    color={colors.accentBlue}
                  />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

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
  charCodeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    gap: 8,
  },
  charCodeInfo: {
    flex: 1,
    minWidth: 0,
  },
  charCodeName: {
    fontSize: 14,
    fontWeight: "700",
  },
  charCodeClass: {
    fontSize: 11,
    marginTop: 1,
  },
  charCodeValue: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: 3,
    fontFamily: "monospace",
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
