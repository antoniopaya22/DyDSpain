/**
 * SpellsTab - Pestaña de hechizos del personaje
 * Muestra: espacios de conjuro, trucos, hechizos conocidos/preparados,
 * libro de hechizos (mago), magia de pacto (brujo), y puntos de hechicería.
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform,
  ToastAndroid,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog } from "@/components/ui";
import { useDialog } from "@/hooks/useDialog";
import {
  SPELLCASTING_ABILITY,
  CLASS_CASTER_TYPE,
  CLASS_SPELL_PREPARATION,
} from "@/types/spell";
import {
  formatModifier,
  ABILITY_NAMES,
} from "@/types/character";

// ─── Helpers ─────────────────────────────────────────────────────────

function showToast(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
}

const SPELL_LEVEL_COLORS: Record<number, string> = {
  0: "#9ca3af",
  1: "#3b82f6",
  2: "#22c55e",
  3: "#f59e0b",
  4: "#ef4444",
  5: "#a855f7",
  6: "#ec4899",
  7: "#14b8a6",
  8: "#f97316",
  9: "#dc2626",
};

// ─── Main Component ──────────────────────────────────────────────────

export default function SpellsTab() {
  const { dialogProps, showConfirm } = useDialog();
  const {
    character,
    magicState,
    useSpellSlot,
    restoreSpellSlot,
    restoreAllSpellSlots,
    usePactSlot,
    restoreAllPactSlots,
    setConcentration,
    clearConcentration,
  } = useCharacterStore();

  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  const casterType = CLASS_CASTER_TYPE[character.clase];
  const spellcastingAbility =
    SPELLCASTING_ABILITY[character.clase as keyof typeof SPELLCASTING_ABILITY];
  const preparationType = CLASS_SPELL_PREPARATION[character.clase];

  // Non-casters
  if (casterType === "none") {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <View className="h-20 w-20 rounded-full bg-dark-700 items-center justify-center mb-5">
          <Ionicons name="flame-outline" size={40} color="#666699" />
        </View>
        <Text className="text-white text-xl font-bold text-center mb-2">
          Sin magia
        </Text>
        <Text className="text-dark-300 text-base text-center leading-6 px-4">
          Tu clase ({character.clase}) no tiene capacidad de lanzar conjuros.
        </Text>
      </View>
    );
  }

  // Spellcasting stats
  const abilityMod = spellcastingAbility
    ? character.abilityScores[spellcastingAbility].modifier
    : 0;
  const profBonus = character.proficiencyBonus;
  const spellSaveDC = 8 + profBonus + abilityMod;
  const spellAttackBonus = profBonus + abilityMod;

  // Organize spells by level
  const allSpellIds = magicState
    ? [...new Set([...magicState.knownSpellIds, ...magicState.preparedSpellIds, ...magicState.spellbookIds])]
    : [...new Set([...character.knownSpellIds, ...character.preparedSpellIds, ...character.spellbookIds])];

  // Group spell IDs by assumed level (we parse it from the ID if possible, else show flat)
  // Since we only have IDs and no spell database loaded, we'll show them grouped simply
  const cantrips = allSpellIds.filter((id) => id.startsWith("truco_") || id.includes("_cantrip") || id.includes("truco"));
  const levelSpells = allSpellIds.filter((id) => !id.startsWith("truco_") && !id.includes("_cantrip") && !id.includes("truco"));

  // For display, we'll clean up the spell ID into a readable name
  const formatSpellName = (id: string): string => {
    return id
      .replace(/^truco_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isPrepared = (id: string): boolean => {
    if (magicState) {
      return magicState.preparedSpellIds.includes(id);
    }
    return character.preparedSpellIds.includes(id);
  };

  const isInSpellbook = (id: string): boolean => {
    if (magicState) {
      return magicState.spellbookIds.includes(id);
    }
    return character.spellbookIds.includes(id);
  };

  // ── Spell Slot Actions ──

  const handleUseSlot = async (level: number) => {
    const success = await useSpellSlot(level);
    if (success) {
      showToast(`Espacio de nivel ${level} usado`);
    } else {
      showToast(`No quedan espacios de nivel ${level}`);
    }
  };

  const handleRestoreSlot = async (level: number) => {
    await restoreSpellSlot(level);
    showToast(`Espacio de nivel ${level} restaurado`);
  };

  const handleRestoreAllSlots = () => {
    showConfirm(
      "Restaurar Espacios",
      "¿Restaurar todos los espacios de conjuro?",
      async () => {
        await restoreAllSpellSlots();
        if (character.clase === "brujo") {
          await restoreAllPactSlots();
        }
        showToast("Todos los espacios restaurados");
      },
      { confirmText: "Restaurar", cancelText: "Cancelar", type: "info" }
    );
  };

  const handleUsePactSlot = async () => {
    const success = await usePactSlot();
    if (success) {
      showToast("Espacio de pacto usado");
    } else {
      showToast("No quedan espacios de pacto");
    }
  };

  // ── Render Sections ──

  const renderSpellcastingInfo = () => (
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="flame" size={20} color="#ef4444" />
        <Text className="text-white text-base font-semibold ml-2">
          Lanzamiento de Conjuros
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {/* Spellcasting Ability */}
        {spellcastingAbility && (
          <StatBox
            label="Aptitud Mágica"
            value={ABILITY_NAMES[spellcastingAbility]}
            subValue={formatModifier(abilityMod)}
            color="#a855f7"
          />
        )}

        {/* Spell Save DC */}
        <StatBox
          label="CD de Salvación"
          value={String(spellSaveDC)}
          subValue={`8 + ${profBonus} + ${abilityMod}`}
          color="#f59e0b"
        />

        {/* Spell Attack Bonus */}
        <StatBox
          label="Ataque Mágico"
          value={formatModifier(spellAttackBonus)}
          subValue={`${profBonus} + ${abilityMod}`}
          color="#ef4444"
        />
      </View>

      {/* Preparation type info */}
      <View className="mt-3 pt-3 border-t border-surface-border/50">
        <View className="flex-row items-center">
          <Ionicons name="information-circle-outline" size={14} color="#666699" />
          <Text className="text-dark-400 text-xs ml-1.5">
            {preparationType === "prepared"
              ? "Preparas conjuros de tu lista de clase cada día."
              : preparationType === "known"
                ? "Conoces un número fijo de conjuros."
                : preparationType === "pact"
                  ? "Usas magia de pacto. Espacios se recuperan en descanso corto."
                  : preparationType === "spellbook"
                    ? "Aprendes conjuros en tu libro de hechizos y los preparas cada día."
                    : "No lanzas conjuros."}
          </Text>
        </View>
      </View>
    </View>
  );

  const renderSpellSlots = () => {
    if (!magicState) return null;

    const slotEntries = Object.entries(magicState.spellSlots)
      .filter(([_, slot]) => slot && slot.total > 0)
      .sort(([a], [b]) => Number(a) - Number(b));

    if (slotEntries.length === 0 && !magicState.pactMagicSlots) return null;

    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={20} color="#3b82f6" />
            <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Espacios de Conjuro
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
            onPress={handleRestoreAllSlots}
          >
            <Text className="text-blue-400 text-xs font-semibold">
              Restaurar todos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Regular spell slots */}
        {slotEntries.map(([levelStr, slot]) => {
          if (!slot) return null;
          const level = Number(levelStr);
          const available = slot.total - slot.used;
          const color = SPELL_LEVEL_COLORS[level] ?? "#3b82f6";

          return (
            <View key={level} className="mb-3">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-dark-200 text-sm font-medium">
                  Nivel {level}
                </Text>
                <Text className="text-dark-400 text-xs">
                  {available}/{slot.total} disponibles
                </Text>
              </View>

              <View className="flex-row items-center">
                {/* Slot dots */}
                <View className="flex-row flex-1">
                  {Array.from({ length: slot.total }).map((_, i) => {
                    const isAvailable = i < available;
                    return (
                      <TouchableOpacity
                        key={i}
                        className="h-9 w-9 rounded-lg mx-0.5 items-center justify-center border"
                        style={{
                          backgroundColor: isAvailable
                            ? `${color}20`
                            : "#1a1a2e",
                          borderColor: isAvailable ? `${color}66` : "#3a3a5c",
                        }}
                        onPress={() =>
                          isAvailable
                            ? handleUseSlot(level)
                            : handleRestoreSlot(level)
                        }
                      >
                        <Ionicons
                          name={isAvailable ? "ellipse" : "ellipse-outline"}
                          size={14}
                          color={isAvailable ? color : "#3a3a5c"}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Use/Restore buttons */}
                <TouchableOpacity
                  className="ml-2 bg-dark-700 rounded-lg px-2.5 py-2 active:bg-dark-600"
                  onPress={() => handleUseSlot(level)}
                  disabled={available <= 0}
                  style={{ opacity: available > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="remove" size={16} color={color} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1 bg-dark-700 rounded-lg px-2.5 py-2 active:bg-dark-600"
                  onPress={() => handleRestoreSlot(level)}
                  disabled={slot.used <= 0}
                  style={{ opacity: slot.used > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="add" size={16} color={color} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Pact Magic Slots (Warlock) */}
        {magicState.pactMagicSlots && (
          <View className="mt-2 pt-3 border-t border-surface-border/50">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Ionicons name="bonfire-outline" size={16} color="#a855f7" />
                <Text className="text-purple-300 text-sm font-medium ml-1.5">
                  Magia de Pacto (Nv. {magicState.pactMagicSlots.slotLevel})
                </Text>
              </View>
              <Text className="text-dark-400 text-xs">
                {magicState.pactMagicSlots.total - magicState.pactMagicSlots.used}/
                {magicState.pactMagicSlots.total} disponibles
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="flex-row flex-1">
                {Array.from({ length: magicState.pactMagicSlots.total }).map(
                  (_, i) => {
                    const isAvailable =
                      i <
                      magicState.pactMagicSlots!.total -
                        magicState.pactMagicSlots!.used;
                    return (
                      <TouchableOpacity
                        key={i}
                        className="h-9 w-9 rounded-lg mx-0.5 items-center justify-center border"
                        style={{
                          backgroundColor: isAvailable
                            ? "#a855f720"
                            : "#1a1a2e",
                          borderColor: isAvailable ? "#a855f766" : "#3a3a5c",
                        }}
                        onPress={isAvailable ? handleUsePactSlot : undefined}
                      >
                        <Ionicons
                          name={isAvailable ? "bonfire" : "bonfire-outline"}
                          size={14}
                          color={isAvailable ? "#a855f7" : "#3a3a5c"}
                        />
                      </TouchableOpacity>
                    );
                  }
                )}
              </View>
              <TouchableOpacity
                className="ml-2 bg-dark-700 rounded-lg px-2.5 py-2 active:bg-dark-600"
                onPress={handleUsePactSlot}
                disabled={
                  (magicState.pactMagicSlots?.used ?? 0) >=
                  (magicState.pactMagicSlots?.total ?? 0)
                }
                style={{
                  opacity:
                    (magicState.pactMagicSlots?.used ?? 0) <
                    (magicState.pactMagicSlots?.total ?? 0)
                      ? 1
                      : 0.4,
                }}
              >
                <Ionicons name="remove" size={16} color="#a855f7" />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-1 bg-dark-700 rounded-lg px-2.5 py-2 active:bg-dark-600"
                onPress={async () => {
                  await restoreAllPactSlots();
                  showToast("Espacios de pacto restaurados");
                }}
                disabled={(magicState.pactMagicSlots?.used ?? 0) <= 0}
                style={{
                  opacity: (magicState.pactMagicSlots?.used ?? 0) > 0 ? 1 : 0.4,
                }}
              >
                <Ionicons name="add" size={16} color="#a855f7" />
              </TouchableOpacity>
            </View>

            <Text className="text-dark-500 text-[10px] mt-1.5">
              Se recuperan en descanso corto
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSorceryPoints = () => {
    if (!magicState?.sorceryPoints || character.clase !== "hechicero")
      return null;

    const { max, current } = magicState.sorceryPoints;

    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#ec4899" />
            <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Puntos de Hechicería
            </Text>
          </View>
          <Text className="text-pink-400 text-lg font-bold">
            {current}/{max}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="h-3 bg-dark-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${max > 0 ? (current / max) * 100 : 0}%`,
              backgroundColor: "#ec4899",
            }}
          />
        </View>

        <Text className="text-dark-500 text-[10px] mt-1.5">
          Se recuperan en descanso largo
        </Text>
      </View>
    );
  };

  const renderConcentration = () => {
    const { concentration } = character;
    if (!concentration) return null;

    return (
      <View className="bg-surface-card rounded-card border border-purple-500/30 p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="eye" size={20} color="#a855f7" />
            <View className="ml-3 flex-1">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider">
                Concentración activa
              </Text>
              <Text className="text-purple-300 text-sm font-semibold">
                {concentration.spellName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-dark-700 rounded-lg px-3 py-1.5 active:bg-dark-600"
            onPress={() => {
              showConfirm(
                "Romper Concentración",
                `¿Dejar de concentrarte en "${concentration.spellName}"?`,
                clearConcentration,
                { confirmText: "Romper", cancelText: "Cancelar", type: "danger" }
              );
            }}
          >
            <Text className="text-red-400 text-xs font-semibold">Romper</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderCantrips = () => {
    if (cantrips.length === 0) return null;

    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="h-7 w-7 rounded-full items-center justify-center mr-2"
            style={{ backgroundColor: `${SPELL_LEVEL_COLORS[0]}20` }}
          >
            <Text
              className="text-xs font-bold"
              style={{ color: SPELL_LEVEL_COLORS[0] }}
            >
              0
            </Text>
          </View>
          <Text className="text-white text-sm font-semibold flex-1">
            Trucos
          </Text>
          <Text className="text-dark-400 text-xs">
            {cantrips.length} conocidos
          </Text>
        </View>

        {cantrips.map((spellId) => (
          <SpellCard
            key={spellId}
            spellId={spellId}
            name={formatSpellName(spellId)}
            level={0}
            prepared={true}
            isCantrip
          />
        ))}
      </View>
    );
  };

  const renderSpellList = () => {
    if (levelSpells.length === 0) return null;

    // Try to guess spell levels from the ID pattern or just show all under "Conjuros"
    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="book" size={20} color="#fbbf24" />
          <Text className="text-white text-sm font-semibold flex-1 ml-2">
            {preparationType === "spellbook"
              ? "Libro de Hechizos"
              : preparationType === "prepared"
                ? "Conjuros Preparados"
                : "Conjuros Conocidos"}
          </Text>
          <Text className="text-dark-400 text-xs">
            {levelSpells.length} conjuro(s)
          </Text>
        </View>

        {levelSpells.map((spellId) => (
          <SpellCard
            key={spellId}
            spellId={spellId}
            name={formatSpellName(spellId)}
            level={1}
            prepared={isPrepared(spellId)}
            inSpellbook={isInSpellbook(spellId)}
            showSpellbook={preparationType === "spellbook"}
            onCast={(lvl) => handleUseSlot(lvl)}
          />
        ))}
      </View>
    );
  };

  const renderEmptySpells = () => {
    if (cantrips.length > 0 || levelSpells.length > 0) return null;

    return (
      <View className="bg-surface-card rounded-card border border-surface-border p-6 mb-4 items-center">
        <View className="h-16 w-16 rounded-full bg-dark-700 items-center justify-center mb-4">
          <Ionicons name="book-outline" size={32} color="#666699" />
        </View>
        <Text className="text-white text-base font-semibold text-center mb-1">
          Sin conjuros
        </Text>
        <Text className="text-dark-300 text-sm text-center leading-5">
          No tienes conjuros conocidos ni preparados todavía.
          Los conjuros se seleccionan durante la creación del personaje.
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {renderSpellcastingInfo()}
        {renderConcentration()}
        {renderSpellSlots()}
        {renderSorceryPoints()}
        {renderCantrips()}
        {renderSpellList()}
        {renderEmptySpells()}
      </ScrollView>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function StatBox({
  label,
  value,
  subValue,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <View className="flex-1 min-w-[100px] bg-dark-700 rounded-xl p-3 mr-2 mb-2 items-center border border-surface-border">
      <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-dark-500 text-[10px] mt-0.5">{subValue}</Text>
      )}
    </View>
  );
}

function SpellCard({
  spellId,
  name,
  level,
  prepared,
  isCantrip,
  inSpellbook,
  showSpellbook,
  onCast,
}: {
  spellId: string;
  name: string;
  level: number;
  prepared: boolean;
  isCantrip?: boolean;
  inSpellbook?: boolean;
  showSpellbook?: boolean;
  onCast?: (level: number) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const color = SPELL_LEVEL_COLORS[level] ?? "#3b82f6";

  return (
    <TouchableOpacity
      className="bg-dark-700 rounded-lg p-3 mb-2 border border-surface-border"
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        {/* Level indicator */}
        <View
          className="h-8 w-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${color}20` }}
        >
          {isCantrip ? (
            <Ionicons name="sparkles" size={16} color={color} />
          ) : (
            <Text className="text-xs font-bold" style={{ color }}>
              {level}
            </Text>
          )}
        </View>

        {/* Spell info */}
        <View className="flex-1">
          <Text className="text-white text-sm font-semibold">{name}</Text>
          <View className="flex-row items-center mt-0.5">
            {isCantrip && (
              <Text className="text-dark-400 text-[10px] mr-2">Truco</Text>
            )}
            {!isCantrip && prepared && (
              <View className="flex-row items-center mr-2">
                <Ionicons name="checkmark-circle" size={10} color="#22c55e" />
                <Text className="text-green-400 text-[10px] ml-0.5">
                  Preparado
                </Text>
              </View>
            )}
            {showSpellbook && inSpellbook && (
              <View className="flex-row items-center mr-2">
                <Ionicons name="book" size={10} color="#fbbf24" />
                <Text className="text-gold-400 text-[10px] ml-0.5">
                  En libro
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Cast button for non-cantrips */}
        {!isCantrip && onCast && prepared && (
          <TouchableOpacity
            className="bg-primary-500/20 rounded-lg px-3 py-1.5 mr-2 active:bg-primary-500/40"
            onPress={(e) => {
              e.stopPropagation?.();
              onCast(level);
            }}
          >
            <Text className="text-primary-400 text-xs font-semibold">
              Lanzar
            </Text>
          </TouchableOpacity>
        )}

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color="#666699"
        />
      </View>

      {expanded && (
        <View className="mt-2 pt-2 border-t border-surface-border/50">
          <Text className="text-dark-300 text-xs leading-5">
            ID: {spellId}
          </Text>
          <Text className="text-dark-400 text-[10px] mt-1 italic">
            La descripción detallada del conjuro se mostrará cuando se carguen
            los datos completos del SRD.
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
