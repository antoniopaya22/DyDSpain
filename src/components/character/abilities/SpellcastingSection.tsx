import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { SPELL_LEVEL_COLORS } from "@/constants/abilities";
import {
  ABILITY_NAMES,
  formatModifier,
  type AbilityKey,
  type Character,
} from "@/types/character";
import {
  type MetamagicOption,
  METAMAGIC_NAMES,
  METAMAGIC_DESCRIPTIONS,
  METAMAGIC_COSTS,
} from "@/types/spell";
import type { InternalMagicState } from "@/stores/characterStore/helpers";
import { getSpellById } from "@/data/srd/spells";
import { getSpellDescription } from "@/data/srd/spellDescriptions";


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
    <View className="flex-1 min-w-[100px] bg-gray-200 dark:bg-dark-700 rounded-xl p-3 mr-2 mb-2 items-center border border-dark-100 dark:border-surface-border">
      <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-0.5">
          {subValue}
        </Text>
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
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const color = SPELL_LEVEL_COLORS[level] ?? colors.accentBlue;

  return (
    <TouchableOpacity
      className="bg-gray-200 dark:bg-dark-700 rounded-lg p-3 mb-2 border border-dark-100 dark:border-surface-border"
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
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

        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-sm font-semibold">
            {name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            {isCantrip && (
              <Text className="text-dark-400 text-[10px] mr-2">
                Truco{(() => { const s = getSpellById(spellId); return s ? ` · ${s.escuela}` : ""; })()}
              </Text>
            )}
            {!isCantrip && prepared && (
              <View className="flex-row items-center mr-2">
                <Ionicons
                  name="checkmark-circle"
                  size={10}
                  color={colors.accentGreen}
                />
                <Text className="text-green-600 dark:text-green-400 text-[10px] ml-0.5">
                  Preparado
                </Text>
              </View>
            )}
            {showSpellbook && inSpellbook && (
              <View className="flex-row items-center mr-2">
                <Ionicons name="book" size={10} color={colors.accentGold} />
                <Text className="text-gold-700 dark:text-gold-400 text-[10px] ml-0.5">
                  En libro
                </Text>
              </View>
            )}
          </View>
        </View>

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
          color={colors.textMuted}
        />
      </View>

      {expanded && (
        <View className="mt-2 pt-2 border-t border-dark-100 dark:border-surface-border/50">
          {(() => {
            const srdSpell = getSpellById(spellId);
            const desc = getSpellDescription(spellId);
            return (
              <View>
                {srdSpell && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: desc ? 8 : 0 }}>
                    <Text className="text-dark-500 dark:text-dark-300 text-xs">
                      {srdSpell.escuela}
                    </Text>
                    {!isCantrip && (
                      <Text className="text-dark-400 text-xs">
                        · Nivel {srdSpell.nivel}
                      </Text>
                    )}
                  </View>
                )}
                {desc && (
                  <View>
                    {/* Casting properties */}
                    <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 6 }}>
                      {desc.tiempo ? (
                        <Text className="text-dark-400 dark:text-dark-500 text-[10px]">
                          ⏱ {desc.tiempo}
                        </Text>
                      ) : null}
                      {desc.alcance ? (
                        <Text className="text-dark-400 dark:text-dark-500 text-[10px]">
                          · 📏 {desc.alcance}
                        </Text>
                      ) : null}
                      {desc.duracion ? (
                        <Text className="text-dark-400 dark:text-dark-500 text-[10px]">
                          · ⏳ {desc.duracion}
                        </Text>
                      ) : null}
                    </View>
                    {desc.componentes ? (
                      <Text className="text-dark-400 dark:text-dark-500 text-[10px] mb-1">
                        Componentes: {desc.componentes}
                      </Text>
                    ) : null}
                    {/* Spell effect description */}
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontSize: 12,
                        lineHeight: 18,
                        marginTop: 4,
                      }}
                    >
                      {desc.descripcion}
                    </Text>
                  </View>
                )}
                {!desc && !srdSpell && (
                  <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5">
                    ID: {spellId}
                  </Text>
                )}
              </View>
            );
          })()}
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Props ───────────────────────────────────────────────────────────

