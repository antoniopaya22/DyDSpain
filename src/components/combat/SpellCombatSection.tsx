/**
 * SpellCombatSection — Sección de magia para la pestaña de combate.
 *
 * Muestra: estadísticas de lanzamiento, espacios de conjuro (con usar/restaurar),
 * magia de pacto, puntos de hechicería, metamagia, y lista rápida de conjuros
 * con botón "Lanzar".
 *
 * Es auto-contenido: lee todo del store directamente.
 */

import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme, useDialog, useToast } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import { SPELL_LEVEL_COLORS } from "@/constants/abilities";
import { useCharacterStore } from "@/stores/characterStore";
import {
  SPELLCASTING_ABILITY,
  CLASS_CASTER_TYPE,
  CLASS_SPELL_PREPARATION,
  type MetamagicOption,
  METAMAGIC_NAMES,
  METAMAGIC_DESCRIPTIONS,
  METAMAGIC_COSTS,
} from "@/types/spell";
import {
  ABILITY_NAMES,
  formatModifier,
  type AbilityKey,
} from "@/types/character";
import { getSpellById } from "@/data/srd/spells";
import { getSpellDescription } from "@/data/srd/spellDescriptions";
import { ConfirmDialog, Toast } from "@/components/ui";

// ─── Stat Box ────────────────────────────────────────────────────────

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
  const { colors } = useTheme();
  return (
    <View
      className="flex-1 min-w-[100px] rounded-xl p-3 mr-2 mb-2 items-center border"
      style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}
    >
      <Text className="text-[10px] uppercase tracking-wider mb-1" style={{ color: colors.textMuted }}>
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-[10px] mt-0.5" style={{ color: colors.textMuted }}>
          {subValue}
        </Text>
      )}
    </View>
  );
}

// ─── Compact Spell Row ───────────────────────────────────────────────

