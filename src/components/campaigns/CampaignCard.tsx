/**
 * CampaignCard - Animated campaign card with class-themed accent
 *
 * Shows campaign name, description, character status badge, and date.
 * Uses entrance animation with staggered delay based on index.
 * Extracted from app/index.tsx
 */

import { useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme, useEntranceAnimation } from "@/hooks";
import type { Campaign } from "@/types/campaign";

interface CampaignCardProps {
  item: Campaign;
  index: number;
  classTheme: { iconName: string; color: string } | null;
  onPress: () => void;
  onLongPress: () => void;
}

export function CampaignCard({
  item,
  index,
  classTheme,
  onPress,
  onLongPress,
}: CampaignCardProps) {
  const { colors } = useTheme();
  const hasCharacter = !!item.personajeId;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const {
    opacity: entranceAnim,
    translateY,
  } = useEntranceAnimation({
    delay: index * 80,
    duration: 450,
    slide: true,
    distance: 24,
    slideDuration: 500,
  });

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: 120,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const classAccent = hasCharacter && classTheme ? classTheme.color : null;
  const accentColor =
    classAccent ?? (hasCharacter ? colors.accentRed : colors.textMuted);
  const accentColorLight = hasCharacter
    ? `${accentColor}26`
    : `${colors.textMuted}1F`;

  return (
    <Animated.View
      style={{
        opacity: entranceAnim,
        transform: [{ scale: scaleAnim }, { translateY }],
        marginBottom: 14,
        shadowColor: hasCharacter ? accentColor : colors.shadowColor,
        shadowOffset: { width: 0, height: hasCharacter ? 4 : 2 },
        shadowOpacity: hasCharacter ? 0.2 : 0.12,
        shadowRadius: hasCharacter ? 10 : 4,
        elevation: hasCharacter ? 6 : 3,
      }}
    >
      <TouchableOpacity
        onPress={onPress}
        onLongPress={onLongPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        style={[
          styles.card,
          {
            backgroundColor: colors.cardBg,
            borderColor: colors.cardBorder,
          },
        ]}
      >
        {/* Accent left line */}
        <View style={styles.cardAccentLineContainer}>
          <LinearGradient
            colors={[accentColor, `${accentColor}66`, `${accentColor}22`]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={styles.cardAccentLine}
          />
        </View>

        {/* Inner subtle gradient overlay */}
        <View style={StyleSheet.absoluteFill}>
          <LinearGradient
            colors={[
              "rgba(255,255,255,0.025)",
              "rgba(255,255,255,0)",
              "rgba(0,0,0,0.04)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        </View>

        <View style={styles.cardRow}>
          {/* Campaign icon */}
          <View
            style={[styles.cardIcon, { backgroundColor: accentColorLight }]}
          >
            {hasCharacter ? (
              <View style={styles.cardIconInner}>
                <Ionicons
                  name={(classTheme?.iconName as keyof typeof Ionicons.glyphMap) ?? "shield-half-sharp"}
                  size={26}
                  color={accentColor}
                />
                <View style={styles.cardIconSparkle}>
                  <Ionicons
                    name="sparkles"
                    size={10}
                    color={colors.accentGold}
                  />
                </View>
              </View>
            ) : (
              <Ionicons
                name="add-circle-outline"
                size={26}
                color={accentColor}
              />
            )}
          </View>

          {/* Campaign info */}
          <View style={styles.cardInfo}>
            <Text
              style={[styles.cardTitle, { color: colors.cardTitle }]}
              numberOfLines={1}
            >
              {item.nombre}
            </Text>
            {item.descripcion ? (
              <Text
                style={[
                  styles.cardDescription,
                  { color: colors.cardDescription },
                ]}
                numberOfLines={1}
              >
                {item.descripcion}
              </Text>
            ) : null}
            <View style={styles.cardMetaRow}>
              <View
                style={[
                  styles.cardStatusBadge,
                  {
                    backgroundColor: hasCharacter
                      ? `${colors.accentGreen}1F`
                      : `${colors.accentGold}1F`,
                    borderColor: hasCharacter
                      ? `${colors.accentGreen}33`
                      : `${colors.accentGold}33`,
                  },
                ]}
              >
                <View
                  style={[
                    styles.cardStatusDot,
                    {
                      backgroundColor: hasCharacter
                        ? colors.accentGreen
                        : colors.accentGold,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.cardStatusText,
                    {
                      color: hasCharacter
                        ? colors.accentGreen
                        : colors.accentGold,
                    },
                  ]}
                >
                  {hasCharacter ? "Personaje creado" : "Sin personaje"}
                </Text>
              </View>
              <Text style={[styles.cardDateText, { color: colors.textMuted }]}>
                {new Date(item.actualizadoEn).toLocaleDateString("es-ES", {
                  day: "numeric",
                  month: "short",
                })}
              </Text>
            </View>
          </View>

          {/* Chevron */}
          <View
            style={[
              styles.cardChevron,
              { backgroundColor: colors.cardChevronBg },
            ]}
          >
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.chevronColor}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 16,
    paddingLeft: 20,
    overflow: "hidden",
    position: "relative",
  },
  cardAccentLineContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 3.5,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: "hidden",
  },
  cardAccentLine: {
    flex: 1,
    width: "100%",
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardIcon: {
    height: 52,
    width: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    position: "relative",
  },
  cardIconInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  cardIconSparkle: {
    position: "absolute",
    top: -8,
    right: -8,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: -0.2,
  },
  cardDescription: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  cardMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    gap: 8,
  },
  cardStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  cardStatusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginRight: 5,
  },
  cardStatusText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  cardDateText: {
    fontSize: 11,
    fontWeight: "500",
  },
  cardChevron: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
});
