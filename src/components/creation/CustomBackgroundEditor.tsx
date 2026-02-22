/**
 * CustomBackgroundEditor — Form to configure a custom background during character creation.
 * Allows setting skill proficiencies, tool proficiencies, languages, equipment, gold, and a feature.
 */

import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import type { SkillKey } from "@/types/character";
import { SKILLS } from "@/types/character";
import type { CustomBackgroundConfig } from "@/types/creation";

// ─── Constants ───────────────────────────────────────────────────────

const SKILL_OPTIONS: { value: SkillKey; label: string }[] = (
  Object.entries(SKILLS) as [SkillKey, { nombre: string }][]
).map(([key, def]) => ({ value: key, label: def.nombre }));

const DEFAULT_CONFIG: CustomBackgroundConfig = {
  nombre: "",
  descripcion: "",
  skillProficiencies: [],
  toolProficiencies: [],
  extraLanguages: 0,
  equipment: [],
  startingGold: 10,
  featureName: "",
  featureDescription: "",
};

// ─── Component ───────────────────────────────────────────────────────

interface CustomBackgroundEditorProps {
  initialData?: CustomBackgroundConfig;
  onChange: (data: CustomBackgroundConfig) => void;
}

export default function CustomBackgroundEditor({
  initialData,
  onChange,
}: CustomBackgroundEditorProps) {
  const { colors } = useTheme();
  const [data, setData] = useState<CustomBackgroundConfig>(
    initialData ?? { ...DEFAULT_CONFIG },
  );

  // Sections collapsed state
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    basic: true,
    skills: true,
    proficiencies: false,
    equipment: false,
    feature: false,
  });

  const update = (partial: Partial<CustomBackgroundConfig>) => {
    const next = { ...data, ...partial };
    setData(next);
    onChange(next);
  };

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ── Skill proficiencies (toggle, max 2) ──

  const toggleSkill = (skill: SkillKey) => {
    const current = data.skillProficiencies;
    if (current.includes(skill)) {
      update({
        skillProficiencies: current.filter((s) => s !== skill),
      });
    } else if (current.length < 2) {
      update({ skillProficiencies: [...current, skill] });
    }
  };

  // ── Tool proficiencies (free text list) ──

  const [newToolProf, setNewToolProf] = useState("");

  const addToolProf = () => {
    const trimmed = newToolProf.trim();
    if (!trimmed || data.toolProficiencies.includes(trimmed)) return;
    update({ toolProficiencies: [...data.toolProficiencies, trimmed] });
    setNewToolProf("");
  };

  const removeToolProf = (value: string) => {
    update({
      toolProficiencies: data.toolProficiencies.filter((v) => v !== value),
    });
  };

  // ── Equipment (free text list) ──

  const [newEquipment, setNewEquipment] = useState("");

  const addEquipment = () => {
    const trimmed = newEquipment.trim();
    if (!trimmed || data.equipment.includes(trimmed)) return;
    update({ equipment: [...data.equipment, trimmed] });
    setNewEquipment("");
  };

  const removeEquipment = (value: string) => {
    update({
      equipment: data.equipment.filter((v) => v !== value),
    });
  };

  // ── Render helpers ──

  const SectionHeader = ({
    sectionKey,
    title,
    icon,
    count,
  }: {
    sectionKey: string;
    title: string;
    icon: keyof typeof Ionicons.glyphMap;
    count?: number;
  }) => (
    <TouchableOpacity
      className="flex-row items-center justify-between py-3 mb-1"
      onPress={() => toggleSection(sectionKey)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center flex-1">
        <Ionicons
          name={icon}
          size={18}
          color={colors.accentRed}
          style={{ marginRight: 8 }}
        />
        <Text className="text-base font-bold" style={{ color: colors.textPrimary }}>
          {title}
        </Text>
        {count !== undefined && count > 0 && (
          <View className="rounded-full px-2 py-0.5 ml-2" style={{ backgroundColor: withAlpha(colors.accentRed, 0.2) }}>
            <Text className="text-xs font-semibold" style={{ color: colors.accentRed }}>
              {count}
            </Text>
          </View>
        )}
      </View>
      <Ionicons
        name={expandedSections[sectionKey] ? "chevron-up" : "chevron-down"}
        size={18}
        color={colors.textMuted}
      />
    </TouchableOpacity>
  );

  const ChipList = ({
    items,
    onRemove,
  }: {
    items: string[];
    onRemove: (item: string) => void;
  }) => (
    <View className="flex-row flex-wrap mt-1">
      {items.map((item) => (
        <TouchableOpacity
          key={item}
          className="flex-row items-center border rounded-full px-3 py-1.5 mr-2 mb-2 active:opacity-70"
          onPress={() => onRemove(item)}
          style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}
        >
          <Text className="text-sm mr-1" style={{ color: colors.textPrimary }}>
            {item}
          </Text>
          <Ionicons name="close-circle" size={14} color={colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const AddRow = ({
    value,
    onChangeText,
    onAdd,
    placeholder,
  }: {
    value: string;
    onChangeText: (t: string) => void;
    onAdd: () => void;
    placeholder: string;
  }) => (
    <View className="flex-row items-center mt-1 mb-2">
      <TextInput
        className="flex-1 border rounded-xl px-3 py-2.5 text-sm mr-2"
        style={{ backgroundColor: colors.bgInput, borderColor: colors.borderDefault, color: colors.textPrimary }}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        onSubmitEditing={onAdd}
        returnKeyType="done"
      />
      <TouchableOpacity
        className="h-10 w-10 rounded-xl items-center justify-center"
        style={{ backgroundColor: withAlpha(colors.accentRed, 0.15) }}
        onPress={onAdd}
      >
        <Ionicons name="add" size={20} color={colors.accentRed} />
      </TouchableOpacity>
    </View>
  );

  // ── Main Render ──

  return (
    <View>
      {/* ── Básico ── */}
      <SectionHeader sectionKey="basic" title="Datos Básicos" icon="create-outline" />
      {expandedSections.basic && (
        <View className="mb-4">
          {/* Nombre */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Nombre del trasfondo *
          </Text>
          <TextInput
            className="border rounded-xl px-3 py-2.5 text-base mb-3"
            style={{ backgroundColor: colors.bgInput, borderColor: colors.borderDefault, color: colors.textPrimary }}
            value={data.nombre}
            onChangeText={(t) => update({ nombre: t })}
            placeholder="Ej: Boticario, Gladiador, Contrabandista..."
            placeholderTextColor={colors.textMuted}
            maxLength={50}
          />

          {/* Descripción */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Descripción
          </Text>
          <TextInput
            className="border rounded-xl px-3 py-2.5 text-sm mb-3"
            style={{ backgroundColor: colors.bgInput, borderColor: colors.borderDefault, color: colors.textPrimary, minHeight: 80 }}
            value={data.descripcion}
            onChangeText={(t) => update({ descripcion: t })}
            placeholder="Describe brevemente el trasfondo de tu personaje..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>
      )}

      {/* ── Habilidades ── */}
      <SectionHeader
        sectionKey="skills"
        title="Habilidades"
        icon="school-outline"
        count={data.skillProficiencies.length}
      />
      {expandedSections.skills && (
        <View className="mb-4">
          <Text className="text-xs mb-2" style={{ color: colors.textMuted }}>
            Elige exactamente 2 competencias en habilidades. Pulsa para
            seleccionar/deseleccionar.
          </Text>
          <View className="flex-row flex-wrap">
            {SKILL_OPTIONS.map(({ value, label }) => {
              const selected = data.skillProficiencies.includes(value);
              const disabled = !selected && data.skillProficiencies.length >= 2;
              return (
                <TouchableOpacity
                  key={value}
                  className="border rounded-full px-3 py-1.5 mr-2 mb-2"
                  onPress={() => toggleSkill(value)}
                  disabled={disabled}
                  style={{
                    backgroundColor: selected
                      ? withAlpha(colors.accentRed, 0.15)
                      : colors.bgCard,
                    borderColor: selected ? colors.accentRed : colors.borderDefault,
                    opacity: disabled ? 0.4 : 1,
                  }}
                >
                  <Text
                    className="text-sm"
                    style={{
                      color: selected ? colors.accentRed : colors.textPrimary,
                      fontWeight: selected ? "700" : "400",
                    }}
                  >
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ── Herramientas e Idiomas ── */}
      <SectionHeader
        sectionKey="proficiencies"
        title="Herramientas e Idiomas"
        icon="hammer-outline"
        count={(data.toolProficiencies.length) + data.extraLanguages}
      />
      {expandedSections.proficiencies && (
        <View className="mb-4">
          {/* Tool proficiencies */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Competencias con herramientas
          </Text>
          <AddRow
            value={newToolProf}
            onChangeText={setNewToolProf}
            onAdd={addToolProf}
            placeholder="Ej: Herramientas de herbalista"
          />
          {data.toolProficiencies.length > 0 && (
            <ChipList items={data.toolProficiencies} onRemove={removeToolProf} />
          )}

          {/* Extra languages */}
          <Text className="text-sm font-semibold mb-1 mt-2" style={{ color: colors.textSecondary }}>
            Idiomas adicionales
          </Text>
          <View className="flex-row items-center mb-3">
            <TouchableOpacity
              className="h-9 w-9 rounded-lg items-center justify-center border"
              style={{ borderColor: colors.borderDefault, backgroundColor: colors.bgCard }}
              onPress={() => update({ extraLanguages: Math.max(0, data.extraLanguages - 1) })}
            >
              <Ionicons name="remove" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <Text className="mx-4 text-lg font-bold" style={{ color: colors.textPrimary }}>
              {data.extraLanguages}
            </Text>
            <TouchableOpacity
              className="h-9 w-9 rounded-lg items-center justify-center border"
              style={{ borderColor: colors.borderDefault, backgroundColor: colors.bgCard }}
              onPress={() => update({ extraLanguages: Math.min(3, data.extraLanguages + 1) })}
            >
              <Ionicons name="add" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Equipo y Oro ── */}
      <SectionHeader
        sectionKey="equipment"
        title="Equipo y Oro"
        icon="briefcase-outline"
        count={data.equipment.length}
      />
      {expandedSections.equipment && (
        <View className="mb-4">
          {/* Equipment */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Equipo inicial
          </Text>
          <AddRow
            value={newEquipment}
            onChangeText={setNewEquipment}
            onAdd={addEquipment}
            placeholder="Ej: Mochila, Saco de dormir..."
          />
          {data.equipment.length > 0 && (
            <ChipList items={data.equipment} onRemove={removeEquipment} />
          )}

          {/* Starting gold */}
          <Text className="text-sm font-semibold mb-1 mt-2" style={{ color: colors.textSecondary }}>
            Oro inicial (po)
          </Text>
          <View className="flex-row items-center mb-3">
            <TouchableOpacity
              className="h-9 w-9 rounded-lg items-center justify-center border"
              style={{ borderColor: colors.borderDefault, backgroundColor: colors.bgCard }}
              onPress={() => update({ startingGold: Math.max(0, data.startingGold - 5) })}
            >
              <Ionicons name="remove" size={18} color={colors.textMuted} />
            </TouchableOpacity>
            <Text className="mx-4 text-lg font-bold" style={{ color: colors.accentGold }}>
              {data.startingGold}
            </Text>
            <TouchableOpacity
              className="h-9 w-9 rounded-lg items-center justify-center border"
              style={{ borderColor: colors.borderDefault, backgroundColor: colors.bgCard }}
              onPress={() => update({ startingGold: data.startingGold + 5 })}
            >
              <Ionicons name="add" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Rasgo Especial ── */}
      <SectionHeader
        sectionKey="feature"
        title="Rasgo Especial"
        icon="star-outline"
        count={data.featureName ? 1 : 0}
      />
      {expandedSections.feature && (
        <View className="mb-4">
          <Text className="text-xs mb-2" style={{ color: colors.textMuted }}>
            Define un rasgo especial que tu trasfondo otorga a tu personaje.
          </Text>

          {/* Feature name */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Nombre del rasgo
          </Text>
          <TextInput
            className="border rounded-xl px-3 py-2.5 text-base mb-3"
            style={{ backgroundColor: colors.bgInput, borderColor: colors.borderDefault, color: colors.textPrimary }}
            value={data.featureName}
            onChangeText={(t) => update({ featureName: t })}
            placeholder="Ej: Contacto Criminal, Fe del Pueblo..."
            placeholderTextColor={colors.textMuted}
            maxLength={60}
          />

          {/* Feature description */}
          <Text className="text-sm font-semibold mb-1" style={{ color: colors.textSecondary }}>
            Descripción del rasgo
          </Text>
          <TextInput
            className="border rounded-xl px-3 py-2.5 text-sm mb-3"
            style={{ backgroundColor: colors.bgInput, borderColor: colors.borderDefault, color: colors.textPrimary, minHeight: 80 }}
            value={data.featureDescription}
            onChangeText={(t) => update({ featureDescription: t })}
            placeholder="Describe qué beneficio otorga este rasgo..."
            placeholderTextColor={colors.textMuted}
            multiline
            textAlignVertical="top"
            maxLength={500}
          />
        </View>
      )}
    </View>
  );
}
