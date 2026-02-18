import { useCallback, useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCampaignStore } from "@/stores/campaignStore";
import { getClassData } from "@/data/srd/classes";
import {
  ConfirmDialog,
  Toast,
  SearchBar,
  InlineDndLogo,
  TorchGlow,
  D20Watermark,
  FloatingParticles,
} from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import { getItem, STORAGE_KEYS } from "@/utils/storage";
import type { Campaign } from "@/types/campaign";
import type { Character, ClassId } from "@/types/character";
import { CampaignCard, HomeEmptyState, StatsRow } from "@/components/campaigns";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Main Home Screen ────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { campaigns, loadCampaigns, deleteCampaign } = useCampaignStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [campaignClassMap, setCampaignClassMap] = useState<
    Record<string, ClassId | null>
  >({});
  const { dialogProps, showDestructive } = useDialog();
  const { toastProps, showSuccess } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadCampaigns();
    }, [loadCampaigns]),
  );

  useEffect(() => {
    let active = true;

    const loadCampaignClasses = async () => {
      const entries = await Promise.all(
        campaigns.map(async (campaign) => {
          if (!campaign.personajeId) {
            return [campaign.id, null] as const;
          }
          const character = await getItem<Character>(
            STORAGE_KEYS.CHARACTER(campaign.personajeId),
          );
          return [campaign.id, character?.clase ?? null] as const;
        }),
      );

      if (!active) return;

      const nextMap: Record<string, ClassId | null> = {};
      for (const [id, classId] of entries) {
        nextMap[id] = classId;
      }
      setCampaignClassMap(nextMap);
    };

    loadCampaignClasses();

    return () => {
      active = false;
    };
  }, [campaigns]);

  const filteredCampaigns = campaigns.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const campaignsWithCharacter = campaigns.filter(
    (c) => !!c.personajeId,
  ).length;

  const handleDeleteCampaign = (campaign: Campaign) => {
    showDestructive(
      "Eliminar partida",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"? Se perderá el personaje asociado de forma permanente.`,
      () => {
        deleteCampaign(campaign.id);
        showSuccess(
          "Partida eliminada",
          `"${campaign.nombre}" ha sido eliminada`,
        );
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" },
    );
  };

  const handlePressCampaign = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const renderCampaignCard = ({
    item,
    index,
  }: {
    item: Campaign;
    index: number;
  }) => {
    const classId = campaignClassMap[item.id];
    const classTheme = classId ? getClassData(classId) : null;

    return (
      <CampaignCard
        item={item}
        index={index}
        classTheme={classTheme}
        onPress={() => handlePressCampaign(item)}
        onLongPress={() => handleDeleteCampaign(item)}
      />
    );
  };

  const renderEmptyList = () => (
    <HomeEmptyState onCreateFirst={() => router.push("/campaigns/new")} />
  );

  const renderLongPressHint = () => {
    if (campaigns.length === 0) return null;
    return (
      <View style={styles.longPressHintRow}>
        <Ionicons
          name="finger-print-outline"
          size={13}
          color={colors.textMuted}
        />
        <Text style={[styles.longPressHintText, { color: colors.textMuted }]}>
          Mantén presionado una partida para más opciones
        </Text>
      </View>
    );
  };

  const renderListHeader = () => {
    if (campaigns.length === 0) return null;
    return (
      <View style={styles.listHeaderContainer}>
        <StatsRow
          total={campaigns.length}
          withCharacter={campaignsWithCharacter}
        />
        {filteredCampaigns.length !== campaigns.length && (
          <Text style={[styles.filterResultText, { color: colors.textMuted }]}>
            {filteredCampaigns.length}{" "}
            {filteredCampaigns.length === 1 ? "resultado" : "resultados"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Background gradient */}
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* Atmospheric torch glow effects */}
      <TorchGlow
        color={colors.accentRed}
        position="top-right"
        size={180}
        intensity={isDark ? 0.06 : 0.04}
        animated
      />
      <TorchGlow
        color={colors.accentGold}
        position="top-left"
        size={120}
        intensity={isDark ? 0.04 : 0.03}
        animated
      />

      {/* Floating ember particles */}
      {isDark && (
        <FloatingParticles
          count={8}
          color={colors.accentGold}
          width={SCREEN_WIDTH}
          height={600}
          maxSize={3}
          opacity={0.3}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      )}

      {/* D20 watermark */}
      <View
        style={{
          position: "absolute",
          bottom: -40,
          right: -40,
          opacity: isDark ? 0.04 : 0.03,
        }}
      >
        <D20Watermark size={240} variant="dark" opacity={1} />
      </View>

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={colors.gradientHeader}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerTop}>
          <View style={styles.headerBrand}>
            <InlineDndLogo />
          </View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={[
                styles.headerButton,
                {
                  backgroundColor: colors.headerButtonBg,
                  borderColor: colors.headerButtonBorder,
                },
              ]}
              onPress={() => router.push("/compendium")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="book-outline"
                size={20}
                color={colors.sectionDescColor}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.headerButton,
                {
                  backgroundColor: colors.headerButtonBg,
                  borderColor: colors.headerButtonBorder,
                },
              ]}
              onPress={() => router.push("/settings")}
              activeOpacity={0.7}
            >
              <Ionicons
                name="settings-outline"
                size={20}
                color={colors.sectionDescColor}
              />
            </TouchableOpacity>

            {campaigns.length > 0 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/campaigns/new")}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#d32f2f", colors.accentRed, "#a51c1c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.addButtonGradient}
                >
                  <Ionicons name="add" size={26} color="white" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {campaigns.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar partida..."
            style={{ marginTop: 10 }}
          />
        )}

        <View style={styles.headerBorder}>
          <LinearGradient
            colors={[
              "transparent",
              colors.borderDefault + "66",
              colors.borderDefault,
              colors.borderDefault + "66",
              "transparent",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 1, width: "100%" }}
          />
        </View>
      </View>

      {/* Campaign list */}
      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaignCard}
        ListHeaderComponent={renderListHeader}
        ListEmptyComponent={renderEmptyList}
        ListFooterComponent={renderLongPressHint}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 12,
          paddingBottom: 100,
          flexGrow: campaigns.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
        initialNumToRender={8}
      />

      <ConfirmDialog {...dialogProps} />
      <Toast {...toastProps} />
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 14,
    position: "relative",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  addButton: {
    height: 46,
    width: 46,
    borderRadius: 23,
    overflow: "hidden",
    shadowColor: "#8f3d38",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonGradient: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },

  // ── List ──
  listHeaderContainer: {
    marginBottom: 8,
  },
  filterResultText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },

  // ── Long press hint ──
  longPressHintRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 16,
    paddingHorizontal: 16,
    gap: 6,
    opacity: 0.7,
  },
  longPressHintText: {
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
});
