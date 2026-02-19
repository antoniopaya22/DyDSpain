/**
 * Master Home Screen (HU-10.3)
 *
 * Lists all campaigns created by the master.
 * Allows creating, editing, and deleting campaigns.
 */

import { useCallback, useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/stores/authStore";
import { useMasterStore } from "@/stores/masterStore";
import { useTheme, useDialog, useToast } from "@/hooks";
import { ConfirmDialog, Toast, AppHeader } from "@/components/ui";
import type { MasterCampaign } from "@/types/master";

// ─── Component ───────────────────────────────────────────────────────

export default function MasterHomeScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const { user } = useAuthStore();
  const {
    campaigns,
    loadingCampaigns,
    loadCampaigns,
    deleteCampaign,
  } = useMasterStore();
  const { dialogProps, showDestructive } = useDialog();
  const { toastProps, showSuccess } = useToast();

  // ── Create campaign modal state ──
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useFocusEffect(
    useCallback(() => {
      if (user) loadCampaigns(user.id);
    }, [user, loadCampaigns]),
  );

  const handleCreateCampaign = async () => {
    if (!newName.trim() || !user) return;
    setCreating(true);
    try {
      const campaign = await useMasterStore
        .getState()
        .createCampaign(user.id, {
          nombre: newName,
          descripcion: newDesc || undefined,
        });
      setShowCreate(false);
      setNewName("");
      setNewDesc("");
      showSuccess("Campaña creada", `"${campaign.nombre}" lista para jugar`);
    } catch (_err) {
      // Error handled in store
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteCampaign = (campaign: MasterCampaign) => {
    showDestructive(
      "Eliminar campaña",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"? Los jugadores serán desvinculados, pero sus personajes no se eliminarán.`,
      () => {
        deleteCampaign(campaign.id);
        showSuccess(
          "Campaña eliminada",
          `"${campaign.nombre}" ha sido eliminada`,
        );
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" },
    );
  };

  const handlePressCampaign = (campaign: MasterCampaign) => {
    useMasterStore.getState().setActiveCampaign(campaign.id);
    router.push(`/master/${campaign.id}` as any);
  };

  // ── Render campaign card ──
  const renderCampaignCard = ({
    item,
    index,
  }: {
    item: MasterCampaign;
    index: number;
  }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.campaignCard,
        {
          backgroundColor: colors.bgCard,
          borderColor: colors.borderSubtle,
        },
      ]}
      onPress={() => handlePressCampaign(item)}
      onLongPress={() => handleDeleteCampaign(item)}
      activeOpacity={0.85}
    >
      <View style={styles.campaignCardHeader}>
        <View
          style={[
            styles.campaignIcon,
            { backgroundColor: `${colors.accentGold}20` },
          ]}
        >
          <Ionicons name="map-outline" size={24} color={colors.accentGold} />
        </View>
        <View style={styles.campaignInfo}>
          <Text
            style={[styles.campaignName, { color: colors.textPrimary }]}
            numberOfLines={1}
          >
            {item.nombre}
          </Text>
          {item.descripcion ? (
            <Text
              style={[styles.campaignDesc, { color: colors.textSecondary }]}
              numberOfLines={2}
            >
              {item.descripcion}
            </Text>
          ) : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.chevronColor} />
      </View>

      <View style={[styles.campaignMeta, { borderTopColor: colors.borderSeparator }]}>
        <View style={styles.metaItem}>
          <Ionicons name="calendar-outline" size={12} color={colors.textMuted} />
          <Text style={[styles.metaText, { color: colors.textMuted }]}>
            {new Date(item.actualizado_en).toLocaleDateString("es-ES")}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  // ── Empty state ──
  const renderEmpty = () => {
    if (loadingCampaigns) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.accentGold} />
        </View>
      );
    }

    return (
      <View style={styles.emptyContainer}>
        <Ionicons
          name="map-outline"
          size={64}
          color={colors.textMuted}
          style={{ opacity: 0.4 }}
        />
        <Text style={[styles.emptyTitle, { color: colors.textSecondary }]}>
          Sin campañas todavía
        </Text>
        <Text style={[styles.emptyDesc, { color: colors.textMuted }]}>
          Crea tu primera campaña para empezar a dirigir partidas
        </Text>
      </View>
    );
  };

  return (
    <Animated.View
      style={[
        styles.container,
        { backgroundColor: colors.bgPrimary, opacity: fadeAnim },
      ]}
    >
      <LinearGradient
        colors={[colors.gradientMain[0], colors.gradientMain[3]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Shared header */}
      <AppHeader showBack />

      {/* Campaign List */}
      <FlatList
        data={campaigns}
        renderItem={renderCampaignCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmpty}
        showsVerticalScrollIndicator={false}
      />

      {/* FAB — Create Campaign */}
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.accentGold }]}
        onPress={() => setShowCreate(true)}
        activeOpacity={0.85}
      >
        <Ionicons name="add" size={28} color="#FFF" />
      </TouchableOpacity>

      {/* Create Campaign Inline Modal */}
      {showCreate ? (
        <View style={styles.modalOverlay}>
          <TouchableOpacity
            style={styles.modalBackdrop}
            onPress={() => setShowCreate(false)}
            activeOpacity={1}
          />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: colors.bgElevated,
                borderColor: colors.borderSubtle,
              },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.textPrimary }]}>
              Nueva campaña
            </Text>

            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: colors.borderDefault,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Nombre de la campaña"
              placeholderTextColor={colors.searchPlaceholder}
              value={newName}
              onChangeText={setNewName}
              autoFocus
            />

            <TextInput
              style={[
                styles.input,
                styles.inputMultiline,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: colors.borderDefault,
                  color: colors.textPrimary,
                },
              ]}
              placeholder="Descripción (opcional)"
              placeholderTextColor={colors.searchPlaceholder}
              value={newDesc}
              onChangeText={setNewDesc}
              multiline
              numberOfLines={3}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  { backgroundColor: colors.bgSubtle },
                ]}
                onPress={() => setShowCreate(false)}
              >
                <Text style={[styles.modalBtnText, { color: colors.textSecondary }]}>
                  Cancelar
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.modalBtn,
                  {
                    backgroundColor: colors.accentGold,
                    opacity: newName.trim() ? 1 : 0.5,
                  },
                ]}
                onPress={handleCreateCampaign}
                disabled={!newName.trim() || creating}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={[styles.modalBtnText, { color: "#FFF" }]}>
                    Crear
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}

      <ConfirmDialog {...dialogProps} />
      <Toast {...toastProps} />
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    gap: 12,
  },
  campaignCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
  },
  campaignCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
  },
  campaignIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  campaignInfo: {
    flex: 1,
  },
  campaignName: {
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  campaignDesc: {
    fontSize: 13,
    lineHeight: 18,
  },
  campaignMeta: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  metaText: {
    fontSize: 11,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
  },
  emptyDesc: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
  },
  fab: {
    position: "absolute",
    bottom: 32,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
    maxWidth: 380,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    zIndex: 101,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 12,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: "top",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  modalBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