function CastableSpellRow({
  spellId,
  name,
  level,
  prepared,
  onCast,
}: {
  spellId: string;
  name: string;
  level: number;
  prepared: boolean;
  onCast: (level: number) => void;
}) {
  const { colors } = useTheme();
  const color = SPELL_LEVEL_COLORS[level] ?? colors.accentBlue;

  const castingTimeInfo = (() => {
    const desc = getSpellDescription(spellId);
    if (!desc?.tiempo) return null;
    const t = desc.tiempo.toLowerCase();
    if (t.includes("acción adicional"))
      return { icon: "flash" as const, color: colors.accentGreen, label: "Adic." };
    if (t.includes("reacción"))
      return { icon: "arrow-undo" as const, color: colors.accentPurple, label: "Reacc." };
    return null;
  })();

  return (
    <View
      className="flex-row items-center rounded-lg p-2.5 mb-1.5 border"
      style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}
    >
      {/* Level circle */}
      <View
        className="h-7 w-7 rounded-full items-center justify-center mr-2.5"
        style={{ backgroundColor: `${color}20` }}
      >
        <Text className="text-[11px] font-bold" style={{ color }}>
          {level}
        </Text>
      </View>

      {/* Name + badges */}
      <View className="flex-1">
        <Text className="text-sm font-medium" style={{ color: colors.textPrimary }}>
          {name}
        </Text>
        <View className="flex-row items-center mt-0.5">
          {prepared && (
            <View className="flex-row items-center mr-1.5">
              <Ionicons name="checkmark-circle" size={9} color={colors.accentGreen} />
              <Text className="text-[9px] ml-0.5" style={{ color: colors.accentGreen }}>
                Prep.
              </Text>
            </View>
          )}
          {castingTimeInfo && (
            <View
              className="flex-row items-center rounded-full px-1.5"
              style={{ backgroundColor: withAlpha(castingTimeInfo.color, 0.15) }}
            >
              <Ionicons name={castingTimeInfo.icon} size={8} color={castingTimeInfo.color} />
              <Text className="text-[8px] font-semibold ml-0.5" style={{ color: castingTimeInfo.color }}>
                {castingTimeInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Cast button */}
      {prepared && (
        <TouchableOpacity
          className="rounded-lg px-3 py-1.5 active:opacity-70"
          style={{ backgroundColor: withAlpha(colors.accentRed, 0.2) }}
          onPress={() => onCast(level)}
        >
          <Text className="text-xs font-semibold" style={{ color: colors.accentRed }}>
            Lanzar
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Main Component ──────────────────────────────────────────────────

export function SpellCombatSection() {
  const { isDark, colors } = useTheme();
  const { dialogProps, showConfirm } = useDialog();
  const { toastProps, showInfo: showToast } = useToast();

  const {
    character,
    magicState,
    useSpellSlot,
    restoreSpellSlot,
    restoreAllSpellSlots,
    usePactSlot,
    restoreAllPactSlots,
  } = useCharacterStore();

  const [showAllSpells, setShowAllSpells] = useState(false);

  if (!character) return null;

  const casterType = CLASS_CASTER_TYPE[character.clase];
  if (casterType === "none") return null;

  const spellcastingAbility =
    SPELLCASTING_ABILITY[character.clase as keyof typeof SPELLCASTING_ABILITY];
  const preparationType = CLASS_SPELL_PREPARATION[character.clase];

  const abilityMod = spellcastingAbility
    ? character.abilityScores[spellcastingAbility].modifier
    : 0;
  const profBonus = character.proficiencyBonus;
  const spellSaveDC = 8 + profBonus + abilityMod;
  const spellAttackBonus = profBonus + abilityMod;

  // ── Spell data ──

  const allSpellIds = magicState
    ? [
        ...new Set([
          ...magicState.knownSpellIds,
          ...magicState.preparedSpellIds,
          ...magicState.spellbookIds,
        ]),
      ]
    : [
        ...new Set([
          ...character.knownSpellIds,
          ...character.preparedSpellIds,
          ...character.spellbookIds,
        ]),
      ];

  const levelSpells = allSpellIds.filter((id) => {
    const spell = getSpellById(id);
    return spell
      ? spell.nivel > 0
      : !id.startsWith("truco_") && !id.includes("truco");
  });

  const spellsByLevel: Record<number, string[]> = {};
  for (const id of levelSpells) {
    const spell = getSpellById(id);
    const lvl = spell?.nivel ?? 1;
    if (!spellsByLevel[lvl]) spellsByLevel[lvl] = [];
    spellsByLevel[lvl].push(id);
  }
  const sortedSpellLevels = Object.keys(spellsByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  const formatSpellName = (id: string): string => {
    const spell = getSpellById(id);
    if (spell) return spell.nombre;
    if (id.startsWith("custom:truco:")) return id.slice("custom:truco:".length);
    if (id.startsWith("custom:")) return id.slice("custom:".length);
    return id
      .replace(/^truco_/, "")
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
  };

  const isPrepared = (id: string): boolean => {
    if (preparationType === "known" || preparationType === "none") return true;
    if (magicState) return magicState.preparedSpellIds.includes(id);
    return character.preparedSpellIds.includes(id);
  };

  // ── Actions ──

  const handleUseSlot = async (level: number) => {
    const success = await useSpellSlot(level);
    if (success) showToast(`Espacio de nivel ${level} usado`);
    else showToast(`No quedan espacios de nivel ${level}`);
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
        if (character.clase === "brujo") await restoreAllPactSlots();
        showToast("Todos los espacios restaurados");
      },
      { confirmText: "Restaurar", cancelText: "Cancelar", type: "info" },
    );
  };

  const handleUsePactSlot = async () => {
    const success = await usePactSlot();
    if (success) showToast("Espacio de pacto usado");
    else showToast("No quedan espacios de pacto");
  };

  // ── Render: Spellcasting Info ──

  const renderSpellcastingInfo = () => (
    <View
      className="rounded-card border p-4 mb-4"
      style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
    >
      <View className="flex-row items-center mb-3">
        <Ionicons name="flame" size={20} color={colors.accentDanger} />
        <Text className="text-base font-semibold ml-2" style={{ color: colors.textPrimary }}>
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
    </View>
  );

  // ── Render: Spell Slots ──

  const renderSpellSlots = () => {
    if (!magicState) return null;

    const slotEntries = Object.entries(magicState.spellSlots)
      .filter(([_, slot]) => slot && slot.total > 0)
      .sort(([a], [b]) => Number(a) - Number(b));

    if (slotEntries.length === 0 && !magicState.pactMagicSlots) return null;

    return (
      <View
        className="rounded-card border p-4 mb-4"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="flash" size={20} color={colors.accentBlue} />
            <Text
              className="text-xs font-semibold uppercase tracking-wider ml-2"
              style={{ color: colors.textSecondary }}
            >
              Espacios de Conjuro
            </Text>
          </View>
          <TouchableOpacity
            className="rounded-lg px-3 py-1.5 active:opacity-70"
            style={{ backgroundColor: withAlpha(colors.accentBlue, 0.2) }}
            onPress={handleRestoreAllSlots}
          >
            <Text className="text-xs font-semibold" style={{ color: colors.accentBlue }}>
              Restaurar todos
            </Text>
          </TouchableOpacity>
        </View>

        {/* Regular spell slots */}
        {slotEntries.map(([levelStr, slot]) => {
          if (!slot) return null;
          const level = Number(levelStr);
          const available = slot.total - slot.used;
          const color = SPELL_LEVEL_COLORS[level] ?? colors.accentBlue;

          return (
            <View key={level} className="mb-3">
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-sm font-medium" style={{ color: colors.textSecondary }}>
                  Nivel {level}
                </Text>
                <Text className="text-xs" style={{ color: colors.textMuted }}>
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
                          backgroundColor: isAvailable ? `${color}20` : colors.bgPrimary,
                          borderColor: isAvailable ? `${color}66` : colors.borderDefault,
                        }}
                        onPress={() =>
                          isAvailable ? handleUseSlot(level) : handleRestoreSlot(level)
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
                  className="ml-2 rounded-lg px-2.5 py-2 active:opacity-70"
                  onPress={() => handleUseSlot(level)}
                  disabled={available <= 0}
                  style={{
                    backgroundColor: colors.bgSecondary,
                    opacity: available > 0 ? 1 : 0.4,
                  }}
                >
                  <Ionicons name="remove" size={16} color={color} />
                </TouchableOpacity>
                <TouchableOpacity
                  className="ml-1 rounded-lg px-2.5 py-2 active:opacity-70"
                  onPress={() => handleRestoreSlot(level)}
                  disabled={slot.used <= 0}
                  style={{
                    backgroundColor: colors.bgSecondary,
                    opacity: slot.used > 0 ? 1 : 0.4,
                  }}
                >
                  <Ionicons name="add" size={16} color={color} />
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Pact Magic Slots (Warlock) */}
        {magicState.pactMagicSlots && (
          <View className="mt-2 pt-3 border-t" style={{ borderColor: colors.borderDefault }}>
            <View className="flex-row items-center justify-between mb-1.5">
              <View className="flex-row items-center">
                <Ionicons name="bonfire-outline" size={16} color={colors.accentPurple} />
                <Text
                  className="text-sm font-medium ml-1.5"
                  style={{ color: colors.accentPurple }}
                >
                  Magia de Pacto (Nv. {magicState.pactMagicSlots.slotLevel})
                </Text>
              </View>
              <Text className="text-xs" style={{ color: colors.textMuted }}>
                {magicState.pactMagicSlots.total - magicState.pactMagicSlots.used}/
                {magicState.pactMagicSlots.total} disponibles
              </Text>
            </View>

            <View className="flex-row items-center">
              <View className="flex-row flex-1">
                {Array.from({ length: magicState.pactMagicSlots.total }).map((_, i) => {
                  const isAvailable =
                    i < magicState.pactMagicSlots!.total - magicState.pactMagicSlots!.used;
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
                      onPress={isAvailable ? handleUsePactSlot : undefined}
                    >
                      <Ionicons
                        name={isAvailable ? "bonfire" : "bonfire-outline"}
                        size={14}
                        color={isAvailable ? colors.accentPurple : colors.borderDefault}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TouchableOpacity
                className="ml-2 rounded-lg px-2.5 py-2 active:opacity-70"
                onPress={handleUsePactSlot}
                disabled={
                  (magicState.pactMagicSlots?.used ?? 0) >=
                  (magicState.pactMagicSlots?.total ?? 0)
                }
                style={{
                  backgroundColor: colors.bgSecondary,
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
                className="ml-1 rounded-lg px-2.5 py-2 active:opacity-70"
                onPress={async () => {
                  await restoreAllPactSlots();
                  showToast("Espacios de pacto restaurados");
                }}
                disabled={(magicState.pactMagicSlots?.used ?? 0) <= 0}
                style={{
                  backgroundColor: colors.bgSecondary,
                  opacity: (magicState.pactMagicSlots?.used ?? 0) > 0 ? 1 : 0.4,
                }}
              >
                <Ionicons name="add" size={16} color={colors.accentPurple} />
              </TouchableOpacity>
            </View>

            <Text className="text-[10px] mt-1.5" style={{ color: colors.textMuted }}>
              Se recuperan en descanso corto
            </Text>
          </View>
        )}
      </View>
    );
  };

  // ── Render: Sorcery Points ──

  const renderSorceryPoints = () => {
    if (!magicState?.sorceryPoints || character.clase !== "hechicero") return null;

    const { max, current } = magicState.sorceryPoints;

    return (
      <View
        className="rounded-card border p-4 mb-4"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="sparkles" size={20} color="#ec4899" />
            <Text
              className="text-xs font-semibold uppercase tracking-wider ml-2"
              style={{ color: colors.textSecondary }}
            >
              Puntos de Hechicería
            </Text>
          </View>
          <Text className="text-lg font-bold" style={{ color: "#ec4899" }}>
            {current}/{max}
          </Text>
        </View>

        <View
          className="h-3 rounded-full overflow-hidden"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <View
            className="h-full rounded-full"
            style={{
              width: `${max > 0 ? (current / max) * 100 : 0}%`,
              backgroundColor: "#ec4899",
            }}
          />
        </View>

        <Text className="text-[10px] mt-1.5" style={{ color: colors.textMuted }}>
          Se recuperan en descanso largo
        </Text>
      </View>
    );
  };

  // ── Render: Metamagic ──

  const renderMetamagicSection = () => {
    if (character.clase !== "hechicero") return null;
    const chosen = magicState?.metamagicChosen ?? [];
    if (chosen.length === 0) return null;

    return (
      <View
        className="rounded-card border p-4 mb-4"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
      >
        <View className="flex-row items-center mb-3">
          <Ionicons name="flash" size={20} color={colors.accentPurple} />
          <Text
            className="text-xs font-semibold uppercase tracking-wider ml-2"
            style={{ color: colors.textSecondary }}
          >
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

  // ── Render: Castable Spell List ──

  const renderCastableSpells = () => {
    if (levelSpells.length === 0) return null;

    const levelLabel = (lvl: number) => `Nivel ${lvl}`;

    return (
      <View
        className="rounded-card border p-4 mb-4"
        style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center">
            <Ionicons name="flash-outline" size={20} color={colors.accentRed} />
            <Text className="text-sm font-semibold ml-2" style={{ color: colors.textPrimary }}>
              Lanzar Conjuros
            </Text>
          </View>
          {levelSpells.length > 6 && (
            <TouchableOpacity
              onPress={() => setShowAllSpells(!showAllSpells)}
              className="rounded-lg px-2.5 py-1 active:opacity-70"
              style={{ backgroundColor: colors.bgSecondary }}
            >
              <Text className="text-[11px] font-medium" style={{ color: colors.textSecondary }}>
                {showAllSpells ? "Menos" : `Ver todos (${levelSpells.length})`}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {sortedSpellLevels.map((lvl) => {
          const spellsAtLevel = spellsByLevel[lvl];
          const lvlColor = SPELL_LEVEL_COLORS[lvl] ?? colors.accentBlue;
          return (
            <View
              key={lvl}
              style={{
                marginBottom:
                  lvl !== sortedSpellLevels[sortedSpellLevels.length - 1] ? 10 : 0,
              }}
            >
              {/* Level sub-header */}
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 4,
                  gap: 6,
                }}
              >
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: `${lvlColor}20`,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: lvlColor, fontSize: 10, fontWeight: "700" }}>
                    {lvl}
                  </Text>
                </View>
                <Text
                  style={{ color: colors.textSecondary, fontSize: 11, fontWeight: "600" }}
                >
                  {levelLabel(lvl)}
                </Text>
                <View
                  style={{
                    flex: 1,
                    height: 1,
                    backgroundColor: colors.borderSubtle,
                    marginLeft: 4,
                  }}
                />
              </View>

              {(showAllSpells || levelSpells.length <= 6
                ? spellsAtLevel
                : spellsAtLevel.slice(0, 3)
              ).map((spellId) => (
                <CastableSpellRow
                  key={spellId}
                  spellId={spellId}
                  name={formatSpellName(spellId)}
                  level={getSpellById(spellId)?.nivel ?? lvl}
                  prepared={isPrepared(spellId)}
                  onCast={handleUseSlot}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  // ── Main render ──

  return (
    <>
      {renderSpellcastingInfo()}
      {renderSpellSlots()}
      {renderSorceryPoints()}
      {renderMetamagicSection()}
      {renderCastableSpells()}
      <ConfirmDialog {...dialogProps} />
      <Toast {...toastProps} />
    </>
  );
}
