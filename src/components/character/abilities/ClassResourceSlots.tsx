import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import type { ClassResourcesState } from "@/stores/characterStore";
import { UNLIMITED_RESOURCE } from "@/stores/characterStore/helpers";

interface ClassResourceSlotsProps {
  classResources: ClassResourcesState | null;
  classTheme?: { icon: string; color: string; label: string };
  onRestoreAll: () => void;
  onUse: (resourceId: string, nombre: string) => void;
  onRestore: (resourceId: string, nombre: string) => void;
}

export default function ClassResourceSlots({
  classResources,
  classTheme,
  onRestoreAll,
  onUse,
  onRestore,
}: ClassResourceSlotsProps) {
  const { colors } = useTheme();

  if (!classResources) return null;
  const resourceEntries = Object.values(classResources.resources);
  if (resourceEntries.length === 0) return null;

  return (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons
            name="flash"
            size={20}
            color={classTheme?.color ?? colors.accentBlue}
          />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Recursos de Clase
          </Text>
        </View>
        {resourceEntries.some((r) => r.current < r.max && r.max < UNLIMITED_RESOURCE) && (
          <TouchableOpacity
            className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
            onPress={onRestoreAll}
          >
            <Text className="text-blue-400 text-xs font-semibold">
              Restaurar todos
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {resourceEntries.map((res) => {
        const isUnlimited = res.max >= UNLIMITED_RESOURCE;
        const available = res.current;
        const total = res.max;
        const resColor = classTheme?.color ?? colors.accentBlue;
        const pct =
          total > 0 && !isUnlimited ? (available / total) * 100 : 100;
        const showDots = total <= 10 && !isUnlimited;

        return (
          <View key={res.id} className="mb-4">
            <View className="flex-row items-center justify-between mb-1.5">
              <Text className="text-dark-600 dark:text-dark-200 text-sm font-medium">
                {res.nombre}
              </Text>
              <Text className="text-dark-400 text-xs">
                {isUnlimited
                  ? "∞ / Ilimitado"
                  : `${available}/${total} disponibles`}
              </Text>
            </View>

            {/* Dot indicators (like spell slots) for resources <= 10 */}
            {showDots && (
              <View className="flex-row items-center">
                <View className="flex-row flex-1 flex-wrap">
                  {Array.from({ length: total }).map((_, i) => {
                    const isAvailable = i < available;
                    return (
                      <TouchableOpacity
                        key={i}
                        className="h-9 w-9 rounded-lg mx-0.5 mb-1 items-center justify-center border"
                        style={{
                          backgroundColor: isAvailable
                            ? `${resColor}20`
                            : colors.bgPrimary,
                          borderColor: isAvailable
                            ? `${resColor}66`
                            : colors.borderDefault,
                        }}
                        onPress={() =>
                          isAvailable
                            ? onUse(res.id, res.nombre)
                            : onRestore(res.id, res.nombre)
                        }
                      >
                        <Ionicons
                          name={isAvailable ? "ellipse" : "ellipse-outline"}
                          size={14}
                          color={
                            isAvailable ? resColor : colors.borderDefault
                          }
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => onUse(res.id, res.nombre)}
                  disabled={available <= 0}
                  style={{ opacity: available > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="remove" size={16} color={resColor} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() =>
                    onRestore(res.id, res.nombre)
                  }
                  disabled={available >= total}
                  style={{ opacity: available < total ? 1 : 0.4 }}
                >
                  <Ionicons name="add" size={16} color={resColor} />
                </TouchableOpacity>
              </View>
            )}

            {/* Progress bar for resources > 10 (e.g. Ki at high levels) */}
            {!showDots && !isUnlimited && (
              <View>
                <View className="h-4 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden mb-2">
                  <View
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: resColor,
                    }}
                  />
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity
                    className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 mr-2 active:opacity-70"
                    onPress={() => onUse(res.id, res.nombre)}
                    disabled={available <= 0}
                    style={{ opacity: available > 0 ? 1 : 0.4 }}
                  >
                    <Ionicons
                      name="remove-circle-outline"
                      size={16}
                      color={resColor}
                    />
                    <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                      −1
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 active:opacity-70"
                    onPress={() =>
                      onRestore(res.id, res.nombre)
                    }
                    disabled={available >= total}
                    style={{ opacity: available < total ? 1 : 0.4 }}
                  >
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color={colors.accentGreen}
                    />
                    <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                      Restaurar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {isUnlimited && (
              <View className="flex-row items-center">
                <Ionicons name="infinite" size={20} color={resColor} />
                <Text className="text-dark-400 text-xs ml-1.5">
                  Uso ilimitado
                </Text>
              </View>
            )}

            <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
              Se recupera en:{" "}
              {res.recovery === "short_rest"
                ? "Descanso corto o largo"
                : "Descanso largo"}
            </Text>
          </View>
        );
      })}
    </View>
  );
}
