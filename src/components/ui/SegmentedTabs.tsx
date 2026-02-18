/**
 * SegmentedTabs
 *
 * Premium animated tab selector with a sliding indicator, smooth color
 * transitions and scale-on-press micro-interaction.
 *
 * Designed for 2-5 equal-width tabs that fit comfortably on screen.
 *
 * @example
 * <SegmentedTabs
 *   tabs={[
 *     { id: "razas", label: "Razas", icon: "people-outline", iconActive: "people", color: "#f59e0b" },
 *     { id: "clases", label: "Clases", icon: "shield-outline", iconActive: "shield", color: "#ef4444" },
 *   ]}
 *   activeTab="razas"
 *   onTabChange={setActiveTab}
 * />
 */

import React, { useRef, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Easing,
  StyleSheet,
  type LayoutChangeEvent,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks";

// ─── Types ───────────────────────────────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  /** Optional Ionicon for inactive state */
  icon?: keyof typeof Ionicons.glyphMap;
  /** Optional Ionicon for active state (falls back to `icon`) */
  iconActive?: keyof typeof Ionicons.glyphMap;
  /** Accent color when active (defaults to theme accentRed) */
  color?: string;
}

export interface SegmentedTabsProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

// ─── Component ───────────────────────────────────────────────────────

export default function SegmentedTabs({
  tabs,
  activeTab,
  onTabChange,
}: SegmentedTabsProps) {
  const { colors } = useTheme();
  const tabCount = tabs.length;

  // Track the container width so we know each tab's width
  const containerWidth = useRef(0);
  const indicatorX = useRef(new Animated.Value(0)).current;

  // Per-tab animated values
  const bgAnims = useRef(tabs.map(() => new Animated.Value(0))).current;
  const scaleAnims = useRef(tabs.map(() => new Animated.Value(1))).current;

  // ── Slide indicator on tab change ──
  useEffect(() => {
    const idx = tabs.findIndex((t) => t.id === activeTab);
    if (idx < 0) return;

    const tabWidth = containerWidth.current / tabCount;
    Animated.spring(indicatorX, {
      toValue: idx * tabWidth,
      friction: 20,
      tension: 170,
      useNativeDriver: true,
    }).start();

    // Animate backgrounds
    bgAnims.forEach((anim, i) => {
      Animated.timing(anim, {
        toValue: i === idx ? 1 : 0,
        duration: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [activeTab, tabs, tabCount, indicatorX, bgAnims]);

  const handleLayout = useCallback(
    (e: LayoutChangeEvent) => {
      const w = e.nativeEvent.layout.width;
      containerWidth.current = w;
      // Jump indicator to current position without animation
      const idx = tabs.findIndex((t) => t.id === activeTab);
      if (idx >= 0) indicatorX.setValue((idx * w) / tabCount);
    },
    [activeTab, tabs, tabCount, indicatorX],
  );

  const handlePressIn = (idx: number) => {
    Animated.timing(scaleAnims[idx], {
      toValue: 0.92,
      duration: 80,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = (idx: number) => {
    Animated.spring(scaleAnims[idx], {
      toValue: 1,
      friction: 5,
      tension: 200,
      useNativeDriver: true,
    }).start();
  };

  const tabWidth = `${100 / tabCount}%` as const;

  return (
    <View
      style={[
        s.container,
        {
          backgroundColor: colors.bgSubtle,
          borderColor: colors.borderDefault,
        },
      ]}
      onLayout={handleLayout}
    >
      {/* ── Sliding indicator ── */}
      <Animated.View
        style={[
          s.indicator,
          {
            width: tabWidth,
            transform: [{ translateX: indicatorX }],
          },
        ]}
      >
        <LinearGradient
          colors={[
            (tabs.find((t) => t.id === activeTab)?.color ?? colors.accentRed) +
              "22",
            (tabs.find((t) => t.id === activeTab)?.color ?? colors.accentRed) +
              "08",
          ]}
          style={s.indicatorGradient}
        />
        {/* Bottom bar */}
        <View style={s.indicatorBarContainer}>
          <LinearGradient
            colors={[
              "transparent",
              (tabs.find((t) => t.id === activeTab)?.color ??
                colors.accentRed) + "AA",
              tabs.find((t) => t.id === activeTab)?.color ?? colors.accentRed,
              (tabs.find((t) => t.id === activeTab)?.color ??
                colors.accentRed) + "AA",
              "transparent",
            ]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            style={s.indicatorBar}
          />
        </View>
      </Animated.View>

      {/* ── Tab items ── */}
      {tabs.map((tab, idx) => {
        const isActive = activeTab === tab.id;
        const accentColor = tab.color ?? colors.accentRed;

        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => onTabChange(tab.id)}
            onPressIn={() => handlePressIn(idx)}
            onPressOut={() => handlePressOut(idx)}
            activeOpacity={1}
            style={[s.tab, { width: tabWidth }]}
          >
            <Animated.View
              style={[
                s.tabInner,
                { transform: [{ scale: scaleAnims[idx] }] },
              ]}
            >
              {tab.icon && (
                <Ionicons
                  name={
                    isActive ? (tab.iconActive ?? tab.icon) : tab.icon
                  }
                  size={18}
                  color={isActive ? accentColor : colors.textMuted}
                  style={s.tabIcon}
                />
              )}
              <Text
                style={[
                  s.tabLabel,
                  {
                    color: isActive ? accentColor : colors.textMuted,
                    fontWeight: isActive ? "700" : "500",
                  },
                ]}
                numberOfLines={1}
              >
                {tab.label}
              </Text>
              {/* Active dot */}
              {isActive && (
                <View
                  style={[s.activeDot, { backgroundColor: accentColor }]}
                />
              )}
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────

const s = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    overflow: "hidden",
    position: "relative",
  },
  // Sliding highlight behind the active tab
  indicator: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
  },
  indicatorGradient: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 13,
  },
  indicatorBarContainer: {
    position: "absolute",
    bottom: 0,
    left: "15%",
    right: "15%",
    height: 2,
  },
  indicatorBar: {
    flex: 1,
    borderRadius: 1,
  },
  // Individual tab
  tab: {
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  tabInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  tabIcon: {
    marginRight: 6,
  },
  tabLabel: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  activeDot: {
    position: "absolute",
    top: -2,
    right: -8,
    width: 4,
    height: 4,
    borderRadius: 2,
  },
});
