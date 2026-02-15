import { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
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
import { ConfirmDialog, Toast } from "@/components/ui";
import { useDialog, useToast } from "@/hooks/useDialog";
import type { Campaign } from "@/types/campaign";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Animated Campaign Card ──────────────────────────────────────────

function CampaignCard({
  item,
  index,
  onPress,
  onLongPress,
}: {
  item: Campaign;
  index: number;
  onPress: () => void;
  onLongPress: () => void;
}) {
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

  const accentColor = hasCharacter ? "#c62828" : "#666699";
  const accentColorLight = hasCharacter
    ? "rgba(198,40,40,0.15)"
    : "rgba(102,102,153,0.12)";

  return (
    <Animated.View
      style={{
        opacity: entranceAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
        marginBottom: 14,
        // Shadow / elevation
        shadowColor: hasCharacter ? "#c62828" : "#000",
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
        style={styles.card}
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
          <View style={[styles.cardIcon, { backgroundColor: accentColorLight }]}>
            {hasCharacter ? (
              <View style={styles.cardIconInner}>
                <Ionicons name="shield-half-sharp" size={26} color={accentColor} />
                {/* Sparkle overlay for active campaigns */}
                <View style={styles.cardIconSparkle}>
                  <Ionicons name="sparkles" size={10} color="#fbbf24" />
                </View>
              </View>
            ) : (
              <Ionicons name="add-circle-outline" size={26} color={accentColor} />
            )}
          </View>

          {/* Campaign info */}
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {item.nombre}
            </Text>
            {item.descripcion ? (
              <Text style={styles.cardDescription} numberOfLines={1}>
                {item.descripcion}
              </Text>
            ) : null}
            <View style={styles.cardMetaRow}>
              <View
                style={[
                  styles.cardStatusBadge,
                  {
                    backgroundColor: hasCharacter
                      ? "rgba(34,197,94,0.12)"
                      : "rgba(251,191,36,0.12)",
                    borderColor: hasCharacter
                      ? "rgba(34,197,94,0.2)"
                      : "rgba(251,191,36,0.2)",
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardStatusDot,
                    {
                      backgroundColor: hasCharacter ? "#22c55e" : "#fbbf24",
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.cardStatusText,
                    {
                      color: hasCharacter ? "#22c55e" : "#fbbf24",
                    },
                  ]}
                >
                  {hasCharacter ? "Personaje creado" : "Sin personaje"}
                </Text>
              </View>
              <Text style={styles.cardDateText}>
                {new Date(item.actualizadoEn).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>

          {/* Chevron */}
          <View style={styles.cardChevron}>
            <Ionicons name="chevron-forward" size={18} color="#4a4a6a" />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Animated Search Bar ─────────────────────────────────────────────

function AnimatedSearchBar({
  value,
  onChangeText,
  onClear,
}: {
  value: string;
  onChangeText: (text: string) => void;
  onClear: () => void;
}) {
  const focusAnim = useRef(new Animated.Value(0)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 400,
      delay: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [entranceAnim]);

  const handleFocus = () => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    }).start();
  };

  const borderColorInterpolate = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#3a3a5c", "#c6282866"],
  });

  const bgColorInterpolate = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["#1e1e38", "#1e1e3d"],
  });

  return (
    <Animated.View
      style={[
        styles.searchBar,
        {
          opacity: entranceAnim,
          borderColor: borderColorInterpolate,
          backgroundColor: bgColorInterpolate,
        },
      ]}
    >
      <Ionicons name="search" size={18} color="#666699" />
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar partida..."
        placeholderTextColor="#555577"
        value={value}
        onChangeText={onChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <View style={styles.searchClearButton}>
            <Ionicons name="close" size={14} color="#8c8cb3" />
          </View>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
}

// ─── Logo Component (Inline) ─────────────────────────────────────────

function HeaderLogo() {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const entranceScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.spring(entranceScale, {
      toValue: 1,
      friction: 6,
      tension: 80,
      useNativeDriver: true,
    }).start();

    // Pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.04,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    const glow = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.6,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.2,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );

    pulse.start();
    glow.start();

    return () => {
      pulse.stop();
      glow.stop();
    };
  }, [pulseAnim, glowAnim, entranceScale]);

  return (
    <Animated.View
      style={[
        styles.logoWrapper,
        {
          transform: [
            { scale: Animated.multiply(entranceScale, pulseAnim) },
          ],
        },
      ]}
    >
      {/* Glow background */}
      <Animated.View
        style={[
          styles.logoGlow,
          { opacity: glowAnim },
        ]}
      />

      <LinearGradient
        colors={["#d32f2f", "#c62828", "#8e0000"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.logoBg}
      >
        {/* Inner border */}
        <View style={styles.logoInnerBorder}>
          <Text style={styles.logoText}>20</Text>
        </View>
      </LinearGradient>

      {/* Sparkle */}
      <Animated.View style={[styles.logoSparkle, { opacity: glowAnim }]}>
        <Ionicons name="sparkles" size={10} color="#fbbf24" />
      </Animated.View>
    </Animated.View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────

function EmptyState({ onCreateFirst }: { onCreateFirst: () => void }) {
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
      ])
    );
    floatLoop.start();

    return () => floatLoop.stop();
  }, [scaleAnim, fadeAnim, floatAnim]);

  return (
    <View style={styles.emptyContainer}>
      {/* Floating dice icon */}
      <Animated.View
        style={[
          styles.emptyIconOuter,
          {
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim },
            ],
          },
        ]}
      >
        {/* Outer ring */}
        <View style={styles.emptyIconRing} />

        {/* Main icon */}
        <LinearGradient
          colors={["#252540", "#1e1e38", "#1a1a30"]}
          style={styles.emptyIconBg}
        >
          <Ionicons name="dice-outline" size={44} color="#666699" />
        </LinearGradient>

        {/* Decorative sparkles */}
        <View style={[styles.emptySparkle, { top: -4, right: 0 }]}>
          <Ionicons name="sparkles" size={14} color="#fbbf2480" />
        </View>
        <View style={[styles.emptySparkle, { bottom: 4, left: -4 }]}>
          <Ionicons name="star" size={10} color="#c6282860" />
        </View>
      </Animated.View>

      {/* Text */}
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <Text style={styles.emptyTitle}>¡Bienvenido, aventurero!</Text>
        <Text style={styles.emptySubtitle}>
          No tienes ninguna partida todavía.{"\n"}Crea tu primera campaña para
          empezar a jugar.
        </Text>

        {/* Decorative divider */}
        <View style={styles.emptyDivider}>
          <LinearGradient
            colors={["transparent", "#fbbf2440", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.emptyDividerLine}
          />
          <View style={styles.emptyDividerDiamond} />
          <LinearGradient
            colors={["transparent", "#fbbf2440", "transparent"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={styles.emptyDividerLine}
          />
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={onCreateFirst}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={["#d32f2f", "#c62828", "#a51c1c"]}
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
          <Ionicons name="information-circle-outline" size={14} color="#555577" />
          <Text style={styles.emptyHintText}>
            También puedes explorar el{" "}
            <Text style={{ color: "#fbbf2490" }}>Compendio</Text> con razas,
            clases y trasfondos
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

// ─── Stats Row (shows campaign count) ────────────────────────────────

function StatsRow({ total, withCharacter }: { total: number; withCharacter: number }) {
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
    <Animated.View style={[styles.statsRow, { opacity: fadeAnim }]}>
      <View style={styles.statItem}>
        <Text style={styles.statValue}>{total}</Text>
        <Text style={styles.statLabel}>
          {total === 1 ? "Partida" : "Partidas"}
        </Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: "#22c55e" }]}>
          {withCharacter}
        </Text>
        <Text style={styles.statLabel}>Con personaje</Text>
      </View>
      <View style={styles.statDivider} />
      <View style={styles.statItem}>
        <Text style={[styles.statValue, { color: "#fbbf24" }]}>
          {total - withCharacter}
        </Text>
        <Text style={styles.statLabel}>Pendientes</Text>
      </View>
    </Animated.View>
  );
}

