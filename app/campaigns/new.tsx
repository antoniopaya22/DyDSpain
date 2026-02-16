import { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Easing,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as ImagePicker from "expo-image-picker";
import { useCampaignStore } from "@/stores/campaignStore";
import { ConfirmDialog, Toast } from "@/components/ui";
import { useDialog, useToast } from "@/hooks/useDialog";
import { useTheme } from "@/hooks/useTheme";

export default function NewCampaignScreen() {
  const router = useRouter();
  const { colors, isDark } = useTheme();
  const { createCampaign } = useCampaignStore();

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState<string | undefined>(undefined);
  const [saving, setSaving] = useState(false);

  const { dialogProps, showAlert, showDestructive } = useDialog();
  const { toastProps, showError: toastError } = useToast();

  const isValid = nombre.trim().length > 0;

  const handlePickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      showAlert(
        "Permiso necesario",
        "Necesitamos acceso a tu galería para seleccionar una imagen.",
        { type: "warning" },
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.7,
    });

    if (!result.canceled && result.assets[0]) {
      setImagen(result.assets[0].uri);
    }
  };

  const handleRemoveImage = () => {
    setImagen(undefined);
  };

  const handleCreate = async () => {
    if (!isValid || saving) return;

    setSaving(true);
    try {
      const campaign = await createCampaign({
        nombre: nombre.trim(),
        descripcion: descripcion.trim() || undefined,
        imagen,
      });
      router.replace(`/campaigns/${campaign.id}`);
    } catch (error) {
      toastError("No se pudo crear la partida", "Inténtalo de nuevo");
    } finally {
      setSaving(false);
    }
  };

  const handleGoBack = () => {
    if (nombre.trim().length > 0 || descripcion.trim().length > 0) {
      showDestructive(
        "Descartar cambios",
        "¿Estás seguro de que quieres salir? Se perderán los datos introducidos.",
        () => router.back(),
        { confirmText: "Descartar", cancelText: "Seguir editando" },
      );
    } else {
      router.back();
    }
  };

  // ── Entrance animations ──
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerSlide = useRef(new Animated.Value(16)).current;
  const formFade = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(20)).current;
  const infoFade = useRef(new Animated.Value(0)).current;
  const buttonFade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(100, [
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
      Animated.parallel([
        Animated.timing(formFade, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(formSlide, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(infoFade, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(buttonFade, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [headerFade, headerSlide, formFade, formSlide, infoFade, buttonFade]);

  return (
    <KeyboardAvoidingView
      style={newStyles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      {/* Full background gradient */}
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 50 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <Animated.View
          style={[
            newStyles.header,
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

          <View style={newStyles.headerRow}>
            <TouchableOpacity
              style={[
                newStyles.backButton,
                {
                  backgroundColor: colors.headerButtonBg,
                  borderColor: colors.headerButtonBorder,
                },
              ]}
              onPress={handleGoBack}
              activeOpacity={0.7}
            >
              <Ionicons
                name="arrow-back"
                size={20}
                color={colors.textPrimary}
              />
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  newStyles.headerLabel,
                  {
                    color: colors.headerLabelColor,
                    textShadowColor: colors.accentGoldGlow,
                  },
                ]}
              >
                Nueva campaña
              </Text>
              <Text
                style={[
                  newStyles.headerTitle,
                  { color: colors.headerTitleColor },
                ]}
              >
                Nueva Partida
              </Text>
            </View>
          </View>

          <Text
            style={[
              newStyles.headerDescription,
              { color: colors.sectionDescColor },
            ]}
          >
            Crea una nueva campaña para empezar tu aventura. Después podrás
            crear un personaje dentro de ella.
          </Text>

          {/* Bottom border gradient */}
          <View style={newStyles.headerBorder}>
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

        {/* ── Form ── */}
        <Animated.View
          style={[
            newStyles.formContainer,
            {
              opacity: formFade,
              transform: [{ translateY: formSlide }],
            },
          ]}
        >
          {/* Imagen de la partida */}
          <View style={newStyles.fieldGroup}>
            <Text
              style={[newStyles.fieldLabel, { color: colors.textSecondary }]}
            >
              Imagen{" "}
              <Text
                style={[
                  newStyles.fieldLabelOptional,
                  { color: colors.textMuted },
                ]}
              >
                (opcional)
              </Text>
            </Text>

            {imagen ? (
              <View
                style={[
                  newStyles.imagePreview,
                  { borderColor: colors.borderDefault },
                ]}
              >
                <LinearGradient
                  colors={[colors.bgSecondary, colors.bgPrimary]}
                  style={newStyles.imagePreviewInner}
                >
                  <Ionicons name="image" size={56} color={colors.textMuted} />
                  <Text
                    style={[
                      newStyles.imagePreviewText,
                      { color: colors.textMuted },
                    ]}
                  >
                    Imagen seleccionada
                  </Text>
                </LinearGradient>
                <TouchableOpacity
                  style={newStyles.imageRemoveButton}
                  onPress={handleRemoveImage}
                  activeOpacity={0.7}
                >
                  <Ionicons name="close" size={16} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  newStyles.imagePickerButton,
                  {
                    borderColor: colors.borderDefault,
                    backgroundColor: colors.bgSubtle,
                  },
                ]}
                onPress={handlePickImage}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    newStyles.imagePickerIconBg,
                    {
                      backgroundColor: colors.optionBg,
                      borderColor: colors.optionBorder,
                    },
                  ]}
                >
                  <Ionicons
                    name="image-outline"
                    size={28}
                    color={colors.textMuted}
                  />
                </View>
                <Text
                  style={[
                    newStyles.imagePickerText,
                    { color: colors.textMuted },
                  ]}
                >
                  Pulsa para elegir una imagen
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Nombre de la partida */}
          <View style={newStyles.fieldGroup}>
            <Text
              style={[newStyles.fieldLabel, { color: colors.textSecondary }]}
            >
              Nombre de la partida{" "}
              <Text
                style={[
                  newStyles.fieldLabelRequired,
                  { color: colors.accentRed },
                ]}
              >
                *
              </Text>
            </Text>
            <View
              style={[
                newStyles.inputContainer,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: colors.borderDefault,
                },
              ]}
            >
              <Ionicons
                name="text-outline"
                size={18}
                color={colors.textMuted}
                style={{ marginRight: 10 }}
              />
              <TextInput
                style={[newStyles.input, { color: colors.textPrimary }]}
                placeholder="Ej: Las Minas Perdidas de Phandelver"
                placeholderTextColor={colors.textMuted}
                value={nombre}
                onChangeText={setNombre}
                maxLength={100}
                autoFocus
                returnKeyType="next"
              />
            </View>
            <View
              style={[
                newStyles.fieldCounter,
                { backgroundColor: colors.borderSubtle },
              ]}
            >
              <View
                style={[
                  newStyles.fieldCounterBar,
                  { width: `${(nombre.length / 100) * 100}%` },
                ]}
              />
            </View>
            <Text
              style={[newStyles.fieldCounterText, { color: colors.textMuted }]}
            >
              {nombre.length}/100
            </Text>
          </View>

          {/* Descripción */}
          <View style={newStyles.fieldGroup}>
            <Text
              style={[newStyles.fieldLabel, { color: colors.textSecondary }]}
            >
              Descripción{" "}
              <Text
                style={[
                  newStyles.fieldLabelOptional,
                  { color: colors.textMuted },
                ]}
              >
                (opcional)
              </Text>
            </Text>
            <View
              style={[
                newStyles.inputContainer,
                newStyles.textareaContainer,
                {
                  backgroundColor: colors.bgInput,
                  borderColor: colors.borderDefault,
                },
              ]}
            >
              <TextInput
                style={[
                  newStyles.input,
                  newStyles.textarea,
                  { color: colors.textPrimary },
                ]}
                placeholder="Añade una descripción o notas sobre la campaña..."
                placeholderTextColor={colors.textMuted}
                value={descripcion}
                onChangeText={setDescripcion}
                multiline
                numberOfLines={5}
                maxLength={500}
                textAlignVertical="top"
                returnKeyType="default"
              />
            </View>
            <View
              style={[
                newStyles.fieldCounter,
                { backgroundColor: colors.borderSubtle },
              ]}
            >
              <View
                style={[
                  newStyles.fieldCounterBar,
                  {
                    width: `${(descripcion.length / 500) * 100}%`,
                    backgroundColor:
                      descripcion.length > 450
                        ? colors.accentOrange
                        : "rgba(198,40,40,0.5)",
                  },
                ]}
              />
            </View>
            <Text
              style={[newStyles.fieldCounterText, { color: colors.textMuted }]}
            >
              {descripcion.length}/500
            </Text>
          </View>
        </Animated.View>

        {/* ── Info Card ── */}
        <Animated.View
          style={[newStyles.infoCardContainer, { opacity: infoFade }]}
        >
          <View
            style={[
              newStyles.infoCard,
              {
                backgroundColor: colors.bgCard,
                borderColor: colors.borderDefault,
              },
            ]}
          >
            {/* Subtle gradient overlay */}
            <LinearGradient
              colors={["rgba(251,191,36,0.04)", "rgba(251,191,36,0)"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={StyleSheet.absoluteFill}
            />

            {/* Left accent */}
            <View style={newStyles.infoCardAccent}>
              <LinearGradient
                colors={[
                  colors.accentGold,
                  colors.accentGold + "66",
                  colors.accentGold + "22",
                ]}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
                style={{ flex: 1, width: "100%" }}
              />
            </View>

            <View style={newStyles.infoCardContent}>
              <View style={newStyles.infoCardHeader}>
                <View
                  style={[
                    newStyles.infoCardIconBg,
                    { backgroundColor: colors.accentGoldGlow },
                  ]}
                >
                  <Ionicons
                    name="sparkles"
                    size={16}
                    color={colors.accentGold}
                  />
                </View>
                <Text
                  style={[
                    newStyles.infoCardTitle,
                    { color: colors.textPrimary },
                  ]}
                >
                  Siguiente paso
                </Text>
              </View>
              <Text
                style={[
                  newStyles.infoCardText,
                  { color: colors.textSecondary },
                ]}
              >
                Una vez creada la partida, podrás crear un personaje de D&D 5e
                paso a paso: elegir raza, clase, estadísticas, habilidades,
                equipamiento y más.
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* ── Buttons ── */}
        <Animated.View
          style={[newStyles.buttonsContainer, { opacity: buttonFade }]}
        >
          {/* Create button */}
          <TouchableOpacity
            style={[
              newStyles.createButton,
              (!isValid || saving) && newStyles.createButtonDisabled,
            ]}
            onPress={handleCreate}
            disabled={!isValid || saving}
            activeOpacity={0.85}
          >
            <LinearGradient
              colors={
                isValid && !saving
                  ? ["#d32f2f", colors.accentRed, "#a51c1c"]
                  : isDark
                    ? [colors.bgElevated, colors.bgCard, colors.bgSecondary]
                    : ["#c0c0d8", "#b0b0c8", "#a0a0b8"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={newStyles.createButtonGradient}
            >
              {saving ? (
                <Text style={newStyles.createButtonText}>
                  Creando partida...
                </Text>
              ) : (
                <>
                  <Ionicons name="add-circle" size={22} color="white" />
                  <Text style={newStyles.createButtonText}>Crear Partida</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Cancel button */}
          <TouchableOpacity
            style={[
              newStyles.cancelButton,
              {
                backgroundColor: colors.bgSubtle,
                borderColor: colors.borderDefault,
              },
            ]}
            onPress={handleGoBack}
            activeOpacity={0.7}
          >
            <Text
              style={[
                newStyles.cancelButtonText,
                { color: colors.textSecondary },
              ]}
            >
              Cancelar
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* Custom dialog (replaces Alert.alert) */}
      <ConfirmDialog {...dialogProps} />

      {/* Toast notifications */}
      <Toast {...toastProps} />
    </KeyboardAvoidingView>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const newStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  // ── Header ──
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 58 : 48,
    paddingBottom: 18,
    position: "relative",
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  headerLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.3,
  },
  headerDescription: {
    fontSize: 14,
    lineHeight: 21,
  },
  headerBorder: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },

  // ── Form ──
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  fieldGroup: {
    marginBottom: 22,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  fieldLabelRequired: {
    color: "#c62828", // overridden inline via colors.accentRed
    fontWeight: "800",
  },
  fieldLabelOptional: {
    fontWeight: "500",
    textTransform: "lowercase",
    letterSpacing: 0,
    fontSize: 11,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 10,
    borderWidth: 1,
  },
  textareaContainer: {
    alignItems: "flex-start",
    minHeight: 120,
    paddingTop: 14,
  },
  input: {
    flex: 1,
    fontSize: 15,
    fontWeight: "500",
    paddingVertical: 0,
  },
  textarea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  fieldCounter: {
    height: 2,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 1,
    marginTop: 8,
    overflow: "hidden",
  },
  fieldCounterBar: {
    height: "100%",
    backgroundColor: "rgba(198,40,40,0.5)",
    borderRadius: 1,
  },
  fieldCounterText: {
    fontSize: 10,
    fontWeight: "600",
    textAlign: "right",
    marginTop: 4,
  },

  // ── Image Picker ──
  imagePreview: {
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    position: "relative",
  },
  imagePreviewInner: {
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  imagePreviewText: {
    fontSize: 13,
    fontWeight: "500",
    marginTop: 8,
  },
  imageRemoveButton: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerButton: {
    height: 120,
    borderRadius: 14,
    borderWidth: 1.5,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  imagePickerIconBg: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 13,
    fontWeight: "500",
  },

  // ── Info Card ──
  infoCardContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  infoCard: {
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  infoCardAccent: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    overflow: "hidden",
  },
  infoCardContent: {
    padding: 16,
    paddingLeft: 18,
  },
  infoCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  infoCardIconBg: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: "rgba(251,191,36,0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  infoCardTitle: {
    fontSize: 13,
    fontWeight: "700",
  },
  infoCardText: {
    fontSize: 13,
    lineHeight: 19,
  },

  // ── Buttons ──
  buttonsContainer: {
    paddingHorizontal: 20,
  },
  createButton: {
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#c62828", // overridden inline via colors.accentRed
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  createButtonDisabled: {
    shadowOpacity: 0,
    elevation: 0,
    opacity: 0.5,
  },
  createButtonGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
  },
  createButtonText: {
    color: "#ffffff", // overridden inline via colors.textInverted
    fontWeight: "800",
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  cancelButton: {
    marginTop: 10,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
  cancelButtonText: {
    color: "#8c8cb3", // overridden inline via colors.textSecondary
    fontWeight: "600",
    fontSize: 15,
  },
});
