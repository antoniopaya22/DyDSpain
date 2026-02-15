/**
 * FadeInView - Animated wrapper that fades and slides children into view.
 *
 * Supports configurable direction, duration, delay (for staggered lists),
 * and spring physics for a polished entrance animation.
 */

import { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  ViewStyle,
  StyleSheet,
} from "react-native";

// ─── Props ───────────────────────────────────────────────────────────

interface FadeInViewProps {
  children: React.ReactNode;
  /** Delay before the animation starts in ms (default: 0) */
  delay?: number;
  /** Duration of the fade animation in ms (default: 400) */
  duration?: number;
  /** Direction the element slides in from (default: 'up') */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance in pixels the element travels during the slide (default: 20) */
  distance?: number;
  /** Whether to use spring physics instead of timing (default: false) */
  useSpring?: boolean;
  /** Spring friction (only used when useSpring is true, default: 7) */
  springFriction?: number;
  /** Spring tension (only used when useSpring is true, default: 80) */
  springTension?: number;
  /** Whether the animation should play (default: true) */
  active?: boolean;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Easing function (default: Easing.out(Easing.cubic)) */
  easing?: (value: number) => number;
}

// ─── Component ───────────────────────────────────────────────────────

export default function FadeInView({
  children,
  delay = 0,
  duration = 400,
  direction = "up",
  distance = 20,
  useSpring = false,
  springFriction = 7,
  springTension = 80,
  active = true,
  style,
  easing,
}: FadeInViewProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateAnim = useRef(new Animated.Value(getInitialTranslate(direction, distance))).current;

  useEffect(() => {
    if (!active) {
      opacityAnim.setValue(0);
      translateAnim.setValue(getInitialTranslate(direction, distance));
      return;
    }

    const fadeAnimation = Animated.timing(opacityAnim, {
      toValue: 1,
      duration,
      delay,
      easing: easing || Easing.out(Easing.cubic),
      useNativeDriver: true,
    });

    let translateAnimation: Animated.CompositeAnimation;

    if (direction === "none") {
      // No translation, just fade
      translateAnim.setValue(0);
      fadeAnimation.start();
      return;
    }

    if (useSpring) {
      translateAnimation = Animated.spring(translateAnim, {
        toValue: 0,
        friction: springFriction,
        tension: springTension,
        delay,
        useNativeDriver: true,
      });
    } else {
      translateAnimation = Animated.timing(translateAnim, {
        toValue: 0,
        duration: duration + 50, // Slightly longer for a nice overlap
        delay,
        easing: easing || Easing.out(Easing.cubic),
        useNativeDriver: true,
      });
    }

    const parallel = Animated.parallel([fadeAnimation, translateAnimation]);
    parallel.start();

    return () => {
      parallel.stop();
    };
  }, [active, delay, direction, distance, duration, easing, opacityAnim, springFriction, springTension, translateAnim, useSpring]);

  const translateStyle = getTranslateStyle(direction, translateAnim);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          ...translateStyle,
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ─── Staggered Children Wrapper ──────────────────────────────────────

interface StaggeredListProps {
  children: React.ReactNode[];
  /** Base delay before the first item animates (default: 0) */
  baseDelay?: number;
  /** Delay between each item in ms (default: 60) */
  staggerDelay?: number;
  /** Duration of each item's animation (default: 400) */
  duration?: number;
  /** Direction items slide in from (default: 'up') */
  direction?: "up" | "down" | "left" | "right" | "none";
  /** Distance each item travels (default: 16) */
  distance?: number;
  /** Whether to use spring physics (default: false) */
  useSpring?: boolean;
  /** Custom container style */
  style?: ViewStyle | ViewStyle[];
  /** Custom style for each item wrapper */
  itemStyle?: ViewStyle;
}

export function StaggeredList({
  children,
  baseDelay = 0,
  staggerDelay = 60,
  duration = 400,
  direction = "up",
  distance = 16,
  useSpring = false,
  style,
  itemStyle,
}: StaggeredListProps) {
  return (
    <Animated.View style={style}>
      {children.map((child, index) => (
        <FadeInView
          key={index}
          delay={baseDelay + index * staggerDelay}
          duration={duration}
          direction={direction}
          distance={distance}
          useSpring={useSpring}
          style={itemStyle}
        >
          {child}
        </FadeInView>
      ))}
    </Animated.View>
  );
}

// ─── Scale Fade In (for modals, popups, FABs) ────────────────────────

interface ScaleFadeInProps {
  children: React.ReactNode;
  /** Delay before animation starts (default: 0) */
  delay?: number;
  /** Duration of the animation (default: 350) */
  duration?: number;
  /** Initial scale (default: 0.85) */
  initialScale?: number;
  /** Whether the animation is active (default: true) */
  active?: boolean;
  /** Custom style */
  style?: ViewStyle | ViewStyle[];
}

export function ScaleFadeIn({
  children,
  delay = 0,
  duration = 350,
  initialScale = 0.85,
  active = true,
  style,
}: ScaleFadeInProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(initialScale)).current;

  useEffect(() => {
    if (!active) {
      opacityAnim.setValue(0);
      scaleAnim.setValue(initialScale);
      return;
    }

    const anim = Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 100,
        delay,
        useNativeDriver: true,
      }),
    ]);

    anim.start();

    return () => {
      anim.stop();
    };
  }, [active, delay, duration, initialScale, opacityAnim, scaleAnim]);

  return (
    <Animated.View
      style={[
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────

function getInitialTranslate(
  direction: "up" | "down" | "left" | "right" | "none",
  distance: number
): number {
  switch (direction) {
    case "up":
      return distance;
    case "down":
      return -distance;
    case "left":
      return distance;
    case "right":
      return -distance;
    case "none":
      return 0;
  }
}

function getTranslateStyle(
  direction: "up" | "down" | "left" | "right" | "none",
  anim: Animated.Value
): ViewStyle {
  switch (direction) {
    case "up":
    case "down":
      return { transform: [{ translateY: anim as any }] };
    case "left":
    case "right":
      return { transform: [{ translateX: anim as any }] };
    case "none":
      return {};
  }
}
