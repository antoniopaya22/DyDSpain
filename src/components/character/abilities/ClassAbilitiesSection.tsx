import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/hooks";
import {
  getClassAbilities,
  type ClassAbilityResource,
} from "@/data/srd/classAbilities";
import type { Character } from "@/types/character";
import type { ClassData } from "@/data/srd/classes";
import type { ClassResourcesState } from "@/stores/characterStore";
import { UNLIMITED_RESOURCE } from "@/stores/characterStore/helpers";

// ─── Types ───────────────────────────────────────────────────────────

interface ClassAbilitiesSectionProps {
  character: Character;
  classData: ClassData | null;
  classTheme: { icon: string; color: string; label: string } | undefined;
  classResources: ClassResourcesState | null;
  profBonus: number;
  expandedAbility: string | null;
  setExpandedAbility: (id: string | null) => void;
  onRestoreAllResources: () => void;
  onUseResource: (resourceId: string, nombre: string) => void;
  onRestoreResource: (resourceId: string, nombre: string) => void;
  onUseResourceAmount: (
    resourceId: string,
    amount: number,
    abilityName: string,
  ) => void;
}

// ─── Local helper ────────────────────────────────────────────────────

function StatBox({
  label,
  value,
  subValue,
  color,
}: {
  label: string;
  value: string;
  subValue?: string;
  color: string;
}) {
  return (
    <View className="flex-1 min-w-[100px] bg-gray-200 dark:bg-dark-700 rounded-xl p-3 mr-2 mb-2 items-center border border-dark-100 dark:border-surface-border">
      <Text className="text-dark-400 text-[10px] uppercase tracking-wider mb-1">
        {label}
      </Text>
      <Text className="text-xl font-bold" style={{ color }}>
        {value}
      </Text>
      {subValue && (
        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-0.5">
          {subValue}
        </Text>
      )}
    </View>
  );
}

// ─── Component ───────────────────────────────────────────────────────

