/**
 * CombatTab - Pestaña de combate del personaje
 * Muestra: HP tracker, clase de armadura, velocidad, salvaciones de muerte,
 * dados de golpe, condiciones activas, concentración, y log de combate.
 */

import { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useDialog, useToast } from "@/hooks/useDialog";
import {
  CONDITION_NAMES,
  formatModifier,
  type Condition,
} from "@/types/character";

// ─── Helpers ─────────────────────────────────────────────────────────

function showToastLegacy(message: string) {
  // Legacy fallback - no longer used, kept for reference
  void message;
  }
}

function getHpColor(current: number, max: number): string {
  if (max <= 0) return "#ef4444";
  const pct = current / max;
  if (pct >= 0.75) return "#22c55e";
  if (pct >= 0.5) return "#84cc16";
  if (pct >= 0.25) return "#eab308";
  if (pct > 0) return "#f97316";
  return "#ef4444";
}

function getHpLabel(current: number, max: number): string {
  if (max <= 0) return "Muerto";
  const pct = current / max;
  if (pct >= 0.75) return "Saludable";
  if (pct >= 0.5) return "Herido";
  if (pct >= 0.25) return "Malherido";
  if (pct > 0) return "Crítico";
  return "Inconsciente";
}

const ALL_CONDITIONS: Condition[] = [
  "agarrado",
  "asustado",
  "aturdido",
  "cegado",
  "derribado",
  "encantado",
  "ensordecido",
  "envenenado",
  "hechizado",
  "incapacitado",
  "inconsciente",
  "invisible",
  "paralizado",
  "petrificado",
  "restringido",
];

// ─── Main Component ──────────────────────────────────────────────────

