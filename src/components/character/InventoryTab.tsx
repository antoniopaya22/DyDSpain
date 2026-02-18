/**
 * InventoryTab - Pestaña de inventario del personaje
 * Muestra: lista de objetos, equipar/desequipar, monedas, peso,
 * formulario para añadir objetos, y transacciones de monedas.
 *
 * Sub-components extracted to src/components/inventory/:
 *   InventoryItemCard, AddItemModal, CoinTransactionModal
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useTheme, useDialog, useToast } from "@/hooks";
import {
  ITEM_CATEGORY_NAMES,
  COIN_ABBR,
  COIN_ICONS,
  calcCoinWeight,
  calcInventoryWeight,
  calcCarryingCapacity,
  calcEncumbrancePercentage,
  calcTotalGoldValue,
  countActiveAttunements,
  type ItemCategory,
  type CoinType,
  type InventoryItem,
} from "@/types/item";

// Extracted sub-components
import {
  InventoryItemCard,
  AddItemModal,
  CoinTransactionModal,
} from "@/components/inventory";

// ─── Helpers ─────────────────────────────────────────────────────────

const COIN_ORDER: CoinType[] = ["mpl", "mo", "me", "mp", "mc"];

const COIN_COLORS: Record<CoinType, string> = {
  mc: "#b45309",
  mp: "#9ca3af",
  me: "#3b82f6",
  mo: "#f59e0b",
  mpl: "#a78bfa",
};

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

// ─── Main Component ──────────────────────────────────────────────────

export default function InventoryTab() {
  const { colors } = useTheme();
  const { toastProps, showInfo: showToast } = useToast();
  const {
    character,
    inventory,
    removeItem,
    toggleEquipItem,
    updateItem,
  } = useCharacterStore();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "equipped" | ItemCategory>(
    "all",
  );
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  const { dialogProps, showDestructive } = useDialog();

  if (!character || !inventory) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-500 dark:text-dark-300 text-base">
          No se ha cargado el inventario
        </Text>
      </View>
    );
  }

  const strScore = character.abilityScores.fue.total;
  const totalWeight = calcInventoryWeight(inventory);
  const maxCarry = calcCarryingCapacity(strScore);
  const encumbrancePct = calcEncumbrancePercentage(totalWeight, strScore);
  const isOverweight = totalWeight > maxCarry;
  const totalGold = calcTotalGoldValue(inventory.coins);
  const activeAttunements = countActiveAttunements(inventory.items);

  // Filter items
  const filteredItems = inventory.items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "equipped") return item.equipado;
    return item.categoria === filter;
  });

  // ── Actions ──

  const handleDeleteItem = (item: InventoryItem) => {
    showDestructive(
      "Eliminar objeto",
      `¿Eliminar "${item.nombre}" del inventario?`,
      async () => {
        await removeItem(item.id);
        setExpandedItemId(null);
        showToast(`"${item.nombre}" eliminado`);
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" },
    );
  };

  const handleUpdateQuantity = async (item: InventoryItem, delta: number) => {
    const newQty = Math.max(0, item.cantidad + delta);
    if (newQty === 0) {
      handleDeleteItem(item);
      return;
    }
    await updateItem(item.id, { cantidad: newQty });
  };

  const handleToggleEquip = async (item: InventoryItem) => {
    await toggleEquipItem(item.id);
    showToast(
      item.equipado
        ? `${item.nombre} desequipado`
        : `${item.nombre} equipado`,
    );
  };

  // ── Render Sections ──

  const renderWeightBar = () => {
    const barColor = isOverweight
      ? colors.accentDanger
      : encumbrancePct > 75
        ? colors.accentAmber
        : colors.accentGreen;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="scale-outline" size={18} color={barColor} />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Capacidad de Carga
            </Text>
          </View>
          <Text className="text-sm font-bold" style={{ color: barColor }}>
            {totalWeight.toFixed(1)} / {maxCarry} lb
          </Text>
        </View>

        <View className="h-2.5 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${Math.min(100, encumbrancePct)}%`,
              backgroundColor: barColor,
            }}
          />
        </View>

        {isOverweight && (
          <View className="flex-row items-center mt-2">
            <Ionicons name="warning" size={14} color={colors.accentDanger} />
            <Text className="text-red-400 text-xs ml-1">
              ¡Sobrecargado! Velocidad reducida.
            </Text>
          </View>
        )}

        {/* Attunement info */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="link-outline" size={14} color={colors.accentPurple} />
          <Text className="text-dark-400 text-xs ml-1">
            Sintonizaciones: {activeAttunements}/{inventory.maxAttunements}
          </Text>
        </View>
      </View>
    );
  };

  const renderCoins = () => (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="cash-outline" size={18} color={colors.accentAmber} />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Monedas
          </Text>
        </View>
        <TouchableOpacity
          className="bg-amber-600/20 rounded-lg px-3 py-1.5 active:bg-amber-600/40"
          onPress={() => setShowCoinModal(true)}
        >
          <Text className="text-amber-400 text-xs font-semibold">
            Gestionar
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between mb-3">
        {COIN_ORDER.map((type) => (
          <View key={type} className="items-center flex-1">
            <Text className="text-lg mb-0.5">{COIN_ICONS[type]}</Text>
            <Text
              className="text-lg font-bold"
              style={{ color: COIN_COLORS[type] }}
            >
              {inventory.coins[type]}
            </Text>
            <Text className="text-dark-300 dark:text-dark-500 text-[10px] uppercase">
              {COIN_ABBR[type]}
            </Text>
          </View>
        ))}
      </View>

      <View className="border-t border-dark-100 dark:border-surface-border/50 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-dark-400 text-xs">Total en oro</Text>
          <Text className="text-gold-700 dark:text-gold-400 text-sm font-bold">
            {totalGold.toFixed(2)} MO
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-dark-400 text-xs">Peso de monedas</Text>
          <Text className="text-dark-500 dark:text-dark-300 text-xs">
            {calcCoinWeight(inventory.coins).toFixed(1)} lb
          </Text>
        </View>
      </View>
    </View>
  );

  const renderFilterTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mb-3"
      contentContainerStyle={{ paddingRight: 16 }}
    >
      {[
        { key: "all" as const, label: "Todos", count: inventory.items.length },
        {
          key: "equipped" as const,
          label: "Equipado",
          count: inventory.items.filter((i) => i.equipado).length,
        },
        ...CATEGORY_OPTIONS.filter((c) =>
          inventory.items.some((i) => i.categoria === c.value),
        ).map((c) => ({
          key: c.value as ItemCategory,
          label: c.label,
          count: inventory.items.filter((i) => i.categoria === c.value).length,
        })),
      ].map((tab) => {
        const isActive = filter === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            className={`rounded-full px-4 py-2 mr-2 border ${
              isActive
                ? "bg-primary-500/20 border-primary-500/50"
                : "bg-gray-200 dark:bg-dark-700 border-dark-100 dark:border-surface-border"
            }`}
            onPress={() => setFilter(tab.key)}
          >
            <Text
              className={`text-xs font-semibold ${
                isActive
                  ? "text-primary-400"
                  : "text-dark-500 dark:text-dark-300"
              }`}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderItemList = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider">
          Objetos ({filteredItems.length})
        </Text>
        <TouchableOpacity
          className="bg-primary-500/20 rounded-lg px-3 py-1.5 flex-row items-center active:bg-primary-500/40"
          onPress={() => setShowAddItem(true)}
        >
          <Ionicons name="add" size={16} color={colors.accentRed} />
          <Text className="text-primary-400 text-xs font-semibold ml-1">
            Añadir
          </Text>
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      {filteredItems.length === 0 ? (
        <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-6 items-center">
          <Ionicons name="bag-outline" size={32} color={colors.textMuted} />
          <Text className="text-dark-400 text-sm mt-2">
            {filter === "all"
              ? "Tu inventario está vacío"
              : "No hay objetos en esta categoría"}
          </Text>
          <TouchableOpacity
            className="mt-3 bg-primary-500 rounded-lg px-4 py-2 active:bg-primary-600"
            onPress={() => setShowAddItem(true)}
          >
            <Text className="text-white text-xs font-semibold">
              Añadir objeto
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        filteredItems.map((item) => (
          <InventoryItemCard
            key={item.id}
            item={item}
            isExpanded={expandedItemId === item.id}
            onToggleExpand={() =>
              setExpandedItemId(expandedItemId === item.id ? null : item.id)
            }
            onToggleEquip={() => handleToggleEquip(item)}
            onUpdateQuantity={(delta) => handleUpdateQuantity(item, delta)}
            onDelete={() => handleDeleteItem(item)}
          />
        ))
      )}
    </View>
  );

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderWeightBar()}
        {renderCoins()}
        {renderItemList()}
      </ScrollView>

      <AddItemModal
        visible={showAddItem}
        onClose={() => setShowAddItem(false)}
        onShowToast={showToast}
      />
      <CoinTransactionModal
        visible={showCoinModal}
        onClose={() => setShowCoinModal(false)}
        onShowToast={showToast}
      />

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </View>
  );
}
