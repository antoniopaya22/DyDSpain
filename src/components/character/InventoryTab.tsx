/**
 * InventoryTab - Pestaña de inventario del personaje
 * Muestra: lista de objetos, equipar/desequipar, monedas, peso,
 * formulario para añadir objetos, y transacciones de monedas.
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ToastAndroid,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog } from "@/components/ui";
import { useDialog } from "@/hooks/useDialog";
import {
  ITEM_CATEGORY_NAMES,
  ITEM_CATEGORY_ICONS,
  COIN_NAMES,
  COIN_ABBR,
  COIN_ICONS,
  calcTotalWeight,
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

// ─── Helpers ─────────────────────────────────────────────────────────

function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

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
  const {
    character,
    inventory,
    addItem,
    removeItem,
    toggleEquipItem,
    updateItem,
    updateCoins,
    addCoinTransaction,
  } = useCharacterStore();

  const [showAddItem, setShowAddItem] = useState(false);
  const [showCoinModal, setShowCoinModal] = useState(false);
  const [filter, setFilter] = useState<"all" | "equipped" | ItemCategory>(
    "all"
  );
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Add item form state
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState<ItemCategory>("otro");
  const [newItemQuantity, setNewItemQuantity] = useState("1");
  const [newItemWeight, setNewItemWeight] = useState("0");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemValue, setNewItemValue] = useState("");

  // Coin modal state
  const [coinOperation, setCoinOperation] = useState<"add" | "remove">("add");
  const [coinAmounts, setCoinAmounts] = useState<Record<CoinType, string>>({
    mc: "",
    mp: "",
    me: "",
    mo: "",
    mpl: "",
  });
  const [coinDescription, setCoinDescription] = useState("");

  const { dialogProps, showDestructive } = useDialog();

  if (!character || !inventory) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-300 text-base">
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

  const handleAddItem = async () => {
    if (!newItemName.trim()) {
      showToast("Introduce un nombre para el objeto");
      return;
    }

    const quantity = parseInt(newItemQuantity, 10) || 1;
    const weight = parseFloat(newItemWeight) || 0;
    const valor = parseFloat(newItemValue) || undefined;

    await addItem({
      nombre: newItemName.trim(),
      categoria: newItemCategory,
      cantidad: quantity,
      peso: weight,
      valor,
      descripcion: newItemDescription.trim() || undefined,
      equipado: false,
      custom: true,
    });

    // Reset form
    setNewItemName("");
    setNewItemCategory("otro");
    setNewItemQuantity("1");
    setNewItemWeight("0");
    setNewItemDescription("");
    setNewItemValue("");
    setShowAddItem(false);
    showToast(`"${newItemName.trim()}" añadido al inventario`);
  };

  const handleDeleteItem = (item: InventoryItem) => {
    showDestructive(
      "Eliminar objeto",
      `¿Eliminar "${item.nombre}" del inventario?`,
      async () => {
        await removeItem(item.id);
        setExpandedItemId(null);
        showToast(`"${item.nombre}" eliminado`);
      },
      { confirmText: "Eliminar", cancelText: "Cancelar" }
    );
  };

  const handleUpdateQuantity = async (
    item: InventoryItem,
    delta: number
  ) => {
    const newQty = Math.max(0, item.cantidad + delta);
    if (newQty === 0) {
      handleDeleteItem(item);
      return;
    }
    await updateItem(item.id, { cantidad: newQty });
  };

  const handleCoinTransaction = async () => {
    const coins: Partial<Record<CoinType, number>> = {};
    let hasAny = false;

    for (const type of COIN_ORDER) {
      const amount = parseInt(coinAmounts[type], 10);
      if (!isNaN(amount) && amount > 0) {
        coins[type] = amount;
        hasAny = true;
      }
    }

    if (!hasAny) {
      showToast("Introduce al menos una cantidad");
      return;
    }

    await addCoinTransaction({
      type: coinOperation === "add" ? "income" : "expense",
      coins,
      description:
        coinDescription.trim() ||
        (coinOperation === "add" ? "Ingreso" : "Gasto"),
    });

    // Reset
    setCoinAmounts({ mc: "", mp: "", me: "", mo: "", mpl: "" });
    setCoinDescription("");
    setShowCoinModal(false);
    showToast(
      coinOperation === "add" ? "Monedas añadidas" : "Monedas gastadas"
    );
  };

  // ── Render Sections ──

  const renderWeightBar = () => {
    const barColor = isOverweight
      ? "#ef4444"
      : encumbrancePct > 75
        ? "#f59e0b"
        : "#22c55e";

    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-2">
          <View className="flex-row items-center">
            <Ionicons name="scale-outline" size={18} color={barColor} />
            <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Capacidad de Carga
            </Text>
          </View>
          <Text
            className="text-sm font-bold"
            style={{ color: barColor }}
          >
            {totalWeight.toFixed(1)} / {maxCarry} lb
          </Text>
        </View>

        <View className="h-2.5 bg-dark-700 rounded-full overflow-hidden">
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
            <Ionicons name="warning" size={14} color="#ef4444" />
            <Text className="text-red-400 text-xs ml-1">
              ¡Sobrecargado! Velocidad reducida.
            </Text>
          </View>
        )}

        {/* Attunement info */}
        <View className="flex-row items-center mt-2">
          <Ionicons name="link-outline" size={14} color="#a855f7" />
          <Text className="text-dark-400 text-xs ml-1">
            Sintonizaciones: {activeAttunements}/{inventory.maxAttunements}
          </Text>
        </View>
      </View>
    );
  };

  const renderCoins = () => (
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="cash-outline" size={18} color="#f59e0b" />
          <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
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
            <Text className="text-dark-500 text-[10px] uppercase">
              {COIN_ABBR[type]}
            </Text>
          </View>
        ))}
      </View>

      <View className="border-t border-surface-border/50 pt-2">
        <View className="flex-row items-center justify-between">
          <Text className="text-dark-400 text-xs">Total en oro</Text>
          <Text className="text-gold-400 text-sm font-bold">
            {totalGold.toFixed(2)} MO
          </Text>
        </View>
        <View className="flex-row items-center justify-between mt-1">
          <Text className="text-dark-400 text-xs">Peso de monedas</Text>
          <Text className="text-dark-300 text-xs">
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
          inventory.items.some((i) => i.categoria === c.value)
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
                : "bg-dark-700 border-surface-border"
            }`}
            onPress={() => setFilter(tab.key)}
          >
            <Text
              className={`text-xs font-semibold ${
                isActive ? "text-primary-400" : "text-dark-300"
              }`}
            >
              {tab.label} ({tab.count})
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderItemCard = (item: InventoryItem) => {
    const isExpanded = expandedItemId === item.id;
    const categoryIcon =
      ITEM_CATEGORY_ICONS[item.categoria] ?? "📦";
    const categoryName =
      ITEM_CATEGORY_NAMES[item.categoria] ?? "Otro";

    return (
      <TouchableOpacity
        key={item.id}
        className="bg-surface-card rounded-card border border-surface-border mb-2 overflow-hidden"
        onPress={() => setExpandedItemId(isExpanded ? null : item.id)}
        activeOpacity={0.7}
      >
        <View className="flex-row items-center p-3">
          {/* Category icon */}
          <View className="h-10 w-10 rounded-lg bg-dark-700 items-center justify-center mr-3">
            <Text className="text-base">{categoryIcon}</Text>
          </View>

          {/* Item info */}
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text
                className="text-sm font-semibold flex-1"
                style={{
                  color: item.equipado ? "#fbbf24" : "#ffffff",
                }}
                numberOfLines={1}
              >
                {item.nombre}
              </Text>
              {item.cantidad > 1 && (
                <View className="bg-dark-600 rounded-full px-2 py-0.5 ml-1">
                  <Text className="text-dark-200 text-[10px] font-bold">
                    x{item.cantidad}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-row items-center mt-0.5">
              <Text className="text-dark-400 text-[10px]">
                {categoryName}
              </Text>
              {item.peso > 0 && (
                <Text className="text-dark-500 text-[10px] ml-2">
                  {item.peso * item.cantidad} lb
                </Text>
              )}
              {item.equipado && (
                <View className="flex-row items-center ml-2">
                  <Ionicons
                    name="checkmark-circle"
                    size={10}
                    color="#fbbf24"
                  />
                  <Text className="text-gold-400 text-[10px] ml-0.5">
                    Equipado
                  </Text>
                </View>
              )}
              {item.magicDetails && (
                <View className="flex-row items-center ml-2">
                  <Ionicons name="sparkles" size={10} color="#a855f7" />
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
                  : "bg-dark-700 border-surface-border"
              }`}
              onPress={async (e) => {
                await toggleEquipItem(item.id);
                showToast(
                  item.equipado
                    ? `${item.nombre} desequipado`
                    : `${item.nombre} equipado`
                );
              }}
            >
              <Ionicons
                name={item.equipado ? "body" : "body-outline"}
                size={16}
                color={item.equipado ? "#f59e0b" : "#666699"}
              />
            </TouchableOpacity>
          )}

          <Ionicons
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={16}
            color="#666699"
            style={{ marginLeft: 8 }}
          />
        </View>

        {/* Expanded details */}
        {isExpanded && (
          <View className="px-3 pb-3 border-t border-surface-border/50 pt-2">
            {item.descripcion && (
              <Text className="text-dark-300 text-xs leading-5 mb-2">
                {item.descripcion}
              </Text>
            )}

            {/* Weapon details */}
            {item.weaponDetails && (
              <View className="bg-dark-700 rounded-lg p-2.5 mb-2">
                <Text className="text-red-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Datos de Arma
                </Text>
                <Text className="text-dark-200 text-xs">
                  Daño: {item.weaponDetails.damage.dice}{" "}
                  {item.weaponDetails.damage.damageType}
                </Text>
                {item.weaponDetails.versatileDamage && (
                  <Text className="text-dark-200 text-xs">
                    Versátil:{" "}
                    {item.weaponDetails.versatileDamage.dice}{" "}
                    {item.weaponDetails.versatileDamage.damageType}
                  </Text>
                )}
                {item.weaponDetails.range && (
                  <Text className="text-dark-200 text-xs">
                    Alcance: {item.weaponDetails.range.normal}/
                    {item.weaponDetails.range.long} pies
                  </Text>
                )}
                {item.weaponDetails.properties.length > 0 && (
                  <Text className="text-dark-300 text-xs mt-1">
                    Propiedades:{" "}
                    {item.weaponDetails.properties.join(", ")}
                  </Text>
                )}
              </View>
            )}

            {/* Armor details */}
            {item.armorDetails && (
              <View className="bg-dark-700 rounded-lg p-2.5 mb-2">
                <Text className="text-blue-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Datos de Armadura
                </Text>
                <Text className="text-dark-200 text-xs">
                  CA base: {item.armorDetails.baseAC}
                </Text>
                {item.armorDetails.addDexModifier && (
                  <Text className="text-dark-200 text-xs">
                    + mod. DES
                    {item.armorDetails.maxDexBonus !== null
                      ? ` (máx. +${item.armorDetails.maxDexBonus})`
                      : ""}
                  </Text>
                )}
                {item.armorDetails.strengthRequirement && (
                  <Text className="text-dark-300 text-xs">
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
              <View className="bg-dark-700 rounded-lg p-2.5 mb-2">
                <Text className="text-purple-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Propiedades Mágicas
                </Text>
                <Text className="text-dark-200 text-xs">
                  Rareza: {item.magicDetails.rarity}
                </Text>
                {item.magicDetails.requiresAttunement && (
                  <Text className="text-dark-200 text-xs">
                    Requiere sintonización
                    {item.magicDetails.attunementRestriction
                      ? ` (${item.magicDetails.attunementRestriction})`
                      : ""}
                  </Text>
                )}
                {item.magicDetails.charges && (
                  <Text className="text-dark-200 text-xs">
                    Cargas: {item.magicDetails.charges.current}/
                    {item.magicDetails.charges.max}
                  </Text>
                )}
                {item.magicDetails.magicDescription && (
                  <Text className="text-dark-300 text-xs mt-1">
                    {item.magicDetails.magicDescription}
                  </Text>
                )}
              </View>
            )}

            {/* Notes */}
            {item.notas && (
              <View className="bg-dark-700 rounded-lg p-2.5 mb-2">
                <Text className="text-gold-400 text-[10px] font-semibold uppercase tracking-wider mb-1">
                  Notas
                </Text>
                <Text className="text-dark-300 text-xs">
                  {item.notas}
                </Text>
              </View>
            )}

            {/* Item stats */}
            <View className="flex-row flex-wrap mb-2">
              {item.valor !== undefined && item.valor > 0 && (
                <View className="flex-row items-center bg-dark-700 rounded-lg px-2.5 py-1.5 mr-2 mb-1">
                  <Ionicons name="cash-outline" size={12} color="#f59e0b" />
                  <Text className="text-dark-200 text-xs ml-1">
                    {item.valor} MO
                  </Text>
                </View>
              )}
              <View className="flex-row items-center bg-dark-700 rounded-lg px-2.5 py-1.5 mr-2 mb-1">
                <Ionicons name="scale-outline" size={12} color="#666699" />
                <Text className="text-dark-200 text-xs ml-1">
                  {item.peso} lb c/u
                </Text>
              </View>
            </View>

            {/* Action buttons */}
            <View className="flex-row items-center justify-between mt-1">
              {/* Quantity controls */}
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="h-8 w-8 rounded-lg bg-dark-600 items-center justify-center active:bg-dark-500"
                  onPress={() => handleUpdateQuantity(item, -1)}
                >
                  <Ionicons name="remove" size={16} color="#9ca3af" />
                </TouchableOpacity>
                <Text className="text-white text-sm font-bold mx-3 min-w-[24px] text-center">
                  {item.cantidad}
                </Text>
                <TouchableOpacity
                  className="h-8 w-8 rounded-lg bg-dark-600 items-center justify-center active:bg-dark-500"
                  onPress={() => handleUpdateQuantity(item, 1)}
                >
                  <Ionicons name="add" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>

              {/* Delete */}
              <TouchableOpacity
                className="flex-row items-center bg-red-500/15 border border-red-500/30 rounded-lg px-3 py-1.5 active:bg-red-500/30"
                onPress={() => handleDeleteItem(item)}
              >
                <Ionicons name="trash-outline" size={14} color="#ef4444" />
                <Text className="text-red-400 text-xs font-semibold ml-1">
                  Eliminar
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderItemList = () => (
    <View className="mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider">
          Objetos ({filteredItems.length})
        </Text>
        <TouchableOpacity
          className="bg-primary-500/20 rounded-lg px-3 py-1.5 flex-row items-center active:bg-primary-500/40"
          onPress={() => setShowAddItem(true)}
        >
          <Ionicons name="add" size={16} color="#c62828" />
          <Text className="text-primary-400 text-xs font-semibold ml-1">
            Añadir
          </Text>
        </TouchableOpacity>
      </View>

      {renderFilterTabs()}

      {filteredItems.length === 0 ? (
        <View className="bg-surface-card rounded-card border border-surface-border p-6 items-center">
          <Ionicons name="bag-outline" size={32} color="#666699" />
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
        filteredItems.map(renderItemCard)
      )}
    </View>
  );

  const renderAddItemModal = () => (
    <Modal
      visible={showAddItem}
      animationType="slide"
      transparent
      onRequestClose={() => setShowAddItem(false)}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-dark-800 rounded-t-3xl border-t border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-white text-lg font-bold">
              Añadir Objeto
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-dark-700 items-center justify-center"
              onPress={() => setShowAddItem(false)}
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
            <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5 mt-2">
              Nombre <Text className="text-primary-500">*</Text>
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border mb-4"
              placeholder="Ej: Espada larga"
              placeholderTextColor="#666699"
              value={newItemName}
              onChangeText={setNewItemName}
              maxLength={100}
              autoFocus
            />

            {/* Category */}
            <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
              Categoría
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mb-4"
            >
              {CATEGORY_OPTIONS.map((opt) => {
                const isSelected = newItemCategory === opt.value;
                return (
                  <TouchableOpacity
                    key={opt.value}
                    className={`rounded-full px-3.5 py-2 mr-2 border ${
                      isSelected
                        ? "bg-primary-500/20 border-primary-500/50"
                        : "bg-dark-700 border-surface-border"
                    }`}
                    onPress={() => setNewItemCategory(opt.value)}
                  >
                    <Text
                      className={`text-xs font-medium ${
                        isSelected ? "text-primary-400" : "text-dark-300"
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
                <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Cantidad
                </Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border"
                  placeholder="1"
                  placeholderTextColor="#666699"
                  keyboardType="numeric"
                  value={newItemQuantity}
                  onChangeText={setNewItemQuantity}
                />
              </View>
              <View className="flex-1 mx-1">
                <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Peso (lb)
                </Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border"
                  placeholder="0"
                  placeholderTextColor="#666699"
                  keyboardType="decimal-pad"
                  value={newItemWeight}
                  onChangeText={setNewItemWeight}
                />
              </View>
              <View className="flex-1 ml-2">
                <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
                  Valor (MO)
                </Text>
                <TextInput
                  className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border"
                  placeholder="—"
                  placeholderTextColor="#666699"
                  keyboardType="decimal-pad"
                  value={newItemValue}
                  onChangeText={setNewItemValue}
                />
              </View>
            </View>

            {/* Description */}
            <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border mb-6 min-h-[80px]"
              placeholder="Añade una descripción..."
              placeholderTextColor="#666699"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={newItemDescription}
              onChangeText={setNewItemDescription}
              maxLength={500}
            />

            {/* Submit */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                newItemName.trim()
                  ? "bg-primary-500 active:bg-primary-600"
                  : "bg-dark-600 opacity-50"
              }`}
              onPress={handleAddItem}
              disabled={!newItemName.trim()}
            >
              <Text className="text-white font-bold text-base">
                Añadir al Inventario
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3 items-center active:bg-surface-light"
              onPress={() => setShowAddItem(false)}
            >
              <Text className="text-dark-300 font-semibold text-sm">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );

  const renderCoinModal = () => (
    <Modal
      visible={showCoinModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowCoinModal(false)}
    >
      <KeyboardAvoidingView
        className="flex-1 justify-end"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View className="bg-dark-800 rounded-t-3xl border-t border-surface-border">
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 pt-5 pb-3">
            <Text className="text-white text-lg font-bold">
              Gestionar Monedas
            </Text>
            <TouchableOpacity
              className="h-8 w-8 rounded-full bg-dark-700 items-center justify-center"
              onPress={() => setShowCoinModal(false)}
            >
              <Ionicons name="close" size={18} color="white" />
            </TouchableOpacity>
          </View>

          <ScrollView
            className="px-5 pb-8"
            contentContainerStyle={{ paddingBottom: 40 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Operation toggle */}
            <View className="flex-row mb-4 bg-dark-700 rounded-xl p-1">
              <TouchableOpacity
                className={`flex-1 rounded-lg py-2.5 items-center ${
                  coinOperation === "add"
                    ? "bg-green-600/80"
                    : "bg-transparent"
                }`}
                onPress={() => setCoinOperation("add")}
              >
                <Text
                  className={`text-sm font-semibold ${
                    coinOperation === "add"
                      ? "text-white"
                      : "text-dark-400"
                  }`}
                >
                  Añadir
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-lg py-2.5 items-center ${
                  coinOperation === "remove"
                    ? "bg-red-600/80"
                    : "bg-transparent"
                }`}
                onPress={() => setCoinOperation("remove")}
              >
                <Text
                  className={`text-sm font-semibold ${
                    coinOperation === "remove"
                      ? "text-white"
                      : "text-dark-400"
                  }`}
                >
                  Gastar
                </Text>
              </TouchableOpacity>
            </View>

            {/* Current coins display */}
            <View className="bg-dark-700 rounded-xl p-3 mb-4 border border-surface-border">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-2">
                Monedas actuales
              </Text>
              <View className="flex-row justify-between">
                {COIN_ORDER.map((type) => (
                  <View key={type} className="items-center">
                    <Text className="text-xs mb-0.5">
                      {COIN_ICONS[type]}
                    </Text>
                    <Text
                      className="text-sm font-bold"
                      style={{ color: COIN_COLORS[type] }}
                    >
                      {inventory.coins[type]}
                    </Text>
                    <Text className="text-dark-500 text-[9px]">
                      {COIN_ABBR[type]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Coin inputs */}
            <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Cantidades a {coinOperation === "add" ? "añadir" : "gastar"}
            </Text>
            {COIN_ORDER.map((type) => (
              <View
                key={type}
                className="flex-row items-center mb-2"
              >
                <View className="flex-row items-center w-28">
                  <Text className="text-base mr-1.5">
                    {COIN_ICONS[type]}
                  </Text>
                  <Text
                    className="text-sm font-medium"
                    style={{ color: COIN_COLORS[type] }}
                  >
                    {COIN_NAMES[type]}
                  </Text>
                </View>
                <TextInput
                  className="flex-1 bg-surface rounded-xl px-4 py-2.5 text-white text-sm border border-surface-border ml-3"
                  placeholder="0"
                  placeholderTextColor="#666699"
                  keyboardType="numeric"
                  value={coinAmounts[type]}
                  onChangeText={(val) =>
                    setCoinAmounts({ ...coinAmounts, [type]: val })
                  }
                />
              </View>
            ))}

            {/* Description */}
            <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider mb-1.5 mt-3">
              Descripción (opcional)
            </Text>
            <TextInput
              className="bg-surface rounded-xl px-4 py-3 text-white text-sm border border-surface-border mb-6"
              placeholder="Ej: Recompensa por misión"
              placeholderTextColor="#666699"
              value={coinDescription}
              onChangeText={setCoinDescription}
              maxLength={100}
            />

            {/* Submit */}
            <TouchableOpacity
              className={`rounded-xl py-4 items-center ${
                coinOperation === "add"
                  ? "bg-green-600 active:bg-green-700"
                  : "bg-red-600 active:bg-red-700"
              }`}
              onPress={handleCoinTransaction}
            >
              <Text className="text-white font-bold text-base">
                {coinOperation === "add"
                  ? "Añadir Monedas"
                  : "Gastar Monedas"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-3 rounded-xl py-3 items-center active:bg-surface-light"
              onPress={() => setShowCoinModal(false)}
            >
              <Text className="text-dark-300 font-semibold text-sm">
                Cancelar
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
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

      {renderAddItemModal()}
      {renderCoinModal()}

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />
    </View>
  );
}
