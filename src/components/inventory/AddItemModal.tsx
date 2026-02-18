/**
 * AddItemModal - Bottom-sheet modal for adding new inventory items
 *
 * Form with name, category, quantity, weight, value, and description fields.
 * Extracted from InventoryTab.tsx
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ITEM_CATEGORY_ICONS, type ItemCategory } from "@/types/item";
import { useTheme } from "@/hooks";

const CATEGORY_OPTIONS: { value: ItemCategory; label: string }[] = [
  { value: "arma", label: "Arma" },
  { value: "armadura", label: "Armadura" },
  { value: "escudo", label: "Escudo" },
  { value: "equipo_aventurero", label: "Equipo de aventurero" },
  { value: "herramienta", label: "Herramienta" },
  { value: "consumible", label: "Consumible" },
  { value: "municion", label: "Munición" },
  { value: "objeto_magico", label: "Objeto mágico" },
  { value: "montura_vehiculo", label: "Montura / Vehículo" },
  { value: "otro", label: "Otro" },
];

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onShowToast: (message: string) => void;
}

export function AddItemModal({
  visible,
  onClose,
  onShowToast,
}: AddItemModalProps) {
  const { colors } = useTheme();
  const { addItem } = useCharacterStore();

  const [name, setName] = useState("");
  const [category, setCategory] = useState<ItemCategory>("otro");
  const [quantity, setQuantity] = useState("1");
  const [weight, setWeight] = useState("0");
  const [description, setDescription] = useState("");
  const [value, setValue] = useState("");

  const resetForm = () => {
    setName("");
    setCategory("otro");
    setQuantity("1");
    setWeight("0");
    setDescription("");
    setValue("");
  };

  const handleSubmit = async () => {
    if (!name.trim()) {
      onShowToast("Introduce un nombre para el objeto");
      return;
    }

    const qty = parseInt(quantity, 10) || 1;
    const wt = parseFloat(weight) || 0;
    const val = parseFloat(value) || undefined;

    await addItem({
      nombre: name.trim(),
      categoria: category,
      cantidad: qty,
      peso: wt,
      valor: val,
      descripcion: description.trim() || undefined,
      equipado: false,
      custom: true,
    });

    const itemName = name.trim();
    resetForm();
    onClose();
    onShowToast(`"${itemName}" añadido al inventario`);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-gray-50 dark:bg-dark-800 rounded-t-3xl border-t border-dark-100 dark:border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-dark-900 dark:text-white text-lg font-bold">
              Añadir Objeto
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center"
              onPress={onClose}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Name */}
            <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5 mt-2">
              Nombre <Text className="text-primary-500">*</Text>
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-4"
              placeholder="Ej: Espada larga"
              placeholderTextColor={colors.textMuted}
              value={name}
              onChangeText={setName}
              maxLength={100}
              autoFocus
            />

            {/* Category */}
            <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
              Categoría
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = category === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    className={`rounded-full px-3.5 py-2 mr-2 border ${
                      isSelected
                        ? "bg-primary-500/20 border-primary-500/50"
                        : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
                    }`}
                    onPress={() => setCategory(opt.value)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected
                          ? "text-primary-400"
                          : "text-dark-500 dark:text-dark-300"
                      }`}
                    >
                      {ITEM_CATEGORY_ICONS[opt.value]} {opt.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Quantity & Weight row */}
            <View className="flex-row mb-4">
              <View className="flex-1 mr-2">
                <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Cantidad
                </Text>
                <TextInput
                  className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border"
                  placeholder="1"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                />
              </View>
              <View className="flex-1 mx-1">
                <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Peso (lb)
                </Text>
                <TextInput
                  className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border"
                  placeholder="0"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={weight}
                  onChangeText={setWeight}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Valor (MO)
                </Text>
                <TextInput
                  className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border"
                  placeholder="—"
                  placeholderTextColor={colors.textMuted}
                  keyboardType="decimal-pad"
                  value={value}
                  onChangeText={setValue}
                />
              </View>
            </View>

            {/* Description */}
            <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-gray-100 dark:bg-surface rounded-xl px-4 py-3 text-dark-900 dark:text-white text-sm border border-dark-100 dark:border-surface-border mb-6 min-h-[80px]"
              placeholder="Añade una descripción..."
              placeholderTextColor={colors.textMuted}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
              maxLength={500}
            />

            {/* Submit */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                name.trim()
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-gray-300 dark:bg-dark-600 opacity-50"
              }`}
              onPress={handleSubmit}
              disabled={!name.trim()}
            >
              <Text className="text-white font-bold text-base">
                Añadir al Inventario
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3 items-center active:bg-gray-50 dark:active:bg-surface-light"
              onPress={onClose}
            >
              <Text className="text-dark-500 dark:text-dark-300 font-semibold text-sm">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
