/**
 * Compendium Screen (HU-13)
 *
 * Browsable SRD 5.1 reference organized by category:
 * - Razas (Races)
 * - Clases (Classes)
 * - Trasfondos (Backgrounds)
 *
 * Features:
 * - Global search across all categories
 * - Expandable detail cards
 * - Tab-based navigation between categories
 * - Dark D&D-themed styling
 */

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Dimensions,
  Animated,
  Easing,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { SearchBar } from "@/components/ui";
import {
  getRaceList,
  getRaceData,
  getSubraceData,
  getAllRaceTraits,
  RACE_ICONS,
  getClassList,
  getClassData,
  CLASS_ICONS,
  getBackgroundList,
  getBackgroundData,
  BACKGROUND_ICONS,
} from "@/data/srd";
import type {
  RaceData,
  SubraceData,
  ClassData,
  BackgroundData,
} from "@/data/srd";
import { SKILLS } from "@/types/character";
import { ABILITY_NAMES, type AbilityKey } from "@/types/character";

// ─── Types ───────────────────────────────────────────────────────────

type TabId = "razas" | "clases" | "trasfondos";

interface TabDef {
  id: TabId;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconActive: keyof typeof Ionicons.glyphMap;
  color: string;
}

function getTabs(colors: import("@/utils/theme").ThemeColors): TabDef[] {
  return [
    {
      id: "razas",
      label: "Razas",
      icon: "people-outline",
      iconActive: "people",
      color: colors.accentAmber,
    },
    {
      id: "clases",
      label: "Clases",
      icon: "shield-outline",
      iconActive: "shield",
      color: colors.accentDanger,
    },
    {
      id: "trasfondos",
      label: "Trasfondos",
      icon: "book-outline",
      iconActive: "book",
      color: colors.accentBlue,
    },
  ];
}

// ─── Helpers ─────────────────────────────────────────────────────────

function formatAbilityBonuses(
  bonuses: Partial<Record<AbilityKey, number>>,
): string {
  return Object.entries(bonuses)
    .filter(([, v]) => v && v !== 0)
    .map(([key, val]) => {
      const name = ABILITY_NAMES[key as AbilityKey] || key.toUpperCase();
      return `${name} ${val! > 0 ? "+" : ""}${val}`;
    })
    .join(", ");
}

function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ─── Main Component ──────────────────────────────────────────────────

