/**
 * InventoryItemCard - Expandable inventory item card
 *
 * Shows item summary with category icon, name, badges (equipped, magic).
 * Expands to show weapon/armor/magic details, notes, stats, and action buttons.
 * Extracted from InventoryTab.tsx
 */

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  ITEM_CATEGORY_NAMES,
  ITEM_CATEGORY_ICONS,
  type InventoryItem,
} from "@/types/item";
import { useTheme } from "@/hooks";

interface InventoryItemCardProps {
  item: InventoryItem;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleEquip: () => void;
  onUpdateQuantity: (delta: number) => void;
  onDelete: () => void;
}

export function InventoryItemCard({
  item,
  isExpanded,
  onToggleExpand,
  onToggleEquip,
  onUpdateQuantity,
  onDelete,
}: InventoryItemCardProps) {
  const { colors } = useTheme();

  const categoryIcon = ITEM_CATEGORY_ICONS[item.categoria] ?? "📦";
  const categoryName = ITEM_CATEGORY_NAMES[item.categoria] ?? "Otro";

  return (
    <TouchableOpacity
      key={item.id}
      className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border mb-2 overflow-hidden"
      onPress={onToggleExpand}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center p-3">
        {/* Category icon */}
        <View className="h-10 w-10 rounded-lg bg-gray-200 dark:bg-dark-700 items-center justify-center mr-3">
          <Text className="text-base">{categoryIcon}</Text>
        </View>

        {/* Item info */}
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text
              className="text-sm font-semibold flex-1"
              style={{
                color: item.equipado ? colors.accentGold : colors.textPrimary,
              }}
              numberOfLines={1}
            >
              {item.nombre}
            </Text>
            {item.cantidad > 1 && (
              <View className="bg-gray-300 dark:bg-dark-600 rounded-full px-2 py-0.5 ml-1">
                <Text className="text-dark-600 dark:text-dark-200 text-[10px] font-bold">
                  x{item.cantidad}
                </Text>
              </View>
            )}
          </View>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-dark-400 text-[10px]">{categoryName}</Text>
            {item.peso > 0 && (
              <Text className="text-dark-300 dark:text-dark-500 text-[10px] ml-2">
                {item.peso * item.cantidad} lb
              </Text>
            )}
            {item.equipado && (
              <View className="flex-row items-center ml-2">
                <Ionicons
                  name="checkmark-circle"
                  size={10}
                  color={colors.accentGold}
                />
                <Text className="text-gold-700 dark:text-gold-400 text-[10px] ml-0.5">
                  Equipado
                </Text>
              </View>
            )}
            {item.magicDetails && (
              <View className="flex-row items-center ml-2">
                <Ionicons
                  name="sparkles"
                  size={10}
                  color={colors.accentPurple}
                />
                <Text className="text-purple-400 text-[10px] ml-0.5">
                  Mágico
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Equip toggle */}
        {(item.categoria === "arma" ||
          item.categoria === "armadura" ||
          item.categoria === "escudo") && (
          <TouchableOpacity
            className={`h-8 w-8 rounded-full items-center justify-center ml-2 border ${
              item.equipado
                ? "bg-gold-500/20 border-gold-500/50"
                : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
            }`}
            onPress={onToggleEquip}
          >
            <Ionicons
              name={item.equipado ? "body" : "body-outline"}
              size={16}
              color={item.equipado ? colors.accentAmber : colors.textMuted}
            />
          </TouchableOpacity>
        )}

        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </View>

      {/* Expanded details */}
      {isExpanded && (
        <View className="px-3 pb-3 border-t border-dark-100 dark:border-surface-border/50 pt-2">
          {item.descripcion && (
            <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5 mb-2">
              {item.descripcion}
            </Text>
          )}

          {/* Weapon details */}
          {item.weaponDetails && (
            <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-2.5 mb-2">
              <Text className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                Datos de Arma
              </Text>
              <Text className="text-dark-600 dark:text-dark-200 text-xs">
                Daño: {item.weaponDetails.damage.dice}{" "}
                {item.weaponDetails.damage.damageType}
              </Text>
              {item.weaponDetails.versatileDamage && (
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
                  Versátil: {item.weaponDetails.versatileDamage.dice}{" "}
                  {item.weaponDetails.versatileDamage.damageType}
                </Text>
              )}
              {item.weaponDetails.range && (
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
                  Alcance: {item.weaponDetails.range.normal}/
                  {item.weaponDetails.range.long} pies
                </Text>
              )}
              {item.weaponDetails.properties.length > 0 && (
                <Text className="text-dark-500 dark:text-dark-300 text-xs mt-1">
                  Propiedades: {item.weaponDetails.properties.join(", ")}
                </Text>
              )}
            </View>
          )}

          {/* Armor details */}
          {item.armorDetails && (
            <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-2.5 mb-2">
              <Text className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                Datos de Armadura
              </Text>
              <Text className="text-dark-600 dark:text-dark-200 text-xs">
                CA base: {item.armorDetails.baseAC}
              </Text>
              {item.armorDetails.addDexModifier && (
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
                  + mod. DES
                  {item.armorDetails.maxDexBonus !== null
                    ? ` (máx. +${item.armorDetails.maxDexBonus})`
                    : ""}
                </Text>
              )}
              {item.armorDetails.strengthRequirement && (
                <Text className="text-dark-500 dark:text-dark-300 text-xs">
                  Requiere FUE {item.armorDetails.strengthRequirement}
                </Text>
              )}
              {item.armorDetails.stealthDisadvantage && (
                <Text className="text-red-400 text-xs">
                  Desventaja en Sigilo
                </Text>
              )}
            </View>
          )}

          {/* Magic item details */}
          {item.magicDetails && (
            <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-2.5 mb-2">
              <Text className="text-purple-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                Propiedades Mágicas
              </Text>
              <Text className="text-dark-600 dark:text-dark-200 text-xs">
                Rareza: {item.magicDetails.rarity}
              </Text>
              {item.magicDetails.requiresAttunement && (
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
                  Requiere sintonización
                  {item.magicDetails.attunementRestriction
                    ? ` (${item.magicDetails.attunementRestriction})`
                    : ""}
                </Text>
              )}
              {item.magicDetails.charges && (
                <Text className="text-dark-600 dark:text-dark-200 text-xs">
                  Cargas: {item.magicDetails.charges.current}/
                  {item.magicDetails.charges.max}
                </Text>
              )}
              {item.magicDetails.magicDescription && (
                <Text className="text-dark-500 dark:text-dark-300 text-xs mt-1">
                  {item.magicDetails.magicDescription}
                </Text>
              )}
            </View>
          )}

          {/* Notes */}
          {item.notas && (
            <View className="bg-gray-200 dark:bg-dark-700 rounded-lg p-2.5 mb-2">
              <Text className="text-gold-700 dark:text-gold-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                Notas
              </Text>
              <Text className="text-dark-500 dark:text-dark-300 text-xs">
                {item.notas}
              </Text>
            </View>
          )}

          {/* Item stats */}
          <View className="flex-row flex-wrap mb-2">
            {item.valor !== undefined && item.valor > 0 && (
              <View className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-1.5 mr-2 mb-1">
                <Ionicons
                  name="cash-outline"
                  size={12}
                  color={colors.accentAmber}
                />
                <Text className="text-dark-600 dark:text-dark-200 text-xs ml-1">
                  {item.valor} MO
                </Text>
              </View>
            )}
            <View className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-1.5 mr-2 mb-1">
              <Ionicons
                name="scale-outline"
                size={12}
                color={colors.textMuted}
              />
              <Text className="text-dark-600 dark:text-dark-200 text-xs ml-1">
                {item.peso} lb c/u
              </Text>
            </View>
          </View>

          {/* Action buttons */}
          <View className="flex-row items-center justify-between mt-1">
            {/* Quantity controls */}
            <View className="flex-row items-center">
              <TouchableOpacity
                className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-dark-600 items-center justify-center active:bg-dark-500"
                onPress={() => onUpdateQuantity(-1)}
              >
                <Ionicons name="remove" size={16} color={colors.textMuted} />
              </TouchableOpacity>
              <Text className="text-dark-900 dark:text-white text-sm font-bold mx-3 min-w-[24px] text-center">
                {item.cantidad}
              </Text>
              <TouchableOpacity
                className="h-8 w-8 rounded-lg bg-gray-300 dark:bg-dark-600 items-center justify-center active:bg-dark-500"
                onPress={() => onUpdateQuantity(1)}
              >
                <Ionicons name="add" size={16} color={colors.textMuted} />
              </TouchableOpacity>
            </View>

            {/* Delete */}
            <TouchableOpacity
              className="flex-row items-center bg-red-500/15 border border-red-500/30 rounded-lg px-3 py-1.5 active:bg-red-500/30"
              onPress={onDelete}
            >
              <Ionicons
                name="trash-outline"
                size={14}
                color={colors.accentDanger}
              />
              <Text className="text-red-400 text-xs font-semibold ml-1">
                Eliminar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
}
