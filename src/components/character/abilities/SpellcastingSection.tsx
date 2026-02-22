import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import { SPELL_LEVEL_COLORS } from "@/constants/abilities";
import {
  ABILITY_NAMES,
  formatModifier,
  type AbilityKey,
  type Character,
} from "@/types/character";
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
  const { colors } = useTheme();
  return (
    <View className="flex-1 min-w-[100px] rounded-xl p-3 mr-2 mb-2 items-center border" style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}>
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

function SpellCard({
  spellId,
  name,
  level,
  prepared,
  isCantrip,
  inSpellbook,
  showSpellbook,
  canTogglePrepared,
  onTogglePrepared,
}: {
  spellId: string;
  name: string;
  level: number;
  prepared: boolean;
  isCantrip?: boolean;
  inSpellbook?: boolean;
  showSpellbook?: boolean;
  canTogglePrepared?: boolean;
  onTogglePrepared?: (spellId: string) => void;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const color = SPELL_LEVEL_COLORS[level] ?? colors.accentBlue;

  const castingTimeInfo = (() => {
    const desc = getSpellDescription(spellId);
    if (!desc?.tiempo) return null;
    const t = desc.tiempo.toLowerCase();
    if (t.includes('acción adicional')) return { icon: 'flash' as const, color: colors.accentGreen, label: 'Adicional' };
    if (t.includes('reacción')) return { icon: 'arrow-undo' as const, color: colors.accentPurple, label: 'Reacción' };
    return null;
  })();

  return (
    <TouchableOpacity
      className="rounded-lg p-3 mb-2 border"
      style={{ backgroundColor: colors.bgSecondary, borderColor: colors.borderDefault }}
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
          <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            {isCantrip && (
              <Text className="text-[10px] mr-2" style={{ color: colors.textMuted }}>
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
                <Text className="text-[10px] ml-0.5" style={{ color: '#22c55e' }}>
                  Preparado
                </Text>
              </View>
            )}
            {showSpellbook && inSpellbook && (
              <View className="flex-row items-center mr-2">
                <Ionicons name="book" size={10} color={colors.accentGold} />
                <Text className="text-[10px] ml-0.5" style={{ color: colors.accentGold }}>
                  En libro
                </Text>
              </View>
            )}
            {castingTimeInfo && (
              <View className="flex-row items-center mr-2 rounded-full px-1.5"
                style={{ backgroundColor: withAlpha(castingTimeInfo.color, 0.15) }}>
                <Ionicons name={castingTimeInfo.icon} size={9} color={castingTimeInfo.color} />
                <Text className="text-[9px] font-semibold ml-0.5" style={{ color: castingTimeInfo.color }}>
                  {castingTimeInfo.label}
                </Text>
              </View>
            )}
          </View>
        </View>

        {!isCantrip && canTogglePrepared && onTogglePrepared && (
          <TouchableOpacity
            className="rounded-lg px-2.5 py-1.5 mr-2 active:opacity-70"
            style={{
              backgroundColor: prepared
                ? withAlpha(colors.accentGreen, 0.15)
                : withAlpha(colors.textMuted, 0.1),
              borderWidth: 1,
              borderColor: prepared
                ? withAlpha(colors.accentGreen, 0.3)
                : withAlpha(colors.textMuted, 0.2),
            }}
            onPress={(e) => {
              e.stopPropagation?.();
              onTogglePrepared(spellId);
            }}
          >
            <Ionicons
              name={prepared ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={prepared ? colors.accentGreen : colors.textMuted}
            />
          </TouchableOpacity>
        )}

        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={colors.textMuted}
        />
      </View>

      {expanded && (
        <View className="mt-2 pt-2 border-t" style={{ borderColor: colors.borderDefault }}>
          {(() => {
            const srdSpell = getSpellById(spellId);
            const desc = getSpellDescription(spellId);
            return (
              <View>
                {srdSpell && (
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: desc ? 8 : 0 }}>
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      {srdSpell.escuela}
                    </Text>
                    {!isCantrip && (
                      <Text className="text-xs" style={{ color: colors.textMuted }}>
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
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                          ⏱ {desc.tiempo}
                        </Text>
                      ) : null}
                      {desc.alcance ? (
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                          · 📏 {desc.alcance}
                        </Text>
                      ) : null}
                      {desc.duracion ? (
                        <Text className="text-[10px]" style={{ color: colors.textMuted }}>
                          · ⏳ {desc.duracion}
                        </Text>
                      ) : null}
                    </View>
                    {desc.componentes ? (
                      <Text className="text-[10px] mb-1" style={{ color: colors.textMuted }}>
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
                  <Text className="text-xs leading-5" style={{ color: colors.textSecondary }}>
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
  onTogglePrepared?: (spellId: string) => void;
  maxPreparedSpells?: number;
  currentPreparedCount?: number;
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
  onTogglePrepared,
  maxPreparedSpells,
  currentPreparedCount,
}: SpellcastingSectionProps) {
  const { colors } = useTheme();

  // ── Render helpers ───────────────────────────────────────────────

  const renderSpellcastingInfo = () => (
    <View className="rounded-card border p-4 mb-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
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

      <View className="mt-3 pt-3 border-t" style={{ borderColor: colors.borderDefault }}>
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={14}
            color={colors.textMuted}
          />
          <Text className="text-xs ml-1.5" style={{ color: colors.textMuted }}>
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
      <View className="rounded-card border p-4 mb-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
        <View className="flex-row items-center mb-3">
          <Ionicons name="book" size={20} color={colors.accentGold} />
          <Text className="text-sm font-semibold flex-1 ml-2" style={{ color: colors.textPrimary }}>
            {sectionTitle}
          </Text>
          {maxPreparedSpells != null && currentPreparedCount != null && (preparationType === "prepared" || preparationType === "spellbook") ? (
            <Text className="text-xs" style={{ color: currentPreparedCount >= maxPreparedSpells ? colors.accentRed : colors.textMuted }}>
              {currentPreparedCount}/{maxPreparedSpells} preparados
            </Text>
          ) : (
            <Text className="text-xs" style={{ color: colors.textMuted }}>
              {levelSpells.length} conjuro(s)
            </Text>
          )}
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

              {spellsAtLevel.map((spellId) => {
                const spellLevel = getSpellLevel(spellId);
                const isCantrip = spellLevel === 0;
                const canToggle =
                  !isCantrip &&
                  (preparationType === "prepared" || preparationType === "spellbook");
                return (
                  <SpellCard
                    key={spellId}
                    spellId={spellId}
                    name={formatSpellName(spellId)}
                    level={spellLevel}
                    prepared={canCastSpell(spellId)}
                    isCantrip={isCantrip}
                    inSpellbook={isInSpellbook(spellId)}
                    showSpellbook={preparationType === "spellbook"}
                    canTogglePrepared={canToggle}
                    onTogglePrepared={onTogglePrepared}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    );
  };

  const renderEmptySpells = () => {
    if (levelSpells.length > 0) return null;

    return (
      <View className="rounded-card border p-6 mb-4 items-center" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
        <View className="h-16 w-16 rounded-full items-center justify-center mb-4" style={{ backgroundColor: colors.bgSecondary }}>
          <Ionicons name="book-outline" size={32} color={colors.textMuted} />
        </View>
        <Text className="text-base font-semibold text-center mb-1" style={{ color: colors.textPrimary }}>
          Sin conjuros
        </Text>
        <Text className="text-sm text-center leading-5" style={{ color: colors.textSecondary }}>
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
      {renderSpellList()}
      {renderEmptySpells()}
    </>
  );
}
