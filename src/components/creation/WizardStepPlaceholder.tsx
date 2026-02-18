import { View, Text, TouchableOpacity } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

const TOTAL_STEPS = 11;

interface WizardStepPlaceholderProps {
  /** Número del paso actual (1-11) */
  stepNumber: number;
  /** Título del paso */
  title: string;
  /** Descripción breve del paso */
  description: string;
  /** Nombre del icono de Ionicons */
  iconName: keyof typeof Ionicons.glyphMap;
  /** Color del icono (hex) */
  iconColor?: string;
  /** Nombre de la ruta del siguiente paso (null si es el último) */
  nextRoute?: string;
  /** Etiqueta para el botón "Siguiente" (ej: "Siguiente: Clase") */
  nextLabel?: string;
  /** Si se permite navegar hacia atrás */
  canGoBack?: boolean;
}

/**
 * Componente placeholder reutilizable para los pasos del wizard de creación
 * de personaje que aún no están implementados.
 *
 * Muestra el progreso, título, descripción, y botones de navegación
 * con el mismo estilo visual que los pasos completados.
 */
export default function WizardStepPlaceholder({
  stepNumber,
  title,
  description,
  iconName,
  iconColor,
  nextRoute,
  nextLabel,
  canGoBack = true,
}: WizardStepPlaceholderProps) {
  const { colors } = useTheme();
  const resolvedIconColor = iconColor ?? colors.accentRed;
  const router = useRouter();
  const { id: campaignId } = useLocalSearchParams<{ id: string }>();

  const progressPercent = (stepNumber / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (!nextRoute) return;
    router.push({
      pathname: nextRoute as any,
      params: { id: campaignId },
    });
  };

  const handleBack = () => {
    router.back();
  };

  const handleCancel = () => {
    // Navegar de vuelta al detalle de la partida
    router.dismiss();
  };

  return (
    <View className="flex-1 bg-gray-50 dark:bg-dark-800">
      {/* Header con progreso */}
      <View className="px-5 pt-16 pb-4">
        <View className="flex-row items-center justify-between mb-4">
          {canGoBack ? (
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-surface items-center justify-center active:bg-gray-50 dark:active:bg-surface-light"
              onPress={handleBack}
            >
              <Ionicons name="arrow-back" size={22} color="white" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              className="h-10 w-10 rounded-full bg-gray-100 dark:bg-surface items-center justify-center active:bg-gray-50 dark:active:bg-surface-light"
              onPress={handleCancel}
            >
              <Ionicons name="close" size={22} color="white" />
            </TouchableOpacity>
          )}

          <Text className="text-dark-500 dark:text-dark-300 text-sm font-semibold">
            Paso {stepNumber} de {TOTAL_STEPS}
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
      <View className="flex-1 px-5 justify-center" style={{ marginTop: -40 }}>
        <View className="items-center mb-10">
          <View className="h-20 w-20 rounded-full bg-primary-500/15 items-center justify-center mb-5">
            <Ionicons name={iconName} size={40} color={resolvedIconColor} />
          </View>

          <Text className="text-dark-900 dark:text-white text-2xl font-bold text-center mb-2">
            {title}
          </Text>
          <Text className="text-dark-500 dark:text-dark-300 text-base text-center leading-6 px-4">
            {description}
          </Text>
        </View>

        {/* Badge "En desarrollo" */}
        <View className="items-center mb-8">
          <View className="bg-gold-500/15 border border-gold-500/30 rounded-full px-5 py-2.5 flex-row items-center">
            <Ionicons
              name="construct-outline"
              size={18}
              color={colors.accentGold}
            />
            <Text className="text-gold-700 dark:text-gold-400 text-sm font-semibold ml-2">
              En desarrollo
            </Text>
          </View>
          <Text className="text-dark-400 text-xs mt-3 text-center px-8">
            Este paso del wizard será implementado próximamente. Por ahora
            puedes navegar entre los pasos para ver la estructura.
          </Text>
        </View>
      </View>

      {/* Footer con botones de navegación */}
      <View className="px-5 pb-10 pt-4 border-t border-dark-100 dark:border-surface-border">
        {nextRoute ? (
          <TouchableOpacity
            className="rounded-xl py-4 items-center flex-row justify-center bg-primary-500 active:bg-primary-600 mb-3"
            onPress={handleNext}
          >
            <Text className="text-white font-bold text-base mr-2">
              {nextLabel ?? "Siguiente"}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className="rounded-xl py-4 items-center flex-row justify-center bg-hp-full active:opacity-80 mb-3"
            onPress={handleCancel}
          >
            <Ionicons name="checkmark-circle" size={22} color="white" />
            <Text className="text-dark-900 dark:text-white font-bold text-base ml-2">
              Confirmar y crear personaje
            </Text>
          </TouchableOpacity>
        )}

        {canGoBack && (
          <TouchableOpacity
            className="rounded-xl py-3.5 items-center active:bg-gray-50 dark:active:bg-surface-light"
            onPress={handleBack}
          >
            <Text className="text-dark-500 dark:text-dark-300 font-semibold text-base">
              Atrás
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
