import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCreationStore, TOTAL_STEPS } from "@/stores/creationStore";
import { ConfirmDialog } from "@/components/ui";
import { useTheme, useDialog } from "@/hooks";

const CURRENT_STEP = 1;

export default function CharacterNameStep() {
  const { colors } = useTheme();
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const { draft, startCreation, loadDraft, saveDraft, setNombre, isStepValid } =
    useCreationStore();

  const [nombre, setNombreLocal] = useState("");
  const [initialized, setInitialized] = useState(false);
  const { dialogProps, showDestructive } = useDialog();

  // Inicializar o cargar borrador al montar
  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        if (!campaignId) return;

        // Intentar cargar borrador existente
        const loaded = await loadDraft(campaignId);
        if (loaded) {
          const currentDraft = useCreationStore.getState().draft;
          if (currentDraft?.nombre) {
            setNombreLocal(currentDraft.nombre);
          }
        } else {
          // Crear nuevo borrador
          await startCreation(campaignId);
        }
        setInitialized(true);
      };
      init();
    }, [campaignId]),
  );

  // Sincronizar el nombre local con el store
  useEffect(() => {
    if (initialized && nombre !== draft?.nombre) {
      setNombre(nombre);
    }
  }, [nombre, initialized]);

  const isValid = nombre.trim().length >= 1;

  const handleNext = async () => {
    if (!isValid) return;
    // Guardar borrador antes de navegar
    setNombre(nombre.trim());
    await saveDraft();
    router.push({
      pathname: "/campaigns/[id]/character/create/race",
      params: { id: campaignId },
    });
  };

  const handleCancel = () => {
    if (nombre.trim().length > 0) {
      showDestructive(
        "Cancelar creación",
        "¿Estás seguro de que quieres cancelar? El borrador se guardará automáticamente y podrás continuar más tarde.",
        async () => {
          if (nombre.trim().length > 0) {
            setNombre(nombre.trim());
            await saveDraft();
          }
          router.back();
        },
        { confirmText: "Salir", cancelText: "Seguir editando" },
      );
    } else {
      router.back();
    }
  };

  const progressPercent = (CURRENT_STEP / TOTAL_STEPS) * 100;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50 dark:bg-dark-800"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1">
        {/* Header con progreso */}
        <View className="px-5 pt-16 pb-4">
          <View className="flex-row items-center justify-between mb-4">
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-surface items-center justify-center active:bg-gray-50 dark:active:bg-surface-light"
              onPress={handleCancel}
            >
              <Ionicons name="close" size={22} color={colors.textPrimary} />
            </TouchableOpacity>

            <Text className="text-dark-500 dark:text-dark-300 text-sm font-semibold">
              Paso {CURRENT_STEP} de {TOTAL_STEPS}
            </Text>

            {/* Placeholder para mantener el layout centrado */}
            <View className="h-10 w-10" />
          </View>

          {/* Barra de progreso */}
          <View className="h-1.5 bg-gray-100 dark:bg-surface rounded-full overflow-hidden">
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
              <Ionicons
                name="text-outline"
                size={40}
                color={colors.accentRed}
              />
            </View>

            <Text className="text-dark-900 dark:text-white text-2xl font-bold text-center mb-2">
              ¿Cómo se llama tu personaje?
            </Text>
            <Text className="text-dark-500 dark:text-dark-300 text-base text-center leading-6 px-4">
              Elige un nombre que identifique a tu héroe en la partida. Podrás
              cambiarlo más adelante.
            </Text>
          </View>

          {/* Campo de nombre */}
          <View className="mb-6">
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-5 py-4 text-dark-900 dark:text-white text-xl text-center border border-dark-100 dark:border-surface-border font-semibold"
              placeholder="Nombre del personaje"
              placeholderTextColor={colors.textMuted}
              value={nombre}
              onChangeText={setNombreLocal}
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
                  className="bg-white dark:bg-surface-card border border-dark-100 dark:border-surface-border rounded-full px-4 py-2 m-1 active:bg-gray-50 dark:active:bg-surface-light"
                  onPress={() => setNombreLocal(suggestion)}
                >
                  <Text className="text-dark-600 dark:text-dark-200 text-sm">
                    {suggestion}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>

        {/* Footer con botones de navegación */}
        <View className="px-5 pb-10 pt-4 border-t border-dark-100 dark:border-surface-border">
          <TouchableOpacity
            className={`rounded-xl py-4 items-center flex-row justify-center ${
              isValid
                ? "bg-primary-500 active:bg-primary-600"
                : "bg-gray-300 dark:bg-dark-600 opacity-50"
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
      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />
    </KeyboardAvoidingView>
  );
}
