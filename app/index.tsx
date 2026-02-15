import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCampaignStore } from "@/stores/campaignStore";
import type { Campaign } from "@/types/campaign";

export default function HomeScreen() {
  const router = useRouter();
  const { campaigns, loadCampaigns, deleteCampaign } = useCampaignStore();
  const [searchQuery, setSearchQuery] = useState("");

  useFocusEffect(
    useCallback(() => {
      loadCampaigns();
    }, [loadCampaigns])
  );

  const filteredCampaigns = campaigns.filter((c) =>
    c.nombre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteCampaign = (campaign: Campaign) => {
    Alert.alert(
      "Eliminar partida",
      `¿Estás seguro de que quieres eliminar "${campaign.nombre}"? Se perderá el personaje asociado de forma permanente.`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: () => deleteCampaign(campaign.id),
        },
      ]
    );
  };

  const handlePressCampaign = (campaign: Campaign) => {
    router.push(`/campaigns/${campaign.id}`);
  };

  const renderCampaignCard = ({ item }: { item: Campaign }) => {
    const hasCharacter = !!item.personajeId;

    return (
      <TouchableOpacity
        className="mb-3 rounded-card bg-surface-card border border-surface-border p-4 active:opacity-80"
        onPress={() => handlePressCampaign(item)}
        onLongPress={() => handleDeleteCampaign(item)}
      >
        <View className="flex-row items-center">
          {/* Icono de la partida */}
          <View className="h-14 w-14 rounded-xl bg-primary-500/20 items-center justify-center mr-4">
            <Ionicons
              name={hasCharacter ? "shield-half-sharp" : "add-circle-outline"}
              size={28}
              color={hasCharacter ? "#c62828" : "#666699"}
            />
          </View>

          {/* Info de la partida */}
          <View className="flex-1">
            <Text className="text-white text-lg font-bold" numberOfLines={1}>
              {item.nombre}
            </Text>
            {item.descripcion ? (
              <Text className="text-dark-300 text-sm mt-0.5" numberOfLines={1}>
                {item.descripcion}
              </Text>
            ) : null}
            <Text className="text-dark-400 text-xs mt-1">
              {hasCharacter ? "📜 Personaje creado" : "⚠️ Sin personaje"}
              {"  ·  "}
              {new Date(item.actualizadoEn).toLocaleDateString("es-ES", {
                day: "numeric",
                month: "short",
              })}
            </Text>
          </View>

          {/* Chevron */}
          <Ionicons name="chevron-forward" size={20} color="#666699" />
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyList = () => (
    <View className="flex-1 items-center justify-center px-8 pt-20">
      <View className="h-24 w-24 rounded-full bg-dark-700 items-center justify-center mb-6">
        <Ionicons name="dice-outline" size={48} color="#666699" />
      </View>
      <Text className="text-white text-xl font-bold text-center mb-2">
        ¡Bienvenido, aventurero!
      </Text>
      <Text className="text-dark-300 text-base text-center leading-6">
        No tienes ninguna partida todavía.{"\n"}Crea tu primera campaña para
        empezar a jugar.
      </Text>
      <TouchableOpacity
        className="mt-8 bg-primary-500 rounded-xl px-8 py-4 flex-row items-center active:bg-primary-600"
        onPress={() => router.push("/campaigns/new")}
      >
        <Ionicons name="add" size={22} color="white" />
        <Text className="text-white font-bold text-base ml-2">
          Crear primera partida
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View className="flex-1 bg-dark-800">
      {/* Header */}
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-gold-400 text-sm font-semibold tracking-wider uppercase">
              D&D Español
            </Text>
            <Text className="text-white text-3xl font-bold mt-1">
              Mis Partidas
            </Text>
          </View>

          {/* Botón crear partida */}
          {campaigns.length > 0 && (
            <TouchableOpacity
              className="h-12 w-12 rounded-full bg-primary-500 items-center justify-center active:bg-primary-600"
              onPress={() => router.push("/campaigns/new")}
            >
              <Ionicons name="add" size={28} color="white" />
            </TouchableOpacity>
          )}
        </View>

        {/* Barra de búsqueda */}
        {campaigns.length > 0 && (
          <View className="mt-4 flex-row items-center bg-surface rounded-xl px-4 py-3 border border-surface-border">
            <Ionicons name="search" size={18} color="#666699" />
            <TextInput
              className="flex-1 text-white text-base ml-3"
              placeholder="Buscar partida..."
              placeholderTextColor="#666699"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={18} color="#666699" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Lista de partidas */}
      <FlatList
        data={filteredCampaigns}
        keyExtractor={(item) => item.id}
        renderItem={renderCampaignCard}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 100,
          flexGrow: campaigns.length === 0 ? 1 : undefined,
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
