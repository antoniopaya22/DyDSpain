import { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Animated,
  Easing,
  StyleSheet,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCampaignStore } from "@/stores/campaignStore";
import {
  ConfirmDialog,
  Toast,
  DndBackdrop,
  SectionLabel,
} from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import type { Campaign } from "@/types/campaign";

// ─── Animated Action Card ────────────────────────────────────────────

function ActionCard({
  icon,
  iconColor,
  iconBg,
  title,
  subtitle,
  onPress,
  delay = 0,
  accentColor,
  chevron = true,
  borderAccent = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  title: string;
  subtitle: string;
  onPress: () => void;
  delay?: number;
  accentColor?: string;
  chevron?: boolean;
  borderAccent?: boolean;
}) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(entranceAnim, {
        toValue: 1,
        duration: 400,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, entranceAnim, translateY]);

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 100,
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

  return (
    <Animated.View
      style={{
        opacity: entranceAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
        marginBottom: 10,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          detailStyles.actionCard,
          {
            backgroundColor: colors.bgCard,
            borderColor: colors.borderDefault,
          },
          borderAccent && accentColor
            ? { borderColor: `${accentColor}40` }
            : {},
        ]}
      >
        {/* Left accent line */}
        {accentColor && (
          <View style={detailStyles.actionCardAccent}>
            <LinearGradient
              colors={[accentColor, `${accentColor}66`, `${accentColor}22`]}
              start={{ x: 0.5, y: 0 }}
              end={{ x: 0.5, y: 1 }}
              style={{ flex: 1, width: "100%" }}
            />
          </View>
        )}

        {/* Subtle inner gradient */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.025)",
              "rgba(255,255,255,0)",
              "rgba(0,0,0,0.03)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={detailStyles.actionCardRow}>
          <View
            style={[detailStyles.actionCardIcon, { backgroundColor: iconBg }]}
          >
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={detailStyles.actionCardInfo}>
            <Text
              style={[
                detailStyles.actionCardTitle,
                { color: colors.textPrimary },
                accentColor ? { color: accentColor } : {},
              ]}
            >
              {title}
            </Text>
            <Text
              style={[
                detailStyles.actionCardSubtitle,
                { color: colors.textSecondary },
              ]}
            >
              {subtitle}
            </Text>
          </View>
          {chevron && (
            <View
              style={[
                detailStyles.actionCardChevron,
                { backgroundColor: colors.bgSubtle },
              ]}
            >
              <Ionicons
                name="chevron-forward"
                size={16}
                color={accentColor || colors.textSecondary}
              />
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Quick Action Grid Item ──────────────────────────────────────────

function QuickActionItem({
  icon,
  iconColor,
  iconBg,
  label,
  sublabel,
  onPress,
  delay = 0,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBg: string;
  label: string;
  sublabel: string;
  onPress: () => void;
  delay?: number;
}) {
  const { colors } = useTheme();
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const entranceAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(entranceAnim, {
      toValue: 1,
      duration: 400,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, entranceAnim]);

  return (
    <Animated.View style={{ flex: 1, opacity: entranceAnim }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() =>
          Animated.timing(scaleAnim, {
            toValue: 0.94,
            duration: 100,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scaleAnim, {
            toValue: 1,
            friction: 5,
            tension: 200,
            useNativeDriver: true,
          }).start()
        }
        activeOpacity={1}
      >
        <Animated.View
          style={[
            detailStyles.quickActionCard,
            {
              transform: [{ scale: scaleAnim }],
              backgroundColor: colors.bgCard,
              borderColor: colors.borderDefault,
            },
          ]}
        >
          {/* Top gradient accent */}
          <View style={detailStyles.quickActionAccent}>
            <LinearGradient
              colors={[iconColor, `${iconColor}66`, `${iconColor}22`]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ flex: 1, height: "100%" }}
            />
          </View>

          <View
            style={[
              detailStyles.quickActionIconBg,
              { backgroundColor: iconBg },
            ]}
          >
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <Text
            style={[
              detailStyles.quickActionLabel,
              { color: colors.textPrimary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              detailStyles.quickActionSublabel,
              { color: colors.textMuted },
            ]}
          >
            {sublabel}
          </Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors, isDark } = useTheme();
  const {
    getCampaignById,
    loadCampaigns,
    deleteCampaign,
    updateCampaign,
    touchCampaign,
    setActiveCampaign,
  } = useCampaignStore();

  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // ── Dialog & Toast hooks ──
  const { dialogProps, showDestructive } = useDialog();
  const {
    toastProps,
    showSuccess: toastSuccess,
    showError: toastError,
  } = useToast();

  // Edit campaign modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editSaving, setEditSaving] = useState(false);



  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        setLoading(true);
        await loadCampaigns();
        const found = getCampaignById(id!);
        setCampaign(found);
        if (found) {
          setActiveCampaign(found.id);
          await touchCampaign(found.id);
        }
        setLoading(false);
      };
      load();
    }, [id, loadCampaigns, getCampaignById, setActiveCampaign, touchCampaign]),
  );

  const handleGoBack = () => {
    setActiveCampaign(null);
    router.back();
  };

  const handleEditCampaign = () => {
    if (!campaign) return;
    setEditNombre(campaign.nombre);
    setEditDescripcion(campaign.descripcion ?? "");
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!campaign || !editNombre.trim()) return;
    setEditSaving(true);
    try {
      const updated = await updateCampaign(campaign.id, {
        nombre: editNombre.trim(),
        descripcion: editDescripcion.trim() || undefined,
      });
      if (updated) {
        setCampaign(updated);
        toastSuccess("Partida actualizada");
      }
      setShowEditModal(false);
    } catch (error) {
      toastError("No se pudo actualizar la partida");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteCampaign = () => {
    if (!campaign) return;

    showDestructive(
      "Eliminar partida",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"?\n\nSe perderá el personaje asociado y todos sus datos de forma permanente.`,
      async () => {
        await deleteCampaign(campaign.id);
        router.replace("/");
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" },
    );
  };

  const handleCreateCharacter = () => {
    router.push(`/campaigns/${id}/character/create`);
  };

  const handleOpenCharacterSheet = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenCombat = () => {
    router.push(`/campaigns/${id}/character/sheet?tab=combat`);
  };

  const handleOpenSpells = () => {
    router.push(`/campaigns/${id}/character/sheet?tab=spells`);
  };

  const handleOpenInventory = () => {
    router.push(`/campaigns/${id}/character/sheet?tab=inventory`);
  };

  const handleOpenNotes = () => {
    router.push(`/campaigns/${id}/character/sheet?tab=notes`);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-dark-800 items-center justify-center">
        <ActivityIndicator size="large" color={colors.accentRed} />
        <Text className="text-gray-500 dark:text-dark-300 text-base mt-4">
          Cargando partida...
        </Text>
      </View>
    );
  }

  if (!campaign) {
    return (
      <View className="flex-1 bg-gray-50 dark:bg-dark-800 items-center justify-center px-8">
        <View className="h-20 w-20 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center mb-6">
          <Ionicons
            name="alert-circle-outline"
            size={44}
            color={colors.dangerText}
          />
        </View>
        <Text className="text-dark-900 dark:text-white text-xl font-bold text-center mb-2">
          Partida no encontrada
        </Text>
        <Text className="text-dark-400 dark:text-dark-300 text-base text-center mb-8">
          La partida que buscas no existe o ha sido eliminada.
        </Text>
        <TouchableOpacity
          className="bg-primary-500 rounded-xl px-8 py-3.5 active:bg-primary-600"
          onPress={() => router.replace("/")}
        >
          <Text className="text-white font-bold text-base">
            Volver al inicio
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasCharacter = !!campaign.personajeId;
  const createdDate = new Date(campaign.creadoEn).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const lastAccessDate = new Date(campaign.actualizadoEn).toLocaleDateString(
    "es-ES",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  );

  // ── Edit Campaign Modal ──
  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowEditModal(false)}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-white dark:bg-dark-800 rounded-t-3xl border-t border-dark-100 dark:border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-dark-900 dark:text-white text-lg font-bold">
              Editar Partida
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center"
              onPress={() => setShowEditModal(false)}
            >
              <Ionicons name="close" size={18} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Nombre */}
            <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider mt-2">
              Nombre de la partida <Text className="text-primary-500">*</Text>
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3.5 text-dark-900 dark:text-white text-base border border-dark-100 dark:border-surface-border mb-4"
              placeholder="Nombre de la partida"
              placeholderTextColor={colors.textMuted}
              value={editNombre}
              onChangeText={setEditNombre}
              maxLength={100}
              autoFocus
              returnKeyType="next"
            />
            <Text className="text-dark-400 text-xs -mt-2 mb-4 text-right">
              {editNombre.length}/100
            </Text>

            {/* Descripción */}
            <Text className="text-dark-600 dark:text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3.5 text-dark-900 dark:text-white text-base border border-dark-100 dark:border-surface-border min-h-[120px] mb-4"
              placeholder="Descripción de la campaña..."
              placeholderTextColor={colors.textMuted}
              value={editDescripcion}
              onChangeText={setEditDescripcion}
              multiline
              numberOfLines={5}
              maxLength={500}
              textAlignVertical="top"
            />
            <Text className="text-dark-400 text-xs -mt-2 mb-6 text-right">
              {editDescripcion.length}/500
            </Text>

            {/* Botón guardar */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                editNombre.trim() && !editSaving
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-gray-300 dark:bg-dark-600 opacity-50"
              }`}
              onPress={handleSaveEdit}
              disabled={!editNombre.trim() || editSaving}
            >
              <Text className="text-white font-bold text-base">
                {editSaving ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3.5 items-center active:bg-gray-100 dark:active:bg-surface-light"
              onPress={() => setShowEditModal(false)}
            >
              <Text className="text-dark-400 dark:text-dark-300 font-semibold text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );



  return (
    <View style={[detailStyles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Themed backdrop */}
      <DndBackdrop />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <View style={detailStyles.heroHeader}>
          <LinearGradient
            colors={colors.gradientHeader}
            style={StyleSheet.absoluteFill}
          />

          {/* Top buttons row */}
          <View style={detailStyles.heroTopRow}>
            <TouchableOpacity
              style={[
                detailStyles.heroButton,
                {
                  backgroundColor: colors.headerButtonBg,
                  borderColor: colors.headerButtonBorder,
                },
              ]}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>

            <View style={detailStyles.heroActions}>
              <TouchableOpacity
                style={[
                  detailStyles.heroButton,
                  {
                    backgroundColor: colors.headerButtonBg,
                    borderColor: colors.headerButtonBorder,
                  },
                ]}
                onPress={handleEditCampaign}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={16} color={colors.accentGold} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  detailStyles.heroButton,
                  {
                    marginLeft: 8,
                    backgroundColor: colors.headerButtonBg,
                    borderColor: colors.headerButtonBorder,
                  },
                ]}
                onPress={handleDeleteCampaign}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="trash-outline"
                  size={16}
                  color={colors.dangerText}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campaign title area */}
          <View style={detailStyles.heroTitleArea}>
            <Text
              style={[
                detailStyles.heroLabel,
                { color: colors.headerLabelColor },
              ]}
            >
              Partida
            </Text>
            <Text
              style={[
                detailStyles.heroTitle,
                { color: colors.headerTitleColor },
              ]}
            >
              {campaign.nombre}
            </Text>

            {campaign.descripcion ? (
              <Text
                style={[
                  detailStyles.heroDescription,
                  { color: colors.sectionDescColor },
                ]}
              >
                {campaign.descripcion}
              </Text>
            ) : null}

            {/* Date badges */}
            <View style={detailStyles.heroDateRow}>
              <View
                style={[
                  detailStyles.heroBadge,
                  {
                    backgroundColor: colors.optionBg,
                    borderColor: colors.optionBorder,
                  },
                ]}
              >
                <Ionicons
                  name="calendar-outline"
                  size={12}
                  color={colors.textMuted}
                />
                <Text
                  style={[
                    detailStyles.heroBadgeText,
                    { color: colors.textMuted },
                  ]}
                >
                  Creada: {createdDate}
                </Text>
              </View>
              <View
                style={[
                  detailStyles.heroBadge,
                  {
                    backgroundColor: colors.optionBg,
                    borderColor: colors.optionBorder,
                  },
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={colors.textMuted}
                />
                <Text
                  style={[
                    detailStyles.heroBadgeText,
                    { color: colors.textMuted },
                  ]}
                >
                  Acceso: {lastAccessDate}
                </Text>
              </View>
            </View>
          </View>

          {/* Decorative gradient border */}
          <View style={detailStyles.heroBorder}>
            <LinearGradient
              colors={[
                "transparent",
                hasCharacter
                  ? colors.accentRed + "44"
                  : colors.borderDefault + "66",
                hasCharacter ? colors.accentRed : colors.borderDefault,
                hasCharacter
                  ? colors.accentRed + "44"
                  : colors.borderDefault + "66",
                "transparent",
              ]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              style={{ height: 1, width: "100%" }}
            />
          </View>
        </View>

        {/* ── Character Section ── */}
        {hasCharacter ? (
          <View style={detailStyles.sectionContainer}>
            {/* Character sheet main card */}
            <SectionLabel
              label="Tu Personaje"
              icon="shield-half-sharp"
              color={colors.accentRed}
              delay={100}
            />

            <ActionCard
              icon="shield-half-sharp"
              iconColor={colors.accentRed}
              iconBg="rgba(143,61,56,0.15)"
              title="Ver Hoja de Personaje"
              subtitle="Estadísticas, habilidades, inventario y más"
              onPress={handleOpenCharacterSheet}
              delay={150}
              accentColor={colors.accentRed}
            />

            {/* Quick actions label */}
            <SectionLabel
              label="Acceso Rápido"
              icon="flash"
              color={colors.accentGold}
              delay={200}
            />

            {/* Quick action grid */}
            <View style={detailStyles.quickActionRow}>
              <QuickActionItem
                icon="heart"
                iconColor={colors.accentGreen}
                iconBg="rgba(34,197,94,0.15)"
                label="Combate"
                sublabel="Vida y ataques"
                onPress={handleOpenCombat}
                delay={250}
              />
              <View style={{ width: 10 }} />
              <QuickActionItem
                icon="star"
                iconColor={colors.accentDanger}
                iconBg="rgba(239,68,68,0.15)"
                label="Habilidades"
                sublabel="Clase y magia"
                onPress={handleOpenSpells}
                delay={300}
              />
            </View>

            <View style={detailStyles.quickActionRow}>
              <QuickActionItem
                icon="bag-handle"
                iconColor={colors.accentGold}
                iconBg="rgba(151,143,98,0.15)"
                label="Inventario"
                sublabel="Objetos y oro"
                onPress={handleOpenInventory}
                delay={350}
              />
              <View style={{ width: 10 }} />
              <QuickActionItem
                icon="document-text"
                iconColor={colors.accentBlue}
                iconBg="rgba(59,130,246,0.15)"
                label="Notas"
                sublabel="Diario y apuntes"
                onPress={handleOpenNotes}
                delay={400}
              />
            </View>
          </View>
        ) : (
          /* ── No Character — Creation Prompt ── */
          <View style={detailStyles.sectionContainer}>
            <View
              style={[
                detailStyles.createCard,
                {
                  backgroundColor: colors.bgCard,
                  borderColor: colors.borderDefault,
                },
              ]}
            >
              {/* Inner gradient overlay */}
              <LinearGradient
                colors={[
                  isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.01)",
                  "transparent",
                  isDark ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.02)",
                ]}
                style={StyleSheet.absoluteFill}
              />

              {/* Floating icon */}
              <View style={detailStyles.createIconOuter}>
                <View
                  style={[
                    detailStyles.createIconRing,
                    { borderColor: colors.borderSubtle },
                  ]}
                />
                <LinearGradient
                  colors={
                    isDark
                      ? [colors.bgElevated, colors.bgSecondary]
                      : [colors.bgSecondary, colors.bgCard]
                  }
                  style={[
                    detailStyles.createIconBg,
                    { borderColor: colors.borderSubtle },
                  ]}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={42}
                    color={colors.textMuted}
                  />
                </LinearGradient>
                <View style={detailStyles.createIconSparkle}>
                  <Ionicons
                    name="sparkles"
                    size={14}
                    color={colors.accentGold + "80"}
                  />
                </View>
              </View>

              <Text
                style={[
                  detailStyles.createTitle,
                  { color: colors.textPrimary },
                ]}
              >
                Crea tu personaje
              </Text>
              <Text
                style={[
                  detailStyles.createSubtitle,
                  { color: colors.textSecondary },
                ]}
              >
                Esta partida aún no tiene personaje. Comienza el proceso de
                creación paso a paso: elige raza, clase, estadísticas y mucho
                más.
              </Text>

              {/* CTA Button with gradient */}
              <TouchableOpacity
                style={[
                  detailStyles.createButton,
                  {
                    backgroundColor: colors.bgCard,
                    borderColor: colors.borderDefault,
                  },
                ]}
                onPress={handleCreateCharacter}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#d32f2f", colors.accentRed, "#a51c1c"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={detailStyles.createButtonGradient}
                >
                  <Ionicons name="sparkles" size={20} color="white" />
                  <Text style={detailStyles.createButtonText}>
                    Crear Personaje
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              {/* Divider */}
              <View style={detailStyles.createDivider}>
                <LinearGradient
                  colors={[
                    "transparent",
                    colors.accentGold + "30",
                    "transparent",
                  ]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ height: 1, width: "100%" }}
                />
              </View>

              {/* Steps preview — compact 2-column grid */}
              <Text
                style={[detailStyles.stepsTitle, { color: colors.textMuted }]}
              >
                11 pasos de creación
              </Text>

              <View style={detailStyles.stepsGrid}>
                {[
                  { icon: "text-outline", label: "Nombre" },
                  { icon: "people-outline", label: "Raza" },
                  { icon: "shield-outline", label: "Clase" },
                  { icon: "stats-chart-outline", label: "Estadísticas" },
                  { icon: "book-outline", label: "Trasfondo" },
                  { icon: "school-outline", label: "Habilidades" },
                  { icon: "star-outline", label: "Conjuros" },
                  { icon: "bag-outline", label: "Equipamiento" },
                  { icon: "chatbubble-outline", label: "Personalidad" },
                  { icon: "body-outline", label: "Apariencia" },
                  { icon: "checkmark-circle-outline", label: "Resumen" },
                ].map((step, index) => (
                  <View
                    key={index}
                    style={[
                      detailStyles.stepChip,
                      {
                        backgroundColor: colors.bgSubtle,
                        borderColor: colors.borderSubtle,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        detailStyles.stepChipNumber,
                        { color: colors.textMuted },
                      ]}
                    >
                      {index + 1}
                    </Text>
                    <Ionicons
                      name={step.icon as any}
                      size={13}
                      color={colors.textMuted}
                    />
                    <Text
                      style={[
                        detailStyles.stepChipLabel,
                        { color: colors.textSecondary },
                      ]}
                      numberOfLines={1}
                    >
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderEditModal()}

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </View>
  );
}

// ─── Detail Styles ───────────────────────────────────────────────────

const detailStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "transparent", // themed inline via colors.bgPrimary
  },

  // ── Hero Header ──
  heroHeader: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 0,
    position: "relative",
  },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  heroButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  heroTitleArea: {
    marginBottom: 16,
  },
  heroLabel: {
    color: "#CDC9B2", // overridden inline via colors.accentGold
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
    textShadowColor: "rgba(178,172,136,0.2)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  heroTitle: {
    color: "#ffffff", // overridden inline via colors.textPrimary
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroDescription: {
    color: "#AAA37B", // overridden inline via colors.textSecondary
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 12,
  },
  heroDateRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  heroBadgeText: {
    color: "#6C6746", // overridden inline via colors.textMuted
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 5,
  },
  heroBorder: {
    marginTop: 16,
  },

  // ── Section Container ──
  sectionContainer: {
    paddingHorizontal: 20,
    paddingTop: 18,
  },

  // ── Action Card ──
  actionCard: {
    borderRadius: 14,
    backgroundColor: "transparent", // themed inline via colors.bgCard
    borderWidth: 1,
    borderColor: "transparent", // themed inline via colors.borderDefault
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingLeft: 20,
    overflow: "hidden",
    position: "relative",
  },
  actionCardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    overflow: "hidden",
  },
  actionCardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionCardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  actionCardInfo: {
    flex: 1,
  },
  actionCardTitle: {
    color: "#ffffff", // overridden inline via colors.textPrimary
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionCardSubtitle: {
    color: "#AAA37B", // overridden inline via colors.textSecondary
    fontSize: 13,
    lineHeight: 18,
  },
  actionCardChevron: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },

  // ── Quick Action Cards ──
  quickActionRow: {
    flexDirection: "row",
    marginBottom: 10,
  },
  quickActionCard: {
    borderRadius: 14,
    backgroundColor: "transparent", // themed inline via colors.bgCard
    borderWidth: 1,
    borderColor: "transparent", // themed inline via colors.borderDefault
    paddingHorizontal: 14,
    paddingVertical: 14,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  quickActionAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 2.5,
    overflow: "hidden",
  },
  quickActionIconBg: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  quickActionLabel: {
    color: "#ffffff", // overridden inline via colors.textPrimary
    fontSize: 13,
    fontWeight: "700",
  },
  quickActionSublabel: {
    color: "#807953", // overridden inline via colors.textMuted
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },

  // ── Create Character Card ──
  createCard: {
    borderRadius: 16,
    backgroundColor: "transparent", // themed inline via colors.bgCard
    borderWidth: 1,
    borderColor: "transparent", // themed inline via colors.borderDefault
    padding: 24,
    alignItems: "center",
    overflow: "hidden",
    position: "relative",
  },
  createIconOuter: {
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  createIconRing: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "rgba(102,102,153,0.15)",
  },
  createIconBg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  createIconSparkle: {
    position: "absolute",
    top: 2,
    right: 2,
  },
  createTitle: {
    color: "#ffffff", // overridden inline via colors.textPrimary
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  createSubtitle: {
    color: "#AAA37B", // overridden inline via colors.textSecondary
    fontSize: 14,
    textAlign: "center",
    lineHeight: 21,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  createButton: {
    borderRadius: 14,
    overflow: "hidden",
    width: "100%",
    shadowColor: "#8f3d38", // overridden inline via colors.accentRed
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
  },
  createButtonText: {
    color: "#ffffff", // overridden inline via colors.textInverted
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },
  createDivider: {
    width: "80%",
    marginVertical: 20,
  },
  stepsTitle: {
    color: "#6C6746",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 10,
    textAlign: "center",
  },
  stepsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 6,
  },
  stepChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  stepChipNumber: {
    fontSize: 10,
    fontWeight: "700",
    marginRight: 4,
    minWidth: 12,
    textAlign: "center",
  },
  stepChipLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginLeft: 4,
  },
});