export default function CompendiumScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const TABS = getTabs(colors);
  const [activeTab, setActiveTab] = useState<TabId>("razas");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── Data loading ──
  const races = useMemo(() => getRaceList(), []);
  const classes = useMemo(() => getClassList(), []);
  const backgrounds = useMemo(() => getBackgroundList(), []);

  const toggleExpand = useCallback((id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  }, []);

  // ── Filtered data ──
  const query = searchQuery.toLowerCase().trim();

  const filteredRaces = useMemo(() => {
    if (!query) return races;
    return races.filter(
      (r) =>
        r.nombre.toLowerCase().includes(query) ||
        r.id.toLowerCase().includes(query),
    );
  }, [races, query]);

  const filteredClasses = useMemo(() => {
    if (!query) return classes;
    return classes.filter(
      (c) =>
        c.nombre.toLowerCase().includes(query) ||
        c.id.toLowerCase().includes(query),
    );
  }, [classes, query]);

  const filteredBackgrounds = useMemo(() => {
    if (!query) return backgrounds;
    return backgrounds.filter(
      (b) =>
        b.nombre.toLowerCase().includes(query) ||
        b.id.toLowerCase().includes(query),
    );
  }, [backgrounds, query]);

  // ── Render: Search Bar ──
  const renderSearchBar = () => (
    <View style={styles.searchContainer}>
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onClear={() => setSearchQuery("")}
        placeholder="Buscar en el compendio..."
        animated={false}
      />
    </View>
  );

  // ── Render: Tab Bar ──
  const renderTabBar = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.tabBarContent}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              setActiveTab(tab.id);
              setExpandedId(null);
            }}
            style={[
              styles.tabButton,
              {
                backgroundColor: colors.tabBg,
                borderColor: colors.tabBorder,
              },
              isActive && {
                backgroundColor: colors.tabActiveBg,
                borderColor: tab.color,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive ? tab.iconActive : tab.icon}
              size={18}
              color={isActive ? tab.color : colors.tabText}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: colors.tabText },
                isActive && { color: tab.color, fontWeight: "700" },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  // ── Render: Race Card ──
  const renderRaceCard = (raceInfo: RaceData) => {
    const data = raceInfo;

    const isExpanded = expandedId === `race_${data.id}`;
    const icon = RACE_ICONS[data.id as keyof typeof RACE_ICONS] || "🧝";
    const bonusStr = formatAbilityBonuses(data.abilityBonuses || {});
    const traits = getAllRaceTraits(data.id as any);

    return (
      <View
        key={data.id}
        style={[
          styles.card,
          { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(`race_${data.id}`)}
          style={styles.cardHeader}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.cardIconBg,
              { backgroundColor: `#f59e0b${colors.iconBgAlpha}` },
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
              {bonusStr || "Sin bonificadores fijos"}
              {" · "}
              Vel. {data.speed} pies
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
            {/* Size & Speed */}
            <View style={styles.detailRow}>
              <DetailBadge
                label="Tamaño"
                value={
                  data.size === "mediano"
                    ? "Mediano"
                    : data.size === "pequeno"
                      ? "Pequeño"
                      : "Grande"
                }
                color={colors.accentPurple}
              />
              <DetailBadge
                label="Velocidad"
                value={`${data.speed} pies`}
                color={colors.accentGreen}
              />
              {data.darkvision && (
                <DetailBadge
                  label="Visión oscura"
                  value={`${data.darkvisionRange || 60} pies`}
                  color={colors.accentDeepPurple}
                />
              )}
            </View>

            {/* Ability Bonuses */}
            {bonusStr && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Bonificadores de característica
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {bonusStr}
                </Text>
              </View>
            )}

            {/* Languages */}
            {data.languages && data.languages.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Idiomas
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {data.languages.join(", ")}
                </Text>
              </View>
            )}

            {/* Racial traits */}
            {traits && traits.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Rasgos raciales
                </Text>
                {traits.map((trait, i) => (
                  <View key={i} style={styles.traitItem}>
                    <Text
                      style={[styles.traitName, { color: colors.textPrimary }]}
                    >
                      {trait.nombre}
                    </Text>
                    <Text
                      style={[
                        styles.traitDesc,
                        { color: colors.textSecondary },
                      ]}
                    >
                      {trait.descripcion}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Subraces */}
            {data.subraces && data.subraces.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Subrazas
                </Text>
                {data.subraces.map((sr) => {
                  const srData = getSubraceData(sr.id as any);
                  const srBonuses = srData?.abilityBonuses
                    ? formatAbilityBonuses(srData.abilityBonuses)
                    : "";
                  return (
                    <View
                      key={sr.id}
                      style={[
                        styles.subraceBlock,
                        {
                          backgroundColor: colors.bgSubtle,
                          borderColor: colors.borderSubtle,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.subraceName,
                          { color: colors.accentGold },
                        ]}
                      >
                        {sr.nombre}
                      </Text>
                      {srBonuses ? (
                        <Text
                          style={[
                            styles.subraceDetail,
                            { color: colors.textSecondary },
                          ]}
                        >
                          {srBonuses}
                        </Text>
                      ) : null}
                      {srData?.traits && srData.traits.length > 0 && (
                        <>
                          {srData.traits.map((srt, si) => (
                            <View key={si} style={styles.traitItem}>
                              <Text
                                style={[
                                  styles.traitName,
                                  { fontSize: 12, color: colors.textPrimary },
                                ]}
                              >
                                {srt.nombre}
                              </Text>
                              <Text
                                style={[
                                  styles.traitDesc,
                                  { fontSize: 11, color: colors.textSecondary },
                                ]}
                              >
                                {srt.descripcion}
                              </Text>
                            </View>
                          ))}
                        </>
                      )}
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  const formatSkillName = (skill: string): string => {
    const def = SKILLS[skill as keyof typeof SKILLS];
    if (def) return def.nombre;
    return skill.charAt(0).toUpperCase() + skill.slice(1).replace(/_/g, " ");
  };

  // ── Render: Class Card ──
  const renderClassCard = (classData: ClassData) => {
    const data = classData;

    const isExpanded = expandedId === `class_${data.id}`;
    const icon = CLASS_ICONS[data.id as keyof typeof CLASS_ICONS] || "⚔️";

    return (
      <View
        key={data.id}
        style={[
          styles.card,
          { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(`class_${data.id}`)}
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
  };

  // ── Render: Background Card ──
  const renderBackgroundCard = (bgInfo: BackgroundData) => {
    const data = bgInfo;

    const isExpanded = expandedId === `bg_${data.id}`;
    const icon =
      BACKGROUND_ICONS[data.id as keyof typeof BACKGROUND_ICONS] || "📜";

    return (
      <View
        key={data.id}
        style={[
          styles.card,
          { backgroundColor: colors.cardBg, borderColor: colors.cardBorder },
        ]}
      >
        <TouchableOpacity
          onPress={() => toggleExpand(`bg_${data.id}`)}
          style={styles.cardHeader}
          activeOpacity={0.7}
        >
          <View
            style={[
              styles.cardIconBg,
              { backgroundColor: `#22c55e${colors.iconBgAlpha}` },
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
              {data.skills
                ? data.skills.map((s) => formatSkillName(s)).join(", ")
                : "Sin habilidades específicas"}
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
            {/* Description */}
            {data.descripcion && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {data.descripcion}
                </Text>
              </View>
            )}

            {/* Skills */}
            {data.skills && data.skills.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Competencias en habilidades
                </Text>
                <View style={styles.skillTagsRow}>
                  {data.skills.map((skill) => (
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

            {/* Tools & Languages */}
            {data.tools && data.tools.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Herramientas
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {data.tools.join(", ")}
                </Text>
              </View>
            )}

            {data.languages !== undefined && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Idiomas
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {typeof data.languages === "number"
                    ? `${data.languages} idioma(s) a elegir`
                    : Array.isArray(data.languages)
                      ? data.languages.join(", ")
                      : String(data.languages)}
                </Text>
              </View>
            )}

            {/* Equipment */}
            {data.equipment && data.equipment.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Equipamiento
                </Text>
                {data.equipment.map((eq, i) => (
                  <Text
                    key={i}
                    style={[styles.equipItem, { color: colors.textSecondary }]}
                  >
                    • {eq}
                  </Text>
                ))}
              </View>
            )}

            {/* Gold */}
            {data.gold !== undefined && data.gold > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Oro inicial
                </Text>
                <Text
                  style={[styles.detailText, { color: colors.textSecondary }]}
                >
                  {data.gold} po
                </Text>
              </View>
            )}

            {/* Feature */}
            {data.feature && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Rasgo especial
                </Text>
                <View style={styles.traitItem}>
                  <Text
                    style={[styles.traitName, { color: colors.textPrimary }]}
                  >
                    {data.feature.nombre}
                  </Text>
                  <Text
                    style={[styles.traitDesc, { color: colors.textSecondary }]}
                  >
                    {data.feature.descripcion}
                  </Text>
                </View>
              </View>
            )}

            {/* Personality tables */}
            {data.personalityTraits && data.personalityTraits.length > 0 && (
              <View style={styles.detailSection}>
                <Text
                  style={[styles.detailLabel, { color: colors.accentGold }]}
                >
                  Rasgos de personalidad ({data.personalityTraits.length})
                </Text>
                {data.personalityTraits.slice(0, 3).map((trait, i) => (
                  <Text
                    style={[
                      styles.personalityItem,
                      { color: colors.textSecondary },
                    ]}
                  >
                    {i + 1}. {trait}
                  </Text>
                ))}
                {data.personalityTraits.length > 3 && (
                  <Text style={[styles.moreText, { color: colors.textMuted }]}>
                    + {data.personalityTraits.length - 3} más...
                  </Text>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    );
  };

  // ── Render: Tab Content ──
  const renderContent = () => {
    switch (activeTab) {
      case "razas":
        return (
          <>
            <Text style={[styles.countText, { color: colors.textMuted }]}>
              {filteredRaces.length} raza{filteredRaces.length !== 1 ? "s" : ""}
            </Text>
            {filteredRaces.length === 0
              ? renderEmpty("razas")
              : filteredRaces.map(renderRaceCard)}
          </>
        );
      case "clases":
        return (
          <>
            <Text style={[styles.countText, { color: colors.textMuted }]}>
              {filteredClasses.length} clase
              {filteredClasses.length !== 1 ? "s" : ""}
            </Text>
            {filteredClasses.length === 0
              ? renderEmpty("clases")
              : filteredClasses.map(renderClassCard)}
          </>
        );
      case "trasfondos":
        return (
          <>
            <Text style={[styles.countText, { color: colors.textMuted }]}>
              {filteredBackgrounds.length} trasfondo
              {filteredBackgrounds.length !== 1 ? "s" : ""}
            </Text>
            {filteredBackgrounds.length === 0
              ? renderEmpty("trasfondos")
              : filteredBackgrounds.map(renderBackgroundCard)}
          </>
        );
    }
  };

  const renderEmpty = (category: string) => (
    <View style={styles.emptyContainer}>
      <Ionicons name="search" size={40} color={colors.textMuted} />
      <Text style={[styles.emptyText, { color: colors.textMuted }]}>
        No se encontraron {category} con "{searchQuery}"
      </Text>
    </View>
  );

  // ── Entrance animations ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(12)).current;
  const contentFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(120, [
      Animated.parallel([
        Animated.timing(headerFade, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(headerSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(contentFade, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFade, headerSlide, contentFade]);

  // ── Main Render ──
  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      {/* Full background gradient */}
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <Animated.View
        style={[
          styles.header,
          {
            opacity: headerFade,
            transform: [{ translateY: headerSlide }],
          },
        ]}
      >
        <LinearGradient
          colors={colors.gradientHeader}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerRow}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.headerButtonBg,
                borderColor: colors.headerButtonBorder,
              },
            ]}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                styles.headerLabel,
                {
                  color: colors.headerLabelColor,
                  textShadowColor: colors.accentGoldGlow,
                },
              ]}
            >
              D&amp;D Español
            </Text>
            <Text
              style={[styles.headerTitle, { color: colors.headerTitleColor }]}
            >
              Compendio
            </Text>
          </View>
          {/* Decorative book icon */}
          <View
            style={[
              styles.headerIconBadge,
              {
                backgroundColor: colors.headerButtonBg,
                borderColor: colors.headerButtonBorder,
              },
            ]}
          >
            <Ionicons name="book" size={18} color={colors.accentGold} />
          </View>
        </View>

        {/* Bottom border gradient */}
        <View style={styles.headerBorder}>
          <LinearGradient
            colors={[
              "transparent",
              colors.borderDefault + "66",
              colors.borderDefault,
              colors.borderDefault + "66",
              "transparent",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={{ height: 1, width: "100%" }}
          />
        </View>
      </Animated.View>

      {/* Search */}
      {renderSearchBar()}

      {/* Tab Bar */}
      {renderTabBar()}

      {/* Content */}
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {renderContent()}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function DetailBadge({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <View
      style={[
        detailBadgeStyles.container,
        { backgroundColor: color + "15", borderColor: color + "30" },
      ]}
    >
      <Text style={[detailBadgeStyles.label, { color: color + "99" }]}>
        {label}
      </Text>
      <Text style={[detailBadgeStyles.value, { color }]}>{value}</Text>
    </View>
  );
}

const detailBadgeStyles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
    minWidth: 80,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 14,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  headerIconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    borderWidth: 1,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    marginTop: 2,
    letterSpacing: -0.3,
  },

  // ── Search ──
  searchContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    paddingTop: 4,
  },
  // ── Tabs ──
  tabBarContent: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
  },
  tabButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  tabLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
  },

  // ── Content ──
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  countText: {
    fontSize: 13,
    marginBottom: 10,
    marginLeft: 4,
  },

  // ── Cards ──
  card: {
    marginBottom: 12,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardIconBg: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },
  cardSubtitle: {
    fontSize: 13,
    marginTop: 2,
  },

  // ── Card Detail ──
  cardDetail: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  detailRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 12,
    marginBottom: 4,
  },
  detailSection: {
    marginTop: 14,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
  },

  // ── Traits ──
  traitItem: {
    marginBottom: 8,
    paddingLeft: 4,
  },
  traitName: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  traitDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  // ── Subrace ──
  subraceBlock: {
    marginBottom: 8,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  subraceName: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 4,
  },
  subraceDetail: {
    fontSize: 12,
    marginBottom: 4,
  },

  // ── Class extras ──
  levelBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  levelBadgeText: {
    fontSize: 11,
    fontWeight: "bold",
  },
  skillTagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  skillTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
  },
  skillTagText: {
    fontSize: 12,
    fontWeight: "500",
  },
  subclassRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  subclassBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  subclassBadgeText: {
    fontSize: 13,
    fontWeight: "600",
  },
  moreText: {
    fontSize: 12,
    fontStyle: "italic",
    marginTop: 4,
  },

  // ── Background extras ──
  equipItem: {
    fontSize: 13,
    lineHeight: 20,
    marginLeft: 4,
  },
  personalityItem: {
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 4,
  },

  // ── Empty ──
  emptyContainer: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyText: {
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
});
