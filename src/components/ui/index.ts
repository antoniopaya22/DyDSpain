/**
 * UI Components - Barrel Export
 *
 * Centralized exports for all reusable UI components.
 * Import from '@/components/ui' for clean imports.
 */

// ─── Animated Pressable & Button Variants ────────────────────────────
export { default as AnimatedPressable } from "./AnimatedPressable";
export { DndButton, IconButton } from "./AnimatedPressable";

// ─── D&D Logo ────────────────────────────────────────────────────────
export { default as DndLogo } from "./DndLogo";
export { InlineDndLogo } from "./DndLogo";

// ─── Glow Card & Variants ────────────────────────────────────────────
export { default as GlowCard } from "./GlowCard";
export { InfoCard, StatCard } from "./GlowCard";

// ─── Fade In Animations ──────────────────────────────────────────────
export { default as FadeInView } from "./FadeInView";
export { StaggeredList, ScaleFadeIn } from "./FadeInView";

// ─── Section Dividers ────────────────────────────────────────────────
export { default as SectionDivider } from "./SectionDivider";
export { SubtleDivider, OrnateDivider, SectionHeaderDivider } from "./SectionDivider";

// ─── Gradient Header & Variants ──────────────────────────────────────
export { default as GradientHeader } from "./GradientHeader";
export { CompactHeader, HeroHeader } from "./GradientHeader";

// ─── Confirm Dialog (replaces native Alert.alert) ────────────────────
export { default as ConfirmDialog } from "./ConfirmDialog";
export type { ConfirmDialogProps, DialogType, DialogButton } from "./ConfirmDialog";

// ─── Toast Notifications ─────────────────────────────────────────────
export { default as Toast } from "./Toast";
export type { ToastProps, ToastType } from "./Toast";

// ─── Web Transition Overlay ──────────────────────────────────────────
export { default as WebTransition } from "./WebTransition";
export type { WebTransitionProps } from "./WebTransition";
