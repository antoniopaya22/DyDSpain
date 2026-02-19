/**
 * Master Character View — Read-only full character sheet (HU-10.8)
 *
 * Shows the complete character data of a player in the master's campaign.
 * All sections are read-only — the master can only observe, not edit.
 *
 * Receives character data via route params (characterId) and reads from
 * the liveCharacters cache or directly from Supabase.
 */

import { useEffect, useRef, useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { supabase } from "@/lib/supabase";
import { getRaceData, getSubraceData } from "@/data/srd/races";
import { getClassData } from "@/data/srd/classes";
import { getBackgroundData } from "@/data/srd/backgrounds";
import { getSpellById } from "@/data/srd/spells";
import { formatModifier, calcProficiencyBonus } from "@/utils/character";
import {
  ABILITY_ABBR,
  SKILLS,
  ALIGNMENT_NAMES,
  CONDITION_NAMES,
} from "@/constants/character";
import { ABILITY_COLORS, ABILITY_KEYS, SPELL_LEVEL_COLORS } from "@/constants/abilities";
import type { Character, AbilityKey, SkillKey } from "@/types/character";
import type { ThemeColors } from "@/utils/theme";

// ─── Types ───────────────────────────────────────────────────────────

type SectionId =
  | "basic"
  | "abilities"
  | "combat"
  | "skills"
  | "spells"
  | "traits"
  | "proficiencies";

// ─── HP Helpers ──────────────────────────────────────────────────────

function getHpColor(current: number, max: number): string {
  if (max === 0) return "#6B7280";
  const ratio = current / max;
  if (ratio > 0.5) return "#22C55E";
  if (ratio > 0.25) return "#F59E0B";
  if (ratio > 0) return "#EF4444";
  return "#7C3AED";
}

function getHpLabel(current: number, max: number): string {
  if (max === 0) return "—";
  if (current <= 0) return "Inconsciente";
  const ratio = current / max;
  if (ratio <= 0.25) return "Crítico";
  if (ratio <= 0.5) return "Herido";
  return "Sano";
}

function getDamageModLabel(modifier: string): string {
  if (modifier === "resistance") return "Res.";
  if (modifier === "immunity") return "Inmun.";
  return "Vuln.";
}

function getSkillProfColor(level: string | undefined, gold: string, green: string): string {
  if (level === "expertise") return gold;
  if (level === "proficient") return green;
  return "transparent";
}

function getRechargeLabel(recharge: string): string {
  if (recharge === "short_rest") return "Desc. corto";
  if (recharge === "long_rest") return "Desc. largo";
  return "Amanecer";
}

// ─── Component ───────────────────────────────────────────────────────

export default function MasterCharacterView() {
  const router = useRouter();
  const { characterId, playerName } = useLocalSearchParams<{
    characterId: string;
    playerName?: string;
  }>();
  const { colors } = useTheme();

  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<SectionId>>(
    new Set(["basic", "abilities", "combat"]),
  );

  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Fetch character from Supabase
  useEffect(() => {
    if (!characterId) return;

    const fetch = async () => {
      try {
        setLoading(true);
        const { data, error: dbError } = await supabase
          .from("personajes")
          .select("datos")
          .eq("id", characterId)
          .single();

        if (dbError) throw new Error(dbError.message);
        if (!data?.datos) throw new Error("Sin datos de personaje");

        setCharacter(data.datos as unknown as Character);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetch();

    // Subscribe to real-time updates
    const channel = supabase
      .channel(`master-char-${characterId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "personajes",
          filter: `id=eq.${characterId}`,
        },
        (payload) => {
          const newData = payload.new as { datos: unknown };
          if (newData?.datos) {
            setCharacter(newData.datos as unknown as Character);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [characterId]);

  // Entrance animation
  useEffect(() => {
    if (character) {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [character, fadeAnim]);

  const toggleSection = (id: SectionId) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Derived data ──
  const raceData = character ? getRaceData(character.raza) : null;
  const subraceData =
    character?.subraza
      ? getSubraceData(character.raza, character.subraza)
      : null;
  const classData = character ? getClassData(character.clase) : null;
  const backgroundData = character ? getBackgroundData(character.trasfondo) : null;
  const profBonus = character ? calcProficiencyBonus(character.nivel) : 0;

  // Prepared/known spells
  const preparedSpells = useMemo(() => {
    if (!character) return [];
    return character.preparedSpellIds
      .map((id) => getSpellById(id))
      .filter(Boolean);
  }, [character]);

  const knownSpells = useMemo(() => {
    if (!character) return [];
    return character.knownSpellIds
      .map((id) => getSpellById(id))
      .filter(Boolean);
  }, [character]);

  // ── Loading ──
  if (loading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.bgPrimary }]}>
        <LinearGradient
          colors={[colors.gradientMain[0], colors.gradientMain[3]]}
          style={StyleSheet.absoluteFill}
        />
        <ActivityIndicator size="large" color={colors.accentGold} />
        <Text style={[styles.loadingText, { color: colors.textMuted }]}>
          Cargando personaje...
        </Text>
      </View>
    );
  }

  // ── Error ──
  if (error || !character) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.bgPrimary }]}>
        <LinearGradient
          colors={[colors.gradientMain[0], colors.gradientMain[3]]}
          style={StyleSheet.absoluteFill}
        />
        <Ionicons name="alert-circle-outline" size={48} color={colors.accentDanger} />
        <Text style={[styles.errorText, { color: colors.textPrimary }]}>
          {error || "Personaje no encontrado"}
        </Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.errorLink, { color: colors.accentGold }]}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hpColor = getHpColor(character.hp.current, character.hp.max);
  const hpPct =
    character.hp.max > 0
      ? Math.min(100, (character.hp.current / character.hp.max) * 100)
      : 0;

  // ── Render ──
  return (
    <View style={[styles.container, { backgroundColor: colors.bgPrimary }]}>
      <LinearGradient
        colors={[colors.gradientMain[0], colors.gradientMain[3]]}
        style={StyleSheet.absoluteFill}
      />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.borderSubtle }]}>
        <TouchableOpacity
          style={[
            styles.backBtn,
            {
              backgroundColor: colors.headerButtonBg,
              borderColor: colors.headerButtonBorder,
            },
          ]}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={18} color={colors.textPrimary} />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text
            style={[styles.headerTitle, { color: colors.headerTitleColor }]}
            numberOfLines={1}
          >
            {character.nombre}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textMuted }]}>
            {playerName ? `Jugador: ${playerName}` : "Vista de Master"}
          </Text>
        </View>

        {/* Real-time indicator */}
        <View style={styles.realtimeBadge}>
          <View style={[styles.realtimeDot, { backgroundColor: colors.accentGreen }]} />
          <Text style={[styles.realtimeLabel, { color: colors.textMuted }]}>En vivo</Text>
        </View>
      </View>

      {/* Character Summary Banner */}
      <View style={[styles.summaryBanner, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
        <View style={styles.summaryRow}>
          <View style={styles.summaryInfo}>
            <Text style={[styles.summaryName, { color: colors.textPrimary }]}>
              {raceData?.nombre ?? character.raza}{" "}
              {subraceData ? `(${subraceData.nombre})` : ""}
            </Text>
            <Text style={[styles.summaryClass, { color: colors.accentGold }]}>
              {classData?.nombre ?? character.clase} Nv. {character.nivel}
              {character.subclase ? ` — ${character.subclase}` : ""}
            </Text>
            <Text style={[styles.summaryBg, { color: colors.textMuted }]}>
              {backgroundData?.nombre ?? character.trasfondo} ·{" "}
              {ALIGNMENT_NAMES[character.alineamiento]}
            </Text>
          </View>

          {/* HP compact */}
          <View style={styles.summaryHp}>
            <Text style={[styles.hpBigValue, { color: hpColor }]}>
              {character.hp.current}
              <Text style={[styles.hpBigMax, { color: colors.textMuted }]}>
                /{character.hp.max}
              </Text>
            </Text>
            <View style={[styles.hpBarBg, { backgroundColor: colors.bgSubtle }]}>
              <View
                style={[
                  styles.hpBarFill,
                  { backgroundColor: hpColor, width: `${hpPct}%` },
                ]}
              />
            </View>
            <Text style={[styles.hpStatusLabel, { color: hpColor }]}>
              {getHpLabel(character.hp.current, character.hp.max)}
            </Text>
            {character.hp.temp > 0 && (
              <Text style={[styles.hpTemp, { color: colors.accentBlue }]}>
                +{character.hp.temp} temp
              </Text>
            )}
          </View>
        </View>

        {/* Conditions */}
        {character.conditions.length > 0 && (
          <View style={styles.conditionsRow}>
            {character.conditions.map((c, i) => (
              <View
                key={`${c.condition}-${i}`}
                style={[styles.conditionChip, { backgroundColor: `${colors.accentAmber}20` }]}
              >
                <Ionicons name="warning-outline" size={10} color={colors.accentAmber} />
                <Text style={[styles.conditionText, { color: colors.accentAmber }]}>
                  {CONDITION_NAMES[c.condition] ?? c.condition}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Concentration */}
        {character.concentration && (
          <View style={[styles.concentrationRow, { backgroundColor: `${colors.accentBlue}10` }]}>
            <Ionicons name="eye-outline" size={14} color={colors.accentBlue} />
            <Text style={[styles.concentrationText, { color: colors.accentBlue }]}>
              Concentrado en: {character.concentration.spellName}
            </Text>
          </View>
        )}
      </View>

      <Animated.ScrollView
        style={{ flex: 1, opacity: fadeAnim }}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ═══ Ability Scores ═══ */}
        <SectionHeader
          title="Características"
          icon="stats-chart"
          expanded={expandedSections.has("abilities")}
          onToggle={() => toggleSection("abilities")}
          colors={colors}
          accentColor={colors.accentBlue}
        />
        {expandedSections.has("abilities") && (
          <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            {/* Ability grid */}
            <View style={styles.abilityGrid}>
              {ABILITY_KEYS.map((key) => {
                const detail = character.abilityScores[key];
                return (
                  <View
                    key={key}
                    style={[
                      styles.abilityBox,
                      { backgroundColor: `${ABILITY_COLORS[key]}08`, borderColor: `${ABILITY_COLORS[key]}25` },
                    ]}
                  >
                    <Text style={[styles.abilityAbbr, { color: ABILITY_COLORS[key] }]}>
                      {ABILITY_ABBR[key]}
                    </Text>
                    <Text style={[styles.abilityTotal, { color: colors.textPrimary }]}>
                      {detail.total}
                    </Text>
                    <Text style={[styles.abilityMod, { color: ABILITY_COLORS[key] }]}>
                      {formatModifier(detail.modifier)}
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Proficiency Bonus */}
            <View style={[styles.profRow, { borderTopColor: colors.borderSeparator }]}>
              <Text style={[styles.profLabel, { color: colors.textMuted }]}>
                Bonificador de competencia
              </Text>
              <Text style={[styles.profValue, { color: colors.accentGold }]}>
                +{profBonus}
              </Text>
            </View>

            {/* Saving Throws */}
            <View style={styles.savingThrowsRow}>
              <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                Tiradas de salvación
              </Text>
              <View style={styles.savingThrowsGrid}>
                {ABILITY_KEYS.map((key) => {
                  const st = character.savingThrows[key];
                  const mod = character.abilityScores[key].modifier;
                  const bonus = mod + (st.proficient ? profBonus : 0);
                  return (
                    <View key={key} style={styles.savingThrowItem}>
                      <View style={[
                        styles.profDot,
                        { backgroundColor: st.proficient ? ABILITY_COLORS[key] : colors.bgSubtle },
                      ]} />
                      <Text style={[styles.stAbbr, { color: colors.textMuted }]}>
                        {ABILITY_ABBR[key]}
                      </Text>
                      <Text style={[styles.stValue, { color: colors.textPrimary }]}>
                        {formatModifier(bonus)}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          </View>
        )}

        {/* ═══ Combat Stats ═══ */}
        <SectionHeader
          title="Combate"
          icon="shield-half-outline"
          expanded={expandedSections.has("combat")}
          onToggle={() => toggleSection("combat")}
          colors={colors}
          accentColor={colors.accentGreen}
        />
        {expandedSections.has("combat") && (
          <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            {/* Combat stats grid */}
            <View style={styles.combatGrid}>
              <CombatStat
                label="Velocidad"
                value={`${character.speed.walk} ft`}
                icon="footsteps-outline"
                color={colors.accentBlue}
                colors={colors}
              />
              <CombatStat
                label="Iniciativa"
                value={formatModifier(character.abilityScores.des.modifier)}
                icon="flash-outline"
                color={colors.accentAmber}
                colors={colors}
              />
              <CombatStat
                label="Dados golpe"
                value={`${character.hitDice.remaining}/${character.hitDice.total} ${character.hitDice.die}`}
                icon="dice-outline"
                color={colors.accentGold}
                colors={colors}
              />
            </View>

            {/* Death Saves */}
            {(character.deathSaves.successes > 0 || character.deathSaves.failures > 0) && (
              <View style={[styles.deathSavesRow, { borderTopColor: colors.borderSeparator }]}>
                <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                  Salvaciones de muerte
                </Text>
                <View style={styles.deathSavesValues}>
                  <View style={styles.deathSaveGroup}>
                    <Text style={[styles.deathSaveLabel, { color: colors.accentGreen }]}>Éxitos</Text>
                    <View style={styles.deathSaveDots}>
                      {[0, 1, 2].map((i) => (
                        <View
                          key={`s${i}`}
                          style={[
                            styles.deathDot,
                            {
                              backgroundColor:
                                i < character.deathSaves.successes
                                  ? colors.accentGreen
                                  : colors.bgSubtle,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                  <View style={styles.deathSaveGroup}>
                    <Text style={[styles.deathSaveLabel, { color: colors.accentDanger }]}>Fallos</Text>
                    <View style={styles.deathSaveDots}>
                      {[0, 1, 2].map((i) => (
                        <View
                          key={`f${i}`}
                          style={[
                            styles.deathDot,
                            {
                              backgroundColor:
                                i < character.deathSaves.failures
                                  ? colors.accentDanger
                                  : colors.bgSubtle,
                            },
                          ]}
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Damage Modifiers */}
            {character.damageModifiers.length > 0 && (
              <View style={[styles.damageModRow, { borderTopColor: colors.borderSeparator }]}>
                <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                  Resistencias / Inmunidades
                </Text>
                <View style={styles.damageModChips}>
                  {character.damageModifiers.map((dm, i) => (
                    <View
                      key={`${dm.type}-${i}`}
                      style={[styles.damageChip, { backgroundColor: `${colors.accentBlue}15` }]}
                    >
                      <Text style={[styles.damageChipText, { color: colors.accentBlue }]}>
                        {getDamageModLabel(dm.modifier)}{" "}
                        {dm.type}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>
        )}

        {/* ═══ Skills ═══ */}
        <SectionHeader
          title="Habilidades"
          icon="list-outline"
          expanded={expandedSections.has("skills")}
          onToggle={() => toggleSection("skills")}
          colors={colors}
          accentColor={colors.accentAmber}
        />
        {expandedSections.has("skills") && (
          <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            <View style={styles.skillsList}>
              {(Object.entries(SKILLS) as [SkillKey, { nombre: string; habilidad: AbilityKey }][]).map(
                ([key, skill]) => {
                  const prof = character.skillProficiencies[key];
                  const abilMod = character.abilityScores[skill.habilidad].modifier;
                  let bonus = abilMod;
                  if (prof?.level === "proficient") bonus += profBonus;
                  if (prof?.level === "expertise") bonus += profBonus * 2;

                  return (
                    <View key={key} style={styles.skillRow}>
                      <View style={[
                        styles.skillProfDot,
                        {
                          backgroundColor: getSkillProfColor(prof?.level, colors.accentGold, colors.accentGreen),
                          borderColor:
                            prof?.level !== "none" && prof?.level
                              ? "transparent"
                              : colors.textMuted,
                        },
                      ]} />
                      <Text
                        style={[
                          styles.skillName,
                          { color: prof?.level !== "none" && prof?.level ? colors.textPrimary : colors.textMuted },
                        ]}
                        numberOfLines={1}
                      >
                        {skill.nombre}
                      </Text>
                      <Text style={[styles.skillAbil, { color: colors.textMuted }]}>
                        {ABILITY_ABBR[skill.habilidad]}
                      </Text>
                      <Text style={[styles.skillBonus, { color: colors.textPrimary }]}>
                        {formatModifier(bonus)}
                      </Text>
                    </View>
                  );
                },
              )}
            </View>
          </View>
        )}

        {/* ═══ Spells ═══ */}
        {(knownSpells.length > 0 || preparedSpells.length > 0) && (
          <>
            <SectionHeader
              title="Hechizos"
              icon="sparkles-outline"
              expanded={expandedSections.has("spells")}
              onToggle={() => toggleSection("spells")}
              colors={colors}
              accentColor={colors.accentDanger}
            />
            {expandedSections.has("spells") && (
              <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                {/* Prepared spells */}
                {preparedSpells.length > 0 && (
                  <View style={styles.spellSection}>
                    <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                      Preparados ({preparedSpells.length})
                    </Text>
                    <View style={styles.spellChipsWrap}>
                      {preparedSpells.map((spell) =>
                        spell ? (
                          <View
                            key={spell.id}
                            style={[
                              styles.spellChip,
                              {
                                backgroundColor: `${SPELL_LEVEL_COLORS[spell.nivel] ?? colors.textMuted}12`,
                                borderColor: `${SPELL_LEVEL_COLORS[spell.nivel] ?? colors.textMuted}30`,
                              },
                            ]}
                          >
                            <Text
                              style={[
                                styles.spellChipLevel,
                                { color: SPELL_LEVEL_COLORS[spell.nivel] ?? colors.textMuted },
                              ]}
                            >
                              {spell.nivel === 0 ? "T" : spell.nivel}
                            </Text>
                            <Text
                              style={[styles.spellChipName, { color: colors.textPrimary }]}
                              numberOfLines={1}
                            >
                              {spell.nombre}
                            </Text>

                          </View>
                        ) : null,
                      )}
                    </View>
                  </View>
                )}

                {/* Known (not prepared) spells */}
                {knownSpells.length > preparedSpells.length && (
                  <View style={[styles.spellSection, { borderTopColor: colors.borderSeparator, borderTopWidth: 1, paddingTop: 12 }]}>
                    <Text style={[styles.subSectionTitle, { color: colors.textSecondary }]}>
                      Conocidos ({knownSpells.length})
                    </Text>
                    <View style={styles.spellChipsWrap}>
                      {knownSpells
                        .filter((s) => s && !character.preparedSpellIds.includes(s.id))
                        .map((spell) =>
                          spell ? (
                            <View
                              key={spell.id}
                              style={[
                                styles.spellChip,
                                {
                                  backgroundColor: `${colors.textMuted}08`,
                                  borderColor: `${colors.textMuted}20`,
                                },
                              ]}
                            >
                              <Text style={[styles.spellChipLevel, { color: colors.textMuted }]}>
                                {spell.nivel === 0 ? "T" : spell.nivel}
                              </Text>
                              <Text
                                style={[styles.spellChipName, { color: colors.textSecondary }]}
                                numberOfLines={1}
                              >
                                {spell.nombre}
                              </Text>
                            </View>
                          ) : null,
                        )}
                    </View>
                  </View>
                )}
              </View>
            )}
          </>
        )}

        {/* ═══ Traits ═══ */}
        {character.traits.length > 0 && (
          <>
            <SectionHeader
              title="Rasgos y capacidades"
              icon="ribbon-outline"
              expanded={expandedSections.has("traits")}
              onToggle={() => toggleSection("traits")}
              colors={colors}
              accentColor={colors.accentGold}
            />
            {expandedSections.has("traits") && (
              <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
                {character.traits.map((trait) => (
                  <View key={trait.id} style={[styles.traitRow, { borderBottomColor: colors.borderSeparator }]}>
                    <View style={styles.traitHeader}>
                      <Text style={[styles.traitName, { color: colors.textPrimary }]}>
                        {trait.nombre}
                      </Text>
                      <Text style={[styles.traitSource, { color: colors.textMuted }]}>
                        {trait.origen}
                      </Text>
                    </View>
                    <Text style={[styles.traitDesc, { color: colors.textSecondary }]} numberOfLines={3}>
                      {trait.descripcion}
                    </Text>
                    {trait.maxUses !== null && (
                      <View style={styles.traitUsesRow}>
                        <Text style={[styles.traitUses, { color: colors.accentGold }]}>
                          Usos: {trait.currentUses ?? 0}/{trait.maxUses}
                        </Text>
                        {trait.recharge && (
                          <Text style={[styles.traitRecharge, { color: colors.textMuted }]}>
                            ({getRechargeLabel(trait.recharge)})
                          </Text>
                        )}
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </>
        )}

        {/* ═══ Proficiencies ═══ */}
        <SectionHeader
          title="Competencias"
          icon="construct-outline"
          expanded={expandedSections.has("proficiencies")}
          onToggle={() => toggleSection("proficiencies")}
          colors={colors}
          accentColor={colors.accentBlue}
        />
        {expandedSections.has("proficiencies") && (
          <View style={[styles.sectionCard, { backgroundColor: colors.bgCard, borderColor: colors.borderSubtle }]}>
            {character.proficiencies.armors.length > 0 && (
              <ProficiencyGroup
                label="Armaduras"
                items={character.proficiencies.armors}
                colors={colors}
              />
            )}
            {character.proficiencies.weapons.length > 0 && (
              <ProficiencyGroup
                label="Armas"
                items={character.proficiencies.weapons}
                colors={colors}
              />
            )}
            {character.proficiencies.tools.length > 0 && (
              <ProficiencyGroup
                label="Herramientas"
                items={character.proficiencies.tools}
                colors={colors}
              />
            )}
            {character.proficiencies.languages.length > 0 && (
              <ProficiencyGroup
                label="Idiomas"
                items={character.proficiencies.languages}
                colors={colors}
              />
            )}
          </View>
        )}

        {/* Bottom padding */}
        <View style={{ height: 40 }} />
      </Animated.ScrollView>

      {/* Read-only badge */}
      <View style={[styles.readOnlyBadge, { backgroundColor: colors.bgElevated, borderColor: colors.borderSubtle }]}>
        <Ionicons name="eye-outline" size={12} color={colors.textMuted} />
        <Text style={[styles.readOnlyText, { color: colors.textMuted }]}>Solo lectura</Text>
      </View>
    </View>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function SectionHeader({
  title,
  icon,
  expanded,
  onToggle,
  colors,
  accentColor,
}: Readonly<{
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  expanded: boolean;
  onToggle: () => void;
  colors: ThemeColors;
  accentColor: string;
}>) {
  return (
    <TouchableOpacity
      style={styles.sectionHeader}
      onPress={onToggle}
      activeOpacity={0.7}
    >
      <View style={[styles.sectionIconBg, { backgroundColor: `${accentColor}15` }]}>
        <Ionicons name={icon} size={16} color={accentColor} />
      </View>
      <Text style={[styles.sectionTitle, { color: colors.textPrimary }]}>{title}</Text>
      <Ionicons
        name={expanded ? "chevron-up" : "chevron-down"}
        size={16}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );
}

function CombatStat({
  label,
  value,
  icon,
  color,
  colors,
}: Readonly<{
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  colors: ThemeColors;
}>) {
  return (
    <View style={[styles.combatStatBox, { backgroundColor: `${color}08`, borderColor: `${color}25` }]}>
      <Ionicons name={icon} size={16} color={color} />
      <Text style={[styles.combatStatValue, { color: colors.textPrimary }]}>{value}</Text>
      <Text style={[styles.combatStatLabel, { color: colors.textMuted }]}>{label}</Text>
    </View>
  );
}

function ProficiencyGroup({
  label,
  items,
  colors,
}: Readonly<{
  label: string;
  items: string[];
  colors: ThemeColors;
}>) {
  return (
    <View style={styles.profGroup}>
      <Text style={[styles.profGroupLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.profGroupItems, { color: colors.textPrimary }]}>
        {items.join(", ")}
      </Text>
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 24,
  },
  loadingText: { fontSize: 14, marginTop: 8 },
  errorText: { fontSize: 16, fontWeight: "600", textAlign: "center" },
  errorLink: { fontSize: 14, fontWeight: "600", marginTop: 8 },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 1,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 18, fontWeight: "800", letterSpacing: -0.3 },
  headerSubtitle: { fontSize: 11, marginTop: 2 },

  realtimeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  realtimeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  realtimeLabel: { fontSize: 10, fontWeight: "600" },

  // Summary Banner
  summaryBanner: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  summaryInfo: { flex: 1, marginRight: 12 },
  summaryName: { fontSize: 14, fontWeight: "700" },
  summaryClass: { fontSize: 15, fontWeight: "800", marginTop: 2 },
  summaryBg: { fontSize: 12, marginTop: 2 },

  summaryHp: { alignItems: "flex-end", minWidth: 90 },
  hpBigValue: { fontSize: 24, fontWeight: "900" },
  hpBigMax: { fontSize: 14, fontWeight: "500" },
  hpBarBg: { width: 90, height: 6, borderRadius: 3, marginTop: 4 },
  hpBarFill: { height: 6, borderRadius: 3 },
  hpStatusLabel: { fontSize: 10, fontWeight: "700", marginTop: 2, textTransform: "uppercase" },
  hpTemp: { fontSize: 10, fontWeight: "600", marginTop: 1 },

  conditionsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 10,
  },
  conditionChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  conditionText: { fontSize: 11, fontWeight: "600" },

  concentrationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  concentrationText: { fontSize: 12, fontWeight: "600" },

  // ScrollView
  scrollContent: { paddingHorizontal: 16, paddingTop: 8 },

  // Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    gap: 10,
  },
  sectionIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: { flex: 1, fontSize: 15, fontWeight: "800", letterSpacing: -0.2 },

  // Section card
  sectionCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    marginBottom: 4,
  },

  // Abilities
  abilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  abilityBox: {
    width: "30%",
    flexGrow: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  abilityAbbr: { fontSize: 11, fontWeight: "800", letterSpacing: 1 },
  abilityTotal: { fontSize: 22, fontWeight: "900", marginVertical: 2 },
  abilityMod: { fontSize: 14, fontWeight: "700" },

  profRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
  },
  profLabel: { fontSize: 13, fontWeight: "500" },
  profValue: { fontSize: 16, fontWeight: "800" },

  savingThrowsRow: { marginTop: 12 },
  subSectionTitle: { fontSize: 12, fontWeight: "700", marginBottom: 8, textTransform: "uppercase", letterSpacing: 0.5 },
  savingThrowsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  savingThrowItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    minWidth: "28%",
  },
  profDot: { width: 8, height: 8, borderRadius: 4 },
  stAbbr: { fontSize: 11, fontWeight: "600" },
  stValue: { fontSize: 13, fontWeight: "700" },

  // Combat
  combatGrid: {
    flexDirection: "row",
    gap: 8,
  },
  combatStatBox: {
    flex: 1,
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
    gap: 4,
  },
  combatStatValue: { fontSize: 16, fontWeight: "800" },
  combatStatLabel: { fontSize: 10, fontWeight: "600", textTransform: "uppercase" },

  deathSavesRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  deathSavesValues: { flexDirection: "row", gap: 24 },
  deathSaveGroup: { gap: 6 },
  deathSaveLabel: { fontSize: 11, fontWeight: "700" },
  deathSaveDots: { flexDirection: "row", gap: 6 },
  deathDot: { width: 10, height: 10, borderRadius: 5 },

  damageModRow: { marginTop: 12, paddingTop: 12, borderTopWidth: 1 },
  damageModChips: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  damageChip: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  damageChipText: { fontSize: 11, fontWeight: "600" },

  // Skills
  skillsList: { gap: 1 },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    gap: 8,
  },
  skillProfDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
  },
  skillName: { flex: 1, fontSize: 13, fontWeight: "500" },
  skillAbil: { fontSize: 10, fontWeight: "600", width: 28, textAlign: "center" },
  skillBonus: { fontSize: 14, fontWeight: "700", width: 30, textAlign: "right" },

  // Spells
  spellSection: { marginBottom: 4 },
  spellChipsWrap: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  spellChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    gap: 5,
  },
  spellChipLevel: { fontSize: 10, fontWeight: "800" },
  spellChipName: { fontSize: 12, fontWeight: "500", maxWidth: 140 },

  // Traits
  traitRow: { paddingVertical: 10, borderBottomWidth: 1 },
  traitHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  traitName: { fontSize: 14, fontWeight: "700", flex: 1 },
  traitSource: { fontSize: 10, fontWeight: "600", textTransform: "uppercase", letterSpacing: 0.5 },
  traitDesc: { fontSize: 12, lineHeight: 18, marginTop: 4 },
  traitUsesRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 6 },
  traitUses: { fontSize: 12, fontWeight: "700" },
  traitRecharge: { fontSize: 11 },

  // Proficiencies
  profGroup: { marginBottom: 10 },
  profGroupLabel: { fontSize: 11, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 },
  profGroupItems: { fontSize: 13, lineHeight: 20 },

  // Read-only badge
  readOnlyBadge: {
    position: "absolute",
    bottom: 24,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  readOnlyText: { fontSize: 11, fontWeight: "700" },
});
