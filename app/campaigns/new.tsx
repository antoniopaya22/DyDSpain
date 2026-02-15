import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useCampaignStore } from "@/stores/campaignStore";

export default function NewCampaignScreen() {
  const router = useRouter();
  const { createCampaign } = useCampaignStore();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const isValid = nombre.trim().length > 0;

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Permiso necesario",
        "Necesitamos acceso a tu galería para seleccionar una imagen."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImagen(undefined);
  };

  const handleCreate = async () => {
    if (!isValid || saving) return;

    setSaving(true);
    try {
      const campaign = await createCampaign({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        imagen,
      });
      router.replace(`/campaigns/${campaign.id}`);
    } catch (error) {
      Alert.alert(
        "Error",
        "No se pudo crear la partida. Inténtalo de nuevo."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    if (nombre.trim().length > 0 || descripcion.trim().length > 0) {
      Alert.alert(
        "Descartar cambios",
        "¿Estás seguro de que quieres salir? Se perderán los datos introducidos.",
        [
          { text: "Seguir editando", style: "cancel" },
          {
            text: "Descartar",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-dark-800"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View className="px-5 pt-16 pb-6">
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-surface items-center justify-center mr-4 active:bg-surface-light"
              onPress={handleGoBack}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
            <Text className="text-white text-2xl font-bold flex-1">
              Nueva Partida
            </Text>
          </View>

          <Text className="text-dark-300 text-base leading-6">
            Crea una nueva campaña para empezar tu aventura. Después podrás
            crear un personaje dentro de ella.
          </Text>
        </View>

        {/* Formulario */}
        <View className="px-5">
          {/* Imagen de la partida */}
          <View className="mb-6">
            <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
              Imagen (opcional)
            </Text>

            {imagen ? (
              <View className="relative rounded-card overflow-hidden border border-surface-border">
                <View className="h-44 bg-surface-light items-center justify-center">
                  <Ionicons name="image" size={64} color="#666699" />
                  <Text className="text-dark-300 text-sm mt-2">
                    Imagen seleccionada
                  </Text>
                </View>
                <TouchableOpacity
                  className="absolute top-3 right-3 h-8 w-8 rounded-full bg-dark-900/80 items-center justify-center"
                  onPress={handleRemoveImage}
                >
                  <Ionicons name="close" size={18} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                className="h-32 rounded-card border-2 border-dashed border-surface-border items-center justify-center active:border-primary-500/50 active:bg-primary-500/5"
                onPress={handlePickImage}
              >
                <Ionicons name="image-outline" size={36} color="#666699" />
                <Text className="text-dark-400 text-sm mt-2">
                  Pulsa para elegir una imagen
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nombre de la partida */}
          <View className="mb-6">
            <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
              Nombre de la partida{" "}
              <Text className="text-primary-500">*</Text>
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3.5 text-white text-base border border-surface-border"
              placeholder="Ej: Las Minas Perdidas de Phandelver"
              placeholderTextColor="#666699"
              value={nombre}
              onChangeText={setNombre}
              maxLength={100}
              autoFocus
              returnKeyType="next"
            />
            <Text className="text-dark-400 text-xs mt-1.5 text-right">
              {nombre.length}/100
            </Text>
          </View>

          {/* Descripción */}
          <View className="mb-8">
            <Text className="text-dark-200 text-sm font-semibold mb-2 uppercase tracking-wider">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3.5 text-white text-base border border-surface-border min-h-[120px]"
              placeholder="Añade una descripción o notas sobre la campaña..."
              placeholderTextColor="#666699"
              value={descripcion}
              onChangeText={setDescripcion}
              multiline
              numberOfLines={5}
              maxLength={500}
              textAlignVertical="top"
              returnKeyType="default"
            />
            <Text className="text-dark-400 text-xs mt-1.5 text-right">
              {descripcion.length}/500
            </Text>
          </View>

          {/* Información adicional */}
          <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-8">
            <View className="flex-row items-center mb-2">
              <Ionicons name="information-circle" size={20} color="#fbbf24" />
              <Text className="text-gold-400 text-sm font-semibold ml-2">
                Siguiente paso
              </Text>
            </View>
            <Text className="text-dark-300 text-sm leading-5">
              Una vez creada la partida, podrás crear un personaje de D&D 5e
              paso a paso: elegir raza, clase, estadísticas, hechizos,
              equipamiento y más.
            </Text>
          </View>

          {/* Botón crear */}
          <TouchableOpacity
            className={`rounded-xl py-4 items-center flex-row justify-center ${
              isValid && !saving
                ? "bg-primary-500 active:bg-primary-600"
                : "bg-dark-600 opacity-50"
            }`}
            onPress={handleCreate}
            disabled={!isValid || saving}
          >
            {saving ? (
              <Text className="text-white font-bold text-base">
                Creando partida...
              </Text>
            ) : (
              <>
                <Ionicons name="add-circle" size={22} color="white" />
                <Text className="text-white font-bold text-base ml-2">
                  Crear Partida
                </Text>
              </>
            )}
          </TouchableOpacity>

          {/* Botón cancelar */}
          <TouchableOpacity
            className="mt-3 rounded-xl py-3.5 items-center active:bg-surface-light"
            onPress={handleGoBack}
          >
            <Text className="text-dark-300 font-semibold text-base">
              Cancelar
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
