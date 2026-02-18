/**
 * Settings Screen (HU-14)
 *
 * Sections:
 * - Apariencia (tema claro/oscuro/auto)
 * - Juego (reglas opcionales)
 * - Unidades de medida
 * - Datos (borrar datos)
 * - Acerca de
 */

import { useCallback, useState } from "react";
import { ScrollView, Animated } from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { useSettingsStore, APP_INFO } from "@/stores/settingsStore";
import { clearAll } from "@/utils/storage";
import {
  ConfirmDialog,
  Toast,
  WebTransition,
  ScreenContainer,
  PageHeader,
  CollapsibleCard,
} from "@/components/ui";
import { useWebTransition, useTheme, useDialog, useToast, useEntranceAnimation } from "@/hooks";

import {
  ThemeSection,
  RulesSection,
  UnitsSection,
  DataSection,
  AboutSection,
} from "@/components/settings";

// ─── Component ───────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const {
    loaded,
    loadSettings,
    resetOptionalRules,
    resetAllSettings,
  } = useSettingsStore();

  const [expandedSection, setExpandedSection] = useState<string | null>(
    "apariencia",
  );

  // ── Dialog, Toast & Web Transition hooks ──
  const { dialogProps, showDestructive, showConfirm, showSuccess, showError } =
    useDialog();
  const {
    toastProps,
    showSuccess: toastSuccess,
    showError: toastError,
  } = useToast();
  const { webTransitionProps, openUrl } = useWebTransition();

  useFocusEffect(
    useCallback(() => {
      if (!loaded) {
        loadSettings();
      }
    }, [loaded, loadSettings]),
  );

  const toggleSection = (section: string) => {
    setExpandedSection((prev) => (prev === section ? null : section));
  };

  // ── Handlers ──

  const handleResetRules = () => {
    showConfirm(
      "Restablecer reglas",
      "¿Volver a las reglas opcionales por defecto?",
      () => {
        resetOptionalRules();
        toastSuccess(
          "Reglas restablecidas",
          "Configuración por defecto aplicada",
        );
      },
      { confirmText: "Restablecer", cancelText: "Cancelar", type: "warning" },
    );
  };

  const handleDeleteAllData = () => {
    showDestructive(
      "Borrar TODOS los datos",
      "Se eliminarán todos los personajes, partidas, notas y configuración de forma permanente.\n\n¿Estás completamente seguro?",
      () => {
        // Second confirmation via another dialog
        showDestructive(
          "Confirmación final",
          "Esta acción NO se puede deshacer. Todos tus datos se perderán para siempre.",
          async () => {
            try {
              await clearAll();
              await resetAllSettings();
              showSuccess(
                "Datos borrados",
                "Todos los datos han sido eliminados correctamente.",
                () => router.replace("/"),
              );
            } catch {
              showError("Error", "No se pudieron borrar todos los datos.");
            }
          },
          { confirmText: "CONFIRMAR BORRADO", cancelText: "Cancelar" },
        );
      },
      { confirmText: "Borrar todo", cancelText: "Cancelar" },
    );
  };

  const handleOpenSRDLink = () => {
    openUrl(APP_INFO.enlaceSRD, {
      label: "SRD 5.1 en Español",
      accentColor: colors.accentBlue,
    });
  };

  // ── Entrance animation ──
  const { opacity: contentFade } = useEntranceAnimation({ delay: 120 });

  return (
    <ScreenContainer>
      {/* Header */}
      <PageHeader title="Ajustes" onBack={() => router.back()} />

      {/* Content */}
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Apariencia */}
          <CollapsibleCard
            id="apariencia"
            title="Apariencia"
            icon="color-palette"
            iconColor={colors.accentPurple}
            isExpanded={expandedSection === "apariencia"}
            onToggle={() => toggleSection("apariencia")}
          >
            <ThemeSection />
          </CollapsibleCard>

          {/* Reglas opcionales */}
          <CollapsibleCard
            id="reglas"
            title="Reglas de Juego"
            icon="game-controller"
            iconColor={colors.accentAmber}
            isExpanded={expandedSection === "reglas"}
            onToggle={() => toggleSection("reglas")}
          >
            <RulesSection onResetRules={handleResetRules} />
          </CollapsibleCard>

          {/* Unidades */}
          <CollapsibleCard
            id="unidades"
            title="Unidades de Medida"
            icon="resize"
            iconColor={colors.accentGreen}
            isExpanded={expandedSection === "unidades"}
            onToggle={() => toggleSection("unidades")}
          >
            <UnitsSection />
          </CollapsibleCard>

          {/* Datos */}
          <CollapsibleCard
            id="datos"
            title="Datos"
            icon="server"
            iconColor={colors.accentBlue}
            isExpanded={expandedSection === "datos"}
            onToggle={() => toggleSection("datos")}
          >
            <DataSection onDeleteAll={handleDeleteAllData} />
          </CollapsibleCard>

          {/* Acerca de */}
          <CollapsibleCard
            id="acerca"
            title="Acerca de"
            icon="information-circle"
            iconColor={colors.textSecondary}
            isExpanded={expandedSection === "acerca"}
            onToggle={() => toggleSection("acerca")}
          >
            <AboutSection onOpenSRDLink={handleOpenSRDLink} />
          </CollapsibleCard>
        </ScrollView>
      </Animated.View>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />

      {/* Web transition overlay */}
      <WebTransition
        {...webTransitionProps}
        onError={() => toastError("No se pudo abrir el enlace")}
      />
    </ScreenContainer>
  );
}