export default function ClassAbilitiesSection({
  character,
  classData,
  classTheme,
  classResources,
  profBonus,
  expandedAbility,
  setExpandedAbility,
  onRestoreAllResources,
  onUseResource,
  onRestoreResource,
  onUseResourceAmount,
}: ClassAbilitiesSectionProps) {
  const { colors } = useTheme();

  // ── Header card ──────────────────────────────────────────────────

  const renderClassAbilitiesHeader = () => {
    const theme = classTheme ?? {
      icon: "star",
      color: colors.accentGold,
      label: "Habilidades",
    };

    // Check if any resource has been partially used
    const hasUsedResources = classResources
      ? Object.values(classResources.resources).some(
          (r) => r.current < r.max && r.max < UNLIMITED_RESOURCE,
        )
      : false;

    return (
      <View className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-4">
        <View className="flex-row items-center mb-3">
          <View
            className="h-10 w-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${theme.color}20` }}
          >
            <Ionicons name={theme.icon as any} size={22} color={theme.color} />
          </View>
          <View className="flex-1">
            <Text className="text-dark-900 dark:text-white text-base font-semibold">
              {classData?.nombre ?? character.clase}
            </Text>
            <Text className="text-dark-400 text-xs">
              Nivel {character.nivel} · Habilidades de clase
            </Text>
          </View>
          {hasUsedResources && (
            <TouchableOpacity
              className="bg-blue-600/20 rounded-lg px-3 py-1.5 active:bg-blue-600/40"
              onPress={onRestoreAllResources}
            >
              <Text className="text-blue-400 text-xs font-semibold">
                Restaurar todo
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Quick stats for the class */}
        <View className="flex-row flex-wrap">
          <StatBox
            label="Nivel"
            value={String(character.nivel)}
            color={theme.color}
          />
          <StatBox
            label="Competencia"
            value={`+${profBonus}`}
            color={colors.accentBlue}
          />
          <StatBox
            label="Dado de Golpe"
            value={classData?.hitDie ?? "d8"}
            color={colors.accentGreen}
          />
        </View>
      </View>
    );
  };

  // ── Resource bar ─────────────────────────────────────────────────

  const renderClassAbilityResource = (ability: ClassAbilityResource) => {
    if (!ability.recurso) return null;
    const { recurso } = ability;

    // Read live values from classResources store if available
    const storeRes = classResources?.resources[ability.id];
    const currentNum = storeRes
      ? storeRes.current
      : typeof recurso.current === "number"
        ? recurso.current
        : 0;
    const maxNum = storeRes
      ? storeRes.max
      : typeof recurso.max === "number"
        ? recurso.max
        : 0;
    const isUnlimited = maxNum >= UNLIMITED_RESOURCE;
    const pct =
      maxNum > 0 && !isUnlimited
        ? (currentNum / maxNum) * 100
        : isUnlimited
          ? 100
          : 0;

    return (
      <View className="mt-3">
        <View className="flex-row items-center justify-between mb-1.5">
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold">
            {recurso.label}
          </Text>
          <Text className="text-sm font-bold" style={{ color: recurso.color }}>
            {isUnlimited ? "∞" : `${currentNum}/${maxNum}`}
          </Text>
        </View>

        {/* Progress bar */}
        {!isUnlimited && (
          <View className="h-3 bg-gray-200 dark:bg-dark-700 rounded-full overflow-hidden">
            <View
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: recurso.color,
              }}
            />
          </View>
        )}

        {/* Use / Restore buttons */}
        {storeRes && !isUnlimited && (
          <View className="flex-row items-center mt-2">
            <TouchableOpacity
              className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 mr-2 active:opacity-70"
              onPress={() => onUseResource(ability.id, ability.nombre)}
              disabled={currentNum <= 0}
              style={{ opacity: currentNum > 0 ? 1 : 0.4 }}
            >
              <Ionicons
                name="remove-circle-outline"
                size={16}
                color={recurso.color}
              />
              <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                Usar
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-2 active:opacity-70"
              onPress={() =>
                onRestoreResource(ability.id, ability.nombre)
              }
              disabled={currentNum >= maxNum}
              style={{ opacity: currentNum < maxNum ? 1 : 0.4 }}
            >
              <Ionicons
                name="add-circle-outline"
                size={16}
                color={colors.accentGreen}
              />
              <Text className="text-dark-600 dark:text-dark-200 text-xs font-semibold ml-1">
                Restaurar
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text className="text-dark-300 dark:text-dark-500 text-[10px] mt-1">
          Se recupera en: {recurso.recovery}
        </Text>
      </View>
    );
  };

  // ── Scaling info ─────────────────────────────────────────────────

  const renderClassAbilityScale = (ability: ClassAbilityResource) => {
    if (!ability.escala) return null;

    return (
      <View className="mt-2 flex-row items-center">
        <View className="bg-gray-200 dark:bg-dark-700 rounded-lg px-3 py-1.5 flex-row items-center">
          <Ionicons name="trending-up" size={12} color={colors.accentAmber} />
          <Text className="text-dark-600 dark:text-dark-200 text-xs font-medium ml-1.5">
            {ability.escala.label}:{" "}
          </Text>
          <Text
            className="text-sm font-bold"
            style={{ color: colors.accentAmber }}
          >
            {ability.escala.value}
          </Text>
        </View>
      </View>
    );
  };

  // ── Cost button ──────────────────────────────────────────────────

  const renderClassAbilityCost = (ability: ClassAbilityResource) => {
    if (!ability.resourceCost) return null;
    const { resourceCost } = ability;

    const storeRes = classResources?.resources[resourceCost.resourceId];
    if (!storeRes) return null;

    const canAfford = storeRes.current >= resourceCost.amount;

    return (
      <View className="mt-3">
        <TouchableOpacity
          className="flex-row items-center rounded-lg px-4 py-2.5 active:opacity-70"
          style={{
            backgroundColor: canAfford
              ? `${resourceCost.color}20`
              : `${colors.textMuted}10`,
            borderWidth: 1,
            borderColor: canAfford
              ? `${resourceCost.color}40`
              : colors.borderDefault,
            opacity: canAfford ? 1 : 0.5,
          }}
          onPress={() =>
            onUseResourceAmount(
              resourceCost.resourceId,
              resourceCost.amount,
              ability.nombre,
            )
          }
          disabled={!canAfford}
        >
          <Ionicons
            name="flash"
            size={16}
            color={canAfford ? resourceCost.color : colors.textMuted}
          />
          <Text
            className="text-sm font-semibold ml-2"
            style={{ color: canAfford ? resourceCost.color : colors.textMuted }}
          >
            Usar — {resourceCost.label}
          </Text>
          <View className="flex-1" />
          <Text
            className="text-xs"
            style={{ color: canAfford ? resourceCost.color : colors.textMuted }}
          >
            ({storeRes.current}/{storeRes.max} {storeRes.nombre})
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  // ── Main abilities list ──────────────────────────────────────────

  const abilities = getClassAbilities(character.clase, character.nivel);
  if (abilities.length === 0) return null;

  return (
    <>
      {renderClassAbilitiesHeader()}
      <View className="mb-4">
        {abilities.map((ability) => {
          const isExpanded = expandedAbility === ability.id;
          return (
            <View
              key={ability.id}
              className="bg-parchment-card dark:bg-surface-card rounded-card border border-dark-100 dark:border-surface-border p-4 mb-3"
            >
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() =>
                  setExpandedAbility(isExpanded ? null : ability.id)
                }
                activeOpacity={0.7}
              >
                <View
                  className="h-8 w-8 rounded-full items-center justify-center mr-3"
                  style={{
                    backgroundColor: `${classTheme?.color ?? colors.accentGold}20`,
                  }}
                >
                  {ability.resourceCost ? (
                    <Ionicons
                      name="flash"
                      size={16}
                      color={ability.resourceCost.color}
                    />
                  ) : ability.recurso ? (
                    <Ionicons
                      name="flash"
                      size={16}
                      color={ability.recurso.color}
                    />
                  ) : ability.escala ? (
                    <Ionicons
                      name="trending-up"
                      size={16}
                      color={colors.accentAmber}
                    />
                  ) : (
                    <Ionicons
                      name="star"
                      size={16}
                      color={classTheme?.color ?? colors.accentGold}
                    />
                  )}
                </View>

                <View className="flex-1">
                  <Text className="text-dark-900 dark:text-white text-sm font-semibold">
                    {ability.nombre}
                  </Text>
                  {ability.recurso &&
                    (() => {
                      const storeRes = classResources?.resources[ability.id];
                      const cur = storeRes
                        ? storeRes.current
                        : ability.recurso!.current;
                      const mx = storeRes ? storeRes.max : ability.recurso!.max;
                      const isUnlimited = typeof mx === "number" && mx >= UNLIMITED_RESOURCE;
                      return (
                        <Text
                          className="text-xs mt-0.5"
                          style={{ color: ability.recurso!.color }}
                        >
                          {isUnlimited ? "Ilimitado" : `${cur}/${mx}`}{" "}
                          {ability.recurso!.label}
                        </Text>
                      );
                    })()}
                  {ability.resourceCost &&
                    (() => {
                      const storeRes =
                        classResources?.resources[
                          ability.resourceCost!.resourceId
                        ];
                      const canAfford = storeRes
                        ? storeRes.current >= ability.resourceCost!.amount
                        : false;
                      return (
                        <Text
                          className="text-xs mt-0.5"
                          style={{
                            color: canAfford
                              ? ability.resourceCost!.color
                              : colors.textMuted,
                          }}
                        >
                          Coste: {ability.resourceCost!.label}
                          {storeRes
                            ? ` (${storeRes.current}/${storeRes.max} disponibles)`
                            : ""}
                        </Text>
                      );
                    })()}
                  {ability.escala &&
                    !ability.recurso &&
                    !ability.resourceCost && (
                      <Text className="text-dark-400 text-xs mt-0.5">
                        {ability.escala.label}: {ability.escala.value}
                      </Text>
                    )}
                </View>

                <Ionicons
                  name={isExpanded ? "chevron-up" : "chevron-down"}
                  size={16}
                  color={colors.textMuted}
                />
              </TouchableOpacity>

              {isExpanded && (
                <View className="mt-3 pt-3 border-t border-dark-100 dark:border-surface-border/50">
                  <Text className="text-dark-500 dark:text-dark-300 text-xs leading-5">
                    {ability.descripcion}
                  </Text>
                  {renderClassAbilityResource(ability)}
                  {renderClassAbilityCost(ability)}
                  {renderClassAbilityScale(ability)}
                </View>
              )}
            </View>
          );
        })}
      </View>
    </>
  );
}