export interface SpellcastingSectionProps {
  character: Character;
  magicState: InternalMagicState | null;
  spellcastingAbility: AbilityKey | undefined;
  preparationType: string;
  abilityMod: number;
  profBonus: number;
  spellSaveDC: number;
  spellAttackBonus: number;
  levelSpells: string[];
  spellsByLevel: Record<number, string[]>;
  sortedSpellLevels: number[];
  formatSpellName: (id: string) => string;
  getSpellLevel: (id: string) => number;
  canCastSpell: (id: string) => boolean;
  isPrepared: (id: string) => boolean;
  isInSpellbook: (id: string) => boolean;
  onUseSlot: (level: number) => void;
  onRestoreSlot: (level: number) => void;
  onRestoreAllSlots: () => void;
  onUsePactSlot: () => void;
  onRestoreAllPactSlots: () => Promise<void>;
  onClearConcentration: () => void;
  onShowToast?: (message: string) => void;
  showConfirm: (
    title: string,
    message: string,
    onConfirm: () => void,
    options?: any,
  ) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function SpellcastingSection({
  character,
  magicState,
  spellcastingAbility,
  preparationType,
  abilityMod,
  profBonus,
  spellSaveDC,
  spellAttackBonus,
  levelSpells,
  spellsByLevel,
  sortedSpellLevels,
  formatSpellName,
  getSpellLevel,
  canCastSpell,
  isPrepared,
  isInSpellbook,
  onUseSlot,
  onRestoreSlot,
  onRestoreAllSlots,
  onUsePactSlot,
  onRestoreAllPactSlots,
  onClearConcentration,
  onShowToast,
  showConfirm,
}: SpellcastingSectionProps) {
  const { isDark, colors } = useTheme();

  // ── Render helpers ───────────────────────────────────────────────

  const renderSpellcastingInfo = () => (
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <Ionicons name="flame" size={20} color={colors.accentDanger} />
        <Text className="text-dark-900 dark:text-white text-base font-semibold ml-2">
          Lanzamiento de Conjuros
        </Text>
      </View>

      <View className="flex-row flex-wrap">
        {spellcastingAbility && (
          <StatBox
            label="Aptitud Mágica"
            value={ABILITY_NAMES[spellcastingAbility]}
            subValue={formatModifier(abilityMod)}
            color={colors.accentPurple}
          />
        )}

        <StatBox
          label="CD de Salvación"
          value={String(spellSaveDC)}
          subValue={`8 + ${profBonus} + ${abilityMod}`}
          color={colors.accentAmber}
        />

        <StatBox
          label="Ataque Mágico"
          value={formatModifier(spellAttackBonus)}
          subValue={`${profBonus} + ${abilityMod}`}
          color={colors.accentDanger}
        />
      </View>

      <View className="mt-3 pt-3 border-t border-dark-100 dark:border-surface-border/50">
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.textMuted}
          />
          <Text className="text-dark-400 text-xs ml-1.5">
            {preparationType === "prepared"
              ? "Preparas conjuros de tu lista de clase cada día."
              : character.clase === "brujo"
                ? "Usas magia de pacto. Espacios se recuperan en descanso corto."
                : preparationType === "known"
                  ? "Conoces un número fijo de conjuros."
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
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={20} color={colors.accentBlue} />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Espacios de Conjuro
            </Text>
          </View>
          <TouchableOpacity
            className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
            onPress={onRestoreAllSlots}
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
                <Text className="text-dark-600 dark:text-dark-200 text-sm font-medium">
                  Nivel {level}
                </Text>
                <Text className="text-dark-400 text-xs">
                  {available}/{slot.total} disponibles
                </Text>
              </View>

              <View className="flex-row items-center">
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
                            : colors.bgPrimary,
                          borderColor: isAvailable
                            ? `${color}66`
                            : colors.borderDefault,
                        }}
                        onPress={() =>
                          isAvailable
                            ? onUseSlot(level)
                            : onRestoreSlot(level)
                        }
                      >
                        <Ionicons
                          name={isAvailable ? "ellipse" : "ellipse-outline"}
                          size={14}
                          color={isAvailable ? color : colors.borderDefault}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </View>