// ─── Main Home Screen ────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const { campaigns, loadCampaigns, deleteCampaign } = useCampaignStore();
  const [searchQuery, setSearchQuery] = useState("");
  const { dialogProps, showDestructive } = useDialog();
  const { toastProps, showSuccess } = useToast();

  useFocusEffect(
    useCallback(() => {
      loadCampaigns();
    }, [loadCampaigns])
  );

  const filteredCampaigns = campaigns.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const campaignsWithCharacter = campaigns.filter((c) => !!c.personajeId).length;

  const handleDeleteCampaign = (campaign: Campaign) => {
    showDestructive(
      "Eliminar partida",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"? Se perderá el personaje asociado de forma permanente.`,
      () => {
        deleteCampaign(campaign.id);
        showSuccess("Partida eliminada", `"${campaign.nombre}" ha sido eliminada`);
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" }
    );
  };

  const handlePressCampaign = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const renderCampaignCard = ({ item, index }: { item: Campaign; index: number }) => (
    <CampaignCard
      item={item}
      index={index}
      onPress={() => handlePressCampaign(item)}
      onLongPress={() => handleDeleteCampaign(item)}
    />
  );

  const renderEmptyList = () => (
    <EmptyState onCreateFirst={() => router.push("/campaigns/new")} />
  );

  // ── Long press hint component ──
  const renderLongPressHint = () => {
    if (campaigns.length === 0) return null;
    return (
      <View style={styles.longPressHintRow}>
        <Ionicons name="finger-print-outline" size={13} color="#444466" />
        <Text style={styles.longPressHintText}>
          Mantén presionado una partida para más opciones
        </Text>
      </View>
    );
  };

  const renderListHeader = () => {
    if (campaigns.length === 0) return null;
    return (
      <View style={styles.listHeaderContainer}>
        <StatsRow total={campaigns.length} withCharacter={campaignsWithCharacter} />
        {filteredCampaigns.length !== campaigns.length && (
          <Text style={styles.filterResultText}>
            {filteredCampaigns.length}{" "}
            {filteredCampaigns.length === 1 ? "resultado" : "resultados"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Background gradient that covers the full screen */}
      <LinearGradient
        colors={["#0d0d1a", "#141425", "#1a1a2e", "#1a1a2e"]}
        locations={[0, 0.15, 0.35, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={styles.header}>
        <LinearGradient
          colors={["#0d0d1a", "#13132200"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={StyleSheet.absoluteFill}
        />

        <View style={styles.headerTop}>
          {/* Logo + Brand */}
          <View style={styles.headerBrand}>
            <HeaderLogo />
            <View style={styles.headerBrandText}>
              <Text style={styles.headerLabel}>D&D Español</Text>
              <Text style={styles.headerTitle}>Mis Partidas</Text>
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.headerActions}>
            {/* Compendium button */}
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/compendium")}
              activeOpacity={0.7}
            >
              <Ionicons name="book-outline" size={20} color="#8c8cb3" />
            </TouchableOpacity>

            {/* Settings button */}
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => router.push("/settings")}
              activeOpacity={0.7}
            >
              <Ionicons name="settings-outline" size={20} color="#8c8cb3" />
            </TouchableOpacity>

            {/* Create campaign FAB */}
            {campaigns.length > 0 && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => router.push("/campaigns/new")}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#d32f2f", "#c62828", "#a51c1c"]}
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
          <AnimatedSearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={() => setSearchQuery("")}
          />
        )}

        {/* Bottom border gradient */}
        <View style={styles.headerBorder}>
          <LinearGradient
            colors={["transparent", "#3a3a5c66", "#3a3a5c", "#3a3a5c66", "transparent"]}
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
    backgroundColor: "#1a1a2e",
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
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowColor: "rgba(251,191,36,0.2)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  headerTitle: {
    color: "#ffffff",
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
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  addButton: {
    height: 46,
    width: 46,
    borderRadius: 23,
    overflow: "hidden",
    shadowColor: "#c62828",
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

  // ── Logo ──
  logoWrapper: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  logoGlow: {
    position: "absolute",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(198,40,40,0.12)",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 14,
    elevation: 8,
  },
  logoBg: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#c62828",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  logoInnerBorder: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "900",
    letterSpacing: -0.5,
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  logoSparkle: {
    position: "absolute",
    top: -3,
    right: -3,
  },

  // ── Search Bar ──
  searchBar: {
    marginTop: 14,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    color: "#ffffff",
    fontSize: 15,
    marginLeft: 10,
    paddingVertical: Platform.OS === "ios" ? 2 : 0,
  },
  searchClearButton: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
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
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  statLabel: {
    color: "#666699",
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
    color: "#8c8cb3",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    marginLeft: 4,
  },

  // ── Campaign Card ──
  card: {
    borderRadius: 16,
    backgroundColor: "#23233d",
    borderWidth: 1,
    borderColor: "#3a3a5c",
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
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  cardDescription: {
    color: "#8c8cb3",
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
    color: "#555577",
    fontSize: 11,
    fontWeight: "500",
  },
  cardChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.04)",
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
    color: "#ffffff",
    fontSize: 22,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  emptySubtitle: {
    color: "#8c8cb3",
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
    backgroundColor: "#fbbf2450",
    transform: [{ rotate: "45deg" }],
    marginHorizontal: 8,
  },
  emptyButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#c62828",
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
    color: "#ffffff",
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
    color: "#444466",
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
    color: "#444466",
    fontSize: 12,
    fontWeight: "500",
    fontStyle: "italic",
  },
});
