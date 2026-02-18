/**
 * ClassCard - Expandable class detail card for the Compendium
 * Extracted from compendium.tsx
 */

import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { DetailBadge } from "@/components/ui";
import { CLASS_ICONS } from "@/data/srd";
import type { ClassData } from "@/data/srd";
import { ABILITY_NAMES, type AbilityKey } from "@/types/character";
import { useTheme } from "@/hooks";
import { formatSkillName } from "./compendiumUtils";
import { cardStyles as styles } from "./compendiumStyles";

interface ClassCardProps {
  data: ClassData;
  isExpanded: boolean;
  onToggle: () => void;
}

export function ClassCard({ data, isExpanded, onToggle }: ClassCardProps) {
  const { colors } = useTheme();
  const icon = CLASS_ICONS[data.id as keyof typeof CLASS_ICONS] || "⚔️";

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
      ]}
    >
      <TouchableOpacity
        onPress={onToggle}
        style={styles.cardHeader}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.cardIconBg,
            { backgroundColor: `#ef4444${colors.iconBgAlpha}` },
          ]}
        >
          <Text style={{ fontSize: 22 }}>{icon}</Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
            {data.nombre}
          </Text>
          <Text
            style={[styles.cardSubtitle, { color: colors.textSecondary }]}
            numberOfLines={1}
          >
            Dado de golpe: {data.hitDie} · Salv:{" "}
            {data.savingThrows
              .map((s) => ABILITY_NAMES[s as AbilityKey]?.slice(0, 3) || s)
              .join(", ")}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.chevronColor}
        />
      </TouchableOpacity>

      {isExpanded && (
        <View
          style={[
            styles.cardDetail,
            { borderTopColor: colors.borderSeparator },
          ]}
        >
          {/* Hit Die & Saving Throws */}
          <View style={styles.detailRow}>
            <DetailBadge
              label="Dado de golpe"
              value={data.hitDie}
              color={colors.accentDanger}
            />
            <DetailBadge
              label="PG nivel 1"
              value={`${data.hitDieMax} + CON`}
              color={colors.accentGreen}
            />
          </View>

          {/* Saving Throws */}
          <View style={styles.detailSection}>
            <Text style={[styles.detailLabel, { color: colors.accentGold }]}>
              Salvaciones competentes
            </Text>
            <Text
              style={[styles.detailText, { color: colors.textSecondary }]}
            >
              {data.savingThrows
                .map((s) => ABILITY_NAMES[s as AbilityKey] || s)
                .join(", ")}
            </Text>
          </View>

          {/* Armor Proficiencies */}
          {data.armorProficiencies && data.armorProficiencies.length > 0 && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                Armaduras
              </Text>
              <Text
                style={[styles.detailText, { color: colors.textSecondary }]}
              >
                {data.armorProficiencies.join(", ")}
              </Text>
            </View>
          )}

          {/* Weapon Proficiencies */}
          {data.weaponProficiencies &&
            data.weaponProficiencies.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Armas
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {data.weaponProficiencies.join(", ")}
                </Text>
              </View>
            )}

          {/* Tool Proficiencies */}
          {data.toolProficiencies && data.toolProficiencies.length > 0 && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                Herramientas
              </Text>
              <Text
                style={[styles.detailText, { color: colors.textSecondary }]}
              >
                {data.toolProficiencies.join(", ")}
              </Text>
            </View>
          )}

          {/* Skills */}
          {data.skillChoicePool && data.skillChoicePool.length > 0 && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                Habilidades (elige {data.skillChoiceCount || 2})
              </Text>
              <View style={styles.skillTagsRow}>
                {data.skillChoicePool.map((skill) => (
                  <View
                    key={skill}
                    style={[
                      styles.skillTag,
                      {
                        backgroundColor: colors.tabBg,
                        borderColor: colors.tabBorder,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.skillTagText,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {formatSkillName(skill)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Class Features (level 1) */}
          {data.level1Features && data.level1Features.length > 0 && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                Rasgos de clase (nivel 1)
              </Text>
              {data.level1Features.map((feature, i) => (
                <View key={i} style={styles.traitItem}>
                  <View
                    style={{ flexDirection: "row", alignItems: "center" }}
                  >
                    <View
                      style={[
                        styles.levelBadge,
                        { backgroundColor: `${colors.accentRed}30` },
                      ]}
                    >
                      <Text
                        style={[
                          styles.levelBadgeText,
                          { color: colors.accentRed },
                        ]}
                      >
                        Nv.{feature.nivel}
                      </Text>
                    </View>
                    <Text
                      style={[
                        styles.traitName,
                        { marginLeft: 8, color: colors.textPrimary },
                      ]}
                    >
                      {feature.nombre}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.traitDesc,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {feature.descripcion}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* Subclass info */}
          {data.subclassLevel > 0 && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                Subclase ({data.subclassLabel}) — Nv. {data.subclassLevel}
              </Text>
              <Text
                style={[styles.detailText, { color: colors.textSecondary }]}
              >
                Se elige al alcanzar el nivel {data.subclassLevel}.
              </Text>
            </View>
          )}

          {/* Spellcasting */}
          {data.casterType !== "none" && data.spellcastingAbility && (
            <View style={styles.detailSection}>
              <Text
                style={[styles.detailLabel, { color: colors.accentGold }]}
              >
                🔮 Lanzamiento de conjuros
              </Text>
              <Text
                style={[styles.detailText, { color: colors.textSecondary }]}
              >
                Característica:{" "}
                {ABILITY_NAMES[data.spellcastingAbility as AbilityKey] ||
                  data.spellcastingAbility}
              </Text>
              <Text
                style={[
                  styles.detailText,
                  { color: colors.textSecondary, marginTop: 2 },
                ]}
              >
                Tipo:{" "}
                {data.casterType === "full"
                  ? "Lanzador completo"
                  : data.casterType === "half"
                    ? "Medio lanzador"
                    : data.casterType === "pact"
                      ? "Magia de pacto"
                      : data.casterType}
              </Text>
              {data.preparesSpells && (
                <Text
                  style={[
                    styles.detailText,
                    { color: colors.textSecondary, marginTop: 2 },
                  ]}
                >
                  Prepara conjuros diariamente.
                </Text>
              )}
              {data.cantripsAtLevel1 > 0 && (
                <Text
                  style={[
                    styles.detailText,
                    { color: colors.textSecondary, marginTop: 2 },
                  ]}
                >
                  Trucos a nivel 1: {data.cantripsAtLevel1}
                </Text>
              )}
            </View>
          )}
        </View>
      )}
    </View>
  );
}
