/**
 * OverviewTab - Pestaña de resumen del personaje
 * Muestra: información básica, experiencia/nivel, puntuaciones de característica,
 * habilidades, tiradas de salvación, competencias y rasgos.
 */

import { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import {
  ABILITY_NAMES,
  ABILITY_ABBR,
  SKILLS,
  ALIGNMENT_NAMES,
  formatModifier,
  type AbilityKey,
  type SkillKey,
} from "@/types/character";
import { getRaceData, getSubraceData } from "@/data/srd/races";
import { getClassData } from "@/data/srd/classes";
import { getBackgroundData } from "@/data/srd/backgrounds";
import ExperienceSection from "./ExperienceSection";
import LevelUpModal from "./LevelUpModal";
import { useTheme } from "@/hooks/useTheme";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ABILITY_COLORS: Record<AbilityKey, string> = {
  fue: "#dc2626",
  des: "#16a34a",
  con: "#ea580c",
  int: "#2563eb",
  sab: "#9333ea",
  car: "#db2777",
};

const ABILITY_ORDER: AbilityKey[] = ["fue", "des", "con", "int", "sab", "car"];

export default function OverviewTab() {
  const { isDark, colors } = useTheme();
  const { character, saveCharacter, resetToLevel1 } = useCharacterStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "abilities",
  );
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);

  const handleLevelUp = useCallback(() => {
    setShowLevelUpModal(true);
  }, []);

  const handleLevelUpComplete = useCallback(async () => {
    setShowLevelUpModal(false);
    await saveCharacter();
  }, [saveCharacter]);

  const handleResetToLevel1 = useCallback(() => {
    Alert.alert(
      "Resetear a Nivel 1",
      "¿Estás seguro? Se perderán todas las subidas de nivel, mejoras de característica, subclase y hechizos aprendidos. Esta acción no se puede deshacer.",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Resetear",
          style: "destructive",
          onPress: async () => {
            await resetToLevel1();
            await saveCharacter();
          },
        },
      ],
    );
  }, [resetToLevel1, saveCharacter]);

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-500 dark:text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  const raceData = getRaceData(character.raza);
  const classData = getClassData(character.clase);
  const backgroundData = getBackgroundData(character.trasfondo);

  const toggleSection = (section: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSection(expandedSection === section ? null : section);
  };

  // ── Render helpers ──

  const renderBasicInfo = () => (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="h-14 w-14 rounded-xl bg-primary-500/20 items-center justify-center mr-4">
          <Ionicons
            name="shield-half-sharp"
            size={28}
            color={colors.accentRed}
          />
        </View>
        <View className="flex-1">
          <Text className="text-dark-900 dark:text-white text-xl font-bold">
            {character.nombre}
          </Text>
          <Text className="text-dark-500 dark:text-dark-300 text-sm">
            {raceData.nombre}
            {character.subraza
              ? ` (${getSubraceData(character.raza, character.subraza)?.nombre ?? ""})`
              : ""}{" "}
            · {classData.nombre} Nv. {character.nivel}
          </Text>
        </View>
      </View>

      <View className="flex-row flex-wrap">
        <InfoBadge
          icon="book-outline"
          label={backgroundData.nombre}
          color={colors.accentGold}
        />
        <InfoBadge
          icon="compass-outline"
          label={ALIGNMENT_NAMES[character.alineamiento]}
          color={colors.accentPurple}
        />
        <InfoBadge
          icon="star-outline"
          label={`XP: ${character.experiencia}`}
          color={colors.accentGreen}
        />
        <InfoBadge
          icon="ribbon-outline"
          label={`Competencia: +${character.proficiencyBonus}`}
          color={colors.accentBlue}
        />
      </View>
    </View>
  );

  const renderAbilityScores = () => (
    <CollapsibleSection
      title="Puntuaciones de Característica"
      icon="stats-chart"
      isExpanded={expandedSection === "abilities"}
      onToggle={() => toggleSection("abilities")}
    >
      <View className="flex-row flex-wrap justify-between">
        {ABILITY_ORDER.map((key) => {
          const score = character.abilityScores[key];
          const color = ABILITY_COLORS[key];
          return (
            <View
              key={key}
              className="w-[31%] bg-gray-200 dark:bg-dark-700 rounded-xl p-3 mb-3 items-center border border-dark-100 dark:border-surface-border"
            >
              <Text
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color }}
              >
                {ABILITY_ABBR[key]}
              </Text>
              <Text className="text-dark-900 dark:text-white text-3xl font-bold">
                {score.total}
              </Text>
              <View
                className="rounded-full px-3 py-1 mt-1"
                style={{ backgroundColor: `${color}22` }}
              >
                <Text className="text-sm font-bold" style={{ color }}>
                  {formatModifier(score.modifier)}
                </Text>
              </View>
              {score.racial > 0 && (
                <Text className="text-dark-400 text-[10px] mt-1">
                  Base {score.base} + Racial {score.racial}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </CollapsibleSection>
  );

  const renderSavingThrows = () => {
    const { getSavingThrowBonus } = useCharacterStore.getState();
    return (
      <CollapsibleSection
        title="Tiradas de Salvación"
        icon="shield-checkmark"
        isExpanded={expandedSection === "saves"}
        onToggle={() => toggleSection("saves")}
      >
        <View className="flex-row flex-wrap">
          {ABILITY_ORDER.map((key) => {
            const save = character.savingThrows[key];
            const bonus = getSavingThrowBonus(key);
            const color = ABILITY_COLORS[key];
            return (
              <View key={key} className="w-1/2 pr-2 mb-2">
                <View
                  className="flex-row items-center rounded-lg p-2.5 border"
                  style={{
                    backgroundColor: save.proficient
                      ? `${color}11`
                      : colors.bgPrimary,
                    borderColor: save.proficient
                      ? `${color}44`
                      : colors.borderDefault,
                  }}
                >
                  <View
                    className="h-6 w-6 rounded-full items-center justify-center mr-2"
                    style={{
                      backgroundColor: save.proficient
                        ? `${color}33`
                        : colors.bgElevated,
                    }}
                  >
                    {save.proficient ? (
                      <Ionicons name="checkmark" size={14} color={color} />
                    ) : (
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: colors.textMuted }}
                      />
                    )}
                  </View>
                  <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold flex-1">
                    {ABILITY_ABBR[key]}
                  </Text>
                  <Text
                    className="text-sm font-bold"
                    style={{
                      color: save.proficient ? color : colors.textSecondary,
                    }}
                  >
                    {formatModifier(bonus)}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </CollapsibleSection>
    );
  };

  const renderSkills = () => {
    const { getSkillBonus } = useCharacterStore.getState();
    const sortedSkills = (Object.keys(SKILLS) as SkillKey[]).sort((a, b) =>
      SKILLS[a].nombre.localeCompare(SKILLS[b].nombre, "es"),
    );

    return (
      <CollapsibleSection
        title="Habilidades"
        icon="list"
        isExpanded={expandedSection === "skills"}
        onToggle={() => toggleSection("skills")}
      >
        {sortedSkills.map((key) => {
          const skill = SKILLS[key];
          const proficiency = character.skillProficiencies[key];
          const bonus = getSkillBonus(key);
          const isProficient = proficiency.level === "proficient";
          const isExpertise = proficiency.level === "expertise";
          const abilityColor = ABILITY_COLORS[skill.habilidad];

          return (
            <View
              key={key}
              className="flex-row items-center py-2 border-b border-dark-100 dark:border-surface-border/50"
            >
              {/* Proficiency indicator */}
              <View className="h-5 w-5 rounded-full items-center justify-center mr-2">
                {isExpertise ? (
                  <View
                    className="h-5 w-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${abilityColor}33` }}
                  >
                    <Ionicons name="star" size={12} color={abilityColor} />
                  </View>
                ) : isProficient ? (
                  <View
                    className="h-4 w-4 rounded-full"
                    style={{ backgroundColor: abilityColor }}
                  />
                ) : (
                  <View className="h-4 w-4 rounded-full border-2 border-dark-400" />
                )}
              </View>

              {/* Skill name */}
              <View className="flex-1">
                <Text
                  className="text-sm"
                  style={{
                    color:
                      isProficient || isExpertise
                        ? colors.textPrimary
                        : colors.textSecondary,
                    fontWeight: isProficient || isExpertise ? "600" : "400",
                  }}
                >
                  {skill.nombre}
                </Text>
                <Text className="text-dark-300 dark:text-dark-500 text-[10px]">
                  {ABILITY_ABBR[skill.habilidad]}
                </Text>
              </View>

              {/* Bonus */}
              <Text
                className="text-sm font-bold min-w-[36px] text-right"
                style={{
                  color:
                    isProficient || isExpertise
                      ? abilityColor
                      : colors.textMuted,
                }}
              >
                {formatModifier(bonus)}
              </Text>
            </View>
          );
        })}
      </CollapsibleSection>
    );
  };

  const renderProficiencies = () => (
    <CollapsibleSection
      title="Competencias"
      icon="construct"
      isExpanded={expandedSection === "proficiencies"}
      onToggle={() => toggleSection("proficiencies")}
    >
      {character.proficiencies.armors.length > 0 && (
        <ProficiencyGroup
          title="Armaduras"
          icon="shield-outline"
          items={character.proficiencies.armors}
        />
      )}
      {character.proficiencies.weapons.length > 0 && (
        <ProficiencyGroup
          title="Armas"
          icon="flash-outline"
          items={character.proficiencies.weapons}
        />
      )}
      {character.proficiencies.tools.length > 0 && (
        <ProficiencyGroup
          title="Herramientas"
          icon="hammer-outline"
          items={character.proficiencies.tools}
        />
      )}
      {character.proficiencies.languages.length > 0 && (
        <ProficiencyGroup
          title="Idiomas"
          icon="chatbubbles-outline"
          items={character.proficiencies.languages}
        />
      )}
    </CollapsibleSection>
  );

  const renderTraits = () => (
    <CollapsibleSection
      title="Rasgos y Capacidades"
      icon="sparkles"
      isExpanded={expandedSection === "traits"}
      onToggle={() => toggleSection("traits")}
    >
      {character.traits.length === 0 ? (
        <Text className="text-dark-400 text-sm italic">
          Sin rasgos especiales
        </Text>
      ) : (
        character.traits.map((trait) => (
          <TraitCard key={trait.id} trait={trait} />
        ))
      )}
    </CollapsibleSection>
  );

  const renderPersonality = () => (
    <CollapsibleSection
      title="Personalidad"
      icon="heart"
      isExpanded={expandedSection === "personality"}
      onToggle={() => toggleSection("personality")}
    >
      {character.personality.traits.length > 0 && (
        <View className="mb-3">
          <Text className="text-gold-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Rasgos de Personalidad
          </Text>
          {character.personality.traits.map((trait, idx) => (
            <Text
              key={idx}
              className="text-dark-600 dark:text-dark-200 text-sm leading-5 mb-1"
            >
              • {trait}
            </Text>
          ))}
        </View>
      )}
      {character.personality.ideals ? (
        <View className="mb-3">
          <Text className="text-gold-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Ideales
          </Text>
          <Text className="text-dark-600 dark:text-dark-200 text-sm leading-5">
            {character.personality.ideals}
          </Text>
        </View>
      ) : null}
      {character.personality.bonds ? (
        <View className="mb-3">
          <Text className="text-gold-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Vínculos
          </Text>
          <Text className="text-dark-600 dark:text-dark-200 text-sm leading-5">
            {character.personality.bonds}
          </Text>
        </View>
      ) : null}
      {character.personality.flaws ? (
        <View className="mb-3">
          <Text className="text-gold-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Defectos
          </Text>
          <Text className="text-dark-600 dark:text-dark-200 text-sm leading-5">
            {character.personality.flaws}
          </Text>
        </View>
      ) : null}
      {character.personality.backstory ? (
        <View>
          <Text className="text-gold-700 dark:text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Trasfondo
          </Text>
          <Text className="text-dark-600 dark:text-dark-200 text-sm leading-5">
            {character.personality.backstory}
          </Text>
        </View>
      ) : null}
      {!character.personality.traits.length &&
        !character.personality.ideals &&
        !character.personality.bonds &&
        !character.personality.flaws && (
          <Text className="text-dark-400 text-sm italic">
            Sin datos de personalidad
          </Text>
        )}
    </CollapsibleSection>
  );

  const renderSpeed = () => (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
      <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3">
        Movimiento
      </Text>
      <View className="flex-row flex-wrap">
        <SpeedBadge
          icon="walk-outline"
          label="Caminar"
          value={`${character.speed.walk} pies`}
        />
        {character.speed.swim ? (
          <SpeedBadge
            icon="water-outline"
            label="Nadar"
            value={`${character.speed.swim} pies`}
          />
        ) : null}
        {character.speed.climb ? (
          <SpeedBadge
            icon="trending-up-outline"
            label="Trepar"
            value={`${character.speed.climb} pies`}
          />
        ) : null}
        {character.speed.fly ? (
          <SpeedBadge
            icon="airplane-outline"
            label="Volar"
            value={`${character.speed.fly} pies`}
          />
        ) : null}
      </View>
    </View>
  );

  return (
    <>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {renderBasicInfo()}
        <ExperienceSection onLevelUp={handleLevelUp} />
        {renderSpeed()}
        {renderAbilityScores()}
        {renderSavingThrows()}
        {renderSkills()}
        {renderProficiencies()}
        {renderTraits()}
        {renderPersonality()}

        {/* Reset to Level 1 button */}
        {character.nivel > 1 && (
          <TouchableOpacity
            onPress={handleResetToLevel1}
            activeOpacity={0.7}
            style={{
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderRadius: 12,
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              borderWidth: 1,
              borderColor: "rgba(239, 68, 68, 0.25)",
              gap: 8,
            }}
          >
            <Ionicons
              name="refresh-outline"
              size={18}
              color={colors.accentDanger}
            />
            <Text
              style={{
                color: colors.accentDanger,
                fontSize: 14,
                fontWeight: "600",
              }}
            >
              Resetear personaje a nivel 1
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <LevelUpModal
        visible={showLevelUpModal}
        onClose={() => setShowLevelUpModal(false)}
        onComplete={handleLevelUpComplete}
      />
    </>
  );
}

// ─── Sub-components ──────────────────────────────────────────────────

function CollapsibleSection({
  title,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const { colors: csColors } = useTheme();
  return (
    <View className="bg-white dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4 active:bg-gray-50 dark:active:bg-surface-light"
        onPress={onToggle}
      >
        <Ionicons name={icon} size={20} color={csColors.accentGold} />
        <Text className="text-dark-900 dark:text-white text-base font-semibold flex-1 ml-3">
          {title}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={csColors.textMuted}
        />
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 border-t border-dark-100 dark:border-surface-border/50 pt-3">
          {children}
        </View>
      )}
    </View>
  );
}

function InfoBadge({
  icon,
  label,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
}) {
  return (
    <View
      className="flex-row items-center rounded-full px-3 py-1.5 mr-2 mb-2"
      style={{ backgroundColor: `${color}15` }}
    >
      <Ionicons name={icon} size={12} color={color} />
      <Text className="text-xs ml-1.5 font-medium" style={{ color }}>
        {label}
      </Text>
    </View>
  );
}

function SpeedBadge({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  const { colors: sbColors } = useTheme();
  return (
    <View className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 mr-2 mb-2 border border-dark-100 dark:border-surface-border">
      <Ionicons name={icon} size={16} color={sbColors.accentGreen} />
      <View className="ml-2">
        <Text className="text-dark-400 text-[10px] uppercase">{label}</Text>
        <Text className="text-dark-900 dark:text-white text-sm font-bold">
          {value}
        </Text>
      </View>
    </View>
  );
}

function ProficiencyGroup({
  icon,
  title,
  items,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  items: string[];
}) {
  const { colors: pgColors } = useTheme();
  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={14} color={pgColors.textMuted} />
        <Text className="text-dark-500 dark:text-dark-300 text-xs font-semibold uppercase tracking-wider ml-1.5">
          {title}
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {items.map((item, idx) => (
          <View
            key={idx}
            className="bg-gray-200 dark:bg-dark-700 rounded-lg px-2.5 py-1.5 mr-1.5 mb-1.5 border border-dark-100 dark:border-surface-border"
          >
            <Text className="text-dark-600 dark:text-dark-200 text-xs">
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TraitCard({ trait }: { trait: any }) {
  const { colors: tcColors } = useTheme();
  const [expanded, setExpanded] = useState(false);

  const originColors: Record<string, string> = {
    raza: tcColors.accentGreen,
    clase: tcColors.accentRed,
    subclase: tcColors.accentAmber,
    trasfondo: tcColors.accentBlue,
    dote: tcColors.accentPurple,
    manual: tcColors.textMuted,
  };

  const originNames: Record<string, string> = {
    raza: "Raza",
    clase: "Clase",
    subclase: "Subclase",
    trasfondo: "Trasfondo",
    dote: "Dote",
    manual: "Manual",
  };

  const color = originColors[trait.origen] ?? tcColors.textMuted;

  return (
    <TouchableOpacity
      className="bg-gray-200 dark:bg-dark-700 rounded-lg p-3 mb-2 border border-dark-100 dark:border-surface-border"
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-dark-900 dark:text-white text-sm font-semibold flex-1">
              {trait.nombre}
            </Text>
            <View
              className="rounded-full px-2 py-0.5 ml-2"
              style={{ backgroundColor: `${color}22` }}
            >
              <Text className="text-[10px] font-semibold" style={{ color }}>
                {originNames[trait.origen] ?? trait.origen}
              </Text>
            </View>
          </View>

          {trait.maxUses !== null && (
            <View className="flex-row items-center mt-1">
              <Text className="text-dark-400 text-[10px]">
                Usos: {trait.currentUses}/{trait.maxUses}
                {trait.recharge === "short_rest"
                  ? " (desc. corto)"
                  : trait.recharge === "long_rest"
                    ? " (desc. largo)"
                    : trait.recharge === "dawn"
                      ? " (al amanecer)"
                      : ""}
              </Text>
            </View>
          )}
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={tcColors.textMuted}
          style={{ marginLeft: 8 }}
        />
      </View>

      {expanded && (
        <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5 mt-2 pt-2 border-t border-dark-100 dark:border-surface-border/50">
          {trait.descripcion}
        </Text>
      )}
    </TouchableOpacity>
  );
}
