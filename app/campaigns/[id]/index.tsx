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
  Dimensions,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useCampaignStore } from "@/stores/campaignStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useDialog, useToast } from "@/hooks/useDialog";
import type { Campaign } from "@/types/campaign";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

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
          <View style={[detailStyles.actionCardIcon, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={24} color={iconColor} />
          </View>
          <View style={detailStyles.actionCardInfo}>
            <Text style={[
              detailStyles.actionCardTitle,
              accentColor ? { color: accentColor } : {},
            ]}>
              {title}
            </Text>
            <Text style={detailStyles.actionCardSubtitle}>{subtitle}</Text>
          </View>
          {chevron && (
            <View style={detailStyles.actionCardChevron}>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={accentColor || "#4a4a6a"}
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
            { transform: [{ scale: scaleAnim }] },
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

          <View style={[detailStyles.quickActionIconBg, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={22} color={iconColor} />
          </View>
          <Text style={detailStyles.quickActionLabel}>{label}</Text>
          <Text style={detailStyles.quickActionSublabel}>{sublabel}</Text>
        </Animated.View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Section Header ──────────────────────────────────────────────────

function SectionLabel({
  label,
  color = "#fbbf24",
  icon,
  delay = 0,
}: {
  label: string;
  color?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  delay?: number;
}) {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 350,
      delay,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [delay, fadeAnim]);

  return (
    <Animated.View style={[detailStyles.sectionLabel, { opacity: fadeAnim }]}>
      <View style={detailStyles.sectionLabelRow}>
        {icon && (
          <Ionicons
            name={icon}
            size={14}
            color={`${color}99`}
            style={{ marginRight: 6 }}
          />
        )}
        <Text style={[detailStyles.sectionLabelText, { color: `${color}CC` }]}>
          {label}
        </Text>
      </View>
      <View style={detailStyles.sectionLabelLine}>
        <LinearGradient
          colors={[`${color}40`, "transparent"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={{ flex: 1, height: 1 }}
        />
      </View>
    </Animated.View>
  );
}



// ─── Main Screen ─────────────────────────────────────────────────────

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
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
  const { dialogProps, showDestructive, showAlert } = useDialog();
  const { toastProps, showSuccess: toastSuccess, showError: toastError } = useToast();

  // Edit campaign modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editNombre, setEditNombre] = useState("");
  const [editDescripcion, setEditDescripcion] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  // Master mode state
  const [showMasterMode, setShowMasterMode] = useState(false);

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
    }, [id, loadCampaigns, getCampaignById, setActiveCampaign, touchCampaign])
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
      { confirmText: "Eliminar", cancelText: "Cancelar" }
    );
  };

  const handleCreateCharacter = () => {
    router.push(`/campaigns/${id}/character/create`);
  };

  const handleOpenCharacterSheet = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenCombat = () => {
    router.push(`/campaigns/${id}/character/sheet`);
    // We navigate to the sheet; the user can tap the Combat tab.
    // A small delay + state approach could auto-select the tab, but navigating is enough.
  };

  const handleOpenSpells = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenInventory = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenNotes = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenMasterMode = () => {
    setShowMasterMode(true);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-dark-800 items-center justify-center">
        <ActivityIndicator size="large" color="#c62828" />
        <Text className="text-dark-300 text-base mt-4">
          Cargando partida...
        </Text>
      </View>
    );
  }

  if (!campaign) {
    return (
      <View className="flex-1 bg-dark-800 items-center justify-center px-8">
        <View className="h-20 w-20 rounded-full bg-dark-700 items-center justify-center mb-6">
          <Ionicons name="alert-circle-outline" size={44} color="#ef4444" />
        </View>
        <Text className="text-white text-xl font-bold text-center mb-2">
          Partida no encontrada
        </Text>
        <Text className="text-dark-300 text-base text-center mb-8">
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
    }
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
        <View className="bg-dark-800 rounded-t-3xl border-t border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-white text-lg font-bold">
              Editar Partida
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-dark-700 items-center justify-center"
              onPress={() => setShowEditModal(false)}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Nombre */}
            <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider mt-2">
              Nombre de la partida{" "}
              <Text className="text-primary-500">*</Text>
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3.5 text-white text-base border border-surface-border mb-4"
              placeholder="Nombre de la partida"
              placeholderTextColor="#666699"
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
            <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3.5 text-white text-base border border-surface-border min-h-[120px] mb-4"
              placeholder="Descripción de la campaña..."
              placeholderTextColor="#666699"
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
                  : "bg-dark-600 opacity-50"
              }`}
              onPress={handleSaveEdit}
              disabled={!editNombre.trim() || editSaving}
            >
              <Text className="text-white font-bold text-base">
                {editSaving ? "Guardando..." : "Guardar Cambios"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3.5 items-center active:bg-surface-light"
              onPress={() => setShowEditModal(false)}
            >
              <Text className="text-dark-300 font-semibold text-base">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  // ── Master Mode Modal ──
  const renderMasterModeModal = () => (
    <Modal
      visible={showMasterMode}
      animationType="slide"
      transparent={false}
      onRequestClose={() => setShowMasterMode(false)}
    >
      <View className="flex-1 bg-dark-800">
        {/* Header */}
        <View className="px-5 pt-14 pb-4 border-b border-surface-border">
          <View className="flex-row items-center justify-between">
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-surface items-center justify-center active:bg-surface-light"
              onPress={() => setShowMasterMode(false)}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-gold-400 text-lg font-bold">
              Modo Master (DM)
            </Text>
            <View className="h-10 w-10" />
          </View>
        </View>

        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Campaign Info */}
          <View className="bg-surface-card rounded-card border border-gold-600/30 p-4 mt-4 mb-4">
            <View className="flex-row items-center mb-3">
              <View className="h-12 w-12 rounded-xl bg-gold-500/20 items-center justify-center mr-3">
                <Ionicons name="eye" size={24} color="#d4a017" />
              </View>
              <View className="flex-1">
                <Text className="text-gold-400 text-base font-bold">
                  {campaign.nombre}
                </Text>
                <Text className="text-dark-300 text-xs">
                  Herramientas de Dungeon Master
                </Text>
              </View>
            </View>
          </View>

          {/* Initiative Tracker */}
          <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
            Herramientas de Combate
          </Text>

          <TouchableOpacity
            className="bg-surface-card rounded-card border border-surface-border p-4 mb-3 flex-row items-center active:bg-surface-light"
            onPress={() => {
              showToast("Tirada de iniciativa: " + (Math.floor(Math.random() * 20) + 1));
            }}
          >
            <View className="h-12 w-12 rounded-xl bg-amber-500/20 items-center justify-center mr-4">
              <Ionicons name="flash" size={24} color="#f59e0b" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                Tirada de Iniciativa
              </Text>
              <Text className="text-dark-300 text-sm mt-0.5">
                Pulsa para tirar 1d20 de iniciativa
              </Text>
            </View>
            <Ionicons name="dice-outline" size={22} color="#f59e0b" />
          </TouchableOpacity>

          {/* Quick Dice Roller */}
          <Text className="text-dark-200 text-sm font-semibold mb-3 mt-4 uppercase tracking-wider">
            Tiradas Rápidas
          </Text>

          <View className="flex-row flex-wrap mb-4">
            {[
              { die: "d4", sides: 4, color: "#22c55e" },
              { die: "d6", sides: 6, color: "#3b82f6" },
              { die: "d8", sides: 8, color: "#a855f7" },
              { die: "d10", sides: 10, color: "#ec4899" },
              { die: "d12", sides: 12, color: "#f59e0b" },
              { die: "d20", sides: 20, color: "#ef4444" },
              { die: "d100", sides: 100, color: "#14b8a6" },
            ].map((dice) => (
              <TouchableOpacity
                key={dice.die}
                className="rounded-xl border border-surface-border p-3 mr-2 mb-2 items-center active:opacity-70"
                style={{ backgroundColor: `${dice.color}15`, borderColor: `${dice.color}30`, minWidth: 72 }}
                onPress={() => {
                  const result = Math.floor(Math.random() * dice.sides) + 1;
                  showAlert(
                    `🎲 ${dice.die}`,
                    `Resultado: ${result}`,
                    { type: "info", buttonText: "OK" }
                  );
                }}
              >
                <Ionicons name="dice-outline" size={24} color={dice.color} />
                <Text className="text-sm font-bold mt-1" style={{ color: dice.color }}>
                  {dice.die}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* NPC Quick Generator */}
          <Text className="text-dark-200 text-sm font-semibold mb-3 mt-2 uppercase tracking-wider">
            Generador Rápido de NPC
          </Text>

          <TouchableOpacity
            className="bg-surface-card rounded-card border border-surface-border p-4 mb-3 flex-row items-center active:bg-surface-light"
            onPress={() => {
              const nombres = [
                "Theron", "Elara", "Brom", "Lyra", "Gareth", "Isolde",
                "Darian", "Mira", "Aldric", "Selene", "Kael", "Nessa",
                "Roderick", "Vala", "Magnus", "Freya", "Orion", "Zara",
              ];
              const profesiones = [
                "Tabernero/a", "Herrero/a", "Mercader", "Guardia", "Curandero/a",
                "Bardo", "Ladrón/a", "Sacerdote/isa", "Granjero/a", "Noble",
                "Soldado", "Mago/a errante", "Cazarrecompensas", "Marinero/a",
              ];
              const rasgos = [
                "habla en susurros", "ríe nerviosamente", "siempre mira por encima del hombro",
                "tiene una cicatriz notable", "es extremadamente educado/a",
                "desconfía de los extraños", "colecciona monedas extrañas",
                "cuenta historias increíbles", "tiene un acento extraño",
                "siempre está comiendo algo", "parpadea excesivamente",
              ];
              const nombre = nombres[Math.floor(Math.random() * nombres.length)];
              const profesion = profesiones[Math.floor(Math.random() * profesiones.length)];
              const rasgo = rasgos[Math.floor(Math.random() * rasgos.length)];

              showAlert(
                "NPC Generado",
                `Nombre: ${nombre}\nProfesión: ${profesion}\nRasgo: ${rasgo}`,
                { type: "success", buttonText: "OK" }
              );
            }}
          >
            <View className="h-12 w-12 rounded-xl bg-purple-500/20 items-center justify-center mr-4">
              <Ionicons name="people" size={24} color="#a855f7" />
            </View>
            <View className="flex-1">
              <Text className="text-white text-base font-semibold">
                Generar NPC
              </Text>
              <Text className="text-dark-300 text-sm mt-0.5">
                Nombre, profesión y rasgo aleatorios
              </Text>
            </View>
            <Ionicons name="sparkles" size={22} color="#a855f7" />
          </TouchableOpacity>

          {/* Quick encounter difficulty reference */}
          <Text className="text-dark-200 text-sm font-semibold mb-3 mt-4 uppercase tracking-wider">
            Referencia Rápida
          </Text>

          <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-3">
            <Text className="text-white text-sm font-semibold mb-2">
              Dificultad de Encuentro (Nv. 1)
            </Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-green-400 text-lg font-bold">25</Text>
                <Text className="text-dark-400 text-[10px] uppercase">Fácil</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-yellow-400 text-lg font-bold">50</Text>
                <Text className="text-dark-400 text-[10px] uppercase">Medio</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-orange-400 text-lg font-bold">75</Text>
                <Text className="text-dark-400 text-[10px] uppercase">Difícil</Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-red-400 text-lg font-bold">100</Text>
                <Text className="text-dark-400 text-[10px] uppercase">Mortal</Text>
              </View>
            </View>
            <Text className="text-dark-500 text-[10px] mt-2 text-center">
              XP total del encuentro por personaje
            </Text>
          </View>

          {/* Common DCs */}
          <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-3">
            <Text className="text-white text-sm font-semibold mb-2">
              CDs Comunes
            </Text>
            {[
              { label: "Muy fácil", dc: "5", color: "#22c55e" },
              { label: "Fácil", dc: "10", color: "#84cc16" },
              { label: "Moderada", dc: "15", color: "#eab308" },
              { label: "Difícil", dc: "20", color: "#f97316" },
              { label: "Muy difícil", dc: "25", color: "#ef4444" },
              { label: "Casi imposible", dc: "30", color: "#dc2626" },
            ].map((row) => (
              <View
                key={row.dc}
                className="flex-row items-center justify-between py-1.5 border-b border-surface-border/30"
              >
                <Text className="text-dark-200 text-sm">{row.label}</Text>
                <Text className="text-sm font-bold" style={{ color: row.color }}>
                  CD {row.dc}
                </Text>
              </View>
            ))}
          </View>

          {/* Conditions quick reference */}
          <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-3">
            <Text className="text-white text-sm font-semibold mb-2">
              Condiciones Rápidas
            </Text>
            <View className="flex-row flex-wrap">
              {[
                "Agarrado", "Asustado", "Aturdido", "Cegado", "Derribado",
                "Encantado", "Ensordecido", "Envenenado", "Incapacitado",
                "Inconsciente", "Invisible", "Paralizado", "Petrificado",
                "Restringido",
              ].map((cond) => (
                <View
                  key={cond}
                  className="bg-dark-700 rounded-full px-2.5 py-1 mr-1.5 mb-1.5 border border-surface-border"
                >
                  <Text className="text-dark-200 text-[10px]">{cond}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Session notes shortcut */}
          {hasCharacter && (
            <TouchableOpacity
              className="bg-surface-card rounded-card border border-blue-500/30 p-4 mb-4 flex-row items-center active:bg-surface-light"
              onPress={() => {
                setShowMasterMode(false);
                handleOpenNotes();
              }}
            >
              <View className="h-12 w-12 rounded-xl bg-blue-500/20 items-center justify-center mr-4">
                <Ionicons name="document-text" size={24} color="#3b82f6" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-base font-semibold">
                  Notas de la Partida
                </Text>
                <Text className="text-dark-300 text-sm mt-0.5">
                  Accede a las notas y diario de sesión
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#3b82f6" />
            </TouchableOpacity>
          )}
        </ScrollView>
      </View>
    </Modal>
  );

  return (
    <View style={detailStyles.container}>
      {/* Full background gradient */}
      <LinearGradient
        colors={["#0d0d1a", "#141425", "#1a1a2e", "#1a1a2e"]}
        locations={[0, 0.12, 0.3, 1]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Hero Header ── */}
        <View style={detailStyles.heroHeader}>
          <LinearGradient
            colors={["#0d0d1a", "#13132200"]}
            style={StyleSheet.absoluteFill}
          />

          {/* Top buttons row */}
          <View style={detailStyles.heroTopRow}>
            <TouchableOpacity
              style={detailStyles.heroButton}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={20} color="white" />
            </TouchableOpacity>

            <View style={detailStyles.heroActions}>
              <TouchableOpacity
                style={detailStyles.heroButton}
                onPress={handleEditCampaign}
                activeOpacity={0.7}
              >
                <Ionicons name="pencil" size={16} color="#fbbf24" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[detailStyles.heroButton, { marginLeft: 8 }]}
                onPress={handleDeleteCampaign}
                activeOpacity={0.7}
              >
                <Ionicons name="trash-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Campaign title area */}
          <View style={detailStyles.heroTitleArea}>
            <Text style={detailStyles.heroLabel}>Partida</Text>
            <Text style={detailStyles.heroTitle}>{campaign.nombre}</Text>

            {campaign.descripcion ? (
              <Text style={detailStyles.heroDescription}>
                {campaign.descripcion}
              </Text>
            ) : null}

            {/* Date badges */}
            <View style={detailStyles.heroDateRow}>
              <View style={detailStyles.heroBadge}>
                <Ionicons name="calendar-outline" size={12} color="#666699" />
                <Text style={detailStyles.heroBadgeText}>
                  Creada: {createdDate}
                </Text>
              </View>
              <View style={detailStyles.heroBadge}>
                <Ionicons name="time-outline" size={12} color="#666699" />
                <Text style={detailStyles.heroBadgeText}>
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
                hasCharacter ? "#c6282844" : "#3a3a5c66",
                hasCharacter ? "#c62828" : "#3a3a5c",
                hasCharacter ? "#c6282844" : "#3a3a5c66",
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
            <SectionLabel label="Tu Personaje" icon="shield-half-sharp" color="#c62828" delay={100} />

            <ActionCard
              icon="shield-half-sharp"
              iconColor="#c62828"
              iconBg="rgba(198,40,40,0.15)"
              title="Ver Hoja de Personaje"
              subtitle="Estadísticas, hechizos, inventario y más"
              onPress={handleOpenCharacterSheet}
              delay={150}
              accentColor="#c62828"
            />

            {/* Quick action grid */}
            <View style={detailStyles.quickActionRow}>
              <QuickActionItem
                icon="heart"
                iconColor="#22c55e"
                iconBg="rgba(34,197,94,0.15)"
                label="Combate"
                sublabel="Vida y ataques"
                onPress={handleOpenCombat}
                delay={200}
              />
              <View style={{ width: 10 }} />
              <QuickActionItem
                icon="flame"
                iconColor="#ef4444"
                iconBg="rgba(239,68,68,0.15)"
                label="Hechizos"
                sublabel="Magia y trucos"
                onPress={handleOpenSpells}
                delay={250}
              />
            </View>

            <View style={detailStyles.quickActionRow}>
              <QuickActionItem
                icon="bag-handle"
                iconColor="#d4a017"
                iconBg="rgba(212,160,23,0.15)"
                label="Inventario"
                sublabel="Objetos y oro"
                onPress={handleOpenInventory}
                delay={300}
              />
              <View style={{ width: 10 }} />
              <QuickActionItem
                icon="document-text"
                iconColor="#3b82f6"
                iconBg="rgba(59,130,246,0.15)"
                label="Notas"
                sublabel="Diario y apuntes"
                onPress={handleOpenNotes}
                delay={350}
              />
            </View>

            {/* Ornate divider */}
            <View style={detailStyles.ornateDivider}>
              <LinearGradient
                colors={["transparent", "#fbbf2440", "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ height: 1, flex: 1 }}
              />
              <View style={detailStyles.ornateDiamondWrapper}>
                <View style={detailStyles.ornateDiamond} />
              </View>
              <LinearGradient
                colors={["transparent", "#fbbf2440", "transparent"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ height: 1, flex: 1 }}
              />
            </View>

            {/* Master mode */}
            <SectionLabel label="Herramientas de Partida" icon="eye" color="#d4a017" delay={400} />

            <ActionCard
              icon="eye"
              iconColor="#d4a017"
              iconBg="rgba(212,160,23,0.15)"
              title="Modo Master (DM)"
              subtitle="Dados, NPC, referencia rápida y más"
              onPress={handleOpenMasterMode}
              delay={450}
              accentColor="#d4a017"
              borderAccent
            />
          </View>
        ) : (
          /* ── No Character — Creation Prompt ── */
          <View style={detailStyles.sectionContainer}>
            <View style={detailStyles.createCard}>
              {/* Inner gradient overlay */}
              <LinearGradient
                colors={[
                  "rgba(255,255,255,0.02)",
                  "rgba(255,255,255,0)",
                  "rgba(0,0,0,0.05)",
                ]}
                style={StyleSheet.absoluteFill}
              />

              {/* Floating icon */}
              <View style={detailStyles.createIconOuter}>
                <View style={detailStyles.createIconRing} />
                <LinearGradient
                  colors={["#252540", "#1e1e38"]}
                  style={detailStyles.createIconBg}
                >
                  <Ionicons name="person-add-outline" size={42} color="#666699" />
                </LinearGradient>
                <View style={detailStyles.createIconSparkle}>
                  <Ionicons name="sparkles" size={14} color="#fbbf2480" />
                </View>
              </View>

              <Text style={detailStyles.createTitle}>Crea tu personaje</Text>
              <Text style={detailStyles.createSubtitle}>
                Esta partida aún no tiene personaje. Comienza el proceso de
                creación paso a paso: elige raza, clase, estadísticas y mucho
                más.
              </Text>

              {/* CTA Button with gradient */}
              <TouchableOpacity
                style={detailStyles.createButton}
                onPress={handleCreateCharacter}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={["#d32f2f", "#c62828", "#a51c1c"]}
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
                  colors={["transparent", "#fbbf2430", "transparent"]}
                  start={{ x: 0, y: 0.5 }}
                  end={{ x: 1, y: 0.5 }}
                  style={{ height: 1, width: "100%" }}
                />
              </View>

              {/* Steps preview */}
              <Text style={detailStyles.stepsTitle}>Pasos del proceso</Text>

              {[
                { icon: "text-outline", label: "Nombre del personaje" },
                { icon: "people-outline", label: "Raza y subraza" },
                { icon: "shield-outline", label: "Clase" },
                { icon: "stats-chart-outline", label: "Estadísticas" },
                { icon: "book-outline", label: "Trasfondo" },
                { icon: "school-outline", label: "Habilidades" },
                { icon: "flame-outline", label: "Hechizos (si aplica)" },
                { icon: "bag-outline", label: "Equipamiento" },
                { icon: "chatbubble-outline", label: "Personalidad" },
                { icon: "body-outline", label: "Apariencia (opcional)" },
                { icon: "checkmark-circle-outline", label: "Resumen y confirmación" },
              ].map((step, index) => (
                <View key={index} style={detailStyles.stepRow}>
                  <View style={detailStyles.stepNumber}>
                    <Text style={detailStyles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Ionicons
                    name={step.icon as any}
                    size={15}
                    color="#555577"
                  />
                  <Text style={detailStyles.stepLabel}>{step.label}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      {/* Modals */}
      {renderEditModal()}
      {renderMasterModeModal()}

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
    backgroundColor: "#1a1a2e",
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
    color: "#fbbf24",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 4,
    textShadowColor: "rgba(251,191,36,0.2)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  heroTitle: {
    color: "#ffffff",
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  heroDescription: {
    color: "#8c8cb3",
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
    color: "#555577",
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

  // ── Section Label ──
  sectionLabel: {
    marginBottom: 12,
  },
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  sectionLabelLine: {
    height: 1,
  },

  // ── Action Card ──
  actionCard: {
    borderRadius: 14,
    backgroundColor: "#23233d",
    borderWidth: 1,
    borderColor: "#3a3a5c",
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
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 2,
  },
  actionCardSubtitle: {
    color: "#8c8cb3",
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
    backgroundColor: "#23233d",
    borderWidth: 1,
    borderColor: "#3a3a5c",
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
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "700",
  },
  quickActionSublabel: {
    color: "#666699",
    fontSize: 10,
    fontWeight: "500",
    marginTop: 2,
  },

  // ── Ornate Divider ──
  ornateDivider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 18,
    paddingHorizontal: 12,
  },
  ornateDiamondWrapper: {
    paddingHorizontal: 12,
  },
  ornateDiamond: {
    width: 7,
    height: 7,
    backgroundColor: "#fbbf2460",
    transform: [{ rotate: "45deg" }],
    shadowColor: "#fbbf24",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },

  // ── Create Character Card ──
  createCard: {
    borderRadius: 16,
    backgroundColor: "#23233d",
    borderWidth: 1,
    borderColor: "#3a3a5c",
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
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  createSubtitle: {
    color: "#8c8cb3",
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
    shadowColor: "#c62828",
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
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
  },
  createDivider: {
    width: "80%",
    marginVertical: 20,
  },
  stepsTitle: {
    color: "#555577",
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    textAlign: "center",
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 4,
  },
  stepNumber: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  stepNumberText: {
    color: "#555577",
    fontSize: 11,
    fontWeight: "700",
  },
  stepLabel: {
    color: "#8c8cb3",
    fontSize: 13,
    marginLeft: 8,
    fontWeight: "500",
  },
});
