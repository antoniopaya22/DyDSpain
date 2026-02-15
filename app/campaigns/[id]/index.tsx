import { useCallback, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCampaignStore } from "@/stores/campaignStore";
import type { Campaign } from "@/types/campaign";

export default function CampaignDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    getCampaignById,
    loadCampaigns,
    deleteCampaign,
    touchCampaign,
    setActiveCampaign,
  } = useCampaignStore();

  const [campaign, setCampaign] = useState<Campaign | undefined>(undefined);
  const [loading, setLoading] = useState(true);

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
    router.push(`/campaigns/${id}/edit`);
  };

  const handleDeleteCampaign = () => {
    if (!campaign) return;

    Alert.alert(
      "Eliminar partida",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"?\n\nSe perderá el personaje asociado y todos sus datos de forma permanente.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            await deleteCampaign(campaign.id);
            router.replace("/");
          },
        },
      ]
    );
  };

  const handleCreateCharacter = () => {
    router.push(`/campaigns/${id}/character/create`);
  };

  const handleOpenCharacterSheet = () => {
    router.push(`/campaigns/${id}/character/sheet`);
  };

  const handleOpenMasterMode = () => {
    router.push(`/campaigns/${id}/master`);
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

  return (
    <View className="flex-1 bg-dark-800">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-16 pb-2">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-surface items-center justify-center active:bg-surface-light"
              onPress={handleGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>

            <View className="flex-row">
              <TouchableOpacity
                className="h-10 w-10 rounded-full bg-surface items-center justify-center mr-2 active:bg-surface-light"
                onPress={handleEditCampaign}
              >
                <Ionicons name="pencil" size={18} color="#fbbf24" />
              </TouchableOpacity>
              <TouchableOpacity
                className="h-10 w-10 rounded-full bg-surface items-center justify-center active:bg-surface-light"
                onPress={handleDeleteCampaign}
              >
                <Ionicons name="trash-outline" size={18} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Información de la partida */}
        <View className="px-5 mb-6">
          <Text className="text-gold-400 text-xs font-semibold tracking-wider uppercase mb-1">
            Partida
          </Text>
          <Text className="text-white text-3xl font-bold mb-3">
            {campaign.nombre}
          </Text>

          {campaign.descripcion ? (
            <Text className="text-dark-300 text-base leading-6 mb-4">
              {campaign.descripcion}
            </Text>
          ) : null}

          {/* Fechas */}
          <View className="flex-row items-center flex-wrap">
            <View className="flex-row items-center mr-5 mb-2">
              <Ionicons name="calendar-outline" size={14} color="#666699" />
              <Text className="text-dark-400 text-xs ml-1.5">
                Creada: {createdDate}
              </Text>
            </View>
            <View className="flex-row items-center mb-2">
              <Ionicons name="time-outline" size={14} color="#666699" />
              <Text className="text-dark-400 text-xs ml-1.5">
                Último acceso: {lastAccessDate}
              </Text>
            </View>
          </View>
        </View>

        {/* Separador */}
        <View className="h-px bg-surface-border mx-5 mb-6" />

        {/* Sección de personaje */}
        {hasCharacter ? (
          <View className="px-5">
            {/* Acceso al personaje */}
            <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
              Tu Personaje
            </Text>

            <TouchableOpacity
              className="rounded-card bg-surface-card border border-surface-border p-5 mb-4 active:opacity-80"
              onPress={handleOpenCharacterSheet}
            >
              <View className="flex-row items-center">
                <View className="h-16 w-16 rounded-xl bg-primary-500/20 items-center justify-center mr-4">
                  <Ionicons
                    name="shield-half-sharp"
                    size={32}
                    color="#c62828"
                  />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-bold mb-1">
                    Ver Hoja de Personaje
                  </Text>
                  <Text className="text-dark-300 text-sm">
                    Consulta y edita las estadísticas, hechizos, inventario y
                    más
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={22} color="#666699" />
              </View>
            </TouchableOpacity>

            {/* Acciones rápidas del personaje */}
            <View className="flex-row mb-4">
              <TouchableOpacity
                className="flex-1 rounded-card bg-surface-card border border-surface-border p-4 mr-2 items-center active:opacity-80"
                onPress={handleOpenCharacterSheet}
              >
                <View className="h-12 w-12 rounded-full bg-hp-full/20 items-center justify-center mb-2">
                  <Ionicons name="heart" size={24} color="#22c55e" />
                </View>
                <Text className="text-white text-sm font-semibold">
                  Combate
                </Text>
                <Text className="text-dark-400 text-xs mt-0.5">
                  Vida y ataques
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-card bg-surface-card border border-surface-border p-4 ml-2 items-center active:opacity-80"
                onPress={handleOpenCharacterSheet}
              >
                <View className="h-12 w-12 rounded-full bg-magic-evocation/20 items-center justify-center mb-2">
                  <Ionicons name="flame" size={24} color="#ef4444" />
                </View>
                <Text className="text-white text-sm font-semibold">
                  Hechizos
                </Text>
                <Text className="text-dark-400 text-xs mt-0.5">
                  Magia y trucos
                </Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row mb-6">
              <TouchableOpacity
                className="flex-1 rounded-card bg-surface-card border border-surface-border p-4 mr-2 items-center active:opacity-80"
                onPress={handleOpenCharacterSheet}
              >
                <View className="h-12 w-12 rounded-full bg-gold-500/20 items-center justify-center mb-2">
                  <Ionicons name="bag-handle" size={24} color="#d4a017" />
                </View>
                <Text className="text-white text-sm font-semibold">
                  Inventario
                </Text>
                <Text className="text-dark-400 text-xs mt-0.5">
                  Objetos y oro
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 rounded-card bg-surface-card border border-surface-border p-4 ml-2 items-center active:opacity-80"
                onPress={handleOpenCharacterSheet}
              >
                <View className="h-12 w-12 rounded-full bg-int/20 items-center justify-center mb-2">
                  <Ionicons
                    name="document-text"
                    size={24}
                    color="#2563eb"
                  />
                </View>
                <Text className="text-white text-sm font-semibold">Notas</Text>
                <Text className="text-dark-400 text-xs mt-0.5">
                  Diario y apuntes
                </Text>
              </TouchableOpacity>
            </View>

            {/* Separador */}
            <View className="h-px bg-surface-border mb-6" />

            {/* Modo Master */}
            <Text className="text-dark-200 text-sm font-semibold mb-3 uppercase tracking-wider">
              Herramientas de Partida
            </Text>

            <TouchableOpacity
              className="rounded-card bg-surface-card border border-gold-600/30 p-4 mb-4 flex-row items-center active:opacity-80"
              onPress={handleOpenMasterMode}
            >
              <View className="h-12 w-12 rounded-xl bg-gold-500/20 items-center justify-center mr-4">
                <Ionicons name="eye" size={24} color="#d4a017" />
              </View>
              <View className="flex-1">
                <Text className="text-gold-400 text-base font-bold">
                  Modo Master (DM)
                </Text>
                <Text className="text-dark-300 text-sm mt-0.5">
                  Crea una sala de sesión en vivo
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#d4a017" />
            </TouchableOpacity>
          </View>
        ) : (
          /* Sin personaje — prompt de creación */
          <View className="px-5">
            <View className="rounded-card bg-surface-card border border-surface-border p-6 items-center">
              <View className="h-24 w-24 rounded-full bg-dark-700 items-center justify-center mb-5">
                <Ionicons name="person-add-outline" size={48} color="#666699" />
              </View>

              <Text className="text-white text-xl font-bold text-center mb-2">
                Crea tu personaje
              </Text>
              <Text className="text-dark-300 text-base text-center leading-6 mb-6 px-2">
                Esta partida aún no tiene personaje. Comienza el proceso de
                creación paso a paso: elige raza, clase, estadísticas y mucho
                más.
              </Text>

              <TouchableOpacity
                className="bg-primary-500 rounded-xl px-8 py-4 flex-row items-center active:bg-primary-600 w-full justify-center"
                onPress={handleCreateCharacter}
              >
                <Ionicons name="sparkles" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Crear Personaje
                </Text>
              </TouchableOpacity>

              {/* Wizard steps preview */}
              <View className="mt-6 w-full">
                <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3 text-center">
                  Pasos del proceso
                </Text>

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
                  <View
                    key={index}
                    className="flex-row items-center mb-2.5 px-2"
                  >
                    <View className="h-7 w-7 rounded-full bg-dark-700 items-center justify-center mr-3">
                      <Text className="text-dark-400 text-xs font-bold">
                        {index + 1}
                      </Text>
                    </View>
                    <Ionicons
                      name={step.icon as any}
                      size={16}
                      color="#666699"
                    />
                    <Text className="text-dark-300 text-sm ml-2">
                      {step.label}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
