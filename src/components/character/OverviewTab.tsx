/**
 * OverviewTab - Pestaña de resumen del personaje
 * Muestra: información básica, puntuaciones de característica, habilidades,
 * tiradas de salvación, competencias y rasgos.
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
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
  const { character } = useCharacterStore();
  const [expandedSection, setExpandedSection] = useState<string | null>(
    "abilities"
  );

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-300 text-base">
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
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <View className="flex-row items-center mb-3">
        <View className="h-14 w-14 rounded-xl bg-primary-500/20 items-center justify-center mr-4">
          <Ionicons name="shield-half-sharp" size={28} color="#c62828" />
        </View>
        <View className="flex-1">
          <Text className="text-white text-xl font-bold">
            {character.nombre}
          </Text>
          <Text className="text-dark-300 text-sm">
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
          color="#fbbf24"
        />
        <InfoBadge
          icon="compass-outline"
          label={ALIGNMENT_NAMES[character.alineamiento]}
          color="#8b5cf6"
        />
        <InfoBadge
          icon="star-outline"
          label={`XP: ${character.experiencia}`}
          color="#22c55e"
        />
        <InfoBadge
          icon="ribbon-outline"
          label={`Competencia: +${character.proficiencyBonus}`}
          color="#3b82f6"
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
              className="w-[31%] bg-dark-700 rounded-xl p-3 mb-3 items-center border border-surface-border"
            >
              <Text
                className="text-xs font-bold uppercase tracking-wider mb-1"
                style={{ color }}
              >
                {ABILITY_ABBR[key]}
              </Text>
              <Text className="text-white text-3xl font-bold">
                {score.total}
              </Text>
              <View
                className="rounded-full px-3 py-1 mt-1"
                style={{ backgroundColor: `${color}22` }}
              >
                <Text
                  className="text-sm font-bold"
                  style={{ color }}
                >
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
              <View
                key={key}
                className="w-1/2 pr-2 mb-2"
              >
                <View
                  className="flex-row items-center rounded-lg p-2.5 border"
                  style={{
                    backgroundColor: save.proficient
                      ? `${color}11`
                      : "#1a1a2e",
                    borderColor: save.proficient ? `${color}44` : "#3a3a5c",
                  }}
                >
                  <View
                    className="h-6 w-6 rounded-full items-center justify-center mr-2"
                    style={{
                      backgroundColor: save.proficient
                        ? `${color}33`
                        : "#252540",
                    }}
                  >
                    {save.proficient ? (
                      <Ionicons name="checkmark" size={14} color={color} />
                    ) : (
                      <View
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: "#666699" }}
                      />
                    )}
                  </View>
                  <Text className="text-dark-200 text-xs font-semibold flex-1">
                    {ABILITY_ABBR[key]}
                  </Text>
                  <Text
                    className="text-sm font-bold"
                    style={{ color: save.proficient ? color : "#8c8cb3" }}
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
      SKILLS[a].nombre.localeCompare(SKILLS[b].nombre, "es")
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
              className="flex-row items-center py-2 border-b border-surface-border/50"
            >
              {/* Proficiency indicator */}
              <View className="h-5 w-5 rounded-full items-center justify-center mr-2">
                {isExpertise ? (
                  <View
                    className="h-5 w-5 rounded-full items-center justify-center"
                    style={{ backgroundColor: `${abilityColor}33` }}
                  >
                    <Ionicons
                      name="star"
                      size={12}
                      color={abilityColor}
                    />
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
                      isProficient || isExpertise ? "#ffffff" : "#8c8cb3",
                    fontWeight: isProficient || isExpertise ? "600" : "400",
                  }}
                >
                  {skill.nombre}
                </Text>
                <Text className="text-dark-500 text-[10px]">
                  {ABILITY_ABBR[skill.habilidad]}
                </Text>
              </View>

              {/* Bonus */}
              <Text
                className="text-sm font-bold min-w-[36px] text-right"
                style={{
                  color:
                    isProficient || isExpertise ? abilityColor : "#666699",
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
          <Text className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Rasgos de Personalidad
          </Text>
          {character.personality.traits.map((trait, idx) => (
            <Text key={idx} className="text-dark-200 text-sm leading-5 mb-1">
              • {trait}
            </Text>
          ))}
        </View>
      )}
      {character.personality.ideals ? (
        <View className="mb-3">
          <Text className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Ideales
          </Text>
          <Text className="text-dark-200 text-sm leading-5">
            {character.personality.ideals}
          </Text>
        </View>
      ) : null}
      {character.personality.bonds ? (
        <View className="mb-3">
          <Text className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Vínculos
          </Text>
          <Text className="text-dark-200 text-sm leading-5">
            {character.personality.bonds}
          </Text>
        </View>
      ) : null}
      {character.personality.flaws ? (
        <View className="mb-3">
          <Text className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Defectos
          </Text>
          <Text className="text-dark-200 text-sm leading-5">
            {character.personality.flaws}
          </Text>
        </View>
      ) : null}
      {character.personality.backstory ? (
        <View>
          <Text className="text-gold-400 text-xs font-semibold uppercase tracking-wider mb-1">
            Trasfondo
          </Text>
          <Text className="text-dark-200 text-sm leading-5">
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
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3">
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
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      {renderBasicInfo()}
      {renderSpeed()}
      {renderAbilityScores()}
      {renderSavingThrows()}
      {renderSkills()}
      {renderProficiencies()}
      {renderTraits()}
      {renderPersonality()}
    </ScrollView>
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
  return (
    <View className="bg-surface-card rounded-card border border-surface-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4 active:bg-surface-light"
        onPress={onToggle}
      >
        <Ionicons name={icon} size={20} color="#fbbf24" />
        <Text className="text-white text-base font-semibold flex-1 ml-3">
          {title}
        </Text>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666699"
        />
      </TouchableOpacity>
      {isExpanded && (
        <View className="px-4 pb-4 border-t border-surface-border/50 pt-3">
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
  return (
    <View className="flex-row items-center bg-dark-700 rounded-lg px-3 py-2 mr-2 mb-2 border border-surface-border">
      <Ionicons name={icon} size={16} color="#22c55e" />
      <View className="ml-2">
        <Text className="text-dark-400 text-[10px] uppercase">{label}</Text>
        <Text className="text-white text-sm font-bold">{value}</Text>
      </View>
    </View>
  );
}

function ProficiencyGroup({
  title,
  icon,
  items,
}: {
  title: string;
  icon: keyof typeof Ionicons.glyphMap;
  items: string[];
}) {
  return (
    <View className="mb-3">
      <View className="flex-row items-center mb-2">
        <Ionicons name={icon} size={14} color="#666699" />
        <Text className="text-dark-300 text-xs font-semibold uppercase tracking-wider ml-1.5">
          {title}
        </Text>
      </View>
      <View className="flex-row flex-wrap">
        {items.map((item, idx) => (
          <View
            key={idx}
            className="bg-dark-700 rounded-lg px-2.5 py-1.5 mr-1.5 mb-1.5 border border-surface-border"
          >
            <Text className="text-dark-200 text-xs">{item}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function TraitCard({ trait }: { trait: any }) {
  const [expanded, setExpanded] = useState(false);

  const originColors: Record<string, string> = {
    raza: "#22c55e",
    clase: "#c62828",
    subclase: "#f59e0b",
    trasfondo: "#3b82f6",
    dote: "#a855f7",
    manual: "#6b7280",
  };

  const originNames: Record<string, string> = {
    raza: "Raza",
    clase: "Clase",
    subclase: "Subclase",
    trasfondo: "Trasfondo",
    dote: "Dote",
    manual: "Manual",
  };

  const color = originColors[trait.origen] ?? "#6b7280";

  return (
    <TouchableOpacity
      className="bg-dark-700 rounded-lg p-3 mb-2 border border-surface-border"
      onPress={() => setExpanded(!expanded)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="flex-1">
          <View className="flex-row items-center">
            <Text className="text-white text-sm font-semibold flex-1">
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
          color="#666699"
          style={{ marginLeft: 8 }}
        />
      </View>

      {expanded && (
        <Text className="text-dark-300 text-xs leading-5 mt-2 pt-2 border-t border-surface-border/50">
          {trait.descripcion}
        </Text>
      )}
    </TouchableOpacity>
  );
}
