/**
 * LevelUpModal — wizard shell.
 *
 * All business logic lives in `useLevelUpWizard`.
 * Each wizard step is a standalone component under `./levelup/`.
 */

import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  Animated,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

// Hook & step components
import { useLevelUpWizard } from "./levelup/useLevelUpWizard";
import SummaryStep from "./levelup/SummaryStep";
import HPStep from "./levelup/HPStep";
import ASIStep from "./levelup/ASIStep";
import SpellsStep from "./levelup/SpellsStep";
import SubclassStep from "./levelup/SubclassStep";
import MetamagicStep from "./levelup/MetamagicStep";
import ConfirmStep from "./levelup/ConfirmStep";

// ─── Props ───────────────────────────────────────────────────────────

interface LevelUpModalProps {
  visible: boolean;
  onClose: () => void;
  onComplete: () => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function LevelUpModal({
  visible,
  onClose,
  onComplete,
}: LevelUpModalProps) {
  const { colors } = useTheme();
  const w = useLevelUpWizard(visible, onClose, onComplete);

  if (!w.character || !w.summary || w.steps.length === 0) return null;

  // ── Step dispatcher ──
  const renderStepContent = () => {
    if (!w.currentStep) return null;
    switch (w.currentStep.id) {
      case "summary":
        return (
          <SummaryStep
            summary={w.summary!}
            newLevel={w.newLevel}
            classData={w.classData}
            profChanged={w.profChanged}
            newProfBonus={w.newProfBonus}
            oldProfBonus={w.oldProfBonus}
            character={w.character!}
          />
        );
      case "hp":
        return (
          <HPStep
            hpMethod={w.hpMethod}
            setHpMethod={w.setHpMethod}
            hpRolled={w.hpRolled}
            setHpRolled={w.setHpRolled}
            isRolling={w.isRolling}
            rollHPDie={w.rollHPDie}
            dieSides={w.dieSides}
            fixedHP={w.fixedHP}
            conMod={w.conMod}
            hpGainTotal={w.hpGainTotal}
            newMaxHP={w.newMaxHP}
            character={w.character!}
            classData={w.classData}
          />
        );
      case "asi":
        return (
          <ASIStep
            asiPoints={w.asiPoints}
            asiRemaining={w.asiRemaining}
            totalASIUsed={w.totalASIUsed}
            incrementASI={w.incrementASI}
            decrementASI={w.decrementASI}
            character={w.character!}
          />
        );
      case "spells":
        return (
          <SpellsStep
            summary={w.summary!}
            character={w.character!}
            newLevel={w.newLevel}
            newCantrips={w.newCantrips}
            setNewCantrips={w.setNewCantrips}
            newSpells={w.newSpells}
            setNewSpells={w.setNewSpells}
            newSpellbook={w.newSpellbook}
            setNewSpellbook={w.setNewSpellbook}
            swapOldSpell={w.swapOldSpell}
            setSwapOldSpell={w.setSwapOldSpell}
            swapNewSpell={w.swapNewSpell}
            setSwapNewSpell={w.setSwapNewSpell}
            wantsToSwap={w.wantsToSwap}
            setWantsToSwap={w.setWantsToSwap}
            spellSearch={w.spellSearch}
            setSpellSearch={w.setSpellSearch}
            customCantripName={w.customCantripName}
            setCustomCantripName={w.setCustomCantripName}
            customSpellName={w.customSpellName}
            setCustomSpellName={w.setCustomSpellName}
            expandedSpellIds={w.expandedSpellIds}
            setExpandedSpellIds={w.setExpandedSpellIds}
            getMagicState={w.getMagicState}
          />
        );
      case "subclass":
        return (
          <SubclassStep
            summary={w.summary!}
            character={w.character!}
            newLevel={w.newLevel}
            classData={w.classData}
            subclassName={w.subclassName}
            setSubclassName={w.setSubclassName}
            selectedSubclassId={w.selectedSubclassId}
            setSelectedSubclassId={w.setSelectedSubclassId}
            isCustomSubclass={w.isCustomSubclass}
            setIsCustomSubclass={w.setIsCustomSubclass}
            featureChoices={w.featureChoices}
            setFeatureChoices={w.setFeatureChoices}
          />
        );
      case "metamagic":
        return (
          <MetamagicStep
            summary={w.summary!}
            selectedMetamagic={w.selectedMetamagic}
            setSelectedMetamagic={w.setSelectedMetamagic}
            getMagicState={w.getMagicState}
          />
        );
      case "confirm":
        return (
          <ConfirmStep
            summary={w.summary!}
            character={w.character!}
            newLevel={w.newLevel}
            classData={w.classData}
            hpMethod={w.hpMethod}
            hpRolled={w.hpRolled}
            hpGainTotal={w.hpGainTotal}
            newMaxHP={w.newMaxHP}
            conMod={w.conMod}
            fixedHP={w.fixedHP}
            profChanged={w.profChanged}
            newProfBonus={w.newProfBonus}
            oldProfBonus={w.oldProfBonus}
            asiPoints={w.asiPoints}
            totalASIUsed={w.totalASIUsed}
            subclassName={w.subclassName}
            newCantrips={w.newCantrips}
            newSpells={w.newSpells}
            newSpellbook={w.newSpellbook}
            wantsToSwap={w.wantsToSwap}
            swapOldSpell={w.swapOldSpell}
            swapNewSpell={w.swapNewSpell}
            selectedMetamagic={w.selectedMetamagic}
            selectedSubclassId={w.selectedSubclassId}
            isCustomSubclass={w.isCustomSubclass}
            featureChoices={w.featureChoices}
          />
        );
      default:
        return null;
    }
  };

  // ─── Main render ───────────────────────────────────────────────────

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: colors.bgSecondary }}
      >
        <LinearGradient
          colors={[
            colors.gradientMain[0],
            colors.gradientMain[1],
            colors.gradientMain[2],
          ]}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />

        {/* Header */}
        <View
          style={{
            paddingTop: Platform.OS === "ios" ? 56 : 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          {/* Close & title */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 16,
            }}
          >
            <TouchableOpacity
              onPress={onClose}
              activeOpacity={0.7}
              style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                backgroundColor: colors.headerButtonBg,
                borderWidth: 1,
                borderColor: colors.headerButtonBorder,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  color: colors.accentGold,
                  fontSize: 17,
                  fontWeight: "800",
                  letterSpacing: 0.5,
                }}
              >
                Subir de Nivel
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 12,
                  fontWeight: "500",
                }}
              >
                {w.character.nombre} · {w.classData?.nombre}
              </Text>
            </View>

            {/* Spacer */}
            <View style={{ width: 36 }} />
          </View>

          {/* Step indicator */}
          <View
            style={{
              flexDirection: "row",
              gap: 4,
              alignItems: "center",
            }}
          >
            {w.steps.map((step, index) => {
              const isActive = index === w.currentStepIndex;
              const isDone = index < w.currentStepIndex;

              return (
                <View key={step.id} style={{ flex: 1, alignItems: "center" }}>
                  <View
                    style={{
                      height: 4,
                      width: "100%",
                      borderRadius: 2,
                      backgroundColor: isDone
                        ? colors.accentGold
                        : isActive
                          ? "rgba(251, 191, 36, 0.5)"
                          : colors.borderSeparator,
                    }}
                  />
                  {isActive && (
                    <Text
                      style={{
                        color: colors.accentGold,
                        fontSize: 10,
                        fontWeight: "700",
                        marginTop: 4,
                        textTransform: "uppercase",
                        letterSpacing: 0.5,
                      }}
                      numberOfLines={1}
                    >
                      {step.title}
                    </Text>
                  )}
                </View>
              );
            })}
          </View>
        </View>

        {/* Step content */}
        <Animated.View
          style={{
            flex: 1,
            paddingHorizontal: 20,
            opacity: w.fadeAnim,
            transform: [{ translateY: w.slideAnim }],
          }}
        >
          {/* Step title */}
          {w.currentStep && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <View
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  backgroundColor: "rgba(251, 191, 36, 0.12)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons
                  name={w.currentStep.icon}
                  size={18}
                  color={colors.accentGold}
                />
              </View>
              <Text
                style={{
                  color: colors.textPrimary,
                  fontSize: 20,
                  fontWeight: "800",
                }}
              >
                {w.currentStep.title}
              </Text>
            </View>
          )}

          {renderStepContent()}
        </Animated.View>

        {/* Footer buttons */}
        <View
          style={{
            flexDirection: "row",
            paddingHorizontal: 20,
            paddingBottom: Platform.OS === "ios" ? 34 : 20,
            paddingTop: 12,
            gap: 12,
            borderTopWidth: 1,
            borderTopColor: colors.borderSeparator,
          }}
        >
          <TouchableOpacity
            onPress={w.goBack}
            activeOpacity={0.7}
            style={{
              flex: 1,
              paddingVertical: 14,
              borderRadius: 14,
              backgroundColor: colors.borderSeparator,
              borderWidth: 1,
              borderColor: colors.borderDefault,
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "row",
              gap: 6,
            }}
          >
            <Ionicons
              name={w.isFirstStep ? "close-outline" : "arrow-back-outline"}
              size={18}
              color={colors.textSecondary}
            />
            <Text
              style={{
                color: colors.textSecondary,
                fontSize: 15,
                fontWeight: "600",
              }}
            >
              {w.isFirstStep ? "Cancelar" : "Atrás"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={w.goNext}
            disabled={!w.canProceed() || w.isProcessing}
            activeOpacity={0.8}
            style={{
              flex: 2,
              borderRadius: 14,
              overflow: "hidden",
              opacity: w.canProceed() && !w.isProcessing ? 1 : 0.5,
            }}
          >
            <LinearGradient
              colors={
                w.isLastStep
                  ? [colors.accentGreen, "#16a34a"]
                  : [colors.accentAmber, "#d97706"]
              }
              style={{
                paddingVertical: 14,
                alignItems: "center",
                justifyContent: "center",
                flexDirection: "row",
                gap: 8,
              }}
            >
              {w.isProcessing ? (
                <Text
                  style={{
                    color: colors.textInverted,
                    fontSize: 15,
                    fontWeight: "700",
                  }}
                >
                  Aplicando...
                </Text>
              ) : (
                <>
                  <Text
                    style={{
                      color: colors.textInverted,
                      fontSize: 15,
                      fontWeight: "700",
                    }}
                  >
                    {w.isLastStep ? "¡Confirmar Nivel!" : "Siguiente"}
                  </Text>
                  <Ionicons
                    name={
                      w.isLastStep ? "checkmark-circle" : "arrow-forward"
                    }
                    size={18}
                    color={colors.textInverted}
                  />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
