/**
 * HPTracker - Hit Points display and management
 *
 * Shows HP bar, damage/heal inputs, and temp HP controls.
 * Extracted from CombatTab.tsx
 */

import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCharacterStore } from "@/stores/characterStore";
import { useTheme } from "@/hooks";
import { withAlpha } from "@/utils/theme";
import { getHpColor, getHpLabel } from "@/utils/combat";

interface HPTrackerProps {
  onShowToast: (message: string) => void;
}

export function HPTracker({ onShowToast }: HPTrackerProps) {
  const { colors } = useTheme();
  const { character, takeDamage, heal, setTempHP } = useCharacterStore();

  const [damageInput, setDamageInput] = useState("");
  const [healInput, setHealInput] = useState("");
  const [tempHpInput, setTempHpInput] = useState("");

  if (!character) return null;

  const { hp } = character;
  const hpColor = getHpColor(hp.current, hp.max, colors);
  const hpPct = hp.max > 0 ? Math.min(100, (hp.current / hp.max) * 100) : 0;

  const handleDamage = async () => {
    const amount = parseInt(damageInput, 10);
    if (isNaN(amount) || amount <= 0) return;
    await takeDamage(amount);
    setDamageInput("");
    onShowToast(`-${amount} PG`);
  };

  const handleHeal = async () => {
    const amount = parseInt(healInput, 10);
    if (isNaN(amount) || amount <= 0) return;
    await heal(amount);
    setHealInput("");
    onShowToast(`+${amount} PG`);
  };

  const handleSetTempHP = async () => {
    const amount = parseInt(tempHpInput, 10);
    if (isNaN(amount) || amount < 0) return;
    await setTempHP(amount);
    setTempHpInput("");
    onShowToast(`PG temp: ${amount}`);
  };

  return (
    <View className="rounded-card border p-4 mb-4" style={{ backgroundColor: colors.bgCard, borderColor: colors.borderDefault }}>
      <Text className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: colors.textSecondary }}>
        Puntos de Golpe
      </Text>

      {/* HP Bar */}
      <View className="items-center mb-4">
        <View className="flex-row items-baseline mb-1">
          <Text className="text-5xl font-bold" style={{ color: hpColor }}>
            {hp.current}
          </Text>
          <Text className="text-xl font-semibold ml-1" style={{ color: colors.textMuted }}>
            / {hp.max}
          </Text>
        </View>

        {hp.temp > 0 && (
          <View className="flex-row items-center mb-1">
            <Ionicons name="shield" size={14} color={colors.accentBlue} />
            <Text className="text-sm font-semibold ml-1" style={{ color: colors.accentBlue }}>
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
        <View className="w-full h-3 rounded-full mt-2 overflow-hidden" style={{ backgroundColor: colors.bgSecondary }}>
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
              className="flex-1 rounded-l-lg px-3 py-2.5 text-sm border border-r-0"
              style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.borderDefault }}
              placeholder="Daño"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={damageInput}
              onChangeText={setDamageInput}
              onSubmitEditing={handleDamage}
              returnKeyType="done"
            />
            <TouchableOpacity
              className="rounded-r-lg px-3 items-center justify-center border"
              style={{ backgroundColor: withAlpha(colors.accentDanger, 0.8), borderColor: withAlpha(colors.accentDanger, 0.8) }}
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
              className="flex-1 rounded-l-lg px-3 py-2.5 text-sm border border-r-0"
              style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.borderDefault }}
              placeholder="Curar"
              placeholderTextColor={colors.textMuted}
              keyboardType="numeric"
              value={healInput}
              onChangeText={setHealInput}
              onSubmitEditing={handleHeal}
              returnKeyType="done"
            />
            <TouchableOpacity
              className="rounded-r-lg px-3 items-center justify-center border"
              style={{ backgroundColor: withAlpha(colors.accentGreen, 0.8), borderColor: withAlpha(colors.accentGreen, 0.8) }}
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
          className="flex-1 rounded-l-lg px-3 py-2.5 text-sm border border-r-0"
          style={{ backgroundColor: colors.bgSecondary, color: colors.textPrimary, borderColor: colors.borderDefault }}
          placeholder="PG Temporales"
          placeholderTextColor={colors.textMuted}
          keyboardType="numeric"
          value={tempHpInput}
          onChangeText={setTempHpInput}
          onSubmitEditing={handleSetTempHP}
          returnKeyType="done"
        />
        <TouchableOpacity
          className="rounded-r-lg px-3 items-center justify-center border"
          style={{ backgroundColor: withAlpha(colors.accentBlue, 0.8), borderColor: withAlpha(colors.accentBlue, 0.8) }}
          onPress={handleSetTempHP}
        >
          <Ionicons name="shield" size={18} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
