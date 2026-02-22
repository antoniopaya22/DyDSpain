import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import { SPELL_LEVEL_COLORS } from "@/constants/abilities";
import { getSpellById } from "@/data/srd/spells";
import { getSpellDescription } from "@/data/srd/spellDescriptions";

// ─── Sub-component ───────────────────────────────────────────────────

function CantripCard({
  spellId,
  name,
}: {
  spellId: string;
  name: string;
}) {
  const { colors } = useTheme();
  const [expanded, setExpanded] = useState(false);
  const color = SPELL_LEVEL_COLORS[0] ?? "#9ca3af";

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
          <Ionicons name="sparkles" size={16} color={color} />
        </View>

        <View className="flex-1">
          <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            {name}
          </Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-[10px]" style={{ color: colors.textMuted }}>
              Truco
              {(() => {
                const s = getSpellById(spellId);
                return s ? ` · ${s.escuela}` : "";
              })()}
            </Text>
            {castingTimeInfo && (
              <View className="flex-row items-center ml-1.5 rounded-full px-1.5"
                style={{ backgroundColor: withAlpha(castingTimeInfo.color, 0.15) }}>
                <Ionicons name={castingTimeInfo.icon} size={9} color={castingTimeInfo.color} />
                <Text className="text-[9px] font-semibold ml-0.5" style={{ color: castingTimeInfo.color }}>
                  {castingTimeInfo.label}
                </Text>
              </View>
            )}
          </View>
        </View>

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
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: desc ? 8 : 0,
                    }}
                  >
                    <Text className="text-xs" style={{ color: colors.textSecondary }}>
                      {srdSpell.escuela}
                    </Text>
                  </View>
                )}
                {desc && (
                  <View>
                    <View
                      style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        gap: 4,
                        marginBottom: 6,
                      }}
                    >
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

export interface CantripsSectionProps {
  cantrips: string[];
  formatSpellName: (id: string) => string;
}

// ─── Component ───────────────────────────────────────────────────────

export default function CantripsSection({
  cantrips,
  formatSpellName,
}: CantripsSectionProps) {
  const { colors } = useTheme();

  if (cantrips.length === 0) return null;

  return (
    <View className="rounded-card border p-4 mb-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
      <View className="flex-row items-center mb-3">
        <View
          className="h-8 w-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${colors.accentAmber}20` }}
        >
          <Ionicons name="sparkles" size={18} color={colors.accentAmber} />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold" style={{ color: colors.textPrimary }}>
            Trucos
          </Text>
          <Text className="text-[10px]" style={{ color: colors.textMuted }}>
            Siempre disponibles · No gastan espacios
          </Text>
        </View>
        <View
          className="rounded-full px-2.5 py-0.5"
          style={{ backgroundColor: `${colors.accentAmber}20` }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: colors.accentAmber }}
          >
            {cantrips.length}
          </Text>
        </View>
      </View>

      {cantrips.map((spellId) => (
        <CantripCard
          key={spellId}
          spellId={spellId}
          name={formatSpellName(spellId)}
        />
      ))}
    </View>
  );
}
