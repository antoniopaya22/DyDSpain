import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
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
          <Ionicons name="sparkles" size={16} color={color} />
        </View>

        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-sm font-semibold">
            {name}
          </Text>
          <Text className="text-dark-400 text-[10px] mt-0.5">
            Truco
            {(() => {
              const s = getSpellById(spellId);
              return s ? ` · ${s.escuela}` : "";
            })()}
          </Text>
        </View>

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
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      gap: 8,
                      marginBottom: desc ? 8 : 0,
                    }}
                  >
                    <Text className="text-dark-500 dark:text-dark-300 text-xs">
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
    <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View
          className="h-8 w-8 rounded-full items-center justify-center mr-3"
          style={{ backgroundColor: `${colors.accentAmber}20` }}
        >
          <Ionicons name="sparkles" size={18} color={colors.accentAmber} />
        </View>
        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-sm font-semibold">
            Trucos
          </Text>
          <Text className="text-dark-400 text-[10px]">
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
