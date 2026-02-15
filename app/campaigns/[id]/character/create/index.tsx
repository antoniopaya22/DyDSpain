import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const TOTAL_STEPS = 11;
const CURRENT_STEP = 1;

export default function CharacterNameStep() {
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const [nombre, setNombre] = useState("");

  const isValid = nombre.trim().length >= 1;

  const handleNext = () => {
    if (!isValid) return;
    router.push({
      pathname: "/campaigns/[id]/character/create/race",
      params: { id: campaignId },
    });
  };

  const handleCancel = () => {
    if (nombre.trim().length > 0) {
      Alert.alert(
        "Cancelar creación",
        "¿Estás seguro de que quieres cancelar? Se perderá el progreso actual.",
        [
          { text: "Seguir editando", style: "cancel" },
          {
            text: "Cancelar",
            style: "destructive",
            onPress: () => router.back(),
          },
        ]
      );
    } else {
      router.back();
    }
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-dark-800"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1">
        {/* Header con progreso */}
        <View className="px-5 pt-16 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-surface items-center justify-center active:bg-surface-light"
              onPress={handleCancel}
            >
              <Ionicons name="close" size={22} color="white" />
            </TouchableOpacity>

            <Text className="text-dark-300 text-sm font-semibold">
              Paso {CURRENT_STEP} de {TOTAL_STEPS}
            </Text>

            {/* Placeholder para mantener el layout centrado */}
            <View className="h-10 w-10" />
          </View>

          {/* Barra de progreso */}
          <View className="h-1.5 bg-surface rounded-full overflow-hidden">
            <View
              className="h-full bg-primary-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </View>
        </View>

        {/* Contenido del paso */}
        <View className="flex-1 px-5 justify-center" style={{ marginTop: -60 }}>
          <View className="items-center mb-10">
            <View className="h-20 w-20 rounded-full bg-primary-500/15 items-center justify-center mb-5">
              <Ionicons name="text-outline" size={40} color="#c62828" />
            </View>

            <Text className="text-white text-2xl font-bold text-center mb-2">
              ¿Cómo se llama tu personaje?
            </Text>
            <Text className="text-dark-300 text-base text-center leading-6 px-4">
              Elige un nombre que identifique a tu héroe en la partida. Podrás
              cambiarlo más adelante.
            </Text>
          </View>

          {/* Campo de nombre */}
          <View className="mb-6">
            <TextInput
              className="bg-surface rounded-xl px-5 py-4 text-white text-xl text-center border border-surface-border font-semibold"
              placeholder="Nombre del personaje"
              placeholderTextColor="#666699"
              value={nombre}
              onChangeText={setNombre}
              maxLength={50}
              autoFocus
              autoCorrect={false}
              returnKeyType="done"
              onSubmitEditing={handleNext}
            />
            <Text className="text-dark-400 text-xs mt-2 text-center">
              Máximo 50 caracteres · Se admiten tildes y caracteres especiales
            </Text>
          </View>

          {/* Sugerencias */}
          <View className="mb-8">
            <Text className="text-dark-400 text-xs font-semibold uppercase tracking-wider mb-3 text-center">
              Ideas de nombre
            </Text>
            <View className="flex-row flex-wrap justify-center">
              {[
                "Thorin",
                "Elara",
                "Ragnar",
                "Lyra",
                "Aldric",
                "Isolde",
                "Kael",
                "Seraphina",
              ].map((suggestion) => (
                <TouchableOpacity
                  key={suggestion}
                  className="bg-surface-card border border-surface-border rounded-full px-4 py-2 m-1 active:bg-surface-light"
                  onPress={() => setNombre(suggestion)}
                >
                  <Text className="text-dark-200 text-sm">{suggestion}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Footer con botones de navegación */}
        <View className="px-5 pb-10 pt-4 border-t border-surface-border">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center flex-row justify-center ${
              isValid
                ? "bg-primary-500 active:bg-primary-600"
                : "bg-dark-600 opacity-50"
            }`}
            onPress={handleNext}
            disabled={!isValid}
          >
            <Text className="text-white font-bold text-base mr-2">
              Siguiente: Raza
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