                <TouchableOpacity
                  className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => onUseSlot(level)}
                  disabled={available <= 0}
                  style={{ opacity: available > 0 ? 1 : 0.4 }}
                >
                  <Ionicons name="remove" size={16} color={color} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                  onPress={() => onRestoreSlot(level)}
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
          <View className="mt-2 pt-3 border-t border-dark-100 dark:border-surface-border/50">
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Ionicons
                  name="bonfire-outline"
                  size={16}
                  color={colors.accentPurple}
                />
                <Text className="text-purple-300 text-sm font-medium ml-1.5">
                  Magia de Pacto (Nv. {magicState.pactMagicSlots.slotLevel})
                </Text>
              </View>
              <Text className="text-dark-400 text-xs">
                {magicState.pactMagicSlots.total -
                  magicState.pactMagicSlots.used}
                /{magicState.pactMagicSlots.total} disponibles
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
                            ? `${colors.accentPurple}20`
                            : colors.bgPrimary,
                          borderColor: isAvailable
                            ? `${colors.accentPurple}66`
                            : colors.borderDefault,
                        }}
                        onPress={isAvailable ? onUsePactSlot : undefined}
                      >
                        <Ionicons
                          name={isAvailable ? "bonfire" : "bonfire-outline"}
                          size={14}
                          color={
                            isAvailable
                              ? colors.accentPurple
                              : colors.borderDefault
                          }
                        />
                      </TouchableOpacity>
                    );
                  },
                )}
              </View>
              <TouchableOpacity
                className="ml-2 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                onPress={onUsePactSlot}
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
                <Ionicons name="remove" size={16} color={colors.accentPurple} />
              </TouchableOpacity>
              <TouchableOpacity
                className="ml-1 bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-2 active:bg-gray-300 dark:active:bg-dark-600"
                onPress={async () => {
                  await onRestoreAllPactSlots();
                  onShowToast?.("Espacios de pacto restaurados");
                }}
                disabled={(magicState.pactMagicSlots?.used ?? 0) <= 0}
                style={{
                  opacity: (magicState.pactMagicSlots?.used ?? 0) > 0 ? 1 : 0.4,
                }}
              >
                <Ionicons name="add" size={16} color={colors.accentPurple} />
              </TouchableOpacity>
            </View>

            <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
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
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#ec4899" />
            <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
              Puntos de Hechicería
            </Text>
          </View>
          <Text className="text-pink-400 text-lg font-bold">
            {current}/{max}
          </Text>
        </View>

        <View className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${max > 0 ? (current / max) * 100 : 0}%`,
              backgroundColor: "#ec4899",
            }}
          />
        </View>

        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1.5">
          Se recuperan en descanso largo
        </Text>
      </View>
    );
  };

  const renderMetamagicSection = () => {
    if (character.clase !== "hechicero") return null;
    const chosen = magicState?.metamagicChosen ?? [];
    if (chosen.length === 0) return null;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="flash" size={20} color={colors.accentPurple} />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Metamagia
          </Text>
        </View>

        <View style={{ gap: 8 }}>
          {chosen.map((id) => {
            const name = METAMAGIC_NAMES[id as MetamagicOption] ?? id;
            const cost = METAMAGIC_COSTS[id as MetamagicOption];
            const desc = METAMAGIC_DESCRIPTIONS[id as MetamagicOption];

            return (
              <View
                key={id}
                style={{
                  backgroundColor: isDark
                    ? "rgba(168, 85, 247, 0.08)"
                    : "rgba(168, 85, 247, 0.05)",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: isDark
                    ? "rgba(168, 85, 247, 0.2)"
                    : "rgba(168, 85, 247, 0.15)",
                  padding: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      color: colors.accentPurple,
                      fontSize: 14,
                      fontWeight: "700",
                    }}
                  >
                    {name}
                  </Text>
                  {cost !== undefined && (
                    <View
                      style={{
                        backgroundColor: "rgba(168, 85, 247, 0.15)",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.accentPurple,
                          fontSize: 11,
                          fontWeight: "700",
                        }}
                      >
                        {cost} PH
                      </Text>
                    </View>
                  )}
                </View>
                {desc && (
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 12,
                      lineHeight: 17,
                    }}
                  >
                    {desc}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  const renderConcentration = () => {
    const { concentration } = character;
    if (!concentration) return null;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-purple-500/30 p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="eye" size={20} color={colors.accentPurple} />
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
            className="bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-1.5 active:bg-gray-300 dark:active:bg-dark-600"
            onPress={() => {
              showConfirm(
                "Romper Concentración",
                `¿Dejar de concentrarte en "${concentration.spellName}"?`,
                onClearConcentration,
                {
                  confirmText: "Romper",
                  cancelText: "Cancelar",
                  type: "danger",
                },
              );
            }}
          >
            <Text className="text-red-400 text-xs font-semibold">Romper</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Cantrips are now rendered by CantripsSection in AbilitiesTab

  const renderSpellList = () => {
    if (levelSpells.length === 0) return null;

    const sectionTitle =
      preparationType === "spellbook"
        ? "Libro de Hechizos"
        : preparationType === "prepared"
          ? "Conjuros Preparados"
          : "Conjuros Conocidos";

    const levelLabel = (lvl: number) =>
      lvl === 1
        ? "Nivel 1"
        : lvl === 2
          ? "Nivel 2"
          : lvl === 3
            ? "Nivel 3"
            : `Nivel ${lvl}`;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="book" size={20} color={colors.accentGold} />
          <Text className="text-dark-900 dark:text-white text-sm font-semibold flex-1 ml-2">
            {sectionTitle}
          </Text>
          <Text className="text-dark-400 text-xs">
            {levelSpells.length} conjuro(s)
          </Text>
        </View>

        {sortedSpellLevels.map((lvl) => {
          const spellsAtLevel = spellsByLevel[lvl];
          const lvlColor = SPELL_LEVEL_COLORS[lvl] ?? colors.accentBlue;
          return (
            <View key={lvl} style={{ marginBottom: lvl !== sortedSpellLevels[sortedSpellLevels.length - 1] ? 12 : 0 }}>
              {/* Level sub-header */}
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 6 }}>
                <View
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: `${lvlColor}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: lvlColor, fontSize: 11, fontWeight: "700" }}>{lvl}</Text>
                </View>
                <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "600" }}>
                  {levelLabel(lvl)}
                </Text>
                <View style={{ flex: 1, height: 1, backgroundColor: colors.borderSubtle, marginLeft: 4 }} />
              </View>

              {spellsAtLevel.map((spellId) => (
                <SpellCard
                  key={spellId}
                  spellId={spellId}
                  name={formatSpellName(spellId)}
                  level={getSpellLevel(spellId)}
                  prepared={canCastSpell(spellId)}
                  inSpellbook={isInSpellbook(spellId)}
                  showSpellbook={preparationType === "spellbook"}
                  onCast={(castLvl) => onUseSlot(castLvl)}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEmptySpells = () => {
    if (levelSpells.length > 0) return null;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-6 mb-4 items-center">
        <View className="h-16 w-16 rounded-full bg-gray-200 dark:bg-dark-700 items-center justify-center mb-4">
          <Ionicons name="book-outline" size={32} color={colors.textMuted} />
        </View>
        <Text className="text-dark-900 dark:text-white text-base font-semibold text-center mb-1">
          Sin conjuros
        </Text>
        <Text className="text-dark-500 dark:text-dark-300 text-sm text-center leading-5">
          No tienes conjuros conocidos ni preparados todavía. Los conjuros se
          seleccionan durante la creación del personaje.
        </Text>
      </View>
    );
  };

  // ── Main render ──────────────────────────────────────────────────

  return (
    <>
      {renderSpellcastingInfo()}
      {renderSpellSlots()}
      {renderSorceryPoints()}
      {renderMetamagicSection()}
      {renderConcentration()}
      {renderSpellList()}
      {renderEmptySpells()}
    </>
  );
}
