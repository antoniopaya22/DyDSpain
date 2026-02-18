/**
 * NoteFilterBar - Search, type filters, sort options, and tag filter
 *
 * Contains search bar, type filter chips, sort dropdown, and tag scroll.
 * Extracted from NotesTab.tsx
 */

import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  getPredefinedTags,
  type NoteType,
  type NoteSortOptions,
} from "@/types/notes";
import { useTheme } from "@/hooks";

const PREDEFINED_TAGS = getPredefinedTags();

interface NoteFilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  typeFilter: NoteType | null;
  onTypeFilterChange: (type: NoteType | null) => void;
  sortOptions: NoteSortOptions;
  onSortChange: (options: NoteSortOptions) => void;
  activeTagFilter: string | null;
  onTagFilterChange: (tagId: string | null) => void;
  showSortOptions: boolean;
  onToggleSortOptions: () => void;
}

export function NoteFilterBar({
  searchQuery,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  sortOptions,
  onSortChange,
  activeTagFilter,
  onTagFilterChange,
  showSortOptions,
  onToggleSortOptions,
}: NoteFilterBarProps) {
  const { colors } = useTheme();

  return (
    <View>
      {/* Search bar */}
      <View className="flex-row items-center bg-gray-100 dark:bg-surface rounded-xl px-3 py-2 border border-dark-100 dark:border-surface-border mb-3">
        <Ionicons name="search" size={18} color={colors.textMuted} />
        <TextInput
          className="flex-1 text-dark-900 dark:text-white text-sm ml-2.5"
          placeholder="Buscar notas..."
          placeholderTextColor={colors.textMuted}
          value={searchQuery}
          onChangeText={onSearchChange}
          autoCorrect={false}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange("")}>
            <Ionicons name="close-circle" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter row */}
      <View className="mb-3">
        {/* Type filter + Sort */}
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row">
            <FilterChip
              label="Todas"
              isActive={typeFilter === null}
              onPress={() => onTypeFilterChange(null)}
            />
            <FilterChip
              label="General"
              isActive={typeFilter === "general"}
              onPress={() =>
                onTypeFilterChange(typeFilter === "general" ? null : "general")
              }
            />
            <FilterChip
              label="Diario"
              isActive={typeFilter === "diario"}
              onPress={() =>
                onTypeFilterChange(typeFilter === "diario" ? null : "diario")
              }
            />
          </View>

          <TouchableOpacity
            className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-1.5 border border-dark-100 dark:border-surface-border active:bg-gray-300 dark:active:bg-dark-600"
            onPress={onToggleSortOptions}
          >
            <Ionicons name="swap-vertical" size={14} color={colors.textMuted} />
            <Text className="text-dark-500 dark:text-dark-300 text-[10px] ml-1">
              Ordenar
            </Text>
          </TouchableOpacity>
        </View>

        {/* Sort options dropdown */}
        {showSortOptions && (
          <View className="bg-parchment-card dark:bg-surface-card rounded-lg border border-dark-100 dark:border-surface-border p-2 mb-2">
            {(
              [
                {
                  field: "fechaModificacion" as const,
                  label: "Fecha de modificación",
                },
                { field: "fechaCreacion" as const, label: "Fecha de creación" },
                { field: "titulo" as const, label: "Título" },
                {
                  field: "numeroSesion" as const,
                  label: "Número de sesión",
                },
              ] as const
            ).map((option) => (
              <TouchableOpacity
                key={option.field}
                className={`flex-row items-center justify-between py-2 px-2 rounded-lg ${
                  sortOptions.field === option.field ? "bg-primary-500/10" : ""
                }`}
                onPress={() => {
                  if (sortOptions.field === option.field) {
                    onSortChange({
                      ...sortOptions,
                      order: sortOptions.order === "desc" ? "asc" : "desc",
                    });
                  } else {
                    onSortChange({ field: option.field, order: "desc" });
                  }
                  onToggleSortOptions();
                }}
              >
                <Text
                  className={`text-xs ${
                    sortOptions.field === option.field
                      ? "text-primary-400 font-semibold"
                      : "text-dark-500 dark:text-dark-300"
                  }`}
                >
                  {option.label}
                </Text>
                {sortOptions.field === option.field && (
                  <Ionicons
                    name={
                      sortOptions.order === "desc" ? "arrow-down" : "arrow-up"
                    }
                    size={12}
                    color={colors.accentRed}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Tag filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {PREDEFINED_TAGS.map((tag) => {
            const isActive = activeTagFilter === tag.id;
            return (
              <TouchableOpacity
                key={tag.id}
                className={`flex-row items-center rounded-full px-3 py-1.5 mr-2 border ${
                  isActive
                    ? "border-opacity-50"
                    : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
                }`}
                style={
                  isActive
                    ? {
                        backgroundColor: `${tag.color}20`,
                        borderColor: `${tag.color}50`,
                      }
                    : undefined
                }
                onPress={() => onTagFilterChange(isActive ? null : tag.id)}
              >
                <Text className="text-xs mr-1">{tag.icon}</Text>
                <Text
                  className="text-[10px] font-semibold"
                  style={{ color: isActive ? tag.color : colors.textSecondary }}
                >
                  {tag.nombre}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function FilterChip({
  label,
  isActive,
  onPress,
}: {
  label: string;
  isActive: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      className={`rounded-full px-3 py-1.5 mr-2 border ${
        isActive
          ? "bg-primary-500/20 border-primary-500/50"
          : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
      }`}
      onPress={onPress}
    >
      <Text
        className={`text-[10px] font-semibold ${
          isActive ? "text-primary-400" : "text-dark-500 dark:text-dark-300"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
