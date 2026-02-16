import { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
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
  DragonDivider,
  TorchGlow,
  D20Watermark,
  FloatingParticles,
  MinimalD20Logo,
} from "@/components/ui";
import { useDialog, useToast } from "@/hooks/useDialog";
import { useTheme } from "@/hooks/useTheme";
import { getItem, STORAGE_KEYS } from "@/utils/storage";
import type { Campaign } from "@/types/campaign";
import type { Character, ClassId } from "@/types/character";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Animated Campaign Card ──────────────────────────────────────────

function CampaignCard({
  item,
  index,
  classTheme,
  onPress,
  onLongPress,
}: {
  item: Campaign;
  index: number;
  classTheme: { iconName: string; color: string } | null;
  onPress: () => void;
  onLongPress: () => void;
}) {
  const { colors } = useTheme();
  const hasCharacter = !!item.personajeId;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    const delay = index * 80;
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 450,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 500,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index, entranceAnim, translateY]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const classAccent = hasCharacter && classTheme ? classTheme.color : null;
  const accentColor =
    classAccent ?? (hasCharacter ? colors.accentRed : colors.textMuted);
  const accentColorLight = hasCharacter
    ? `${accentColor}26`
    : `${colors.textMuted}1F`;

  return (
    <Animated.View
      style={{
        opacity: entranceAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
        marginBottom: 14,
        // Shadow / elevation
        shadowColor: hasCharacter ? accentColor : colors.shadowColor,
        shadowOffset: { width: 0, height: hasCharacter ? 4 : 2 },
        shadowOpacity: hasCharacter ? 0.2 : 0.12,
        shadowRadius: hasCharacter ? 10 : 4,
        elevation: hasCharacter ? 6 : 3,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Accent left line */}
        <View style={styles.cardAccentLineContainer}>
          <LinearGradient
            colors={[accentColor, `${accentColor}66`, `${accentColor}22`]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cardAccentLine}
          />
        </View>

        {/* Inner subtle gradient overlay */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.025)",
              "rgba(255,255,255,0)",
              "rgba(0,0,0,0.04)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.cardRow}>
          {/* Campaign icon */}
          <View
            style={[styles.cardIcon, { backgroundColor: accentColorLight }]}
          >
            {hasCharacter ? (
              <View style={styles.cardIconInner}>
                <Ionicons
                  name={classTheme?.iconName ?? "shield-half-sharp"}
                  size={26}
                  color={accentColor}
                />
                {/* Sparkle overlay for active campaigns */}
                <View style={styles.cardIconSparkle}>
                  <Ionicons
                    name="sparkles"
                    size={10}
                    color={colors.accentGold}
                  />
                </View>
              </View>
            ) : (
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={accentColor}
              />
            )}
          </View>

          {/* Campaign info */}
          <View style={styles.cardInfo}>
            <Text
              style={[styles.cardTitle, { color: colors.cardTitle }]}
              numberOfLines={1}
            >
              {item.nombre}
            </Text>
            {item.descripcion ? (
              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.cardDescription },
                ]}
                numberOfLines={1}
              >
                {item.descripcion}
              </Text>
            ) : null}
            <View style={styles.cardMetaRow}>
              <View
                style={[
                  styles.cardStatusBadge,
                  {
                    backgroundColor: hasCharacter
                      ? `${colors.accentGreen}1F`
                      : `${colors.accentGold}1F`,
                    borderColor: hasCharacter
                      ? `${colors.accentGreen}33`
                      : `${colors.accentGold}33`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardStatusDot,
                    {
                      backgroundColor: hasCharacter
                        ? colors.accentGreen
                        : colors.accentGold,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.cardStatusText,
                    {
                      color: hasCharacter
                        ? colors.accentGreen
                        : colors.accentGold,
                    },
                  ]}
                >
                  {hasCharacter ? "Personaje creado" : "Sin personaje"}
                </Text>
              </View>
              <Text style={[styles.cardDateText, { color: colors.textMuted }]}>
                {new Date(item.actualizadoEn).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>

          {/* Chevron */}
          <View
            style={[
              styles.cardChevron,
              { backgroundColor: colors.cardChevronBg },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.chevronColor}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Logo Component (Inline) ─────────────────────────────────────────

// HeaderLogo is now replaced by InlineDndLogo from @/components/ui

// ─── Empty State ─────────────────────────────────────────────────────

function EmptyState({ onCreateFirst }: { onCreateFirst: () => void }) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Float loop
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: -8,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, [scaleAnim, fadeAnim, floatAnim]);

  return (
    <View style={styles.emptyContainer}>
      {/* Floating D20 icon — now using the SVG-based MinimalD20Logo */}
      <Animated.View
        style={[
          styles.emptyIconOuter,
          {
            transform: [{ scale: scaleAnim }, { translateY: floatAnim }],
          },
        ]}
      >
        <MinimalD20Logo size={80} animated showRunicRing />
      </Animated.View>

      {/* Text */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={[styles.emptyTitle, { color: colors.emptyTitle }]}>
          ¡Bienvenido, aventurero!
        </Text>
        <Text style={[styles.emptySubtitle, { color: colors.emptySubtitle }]}>
          No tienes ninguna partida todavía.{"\n"}Crea tu primera campaña para
          empezar a jugar.
        </Text>

        {/* Dragon-themed decorative divider */}
        <DragonDivider
          color={colors.accentGold}
          height={32}
          spacing={16}
          style={{ width: SCREEN_WIDTH * 0.7 }}
        />

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={onCreateFirst}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#d32f2f", colors.accentRed, "#a51c1c"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.emptyButtonGradient}
          >
            <Ionicons name="add" size={22} color="white" />
            <Text style={styles.emptyButtonText}>Crear primera partida</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Hint text */}
        <View style={styles.emptyHintRow}>
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.emptyHintText}
          />
          <Text style={[styles.emptyHintText, { color: colors.emptyHintText }]}>
            También puedes explorar el{" "}
            <Text style={{ color: colors.accentGold + "90" }}>Compendio</Text>{" "}
            con razas, clases y trasfondos
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Stats Row (shows campaign count) ────────────────────────────────

function StatsRow({
  total,
  withCharacter,
}: {
  total: number;
  withCharacter: number;
}) {
  const { colors } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View
      style={[
        styles.statsRow,
        {
          opacity: fadeAnim,
          backgroundColor: colors.statsBg,
          borderColor: colors.statsBorder,
        },
      ]}
    >
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.statsValue }]}>
          {total}
        </Text>
        <Text style={[styles.statLabel, { color: colors.statsLabel }]}>
          {total === 1 ? "Partida" : "Partidas"}
        </Text>
      </View>
      <View
        style={[styles.statDivider, { backgroundColor: colors.statsDivider }]}
      />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.accentGreen }]}>
          {withCharacter}
        </Text>
        <Text style={[styles.statLabel, { color: colors.statsLabel }]}>
          Con personaje
        </Text>
      </View>
      <View
        style={[styles.statDivider, { backgroundColor: colors.statsDivider }]}
      />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: colors.accentGold }]}>
          {total - withCharacter}
        </Text>
        <Text style={[styles.statLabel, { color: colors.statsLabel }]}>
          Pendientes
        </Text>
      </View>
    </Animated.View>
  );
}

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
    <EmptyState onCreateFirst={() => router.push("/campaigns/new")} />
  );

  // ── Long press hint component ──
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
      {/* Background gradient that covers the full screen */}
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

      {/* D20 watermark in background */}
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
          {/* Logo + Brand — using the new SVG-based InlineDndLogo */}
          <View style={styles.headerBrand}>
            <InlineDndLogo />
          </View>

          {/* Action buttons */}
          <View style={styles.headerActions}>
            {/* Compendium button */}
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

            {/* Settings button */}
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

            {/* Create campaign FAB */}
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

        {/* Search bar */}
        {campaigns.length > 0 && (
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
            placeholder="Buscar partida..."
            style={{ marginTop: 10 }}
          />
        )}

        {/* Bottom border gradient */}
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

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
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
  headerBrandText: {
    marginLeft: 12,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 1,
    letterSpacing: -0.3,
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
    shadowColor: "#c62828", // overridden inline via colors.accentRed
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

  // ── List Header ──
  listHeaderContainer: {
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  filterResultText: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },

  // ── Campaign Card ──
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    paddingLeft: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardAccentLineContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
  },
  cardAccentLine: {
    flex: 1,
    width: "100%",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    height: 52,
    width: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    position: "relative",
  },
  cardIconInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconSparkle: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  cardStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  cardStatusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardDateText: {
    fontSize: 11,
    fontWeight: "500",
  },
  cardChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  // ── Empty State ──
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 40,
  },
  emptyIconOuter: {
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  emptyIconRing: {
    position: "absolute",
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 1,
    borderColor: "rgba(102,102,153,0.15)",
  },
  emptyIconBg: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  emptySparkle: {
    position: "absolute",
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyDivider: {
    flexDirection: "row",
    alignItems: "center",
    width: 160,
    marginVertical: 24,
  },
  emptyDividerLine: {
    flex: 1,
    height: 1,
  },
  emptyDividerDiamond: {
    width: 6,
    height: 6,
    backgroundColor: "#fbbf2450", // overridden inline via colors.accentGold + "50"
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
  },
  emptyButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#c62828", // overridden inline via colors.accentRed
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  emptyButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  emptyButtonText: {
    color: "#ffffff", // overridden inline via colors.textInverted
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  emptyHintRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    paddingHorizontal: 12,
    gap: 6,
  },
  emptyHintText: {
    fontSize: 12,
    lineHeight: 17,
    flex: 1,
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