export default function CombatTab() {
  const { dialogProps, showAlert, showConfirm } = useDialog();
  const { toastProps, showSuccess: toastSuccess, showInfo: toastInfo, showWarning: toastWarning } = useToast();

  const showToast = (message: string) => {
    toastInfo(message);
  };

  const {
    character,
    takeDamage,
    heal,
    setTempHP,
    setCurrentHP,
    useHitDie,
    addDeathSuccess,
    addDeathFailure,
    resetDeathSaves,
    addCondition,
    removeCondition,
    clearConditions,
    clearConcentration,
    shortRest,
    longRest,
    getArmorClass,
  } = useCharacterStore();

  const [damageInput, setDamageInput] = useState("");
  const [healInput, setHealInput] = useState("");
  const [tempHpInput, setTempHpInput] = useState("");
  const [showConditionPicker, setShowConditionPicker] = useState(false);
  const [showCombatLog, setShowCombatLog] = useState(false);

  if (!character) {
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-dark-300 text-base">
          No se ha cargado ningún personaje
        </Text>
      </View>
    );
  }

  const { hp, hitDice, deathSaves, speed, conditions, concentration } =
    character;
  const hpColor = getHpColor(hp.current, hp.max);
  const hpPct = hp.max > 0 ? Math.min(100, (hp.current / hp.max) * 100) : 0;
  const ac = getArmorClass();
  const isUnconscious = hp.current === 0;

  // ── Actions ──

  const handleDamage = async () => {
    const amount = parseInt(damageInput, 10);
    if (isNaN(amount) || amount <= 0) return;
    await takeDamage(amount);
    setDamageInput("");
    showToast(`-${amount} PG`);
  };

  const handleHeal = async () => {
    const amount = parseInt(healInput, 10);
    if (isNaN(amount) || amount <= 0) return;
    await heal(amount);
    setHealInput("");
    showToast(`+${amount} PG`);
  };

  const handleSetTempHP = async () => {
    const amount = parseInt(tempHpInput, 10);
    if (isNaN(amount) || amount < 0) return;
    await setTempHP(amount);
    setTempHpInput("");
    showToast(`PG temp: ${amount}`);
  };

  const handleUseHitDie = async () => {
    const result = await useHitDie();
    if (result) {
      showToast(`Dado de golpe: +${result.healed} PG`);
    } else {
      showToast("No quedan dados de golpe");
    }
  };

  const handleDeathSuccess = async () => {
    const result = await addDeathSuccess();
    if (result === "stable") {
      showAlert(
        "¡Estabilizado!",
        "Has conseguido 3 éxitos. Tu personaje se estabiliza con 1 PG.",
        { type: "success", buttonText: "OK" }
      );
    }
  };

  const handleDeathFailure = async () => {
    const result = await addDeathFailure();
    if (result === "dead") {
      showAlert(
        "Muerte",
        "Has acumulado 3 fallos. Tu personaje ha muerto.",
        { type: "danger", buttonText: "OK" }
      );
    }
  };

  const handleShortRest = () => {
    const buttons: Array<{ text: string; style?: "default" | "cancel" | "destructive"; onPress?: () => void }> = [
      { text: "Cancelar", style: "cancel" as const },
      {
        text: "Ninguno",
        style: "default" as const,
        onPress: async () => {
          await shortRest(0);
          toastSuccess("Descanso corto completado");
        },
      },
    ];

    if (hitDice.remaining > 0) {
      buttons.push({
        text: `Usar 1`,
        style: "default" as const,
        onPress: async () => {
          const result = await shortRest(1);
          toastSuccess(
            `Descanso corto: +${result.hpRestored} PG`,
            `${result.diceUsed} dado(s) de golpe usados`
          );
        },
      });
    }

    if (hitDice.remaining > 1) {
      buttons.push({
        text: `Usar todos (${hitDice.remaining})`,
        style: "default" as const,
        onPress: async () => {
          const result = await shortRest(hitDice.remaining);
          toastSuccess(
            `Descanso corto: +${result.hpRestored} PG`,
            `${result.diceUsed} dado(s) de golpe usados`
          );
        },
      });
    }

    showConfirm(
      "Descanso Corto",
      `Tienes ${hitDice.remaining} dado(s) de golpe disponibles. ¿Cuántos quieres usar?`,
      async () => {
        await shortRest(0);
        toastSuccess("Descanso corto completado");
      },
      { confirmText: "Descansar sin dados", cancelText: "Cancelar", type: "info" }
    );
  };

  const handleLongRest = () => {
    showConfirm(
      "Descanso Largo",
      "¿Realizar un descanso largo?\n\n• Recuperas todos los PG\n• Recuperas la mitad de tus dados de golpe\n• Se restauran espacios de conjuro\n• Se restauran rasgos con recarga",
      async () => {
        await longRest();
        toastSuccess("Descanso largo completado", "¡PG al máximo!");
      },
      { confirmText: "Descansar", cancelText: "Cancelar", type: "info" }
    );
  };

  const handleAddCondition = (condition: Condition) => {
    addCondition(condition);
    setShowConditionPicker(false);
    showToast(`Condición añadida: ${CONDITION_NAMES[condition]}`);
  };

  // ── Render Sections ──

  const renderHPSection = () => (
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider mb-3">
        Puntos de Golpe
      </Text>

      {/* HP Bar */}
      <View className="items-center mb-4">
        <View className="flex-row items-baseline mb-1">
          <Text
            className="text-5xl font-bold"
            style={{ color: hpColor }}
          >
            {hp.current}
          </Text>
          <Text className="text-dark-400 text-xl font-semibold ml-1">
            / {hp.max}
          </Text>
        </View>

        {hp.temp > 0 && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="shield" size={14} color="#3b82f6" />
            <Text className="text-blue-400 text-sm font-semibold ml-1">
              +{hp.temp} temporales
            </Text>
          </View>
        )}

        <Text
          className="text-xs font-semibold uppercase tracking-wider"
          style={{ color: hpColor }}
        >
          {getHpLabel(hp.current, hp.max)}
        </Text>

        {/* Progress bar */}
        <View className="w-full h-3 bg-dark-700 rounded-full mt-2 overflow-hidden">
          <View
            className="h-full rounded-full"
            style={{
              width: `${hpPct}%`,
              backgroundColor: hpColor,
            }}
          />
        </View>
      </View>

      {/* HP Controls */}
      <View className="flex-row mb-3">
        {/* Damage */}
        <View className="flex-1 mr-1.5">
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-dark-700 rounded-l-lg px-3 py-2.5 text-white text-sm border border-surface-border border-r-0"
              placeholder="Daño"
              placeholderTextColor="#666699"
              keyboardType="numeric"
              value={damageInput}
              onChangeText={setDamageInput}
              onSubmitEditing={handleDamage}
              returnKeyType="done"
            />
            <TouchableOpacity
              className="bg-red-600/80 rounded-r-lg px-3 items-center justify-center border border-red-600/80"
              onPress={handleDamage}
            >
              <Ionicons name="remove" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Heal */}
        <View className="flex-1 ml-1.5">
          <View className="flex-row">
            <TextInput
              className="flex-1 bg-dark-700 rounded-l-lg px-3 py-2.5 text-white text-sm border border-surface-border border-r-0"
              placeholder="Curar"
              placeholderTextColor="#666699"
              keyboardType="numeric"
              value={healInput}
              onChangeText={setHealInput}
              onSubmitEditing={handleHeal}
              returnKeyType="done"
            />
            <TouchableOpacity
              className="bg-green-600/80 rounded-r-lg px-3 items-center justify-center border border-green-600/80"
              onPress={handleHeal}
            >
              <Ionicons name="add" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Temp HP */}
      <View className="flex-row">
        <TextInput
          className="flex-1 bg-dark-700 rounded-l-lg px-3 py-2.5 text-white text-sm border border-surface-border border-r-0"
          placeholder="PG Temporales"
          placeholderTextColor="#666699"
          keyboardType="numeric"
          value={tempHpInput}
          onChangeText={setTempHpInput}
          onSubmitEditing={handleSetTempHP}
          returnKeyType="done"
        />
        <TouchableOpacity
          className="bg-blue-600/80 rounded-r-lg px-3 items-center justify-center border border-blue-600/80"
          onPress={handleSetTempHP}
        >
          <Ionicons name="shield" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderStatsRow = () => (
    <View className="flex-row mb-4">
      {/* Armor Class */}
      <View className="flex-1 bg-surface-card rounded-card border border-surface-border p-4 mr-2 items-center">
        <View className="h-14 w-14 rounded-full bg-blue-500/15 items-center justify-center mb-1">
          <Ionicons name="shield" size={28} color="#3b82f6" />
        </View>
        <Text className="text-white text-2xl font-bold">{ac}</Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Clase de Armadura
        </Text>
      </View>

      {/* Initiative */}
      <View className="flex-1 bg-surface-card rounded-card border border-surface-border p-4 mx-1 items-center">
        <View className="h-14 w-14 rounded-full bg-amber-500/15 items-center justify-center mb-1">
          <Ionicons name="flash" size={28} color="#f59e0b" />
        </View>
        <Text className="text-white text-2xl font-bold">
          {formatModifier(character.abilityScores.des.modifier)}
        </Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Iniciativa
        </Text>
      </View>

      {/* Speed */}
      <View className="flex-1 bg-surface-card rounded-card border border-surface-border p-4 ml-2 items-center">
        <View className="h-14 w-14 rounded-full bg-green-500/15 items-center justify-center mb-1">
          <Ionicons name="footsteps" size={28} color="#22c55e" />
        </View>
        <Text className="text-white text-2xl font-bold">{speed.walk}</Text>
        <Text className="text-dark-400 text-[10px] uppercase tracking-wider mt-0.5">
          Velocidad (pies)
        </Text>
      </View>
    </View>
  );

  const renderDeathSaves = () => {
    if (!isUnconscious) return null;

    return (
      <View className="bg-surface-card rounded-card border border-red-500/30 p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <Ionicons name="skull-outline" size={20} color="#ef4444" />
          <Text className="text-red-400 text-sm font-semibold ml-2 uppercase tracking-wider">
            Salvaciones de Muerte
          </Text>
        </View>

        {/* Successes */}
        <View className="flex-row items-center mb-3">
          <Text className="text-green-400 text-sm font-medium w-16">
            Éxitos
          </Text>
          <View className="flex-row flex-1 justify-center">
            {[0, 1, 2].map((i) => (
              <View
                key={`s-${i}`}
                className="h-8 w-8 rounded-full mx-1 items-center justify-center border-2"
                style={{
                  backgroundColor:
                    i < deathSaves.successes ? "#22c55e" : "transparent",
                  borderColor:
                    i < deathSaves.successes ? "#22c55e" : "#3a3a5c",
                }}
              >
                {i < deathSaves.successes && (
                  <Ionicons name="checkmark" size={18} color="white" />
                )}
              </View>
            ))}
          </View>
          <TouchableOpacity
            className="bg-green-600/80 rounded-lg px-3 py-2 active:bg-green-700"
            onPress={handleDeathSuccess}
          >
            <Text className="text-white text-xs font-bold">+1</Text>
          </TouchableOpacity>
        </View>

        {/* Failures */}
        <View className="flex-row items-center mb-3">
          <Text className="text-red-400 text-sm font-medium w-16">Fallos</Text>
          <View className="flex-row flex-1 justify-center">
            {[0, 1, 2].map((i) => (
              <View
                key={`f-${i}`}
                className="h-8 w-8 rounded-full mx-1 items-center justify-center border-2"
                style={{
                  backgroundColor:
                    i < deathSaves.failures ? "#ef4444" : "transparent",
                  borderColor:
                    i < deathSaves.failures ? "#ef4444" : "#3a3a5c",
                }}
              >
                {i < deathSaves.failures && (
                  <Ionicons name="close" size={18} color="white" />
                )}
              </View>
            ))}
          </View>
          <TouchableOpacity
            className="bg-red-600/80 rounded-lg px-3 py-2 active:bg-red-700"
            onPress={handleDeathFailure}
          >
            <Text className="text-white text-xs font-bold">+1</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="bg-dark-700 rounded-lg py-2 items-center active:bg-dark-600"
          onPress={() => {
            showConfirm(
              "Reiniciar Salvaciones",
              "¿Reiniciar las salvaciones de muerte?",
              resetDeathSaves,
              { confirmText: "Reiniciar", cancelText: "Cancelar", type: "warning" }
            );
          }}
        >
          <Text className="text-dark-300 text-xs font-semibold">
            Reiniciar
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderHitDice = () => (
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="dice-outline" size={20} color="#a855f7" />
          <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Dados de Golpe
          </Text>
        </View>
        <Text className="text-dark-300 text-xs">
          {hitDice.die}
        </Text>
      </View>

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center">
          {Array.from({ length: hitDice.total }).map((_, i) => (
            <View
              key={i}
              className="h-8 w-8 rounded-lg mx-0.5 items-center justify-center border"
              style={{
                backgroundColor:
                  i < hitDice.remaining ? "#a855f720" : "#1a1a2e",
                borderColor:
                  i < hitDice.remaining ? "#a855f766" : "#3a3a5c",
              }}
            >
              <Ionicons
                name="dice"
                size={16}
                color={i < hitDice.remaining ? "#a855f7" : "#3a3a5c"}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          className={`rounded-lg px-4 py-2 ${
            hitDice.remaining > 0 && hp.current < hp.max
              ? "bg-purple-600/80 active:bg-purple-700"
              : "bg-dark-600 opacity-50"
          }`}
          onPress={handleUseHitDie}
          disabled={hitDice.remaining <= 0 || hp.current >= hp.max}
        >
          <Text className="text-white text-sm font-semibold">Usar</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-dark-400 text-[10px] mt-2">
        {hitDice.remaining}/{hitDice.total} disponibles · Clic en "Usar" para
        tirar {hitDice.die} + mod. CON
      </Text>
    </View>
  );

  const renderConditions = () => (
    <View className="bg-surface-card rounded-card border border-surface-border p-4 mb-4">
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-row items-center">
          <Ionicons name="warning-outline" size={20} color="#f59e0b" />
          <Text className="text-dark-200 text-xs font-semibold uppercase tracking-wider ml-2">
            Condiciones
          </Text>
        </View>
        <View className="flex-row">
          {conditions.length > 0 && (
            <TouchableOpacity
              className="mr-2 px-2 py-1 rounded-md active:bg-dark-600"
              onPress={() => {
                showConfirm(
                  "Limpiar condiciones",
                  "¿Eliminar todas las condiciones?",
                  clearConditions,
                  { confirmText: "Limpiar", cancelText: "Cancelar", type: "warning" }
                );
              }}
            >
              <Text className="text-red-400 text-xs font-semibold">
                Limpiar
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            className="bg-amber-600/80 rounded-lg px-3 py-1 active:bg-amber-700"
            onPress={() => setShowConditionPicker(!showConditionPicker)}
          >
            <Ionicons name="add" size={18} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Active conditions */}
      {conditions.length === 0 ? (
        <Text className="text-dark-400 text-sm italic">
          Sin condiciones activas
        </Text>
      ) : (
        <View className="flex-row flex-wrap">
          {conditions.map((c) => (
            <TouchableOpacity
              key={c.condition}
              className="flex-row items-center bg-amber-500/15 border border-amber-500/30 rounded-full px-3 py-1.5 mr-2 mb-2"
              onPress={() => removeCondition(c.condition)}
            >
              <Text className="text-amber-400 text-xs font-semibold">
                {CONDITION_NAMES[c.condition]}
              </Text>
              <Ionicons
                name="close-circle"
                size={14}
                color="#f59e0b"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Condition Picker */}
      {showConditionPicker && (
        <View className="mt-3 pt-3 border-t border-surface-border/50">
          <Text className="text-dark-300 text-xs mb-2">
            Pulsa para añadir una condición:
          </Text>
          <View className="flex-row flex-wrap">
            {ALL_CONDITIONS.filter(
              (c) => !conditions.some((ac) => ac.condition === c)
            ).map((c) => (
              <TouchableOpacity
                key={c}
                className="bg-dark-700 border border-surface-border rounded-full px-3 py-1.5 mr-2 mb-2 active:bg-dark-600"
                onPress={() => handleAddCondition(c)}
              >
                <Text className="text-dark-200 text-xs">
                  {CONDITION_NAMES[c]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );

  const renderConcentration = () => {
    if (!concentration) return null;

    return (
      <View className="bg-surface-card rounded-card border border-purple-500/30 p-4 mb-4">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Ionicons name="eye" size={20} color="#a855f7" />
            <View className="ml-3 flex-1">
              <Text className="text-dark-400 text-[10px] uppercase tracking-wider">
                Concentración
              </Text>
              <Text className="text-purple-300 text-sm font-semibold">
                {concentration.spellName}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-dark-700 rounded-lg px-3 py-1.5 active:bg-dark-600"
            onPress={() => {
              showConfirm(
                "Romper Concentración",
                `¿Dejar de concentrarte en "${concentration.spellName}"?`,
                clearConcentration,
                { confirmText: "Romper", cancelText: "Cancelar", type: "danger" }
              );
            }}
          >
            <Text className="text-red-400 text-xs font-semibold">Romper</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderRestButtons = () => (
    <View className="flex-row mb-4">
      <TouchableOpacity
        className="flex-1 bg-surface-card rounded-card border border-surface-border p-4 mr-2 items-center active:bg-surface-light"
        onPress={handleShortRest}
      >
        <Ionicons name="cafe-outline" size={24} color="#f59e0b" />
        <Text className="text-white text-sm font-semibold mt-1">
          Descanso Corto
        </Text>
        <Text className="text-dark-400 text-[10px] mt-0.5">
          Usa dados de golpe
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="flex-1 bg-surface-card rounded-card border border-surface-border p-4 ml-2 items-center active:bg-surface-light"
        onPress={handleLongRest}
      >
        <Ionicons name="moon-outline" size={24} color="#3b82f6" />
        <Text className="text-white text-sm font-semibold mt-1">
          Descanso Largo
        </Text>
        <Text className="text-dark-400 text-[10px] mt-0.5">
          Recupera todo
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderCombatLog = () => (
    <View className="bg-surface-card rounded-card border border-surface-border mb-4 overflow-hidden">
      <TouchableOpacity
        className="flex-row items-center p-4 active:bg-surface-light"
        onPress={() => setShowCombatLog(!showCombatLog)}
      >
        <Ionicons name="document-text-outline" size={20} color="#fbbf24" />
        <Text className="text-white text-sm font-semibold flex-1 ml-3">
          Registro de Combate
        </Text>
        <Text className="text-dark-400 text-xs mr-2">
          {character.combatLog.length} entradas
        </Text>
        <Ionicons
          name={showCombatLog ? "chevron-up" : "chevron-down"}
          size={20}
          color="#666699"
        />
      </TouchableOpacity>

      {showCombatLog && (
        <View className="px-4 pb-4 border-t border-surface-border/50">
          {character.combatLog.length === 0 ? (
            <Text className="text-dark-400 text-sm italic mt-3">
              Sin entradas en el registro
            </Text>
          ) : (
            character.combatLog.slice(0, 20).map((entry) => {
              const typeConfig: Record<
                string,
                { icon: keyof typeof Ionicons.glyphMap; color: string }
              > = {
                damage: { icon: "flash", color: "#ef4444" },
                healing: { icon: "heart", color: "#22c55e" },
                temp_hp: { icon: "shield", color: "#3b82f6" },
                hit_dice: { icon: "dice", color: "#a855f7" },
                death_save: { icon: "skull", color: "#f59e0b" },
                rest: { icon: "moon", color: "#60a5fa" },
              };
              const cfg = typeConfig[entry.type] ?? {
                icon: "ellipse" as keyof typeof Ionicons.glyphMap,
                color: "#666699",
              };

              return (
                <View
                  key={entry.id}
                  className="flex-row items-start py-2 border-b border-surface-border/30"
                >
                  <Ionicons
                    name={cfg.icon}
                    size={14}
                    color={cfg.color}
                    style={{ marginTop: 2 }}
                  />
                  <View className="flex-1 ml-2">
                    <Text className="text-dark-200 text-xs">
                      {entry.description ?? entry.type}
                    </Text>
                    <Text className="text-dark-500 text-[10px]">
                      PG después: {entry.hpAfter} ·{" "}
                      {new Date(entry.timestamp).toLocaleTimeString("es-ES", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                </View>
              );
            })
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {renderHPSection()}
        {renderStatsRow()}
        {renderDeathSaves()}
        {renderConcentration()}
        {renderHitDice()}
        {renderConditions()}
        {renderRestButtons()}
        {renderCombatLog()}
      </ScrollView>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </View>
  );
}
