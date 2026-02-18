/**
 * QuickNoteBar - Quick note creation widget
 *
 * Collapsed state shows a prompt; expanded shows a text input + save button.
 * Extracted from NotesTab.tsx
 */

import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";

interface QuickNoteBarProps {
  onSubmit: (content: string) => Promise<void>;
  onShowToast: (message: string) => void;
}

export function QuickNoteBar({ onSubmit, onShowToast }: QuickNoteBarProps) {
  const { colors } = useTheme();
  const [showInput, setShowInput] = useState(false);
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      onShowToast("Escribe algo para la nota rápida");
      return;
    }

    try {
      await onSubmit(content.trim());
      setContent("");
      setShowInput(false);
      onShowToast("Nota rápida creada");
    } catch {
      onShowToast("Error al crear la nota rápida");
    }
  };

  return (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-3 mb-4">
      {!showInput ? (
        <TouchableOpacity
          className="flex-row items-center"
          onPress={() => setShowInput(true)}
        >
          <View className="h-9 w-9 rounded-full bg-primary-500/20 items-center justify-center mr-3">
            <Ionicons name="flash" size={18} color={colors.accentRed} />
          </View>
          <Text className="text-dark-500 dark:text-dark-300 text-sm flex-1">
            Nota rápida...
          </Text>
          <Ionicons name="create-outline" size={18} color={colors.textMuted} />
        </TouchableOpacity>
      ) : (
        <View>
          <TextInput
            className="bg-gray-200 dark:bg-dark-700 rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-2 min-h-[70px]"
            placeholder="Escribe tu nota rápida aquí..."
            placeholderTextColor={colors.textMuted}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            value={content}
            onChangeText={setContent}
            autoFocus
            maxLength={500}
          />
          <View className="flex-row justify-end">
            <TouchableOpacity
              className="mr-2 px-4 py-2 rounded-lg active:bg-gray-300 dark:active:bg-dark-600"
              onPress={() => {
                setShowInput(false);
                setContent("");
              }}
            >
              <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold">
                Cancelar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                content.trim()
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-gray-300 dark:bg-dark-600 opacity-50"
              }`}
              onPress={handleSubmit}
              disabled={!content.trim()}
            >
              <Text className="text-white text-xs font-semibold">
                Guardar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}
