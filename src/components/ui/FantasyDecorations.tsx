/**
 * FantasyDecorations — D&D themed decorative UI components
 *
 * A collection of fantasy/medieval decorative elements to give the app
 * a distinctive D&D personality. Includes:
 *
 * - DragonDivider: A divider with a stylized dragon silhouette
 * - SwordDivider: Crossed swords divider
 * - ShieldFrame: A shield-shaped frame for content
 * - RunicBorder: A border with runic/celtic knot patterns
 * - ParchmentCard: A card with parchment texture feel
 * - TorchGlow: Animated torch-like glow overlay
 * - CastleHeader: Crenellated castle-wall style header border
 * - ScrollBanner: A scroll/ribbon banner for titles
 * - MagicCircle: Animated arcane circle decoration
 */

import { useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ViewStyle,
  TextStyle,
  useWindowDimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useTheme";
import { D20Watermark } from "./D20Icon";
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  RadialGradient,
  Stop,
  Path,
  Circle,
  G,
  Rect,
  Line,
  Text as SvgText,
  Polygon,
  ClipPath,
  Mask,
} from "react-native-svg";

// ═══════════════════════════════════════════════════════════════════════
// ─── Dragon Divider ──────────────────────────────────────────────────
// A horizontal divider featuring a stylized dragon silhouette in the center
// with ornamental lines extending to each side.
// ═══════════════════════════════════════════════════════════════════════

interface DragonDividerProps {
  /** Width of the divider (default: "100%") */
  width?: number | string;
  /** Height of the SVG area (default: 40) */
  height?: number;
  /** Primary color of the dragon and ornaments */
  color?: string;
  /** Secondary color for the lines */
  lineColor?: string;
  /** Facing direction of the dragon */
  facing?: "left" | "right";
  /** Overall spacing above and below */
  spacing?: number;
  /** Custom style */
  style?: ViewStyle;
}

export function DragonDivider({
  width = "100%",
  height = 40,
  color = "#fbbf24",
  lineColor,
  facing = "right",
  spacing = 12,
  style,
}: DragonDividerProps) {
  const lc = lineColor || `${color}55`;
  const flip = facing === "left" ? -1 : 1;
  const svgWidth = 300;
  const svgHeight = 40;
  const cy = svgHeight / 2;

  // A stylized dragon silhouette path (facing right by default)
  // The dragon sits in roughly the center 60px of the 300px viewBox
  const dragonPath = `
    M150,${cy - 2}
    C148,${cy - 8} 142,${cy - 14} 136,${cy - 14}
    C132,${cy - 14} 130,${cy - 11} 128,${cy - 8}
    L126,${cy - 10}
    C124,${cy - 13} 122,${cy - 12} 122,${cy - 9}
    L124,${cy - 6}
    C120,${cy - 2} 118,${cy} 118,${cy + 2}
    C118,${cy + 6} 122,${cy + 10} 128,${cy + 12}
    L132,${cy + 12}
    C130,${cy + 14} 128,${cy + 16} 128,${cy + 16}
    C130,${cy + 16} 134,${cy + 14} 136,${cy + 12}
    C140,${cy + 10} 146,${cy + 6} 150,${cy + 2}
    Z
    M150,${cy - 2}
    C152,${cy - 8} 158,${cy - 14} 164,${cy - 14}
    C168,${cy - 14} 170,${cy - 11} 172,${cy - 8}
    L174,${cy - 10}
    C176,${cy - 13} 178,${cy - 12} 178,${cy - 9}
    L176,${cy - 6}
    C180,${cy - 2} 182,${cy} 182,${cy + 2}
    C182,${cy + 6} 178,${cy + 10} 172,${cy + 12}
    L168,${cy + 12}
    C170,${cy + 14} 172,${cy + 16} 172,${cy + 16}
    C170,${cy + 16} 166,${cy + 14} 164,${cy + 12}
    C160,${cy + 10} 154,${cy + 6} 150,${cy + 2}
    Z
  `;

  // Simplified wing dragon shape (more recognizable)
  const dragonWingPath = `
    M${150 - 18 * flip},${cy}
    C${150 - 15 * flip},${cy - 5} ${150 - 10 * flip},${cy - 10} ${150 - 4 * flip},${cy - 12}
    C${150 + 2 * flip},${cy - 14} ${150 + 8 * flip},${cy - 13} ${150 + 12 * flip},${cy - 10}
    L${150 + 14 * flip},${cy - 8}
    L${150 + 12 * flip},${cy - 5}
    L${150 + 16 * flip},${cy - 6}
    C${150 + 20 * flip},${cy - 7} ${150 + 22 * flip},${cy - 4} ${150 + 18 * flip},${cy}
    C${150 + 22 * flip},${cy + 2} ${150 + 20 * flip},${cy + 6} ${150 + 16 * flip},${cy + 5}
    L${150 + 12 * flip},${cy + 4}
    L${150 + 14 * flip},${cy + 7}
    L${150 + 12 * flip},${cy + 9}
    C${150 + 8 * flip},${cy + 12} ${150 + 2 * flip},${cy + 13} ${150 - 4 * flip},${cy + 11}
    C${150 - 10 * flip},${cy + 9} ${150 - 15 * flip},${cy + 4} ${150 - 18 * flip},${cy}
    Z
  `;

  return (
    <View style={[dividerStyles.container, { marginVertical: spacing }, style]}>
      <Svg
        width={width as any}
        height={height}
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <SvgLinearGradient id="dragonLineL" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0" stopColor={lc} stopOpacity="0" />
            <Stop offset="0.6" stopColor={lc} stopOpacity="0.6" />
            <Stop offset="1" stopColor={color} stopOpacity="0.9" />
          </SvgLinearGradient>
          <SvgLinearGradient id="dragonLineR" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0" stopColor={color} stopOpacity="0.9" />
            <Stop offset="0.4" stopColor={lc} stopOpacity="0.6" />
            <Stop offset="1" stopColor={lc} stopOpacity="0" />
          </SvgLinearGradient>
          <RadialGradient id="dragonGlow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
            <Stop offset="0" stopColor={color} stopOpacity="0.25" />
            <Stop offset="1" stopColor={color} stopOpacity="0" />
          </RadialGradient>
        </Defs>

        {/* Left ornamental line */}
        <Line
          x1={10}
          y1={cy}
          x2={128}
          y2={cy}
          stroke="url(#dragonLineL)"
          strokeWidth={1}
        />
        {/* Left decorative dots */}
        <Circle cx={20} cy={cy} r={1.5} fill={color} opacity={0.3} />
        <Circle cx={35} cy={cy} r={1} fill={color} opacity={0.2} />

        {/* Left end ornament — small diamond */}
        <Polygon
          points={`12,${cy} 16,${cy - 3} 20,${cy} 16,${cy + 3}`}
          fill={color}
          opacity={0.4}
        />

        {/* Center glow behind dragon */}
        <Circle cx={150} cy={cy} r={22} fill="url(#dragonGlow)" />

        {/* Dragon silhouette */}
        <Path d={dragonWingPath} fill={color} opacity={0.85} />
        {/* Dragon eye */}
        <Circle
          cx={150 + 8 * flip}
          cy={cy - 4}
          r={1.2}
          fill="#ffffff"
          opacity={0.9}
        />

        {/* Right ornamental line */}
        <Line
          x1={172}
          y1={cy}
          x2={290}
          y2={cy}
          stroke="url(#dragonLineR)"
          strokeWidth={1}
        />
        {/* Right decorative dots */}
        <Circle cx={280} cy={cy} r={1.5} fill={color} opacity={0.3} />
        <Circle cx={265} cy={cy} r={1} fill={color} opacity={0.2} />

        {/* Right end ornament — small diamond */}
        <Polygon
          points={`288,${cy} 284,${cy - 3} 280,${cy} 284,${cy + 3}`}
          fill={color}
          opacity={0.4}
        />

        {/* Small decorative triangles near dragon */}
        <Polygon
          points={`130,${cy} 133,${cy - 2} 133,${cy + 2}`}
          fill={color}
          opacity={0.5}
        />
        <Polygon
          points={`170,${cy} 167,${cy - 2} 167,${cy + 2}`}
          fill={color}
          opacity={0.5}
        />
      </Svg>
    </View>
  );
}

const dividerStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Sword Divider ───────────────────────────────────────────────────
// A divider featuring crossed swords or a single horizontal sword.
// ═══════════════════════════════════════════════════════════════════════

interface SwordDividerProps {
  /** "single" for a horizontal sword, "crossed" for crossed swords */
  variant?: "single" | "crossed";
  /** Primary color */
  color?: string;
  /** Blade color */
  bladeColor?: string;
  /** Height of the SVG */
  height?: number;
  /** Spacing */
  spacing?: number;
  /** Label text between the swords */
  label?: string;
  /** Label color */
  labelColor?: string;
  style?: ViewStyle;
}

export function SwordDivider({
  variant = "crossed",
  color = "#fbbf24",
  bladeColor = "#b0b0cc",
  height = 36,
  spacing = 14,
  label,
  labelColor,
  style,
}: SwordDividerProps) {
  const svgW = 300;
  const svgH = 36;
  const cy = svgH / 2;

  return (
    <View style={[swordStyles.container, { marginVertical: spacing }, style]}>
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <SvgLinearGradient id="bladeFill" x1="0" y1="0.5" x2="1" y2="0.5">
            <Stop offset="0" stopColor={bladeColor} stopOpacity="0.3" />
            <Stop offset="0.3" stopColor={bladeColor} stopOpacity="0.8" />
            <Stop offset="0.5" stopColor="#ffffff" stopOpacity="0.9" />
            <Stop offset="0.7" stopColor={bladeColor} stopOpacity="0.8" />
            <Stop offset="1" stopColor={bladeColor} stopOpacity="0.3" />
          </SvgLinearGradient>
          <SvgLinearGradient id="guardFill" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="1" stopColor={color} stopOpacity="0.6" />
          </SvgLinearGradient>
        </Defs>

        {variant === "crossed" ? (
          <G>
            {/* Sword 1 — angled left-to-right */}
            <G opacity={0.85}>
              {/* Blade */}
              <Line
                x1={110}
                y1={cy + 8}
                x2={190}
                y2={cy - 8}
                stroke={bladeColor}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.7}
              />
              {/* Crossguard */}
              <Line
                x1={142}
                y1={cy - 4}
                x2={142}
                y2={cy + 8}
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {/* Pommel */}
              <Circle cx={110} cy={cy + 8} r={2.5} fill={color} opacity={0.8} />
              {/* Blade tip */}
              <Circle cx={190} cy={cy - 8} r={1} fill="#ffffff" opacity={0.6} />
            </G>

            {/* Sword 2 — angled right-to-left */}
            <G opacity={0.85}>
              {/* Blade */}
              <Line
                x1={190}
                y1={cy + 8}
                x2={110}
                y2={cy - 8}
                stroke={bladeColor}
                strokeWidth={2}
                strokeLinecap="round"
                opacity={0.7}
              />
              {/* Crossguard */}
              <Line
                x1={158}
                y1={cy - 4}
                x2={158}
                y2={cy + 8}
                stroke={color}
                strokeWidth={2.5}
                strokeLinecap="round"
              />
              {/* Pommel */}
              <Circle cx={190} cy={cy + 8} r={2.5} fill={color} opacity={0.8} />
              {/* Blade tip */}
              <Circle cx={110} cy={cy - 8} r={1} fill="#ffffff" opacity={0.6} />
            </G>

            {/* Center intersection gem */}
            <Circle cx={150} cy={cy} r={4} fill={color} opacity={0.9} />
            <Circle cx={150} cy={cy} r={2.5} fill="#ffffff" opacity={0.3} />

            {/* Left decorative line */}
            <Line
              x1={10}
              y1={cy}
              x2={104}
              y2={cy}
              stroke={color}
              strokeWidth={0.5}
              strokeOpacity={0.3}
            />
            <Polygon
              points={`104,${cy} 108,${cy - 2} 108,${cy + 2}`}
              fill={color}
              opacity={0.5}
            />

            {/* Right decorative line */}
            <Line
              x1={196}
              y1={cy}
              x2={290}
              y2={cy}
              stroke={color}
              strokeWidth={0.5}
              strokeOpacity={0.3}
            />
            <Polygon
              points={`196,${cy} 192,${cy - 2} 192,${cy + 2}`}
              fill={color}
              opacity={0.5}
            />
          </G>
        ) : (
          <G>
            {/* Single horizontal sword */}
            {/* Blade */}
            <Rect
              x={40}
              y={cy - 1}
              width={220}
              height={2}
              fill="url(#bladeFill)"
              rx={1}
            />
            {/* Blade edge highlight */}
            <Line
              x1={40}
              y1={cy - 1}
              x2={260}
              y2={cy - 1}
              stroke="#ffffff"
              strokeWidth={0.3}
              strokeOpacity={0.4}
            />

            {/* Crossguard */}
            <Rect
              x={145}
              y={cy - 7}
              width={10}
              height={14}
              fill="url(#guardFill)"
              rx={2}
            />
            {/* Guard ornaments */}
            <Circle cx={147} cy={cy - 6} r={1.5} fill={color} opacity={0.6} />
            <Circle cx={153} cy={cy - 6} r={1.5} fill={color} opacity={0.6} />
            <Circle cx={147} cy={cy + 6} r={1.5} fill={color} opacity={0.6} />
            <Circle cx={153} cy={cy + 6} r={1.5} fill={color} opacity={0.6} />

            {/* Grip wrapping (handle area) */}
            <Rect
              x={130}
              y={cy - 2.5}
              width={15}
              height={5}
              fill={color}
              opacity={0.4}
              rx={1}
            />

            {/* Pommel */}
            <Circle cx={40} cy={cy} r={4} fill={color} opacity={0.7} />
            <Circle cx={40} cy={cy} r={2} fill="#ffffff" opacity={0.15} />

            {/* Blade tip */}
            <Polygon
              points={`260,${cy} 268,${cy - 1.5} 268,${cy + 1.5}`}
              fill={bladeColor}
              opacity={0.8}
            />
          </G>
        )}

        {/* Label */}
        {label && (
          <SvgText
            x={150}
            y={cy + 15}
            textAnchor="middle"
            fontSize={8}
            fontWeight="700"
            fill={labelColor || color}
            opacity={0.7}
            letterSpacing={2}
          >
            {label.toUpperCase()}
          </SvgText>
        )}
      </Svg>
    </View>
  );
}

const swordStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Shield Frame ────────────────────────────────────────────────────
// A shield-shaped frame that can wrap content, great for character
// avatars, emblems, or highlight sections.
// ═══════════════════════════════════════════════════════════════════════

interface ShieldFrameProps {
  /** Content to render inside the shield */
  children?: React.ReactNode;
  /** Size of the shield (width) */
  size?: number;
  /** Primary border/frame color */
  color?: string;
  /** Inner background color */
  backgroundColor?: string;
  /** Whether to show the SVG decorative border */
  showBorder?: boolean;
  /** Whether to show the inner gradient */
  showGradient?: boolean;
  style?: ViewStyle;
}

export function ShieldFrame({
  children,
  size = 80,
  color = "#fbbf24",
  backgroundColor = "#1e1e38",
  showBorder = true,
  showGradient = true,
  style,
}: ShieldFrameProps) {
  const h = size * 1.15;

  // Shield path: a classic heater-shield shape
  // Fits in viewBox 0 0 100 115
  const shieldPath = `
    M50,2
    C25,2 4,8 4,24
    L4,55
    C4,80 25,100 50,113
    C75,100 96,80 96,55
    L96,24
    C96,8 75,2 50,2
    Z
  `;

  const innerShieldPath = `
    M50,8
    C28,8 10,13 10,27
    L10,54
    C10,76 28,94 50,106
    C72,94 90,76 90,54
    L90,27
    C90,13 72,8 50,8
    Z
  `;

  return (
    <View style={[shieldStyles.container, { width: size, height: h }, style]}>
      {/* SVG Shield Shape */}
      <Svg
        width={size}
        height={h}
        viewBox="0 0 100 115"
        style={StyleSheet.absoluteFill}
      >
        <Defs>
          <SvgLinearGradient id="shieldBorder" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="0.5" stopColor={color} stopOpacity="0.7" />
            <Stop offset="1" stopColor={color} stopOpacity="0.4" />
          </SvgLinearGradient>
          <SvgLinearGradient id="shieldInner" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={backgroundColor} stopOpacity="1" />
            <Stop offset="1" stopColor="#0d0d1a" stopOpacity="1" />
          </SvgLinearGradient>
          <RadialGradient
            id="shieldShine"
            cx="0.35"
            cy="0.25"
            rx="0.4"
            ry="0.4"
          >
            <Stop offset="0" stopColor="#ffffff" stopOpacity="0.12" />
            <Stop offset="1" stopColor="#ffffff" stopOpacity="0" />
          </RadialGradient>
          <ClipPath id="shieldClip">
            <Path d={innerShieldPath} />
          </ClipPath>
        </Defs>

        {/* Outer border */}
        {showBorder && (
          <Path d={shieldPath} fill="url(#shieldBorder)" opacity={0.9} />
        )}

        {/* Inner fill */}
        <Path d={innerShieldPath} fill="url(#shieldInner)" />

        {/* Shine overlay */}
        {showGradient && <Path d={innerShieldPath} fill="url(#shieldShine)" />}

        {/* Decorative cross divider */}
        {showBorder && (
          <G opacity={0.25}>
            <Line
              x1={50}
              y1={8}
              x2={50}
              y2={106}
              stroke={color}
              strokeWidth={0.8}
            />
            <Line
              x1={10}
              y1={50}
              x2={90}
              y2={50}
              stroke={color}
              strokeWidth={0.8}
            />
          </G>
        )}

        {/* Top ornament */}
        {showBorder && (
          <G>
            <Circle cx={50} cy={2} r={3} fill={color} opacity={0.8} />
            <Circle cx={50} cy={2} r={1.5} fill="#ffffff" opacity={0.3} />
          </G>
        )}
      </Svg>

      {/* Content overlay */}
      <View style={shieldStyles.content}>{children}</View>
    </View>
  );
}

const shieldStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  content: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 8,
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Runic Border ────────────────────────────────────────────────────
// A decorative border with runic/celtic patterns for sections or cards.
// ═══════════════════════════════════════════════════════════════════════

interface RunicBorderProps {
  children?: React.ReactNode;
  /** Border color */
  color?: string;
  /** Background color */
  backgroundColor?: string;
  /** Corner size for the cut-corner effect */
  cornerSize?: number;
  /** Whether to show corner ornaments */
  showCornerRunes?: boolean;
  /** Padding inside the border */
  padding?: number;
  /** Border width */
  borderWidth?: number;
  style?: ViewStyle;
}

export function RunicBorder({
  children,
  color = "#fbbf24",
  backgroundColor = "transparent",
  cornerSize = 12,
  showCornerRunes = true,
  padding = 16,
  borderWidth = 1,
  style,
}: RunicBorderProps) {
  return (
    <View style={[runicStyles.container, style]}>
      {/* SVG border overlay */}
      <Svg
        width="100%"
        height="100%"
        style={StyleSheet.absoluteFill}
        preserveAspectRatio="none"
      >
        <Defs>
          <SvgLinearGradient id="runicBorderG" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="0.8" />
            <Stop offset="0.5" stopColor={color} stopOpacity="0.4" />
            <Stop offset="1" stopColor={color} stopOpacity="0.8" />
          </SvgLinearGradient>
        </Defs>

        {/* Main border path with cut corners */}
        <Path
          d={`
            M ${cornerSize},0
            L 100%,0
            L 100%,100%
            L 0,100%
            L 0,${cornerSize}
            Z
          `}
          fill={backgroundColor}
          stroke="url(#runicBorderG)"
          strokeWidth={borderWidth}
        />

        {/* Corner cut decorative triangle */}
        <Path
          d={`M 0,0 L ${cornerSize},0 L 0,${cornerSize} Z`}
          fill="none"
          stroke={color}
          strokeWidth={borderWidth * 0.7}
          strokeOpacity={0.5}
        />

        {/* Corner rune dots */}
        {showCornerRunes && (
          <G>
            {/* Top-left area (near the cut corner) */}
            <Circle
              cx={cornerSize + 4}
              cy={4}
              r={1.5}
              fill={color}
              opacity={0.6}
            />
            <Circle
              cx={4}
              cy={cornerSize + 4}
              r={1.5}
              fill={color}
              opacity={0.6}
            />
            {/* Diamond at corner intersection */}
            <Polygon
              points={`${cornerSize / 2},${cornerSize / 2 - 3} ${cornerSize / 2 + 3},${cornerSize / 2} ${cornerSize / 2},${cornerSize / 2 + 3} ${cornerSize / 2 - 3},${cornerSize / 2}`}
              fill={color}
              opacity={0.45}
            />
          </G>
        )}
      </Svg>

      {/* Content */}
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const runicStyles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Parchment Card ──────────────────────────────────────────────────
// A card component styled to look like aged parchment/scroll.
// ═══════════════════════════════════════════════════════════════════════

interface ParchmentCardProps {
  children?: React.ReactNode;
  /** Parchment tint color */
  tint?: "warm" | "cold" | "dark";
  /** Whether to show torn/rough edges (top/bottom decorative borders) */
  showEdges?: boolean;
  /** Padding */
  padding?: number;
  /** Whether to show the corner fold effect */
  showFold?: boolean;
  /** Card border radius */
  borderRadius?: number;
  style?: ViewStyle;
}

const PARCHMENT_TINTS = {
  warm: {
    bg1: "#f5e6c8",
    bg2: "#e6d5a8",
    bg3: "#d4c495",
    border: "#c8b07a",
    text: "#3b2a12",
    edgeLine: "#c8b07a",
  },
  cold: {
    bg1: "#e8e4f0",
    bg2: "#d8d4e4",
    bg3: "#c8c4d8",
    border: "#a8a4c0",
    text: "#2a2640",
    edgeLine: "#a8a4c0",
  },
  dark: {
    bg1: "#2d2d44",
    bg2: "#252540",
    bg3: "#1e1e38",
    border: "#3a3a5c",
    text: "#b3b3cc",
    edgeLine: "#4a4a6a",
  },
};

export function ParchmentCard({
  children,
  tint = "dark",
  showEdges = true,
  padding = 16,
  showFold = false,
  borderRadius = 4,
  style,
}: ParchmentCardProps) {
  const t = PARCHMENT_TINTS[tint];

  return (
    <View
      style={[
        parchStyles.container,
        {
          borderRadius,
          borderColor: t.border,
        },
        style,
      ]}
    >
      <LinearGradient
        colors={[t.bg1, t.bg2, t.bg3]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />

      {/* Subtle noise/grain texture via overlapping gradients */}
      <LinearGradient
        colors={["rgba(255,255,255,0.04)", "transparent", "rgba(0,0,0,0.06)"]}
        start={{ x: 0.8, y: 0 }}
        end={{ x: 0.2, y: 1 }}
        style={[StyleSheet.absoluteFill, { borderRadius }]}
      />

      {/* Top edge decoration */}
      {showEdges && (
        <View style={[parchStyles.edgeTop, { borderColor: t.edgeLine }]}>
          <Svg width="100%" height={4} preserveAspectRatio="none">
            <Line
              x1="0"
              y1="2"
              x2="100%"
              y2="2"
              stroke={t.edgeLine}
              strokeWidth={0.5}
              strokeDasharray="6,4,2,4"
              strokeOpacity={0.5}
            />
          </Svg>
        </View>
      )}

      {/* Bottom edge decoration */}
      {showEdges && (
        <View style={[parchStyles.edgeBottom, { borderColor: t.edgeLine }]}>
          <Svg width="100%" height={4} preserveAspectRatio="none">
            <Line
              x1="0"
              y1="2"
              x2="100%"
              y2="2"
              stroke={t.edgeLine}
              strokeWidth={0.5}
              strokeDasharray="6,4,2,4"
              strokeOpacity={0.5}
            />
          </Svg>
        </View>
      )}

      {/* Corner fold effect */}
      {showFold && (
        <View style={parchStyles.foldCorner}>
          <Svg width={20} height={20} viewBox="0 0 20 20">
            <Path d="M0,0 L20,0 L20,20 Z" fill={t.bg3} opacity={0.8} />
            <Path
              d="M20,0 L20,20 L0,0 Z"
              fill="none"
              stroke={t.border}
              strokeWidth={0.5}
              strokeOpacity={0.4}
            />
          </Svg>
        </View>
      )}

      {/* Content */}
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const parchStyles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
    borderWidth: 1,
  },
  edgeTop: {
    position: "absolute",
    top: 4,
    left: 8,
    right: 8,
    height: 4,
  },
  edgeBottom: {
    position: "absolute",
    bottom: 4,
    left: 8,
    right: 8,
    height: 4,
  },
  foldCorner: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── DnD Backdrop ─────────────────────────────────────────────────────
// A subtle textured backdrop with D&D themed ornaments.
// ═══════════════════════════════════════════════════════════════════════

interface DndBackdropProps {
  /** Optional container style */
  style?: ViewStyle;
  /** Base glow intensity */
  intensity?: number;
  /** Show floating particles */
  showParticles?: boolean;
  /** Show arcane circle */
  showMagicCircle?: boolean;
}

export function DndBackdrop({
  style,
  intensity,
  showParticles = true,
  showMagicCircle = true,
}: DndBackdropProps) {
  const { colors, isDark } = useTheme();
  const { width, height } = useWindowDimensions();
  const glowIntensity = intensity ?? (isDark ? 0.06 : 0.04);
  const watermarkOpacity = isDark ? 0.05 : 0.06;

  return (
    <View pointerEvents="none" style={[backdropStyles.container, style]}>
      <LinearGradient
        colors={colors.gradientMain}
        locations={colors.gradientLocations}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle texture overlay */}
      <LinearGradient
        colors={
          isDark
            ? ["rgba(255,255,255,0.03)", "transparent", "rgba(0,0,0,0.08)"]
            : ["rgba(0,0,0,0.03)", "transparent", "rgba(255,255,255,0.12)"]
        }
        start={{ x: 0.2, y: 0 }}
        end={{ x: 0.8, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient glow */}
      <TorchGlow
        color={colors.accentGold}
        position="top-left"
        size={160}
        intensity={glowIntensity}
        animated
      />
      <TorchGlow
        color={colors.accentRed}
        position="bottom-right"
        size={200}
        intensity={glowIntensity * 0.9}
        animated
      />

      {/* Watermark dice */}
      <View style={backdropStyles.topLeft}>
        <D20Watermark
          size={140}
          variant={isDark ? "dark" : "silver"}
          opacity={watermarkOpacity}
        />
      </View>
      <View style={backdropStyles.bottomRight}>
        <D20Watermark
          size={220}
          variant={isDark ? "dark" : "silver"}
          opacity={watermarkOpacity}
        />
      </View>

      {/* Arcane circle */}
      {showMagicCircle && (
        <MagicCircle
          size={220}
          color={isDark ? colors.accentGold : colors.accentDeepPurple}
          opacity={isDark ? 0.08 : 0.06}
          animated
          style={backdropStyles.magicCircle}
        />
      )}

      {/* Floating particles */}
      {showParticles && (
        <FloatingParticles
          count={8}
          color={colors.accentGold}
          width={width}
          height={Math.min(height, 700)}
          maxSize={3}
          opacity={isDark ? 0.25 : 0.15}
          style={backdropStyles.particles}
        />
      )}
    </View>
  );
}

const backdropStyles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
  },
  topLeft: {
    position: "absolute",
    top: -40,
    left: -40,
  },
  bottomRight: {
    position: "absolute",
    bottom: -60,
    right: -60,
  },
  magicCircle: {
    position: "absolute",
    top: 80,
    right: -40,
  },
  particles: {
    position: "absolute",
    top: 0,
    left: 0,
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Torch Glow ──────────────────────────────────────────────────────
// An animated ambient glow effect that mimics torchlight flicker.
// Can be placed as a background overlay on any section.
// ═══════════════════════════════════════════════════════════════════════

interface TorchGlowProps {
  /** Glow color */
  color?: string;
  /** Position of the glow source */
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  /** Size of the glow radius */
  size?: number;
  /** Base opacity (0-1) */
  intensity?: number;
  /** Whether to animate the flicker */
  animated?: boolean;
  style?: ViewStyle;
}

export function TorchGlow({
  color = "#fbbf24",
  position = "top-right",
  size = 150,
  intensity = 0.08,
  animated = true,
  style,
}: TorchGlowProps) {
  const flickerAnim = useRef(new Animated.Value(intensity)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!animated) return;

    const flicker = Animated.loop(
      Animated.sequence([
        Animated.timing(flickerAnim, {
          toValue: intensity * 1.6,
          duration: 800 + Math.random() * 600,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: intensity * 0.6,
          duration: 600 + Math.random() * 400,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: intensity * 1.3,
          duration: 500 + Math.random() * 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(flickerAnim, {
          toValue: intensity,
          duration: 700 + Math.random() * 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const breathe = Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.12,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.92,
          duration: 3000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    flicker.start();
    breathe.start();

    return () => {
      flicker.stop();
      breathe.stop();
    };
  }, [animated, intensity, flickerAnim, scaleAnim]);

  const positionStyle: ViewStyle = useMemo(() => {
    const base: ViewStyle = { position: "absolute" };
    switch (position) {
      case "top-left":
        return { ...base, top: -size * 0.4, left: -size * 0.4 };
      case "top-right":
        return { ...base, top: -size * 0.4, right: -size * 0.4 };
      case "bottom-left":
        return { ...base, bottom: -size * 0.4, left: -size * 0.4 };
      case "bottom-right":
        return { ...base, bottom: -size * 0.4, right: -size * 0.4 };
      case "center":
        return {
          ...base,
          top: "50%" as any,
          left: "50%" as any,
          marginTop: -size / 2,
          marginLeft: -size / 2,
        };
      default:
        return base;
    }
  }, [position, size]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        positionStyle,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          opacity: flickerAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════
// ─── Castle Header Border ────────────────────────────────────────────
// A crenellated (castle battlement) style bottom border for headers.
// ═══════════════════════════════════════════════════════════════════════

interface CastleHeaderProps {
  /** Color of the battlements */
  color?: string;
  /** Height of the crenellations */
  height?: number;
  /** Width of each merlon (raised part) */
  merlonWidth?: number;
  /** Width of each crenel (gap) */
  crenelWidth?: number;
  style?: ViewStyle;
}

export function CastleHeader({
  color = "#1a1a2e",
  height = 10,
  merlonWidth = 14,
  crenelWidth = 10,
  style,
}: CastleHeaderProps) {
  return (
    <View style={[castleStyles.container, style]}>
      <Svg width="100%" height={height} preserveAspectRatio="none">
        <Defs>
          <SvgLinearGradient id="castleGrad" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="1" stopColor={color} stopOpacity="0.8" />
          </SvgLinearGradient>
        </Defs>

        {/* Generate the crenellation pattern */}
        {/* We use a repeating path approach */}
        <Path
          d={generateCrenellationPath(merlonWidth, crenelWidth, height)}
          fill="url(#castleGrad)"
        />
      </Svg>
    </View>
  );
}

function generateCrenellationPath(mw: number, cw: number, h: number): string {
  // Create a pattern that repeats across the full width
  // We create enough repeats to cover up to ~400px and SVG will scale
  const totalWidth = 400;
  const unitWidth = mw + cw;
  const count = Math.ceil(totalWidth / unitWidth);
  const crenelHeight = h * 0.45;

  let d = `M 0,${h} L 0,0 `;

  for (let i = 0; i < count; i++) {
    const x = i * unitWidth;
    d += `L ${x},0 `;
    d += `L ${x + mw},0 `;
    d += `L ${x + mw},${crenelHeight} `;
    d += `L ${x + mw + cw},${crenelHeight} `;
    d += `L ${x + mw + cw},0 `;
  }

  d += `L ${totalWidth},0 L ${totalWidth},${h} Z`;
  return d;
}

const castleStyles = StyleSheet.create({
  container: {
    width: "100%",
    overflow: "hidden",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Scroll Banner ───────────────────────────────────────────────────
// A scroll/ribbon shaped banner for displaying titles or labels.
// ═══════════════════════════════════════════════════════════════════════

interface ScrollBannerProps {
  /** Text to display on the banner */
  text: string;
  /** Banner color */
  color?: string;
  /** Text color */
  textColor?: string;
  /** Font size */
  fontSize?: number;
  /** Height of the banner */
  height?: number;
  style?: ViewStyle;
}

export function ScrollBanner({
  text,
  color = "#c62828",
  textColor = "#ffffff",
  fontSize = 14,
  height = 40,
  style,
}: ScrollBannerProps) {
  const svgW = 300;
  const svgH = height;
  const cy = svgH / 2;
  const ribbonH = svgH * 0.65;
  const ribbonTop = cy - ribbonH / 2;
  const ribbonBot = cy + ribbonH / 2;
  const foldW = 20;
  const foldDepth = 6;

  return (
    <View style={[scrollStyles.container, { height }, style]}>
      <Svg
        width="100%"
        height={height}
        viewBox={`0 0 ${svgW} ${svgH}`}
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <SvgLinearGradient id="ribbonMain" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor={color} stopOpacity="1" />
            <Stop offset="1" stopColor={color} stopOpacity="0.85" />
          </SvgLinearGradient>
          <SvgLinearGradient id="ribbonFold" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor="#000000" stopOpacity="0.3" />
            <Stop offset="1" stopColor="#000000" stopOpacity="0.15" />
          </SvgLinearGradient>
        </Defs>

        {/* Left fold (behind main banner) */}
        <Path
          d={`
            M ${foldW + 2},${ribbonTop + 2}
            L 2,${ribbonTop + foldDepth}
            L 2,${ribbonBot - foldDepth}
            L ${foldW + 2},${ribbonBot - 2}
            Z
          `}
          fill="url(#ribbonFold)"
        />

        {/* Right fold (behind main banner) */}
        <Path
          d={`
            M ${svgW - foldW - 2},${ribbonTop + 2}
            L ${svgW - 2},${ribbonTop + foldDepth}
            L ${svgW - 2},${ribbonBot - foldDepth}
            L ${svgW - foldW - 2},${ribbonBot - 2}
            Z
          `}
          fill="url(#ribbonFold)"
        />

        {/* Main ribbon body */}
        <Path
          d={`
            M ${foldW},${ribbonTop}
            L ${svgW - foldW},${ribbonTop}
            L ${svgW - foldW + 8},${cy}
            L ${svgW - foldW},${ribbonBot}
            L ${foldW},${ribbonBot}
            L ${foldW - 8},${cy}
            Z
          `}
          fill="url(#ribbonMain)"
        />

        {/* Highlight line at top */}
        <Line
          x1={foldW + 4}
          y1={ribbonTop + 2}
          x2={svgW - foldW - 4}
          y2={ribbonTop + 2}
          stroke="#ffffff"
          strokeWidth={0.5}
          strokeOpacity={0.25}
        />

        {/* Banner text */}
        <SvgText
          x={svgW / 2}
          y={cy + fontSize * 0.35}
          textAnchor="middle"
          fontSize={fontSize}
          fontWeight="800"
          fill={textColor}
          letterSpacing={1.5}
        >
          {text.toUpperCase()}
        </SvgText>
      </Svg>
    </View>
  );
}

const scrollStyles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Magic Circle ────────────────────────────────────────────────────
// An animated arcane circle with runes and rotating rings.
// Great as a background decoration or loading indicator.
// ═══════════════════════════════════════════════════════════════════════

interface MagicCircleProps {
  /** Size of the circle */
  size?: number;
  /** Primary color */
  color?: string;
  /** Whether rings rotate */
  animated?: boolean;
  /** Overall opacity */
  opacity?: number;
  /** Number of rune symbols on the outer ring */
  runeCount?: number;
  style?: ViewStyle;
}

const RUNE_CHARS = ["ᚠ", "ᚡ", "ᚢ", "ᚣ", "ᚤ", "ᚥ", "ᚦ", "ᚧ", "ᚨ", "ᚩ", "ᚪ", "ᚫ"];

export function MagicCircle({
  size = 200,
  color = "#c62828",
  animated = true,
  opacity: baseOpacity = 0.15,
  runeCount = 8,
  style,
}: MagicCircleProps) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const reverseRotateAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (!animated) return;

    const rotate = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 30000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const reverseRotate = Animated.loop(
      Animated.timing(reverseRotateAnim, {
        toValue: 1,
        duration: 20000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );

    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.7,
          duration: 4000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    rotate.start();
    reverseRotate.start();
    pulse.start();

    return () => {
      rotate.stop();
      reverseRotate.stop();
      pulse.stop();
    };
  }, [animated, rotateAnim, reverseRotateAnim, pulseAnim]);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const reverseRotateInterpolate = reverseRotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["360deg", "0deg"],
  });

  const cx = 100;
  const cy = 100;

  // Generate rune positions around the outer ring
  const runes = useMemo(() => {
    const result = [];
    for (let i = 0; i < runeCount; i++) {
      const angle = (Math.PI * 2 * i) / runeCount - Math.PI / 2;
      const r = 85;
      result.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
        char: RUNE_CHARS[i % RUNE_CHARS.length],
      });
    }
    return result;
  }, [runeCount]);

  // Generate pentagram points
  const pentagramPath = useMemo(() => {
    const r = 55;
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 5; i++) {
      const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
      points.push({
        x: cx + r * Math.cos(angle),
        y: cy + r * Math.sin(angle),
      });
    }
    // Connect every other point to form a star
    const order = [0, 2, 4, 1, 3, 0];
    return (
      order
        .map(
          (idx, i) =>
            `${i === 0 ? "M" : "L"} ${points[idx].x.toFixed(1)},${points[idx].y.toFixed(1)}`,
        )
        .join(" ") + " Z"
    );
  }, []);

  const innerCircleSvg = (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        <RadialGradient id="mcGlow" cx="0.5" cy="0.5" rx="0.5" ry="0.5">
          <Stop offset="0" stopColor={color} stopOpacity="0.2" />
          <Stop offset="0.7" stopColor={color} stopOpacity="0.05" />
          <Stop offset="1" stopColor={color} stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Background glow */}
      <Circle cx={cx} cy={cy} r={98} fill="url(#mcGlow)" />

      {/* Outer ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={92}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeOpacity={0.6}
      />
      <Circle
        cx={cx}
        cy={cy}
        r={88}
        fill="none"
        stroke={color}
        strokeWidth={0.5}
        strokeOpacity={0.3}
      />

      {/* Rune characters around the outer ring */}
      {runes.map((rune, i) => (
        <SvgText
          key={i}
          x={rune.x}
          y={rune.y + 4}
          textAnchor="middle"
          fontSize={10}
          fill={color}
          opacity={0.7}
        >
          {rune.char}
        </SvgText>
      ))}

      {/* Middle ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={70}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        strokeOpacity={0.4}
      />

      {/* Inner ring */}
      <Circle
        cx={cx}
        cy={cy}
        r={38}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        strokeOpacity={0.5}
      />

      {/* Pentagram / star */}
      <Path
        d={pentagramPath}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        strokeOpacity={0.35}
      />

      {/* Center dot */}
      <Circle cx={cx} cy={cy} r={3} fill={color} opacity={0.5} />
      <Circle cx={cx} cy={cy} r={1.5} fill="#ffffff" opacity={0.2} />

      {/* Cardinal direction marks on middle ring */}
      {[0, 90, 180, 270].map((deg, i) => {
        const angle = (deg * Math.PI) / 180;
        const r1 = 67;
        const r2 = 73;
        return (
          <Line
            key={`cardinal-${i}`}
            x1={cx + r1 * Math.cos(angle)}
            y1={cy + r1 * Math.sin(angle)}
            x2={cx + r2 * Math.cos(angle)}
            y2={cy + r2 * Math.sin(angle)}
            stroke={color}
            strokeWidth={1.5}
            strokeOpacity={0.5}
          />
        );
      })}
    </Svg>
  );

  if (animated) {
    return (
      <Animated.View
        pointerEvents="none"
        style={[
          magicStyles.container,
          {
            width: size,
            height: size,
            opacity: pulseAnim.interpolate({
              inputRange: [0.7, 1],
              outputRange: [baseOpacity * 0.7, baseOpacity],
            }),
          },
          style,
        ]}
      >
        <Animated.View
          style={[
            magicStyles.ring,
            {
              transform: [{ rotate: rotateInterpolate }],
            },
          ]}
        >
          {innerCircleSvg}
        </Animated.View>
      </Animated.View>
    );
  }

  return (
    <View
      pointerEvents="none"
      style={[
        magicStyles.container,
        {
          width: size,
          height: size,
          opacity: baseOpacity,
        },
        style,
      ]}
    >
      {innerCircleSvg}
    </View>
  );
}

const magicStyles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    width: "100%",
    height: "100%",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Corner Ornament ─────────────────────────────────────────────────
// Small decorative corner piece for cards and frames.
// ═══════════════════════════════════════════════════════════════════════

interface CornerOrnamentProps {
  /** Which corner */
  corner?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  /** Size of the ornament */
  size?: number;
  /** Color */
  color?: string;
  style?: ViewStyle;
}

export function CornerOrnament({
  corner = "top-left",
  size = 24,
  color = "#fbbf24",
  style,
}: CornerOrnamentProps) {
  // Determine rotation based on corner
  let rotation = "0deg";
  switch (corner) {
    case "top-right":
      rotation = "90deg";
      break;
    case "bottom-right":
      rotation = "180deg";
      break;
    case "bottom-left":
      rotation = "270deg";
      break;
  }

  return (
    <View
      style={[
        cornerStyles.container,
        {
          width: size,
          height: size,
          transform: [{ rotate: rotation }],
        },
        style,
      ]}
    >
      <Svg width={size} height={size} viewBox="0 0 30 30">
        {/* Main corner curve */}
        <Path d="M0,0 L12,0 C8,4 4,8 0,12 Z" fill={color} opacity={0.3} />
        {/* Inner curve line */}
        <Path
          d="M0,0 Q 0,16 16,16"
          fill="none"
          stroke={color}
          strokeWidth={1}
          strokeOpacity={0.5}
        />
        {/* Outer curve line */}
        <Path
          d="M0,0 Q 0,22 22,22"
          fill="none"
          stroke={color}
          strokeWidth={0.5}
          strokeOpacity={0.25}
        />
        {/* Dot at curve end */}
        <Circle cx={16} cy={16} r={1.5} fill={color} opacity={0.5} />
        {/* Small diamond at the corner */}
        <Polygon
          points="0,4 2,0 4,4 2,8"
          fill={color}
          opacity={0.5}
          transform="translate(0, -1)"
        />
      </Svg>
    </View>
  );
}

const cornerStyles = StyleSheet.create({
  container: {
    position: "absolute",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Ornate Frame (composed) ─────────────────────────────────────────
// A full frame with corner ornaments and border styling.
// Uses CornerOrnament at each corner plus a subtle border.
// ═══════════════════════════════════════════════════════════════════════

interface OrnateFrameProps {
  children?: React.ReactNode;
  /** Corner ornament color */
  color?: string;
  /** Border color */
  borderColor?: string;
  /** Background color */
  backgroundColor?: string;
  /** Corner ornament size */
  cornerSize?: number;
  /** Inner padding */
  padding?: number;
  /** Border radius */
  borderRadius?: number;
  style?: ViewStyle;
}

export function OrnateFrame({
  children,
  color = "#fbbf24",
  borderColor: frameBorder,
  backgroundColor = "transparent",
  cornerSize = 20,
  padding = 16,
  borderRadius = 2,
  style,
}: OrnateFrameProps) {
  const bc = frameBorder || `${color}30`;

  return (
    <View
      style={[
        ornateStyles.container,
        {
          backgroundColor,
          borderColor: bc,
          borderRadius,
        },
        style,
      ]}
    >
      {/* Corner ornaments */}
      <CornerOrnament
        corner="top-left"
        size={cornerSize}
        color={color}
        style={{ top: -1, left: -1 }}
      />
      <CornerOrnament
        corner="top-right"
        size={cornerSize}
        color={color}
        style={{ top: -1, right: -1 }}
      />
      <CornerOrnament
        corner="bottom-left"
        size={cornerSize}
        color={color}
        style={{ bottom: -1, left: -1 }}
      />
      <CornerOrnament
        corner="bottom-right"
        size={cornerSize}
        color={color}
        style={{ bottom: -1, right: -1 }}
      />

      {/* Content */}
      <View style={{ padding }}>{children}</View>
    </View>
  );
}

const ornateStyles = StyleSheet.create({
  container: {
    position: "relative",
    borderWidth: 1,
    overflow: "visible",
  },
});

// ═══════════════════════════════════════════════════════════════════════
// ─── Floating Particles ──────────────────────────────────────────────
// Animated sparkle/ember particles for atmospheric backgrounds.
// ═══════════════════════════════════════════════════════════════════════

interface FloatingParticlesProps {
  /** Number of particles */
  count?: number;
  /** Particle color */
  color?: string;
  /** Container area width */
  width?: number;
  /** Container area height */
  height?: number;
  /** Max particle size */
  maxSize?: number;
  /** Base opacity of particles */
  opacity?: number;
  style?: ViewStyle;
}

interface Particle {
  id: number;
  x: number;
  startY: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export function FloatingParticles({
  count = 12,
  color = "#fbbf24",
  width = 300,
  height = 400,
  maxSize = 4,
  opacity: baseOpacity = 0.4,
  style,
}: FloatingParticlesProps) {
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      startY: height * 0.3 + Math.random() * height * 0.7,
      size: 1 + Math.random() * (maxSize - 1),
      duration: 4000 + Math.random() * 6000,
      delay: Math.random() * 3000,
      opacity: (0.2 + Math.random() * 0.8) * baseOpacity,
    }));
  }, [count, width, height, maxSize, baseOpacity]);

  return (
    <View
      pointerEvents="none"
      style={[particleStyles.container, { width, height }, style]}
    >
      {particles.map((p) => (
        <SingleParticle key={p.id} particle={p} color={color} height={height} />
      ))}
    </View>
  );
}

function SingleParticle({
  particle,
  color,
  height,
}: {
  particle: Particle;
  color: string;
  height: number;
}) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animate = () => {
      translateY.setValue(0);
      opacity.setValue(0);
      scale.setValue(0.5);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -(particle.startY + 40),
          duration: particle.duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: particle.opacity,
            duration: particle.duration * 0.2,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: particle.opacity,
            duration: particle.duration * 0.5,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: particle.duration * 0.3,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1,
            duration: particle.duration * 0.3,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.3,
            duration: particle.duration * 0.7,
            easing: Easing.in(Easing.ease),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => {
        // Loop
        animate();
      });
    };

    const timeout = setTimeout(animate, particle.delay);
    return () => clearTimeout(timeout);
  }, [particle, translateY, opacity, scale]);

  return (
    <Animated.View
      style={[
        particleStyles.particle,
        {
          left: particle.x,
          top: particle.startY,
          width: particle.size,
          height: particle.size,
          borderRadius: particle.size / 2,
          backgroundColor: color,
          opacity,
          transform: [{ translateY }, { scale }],
        },
      ]}
    />
  );
}

const particleStyles = StyleSheet.create({
  container: {
    position: "absolute",
    overflow: "hidden",
  },
  particle: {
    position: "absolute",
  },
});
