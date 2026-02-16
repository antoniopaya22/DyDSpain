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

import { useCallback, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  StyleSheet,
  Platform,
  Animated,
  Easing,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  useSettingsStore,
  APP_INFO,
  type ThemeMode,
  type UnitSystem,
} from "@/stores/settingsStore";
import { clearAll } from "@/utils/storage";
import { ConfirmDialog, Toast, WebTransition } from "@/components/ui";
import { useDialog, useToast, useWebTransition } from "@/hooks/useDialog";
import { useTheme } from "@/hooks/useTheme";

// ─── Theme options ───────────────────────────────────────────────────

const THEME_OPTIONS: { value: ThemeMode; label: string; icon: string }[] = [
  { value: "oscuro", label: "Oscuro", icon: "moon" },
  { value: "claro", label: "Claro", icon: "sunny" },
  { value: "auto", label: "Automático", icon: "phone-portrait-outline" },
];

const UNIT_OPTIONS: { value: UnitSystem; label: string; desc: string }[] = [
  { value: "imperial", label: "Imperial", desc: "Pies, libras" },
  { value: "metrico", label: "Métrico", desc: "Metros, kilogramos" },
];

// ─── Component ───────────────────────────────────────────────────────

export default function SettingsScreen() {
  const router = useRouter();
  const { colors, isDark, mode } = useTheme();
  const {
    settings,
    loading,
    loaded,
    loadSettings,
    setTheme,
    setUnits,
    toggleOptionalRule,
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

  // ── Section Renderers ──

  const renderSectionHeader = (
    id: string,
    title: string,
    icon: keyof typeof Ionicons.glyphMap,
    iconColor: string,
  ) => {
    const isExpanded = expandedSection === id;
    return (
      <TouchableOpacity
        onPress={() => toggleSection(id)}
        style={styles.sectionHeader}
        activeOpacity={0.7}
      >
        <View style={styles.sectionHeaderLeft}>
          <View
            style={[
              styles.sectionIcon,
              { backgroundColor: iconColor + colors.iconBgAlpha },
            ]}
          >
            <Ionicons name={icon} size={20} color={iconColor} />
          </View>
          <Text
            style={[styles.sectionTitle, { color: colors.sectionTitleColor }]}
          >
            {title}
          </Text>
        </View>
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={20}
          color={colors.chevronColor}
        />
      </TouchableOpacity>
    );
  };

  const renderThemeSection = () => (
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      <Text
        style={[styles.sectionDescription, { color: colors.sectionDescColor }]}
      >
        Elige el tema visual de la aplicación.
        {settings.tema === "auto" &&
          `\nModo actual: ${mode === "oscuro" ? "Oscuro" : "Claro"} (del sistema)`}
      </Text>
      <View style={styles.optionGroup}>
        {THEME_OPTIONS.map((opt) => {
          const isSelected = settings.tema === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setTheme(opt.value)}
              style={[
                styles.themeOption,
                {
                  backgroundColor: colors.optionBg,
                  borderColor: colors.optionBorder,
                },
                isSelected && {
                  backgroundColor: colors.optionSelectedBg,
                  borderColor: colors.optionSelectedBorder,
                },
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={opt.icon as keyof typeof Ionicons.glyphMap}
                size={22}
                color={isSelected ? colors.accentGold : colors.chevronColor}
              />
              <Text
                style={[
                  styles.themeOptionLabel,
                  { color: colors.textSecondary },
                  isSelected && { color: colors.accentGold },
                ]}
              >
                {opt.label}
              </Text>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color={colors.accentGold}
                  style={{ marginLeft: 4 }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderRulesSection = () => {
    const rules: {
      key: keyof typeof settings.reglasOpcionales;
      label: string;
      desc: string;
    }[] = [
      {
        key: "dotesActivas",
        label: "Dotes (Feats)",
        desc: "Permite elegir dotes en lugar de ASI al subir de nivel.",
      },
      {
        key: "multiclase",
        label: "Multiclase",
        desc: "Permite subir de nivel en una clase diferente.",
      },
      {
        key: "pvFijos",
        label: "PV fijos al subir de nivel",
        desc: "Usa el valor fijo del dado en lugar de tirar.",
      },
      {
        key: "compraPuntos",
        label: "Compra de puntos",
        desc: "Habilita el sistema de compra de puntos de característica en la creación.",
      },
      {
        key: "encumbranceDetallada",
        label: "Carga detallada",
        desc: "Aplica reglas de carga y peso estrictas.",
      },
    ];

    return (
      <View
        style={[
          styles.sectionContent,
          { borderTopColor: colors.borderSeparator },
        ]}
      >
        <Text
          style={[
            styles.sectionDescription,
            { color: colors.sectionDescColor },
          ]}
        >
          Activa o desactiva reglas opcionales de D&D 5e. Estos ajustes se
          aplican a todos los personajes.
        </Text>

        {rules.map((rule) => (
          <View
            key={rule.key}
            style={[
              styles.ruleRow,
              { borderBottomColor: colors.borderSeparator },
            ]}
          >
            <View style={styles.ruleInfo}>
              <Text style={[styles.ruleLabel, { color: colors.textPrimary }]}>
                {rule.label}
              </Text>
              <Text style={[styles.ruleDesc, { color: colors.textMuted }]}>
                {rule.desc}
              </Text>
            </View>
            <Switch
              value={settings.reglasOpcionales[rule.key]}
              onValueChange={() => toggleOptionalRule(rule.key)}
              trackColor={{
                false: colors.switchTrackOff,
                true: colors.switchTrackOn,
              }}
              thumbColor={
                settings.reglasOpcionales[rule.key]
                  ? colors.switchThumbOn
                  : colors.switchThumbOff
              }
            />
          </View>
        ))}

        <TouchableOpacity
          onPress={handleResetRules}
          style={[
            styles.resetButton,
            {
              backgroundColor: colors.optionBg,
              borderColor: colors.optionBorder,
            },
          ]}
        >
          <Ionicons name="refresh" size={16} color={colors.sectionDescColor} />
          <Text
            style={[styles.resetButtonText, { color: colors.sectionDescColor }]}
          >
            Restablecer reglas por defecto
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const renderUnitsSection = () => (
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      <Text
        style={[styles.sectionDescription, { color: colors.sectionDescColor }]}
      >
        Los datos se almacenan en imperial (estándar de D&D). La conversión es
        solo visual.
      </Text>
      <View style={styles.optionGroup}>
        {UNIT_OPTIONS.map((opt) => {
          const isSelected = settings.unidades === opt.value;
          return (
            <TouchableOpacity
              key={opt.value}
              onPress={() => setUnits(opt.value)}
              style={[
                styles.unitOption,
                {
                  backgroundColor: colors.optionBg,
                  borderColor: colors.optionBorder,
                },
                isSelected && {
                  borderColor: `${colors.accentGreen}66`,
                  backgroundColor: `${colors.accentGreen}14`,
                },
              ]}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.unitLabel,
                    { color: colors.sectionDescColor },
                    isSelected && { color: colors.accentGreen },
                  ]}
                >
                  {opt.label}
                </Text>
                <Text style={[styles.unitDesc, { color: colors.textMuted }]}>
                  {opt.desc}
                </Text>
              </View>
              {isSelected && (
                <Ionicons
                  name="checkmark-circle"
                  size={22}
                  color={colors.accentGreen}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderDataSection = () => (
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      <Text
        style={[styles.sectionDescription, { color: colors.sectionDescColor }]}
      >
        Gestiona los datos almacenados en la aplicación.
      </Text>

      <TouchableOpacity
        onPress={handleDeleteAllData}
        style={[
          styles.dangerButton,
          {
            backgroundColor: colors.dangerBg,
            borderColor: colors.dangerBorder,
          },
        ]}
        activeOpacity={0.7}
      >
        <Ionicons name="trash" size={20} color={colors.dangerText} />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text
            style={[styles.dangerButtonTitle, { color: colors.dangerText }]}
          >
            Borrar todos los datos
          </Text>
          <Text
            style={[styles.dangerButtonDesc, { color: colors.dangerTextMuted }]}
          >
            Elimina personajes, partidas, notas y configuración
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color={colors.dangerText} />
      </TouchableOpacity>
    </View>
  );

  const renderAboutSection = () => (
    <View
      style={[
        styles.sectionContent,
        { borderTopColor: colors.borderSeparator },
      ]}
    >
      {/* App info */}
      <View
        style={[
          styles.aboutBlock,
          { borderBottomColor: colors.borderSeparator },
        ]}
      >
        <Text style={[styles.aboutAppName, { color: colors.accentGold }]}>
          {APP_INFO.nombre}
        </Text>
        <Text style={[styles.aboutVersion, { color: colors.sectionDescColor }]}>
          Versión {APP_INFO.version}
        </Text>
        <Text style={[styles.aboutDesc, { color: colors.textSecondary }]}>
          {APP_INFO.descripcion}
        </Text>
      </View>

      {/* License */}
      <View
        style={[
          styles.aboutBlock,
          { borderBottomColor: colors.borderSeparator },
        ]}
      >
        <Text style={[styles.aboutSubtitle, { color: colors.textPrimary }]}>
          📜 Licencia SRD
        </Text>
        <Text style={[styles.aboutText, { color: colors.sectionDescColor }]}>
          {APP_INFO.licenciaSRD}
        </Text>
        <TouchableOpacity onPress={handleOpenSRDLink} style={styles.link}>
          <Ionicons name="open-outline" size={14} color={colors.accentBlue} />
          <Text style={[styles.linkText, { color: colors.accentBlue }]}>
            SRD 5.1 en Español
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tech */}
      <View
        style={[
          styles.aboutBlock,
          { borderBottomColor: colors.borderSeparator },
        ]}
      >
        <Text style={[styles.aboutSubtitle, { color: colors.textPrimary }]}>
          🛠️ Tecnologías
        </Text>
        <View style={styles.techGrid}>
          {APP_INFO.tecnologias.map((tech) => (
            <View
              key={tech}
              style={[
                styles.techBadge,
                {
                  backgroundColor: colors.chipBg,
                  borderColor: colors.chipBorder,
                },
              ]}
            >
              <Text style={[styles.techBadgeText, { color: colors.chipText }]}>
                {tech}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Credits */}
      <View style={[styles.aboutBlock, { borderBottomWidth: 0 }]}>
        <Text style={[styles.aboutSubtitle, { color: colors.textPrimary }]}>
          👤 Créditos
        </Text>
        <Text style={[styles.aboutText, { color: colors.sectionDescColor }]}>
          Desarrollado por {APP_INFO.desarrollador}
        </Text>
      </View>
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
              D&D Español
            </Text>
            <Text
              style={[styles.headerTitle, { color: colors.headerTitleColor }]}
            >
              Ajustes
            </Text>
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

      {/* Content */}
      <Animated.View style={{ flex: 1, opacity: contentFade }}>
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Apariencia */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {renderSectionHeader(
              "apariencia",
              "Apariencia",
              "color-palette",
              colors.accentPurple,
            )}
            {expandedSection === "apariencia" && renderThemeSection()}
          </View>

          {/* Reglas opcionales */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {renderSectionHeader(
              "reglas",
              "Reglas de Juego",
              "game-controller",
              colors.accentAmber,
            )}
            {expandedSection === "reglas" && renderRulesSection()}
          </View>

          {/* Unidades */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {renderSectionHeader(
              "unidades",
              "Unidades de Medida",
              "resize",
              colors.accentGreen,
            )}
            {expandedSection === "unidades" && renderUnitsSection()}
          </View>

          {/* Datos */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {renderSectionHeader("datos", "Datos", "server", colors.accentBlue)}
            {expandedSection === "datos" && renderDataSection()}
          </View>

          {/* Acerca de */}
          <View
            style={[
              styles.section,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {renderSectionHeader(
              "acerca",
              "Acerca de",
              "information-circle",
              colors.textSecondary,
            )}
            {expandedSection === "acerca" && renderAboutSection()}
          </View>
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
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 16,
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

  // ── Sections ──
  section: {
    marginHorizontal: 16,
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
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  sectionHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  sectionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderTopWidth: 1,
  },
  sectionDescription: {
    fontSize: 13,
    lineHeight: 19,
    marginTop: 8,
    marginBottom: 12,
  },

  // ── Theme options ──
  optionGroup: {
    gap: 8,
  },
  themeOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  themeOptionSelected: {
    borderColor: "rgba(251,191,36,0.4)",
    backgroundColor: "rgba(251,191,36,0.08)",
  },
  themeOptionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 12,
    flex: 1,
  },
  themeOptionLabelSelected: {},

  // ── Rules ──
  ruleRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(58,58,92,0.35)",
  },
  ruleInfo: {
    flex: 1,
    marginRight: 12,
  },
  ruleLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  ruleDesc: {
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  resetButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    marginTop: 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  resetButtonText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },

  // ── Units ──
  unitOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  unitOptionSelected: {
    borderColor: "rgba(34,197,94,0.4)",
    backgroundColor: "rgba(34,197,94,0.08)",
  },
  unitLabel: {
    fontSize: 15,
    fontWeight: "600",
  },
  unitLabelSelected: {},
  unitDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // ── Data ──
  dangerButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(239,68,68,0.06)",
    borderWidth: 1,
    borderColor: "rgba(239,68,68,0.18)",
  },
  dangerButtonTitle: {
    fontSize: 15,
    fontWeight: "bold",
  },
  dangerButtonDesc: {
    fontSize: 12,
    marginTop: 2,
  },

  // ── About ──
  aboutBlock: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(58,58,92,0.35)",
  },
  aboutAppName: {
    fontSize: 18,
    fontWeight: "800",
    letterSpacing: -0.2,
  },
  aboutVersion: {
    fontSize: 13,
    marginTop: 2,
  },
  aboutDesc: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 8,
  },
  aboutSubtitle: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 8,
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 19,
  },
  link: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  linkText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
    textDecorationLine: "underline",
  },
  techGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  techBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  techBadgeText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
