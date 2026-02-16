/**
 * useTheme — Hook that resolves the active theme from user settings + system color scheme.
 *
 * - "oscuro"  → always dark palette
 * - "claro"   → always light palette
 * - "auto"    → follows the device's color scheme (light / dark)
 *
 * Returns:
 *   • `colors`       — the full ThemeColors palette for the resolved mode
 *   • `mode`         — the resolved mode ("claro" | "oscuro"), never "auto"
 *   • `isDark`       — convenience boolean
 *   • `rawSetting`   — the original setting value ("claro" | "oscuro" | "auto")
 *
 * Usage:
 *   const { colors, isDark } = useTheme();
 *   <View style={{ backgroundColor: colors.bgPrimary }} />
 */

import { useColorScheme } from "react-native";
import { useSettingsStore, type ThemeMode } from "@/stores/settingsStore";
import { getThemeColors, type ThemeColors } from "@/utils/theme";

// ─── Resolved mode type (never "auto") ──────────────────────────────

type ResolvedMode = "claro" | "oscuro";

// ─── Return type ─────────────────────────────────────────────────────

export interface UseThemeReturn {
  /** Full color palette for the active theme */
  colors: ThemeColors;
  /** Resolved theme mode — always "claro" or "oscuro" */
  mode: ResolvedMode;
  /** Convenience flag: true when dark theme is active */
  isDark: boolean;
  /** The raw setting value from the store ("claro" | "oscuro" | "auto") */
  rawSetting: ThemeMode;
}

// ─── Hook ────────────────────────────────────────────────────────────

export function useTheme(): UseThemeReturn {
  // Read the user's theme preference from the settings store
  const rawSetting = useSettingsStore((state) => state.settings.tema);

  // Read the device's current color scheme (light | dark | null)
  const systemScheme = useColorScheme();

  // Resolve "auto" to a concrete mode
  let mode: ResolvedMode;

  if (rawSetting === "auto") {
    // If the system reports "light", use claro; otherwise default to oscuro
    mode = systemScheme === "light" ? "claro" : "oscuro";
  } else {
    mode = rawSetting;
  }

  const colors = getThemeColors(mode);
  const isDark = mode === "oscuro";

  return { colors, mode, isDark, rawSetting };
}

export default useTheme;
