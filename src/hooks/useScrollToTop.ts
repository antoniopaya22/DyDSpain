/**
 * useScrollToTop — Scrolls a ScrollView to the top every time the screen
 * gains focus (mount + navigation back/forward).
 *
 * Uses useFocusEffect so it fires on every focus event, not just mount.
 * This ensures scroll resets when navigating between steps in a stack.
 *
 * Usage:
 *   const scrollRef = useScrollToTop();
 *   <ScrollView ref={scrollRef} ...>
 */

import { useRef, useCallback } from "react";
import { ScrollView } from "react-native";
import { useFocusEffect } from "expo-router";

/**
 * Returns a ref to attach to a ScrollView that auto-scrolls to top on focus.
 */
export function useScrollToTop() {
  const ref = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      // Brief delay to ensure layout is complete before scrolling
      const timer = setTimeout(() => {
        ref.current?.scrollTo({ y: 0, animated: false });
      }, 50);
      return () => clearTimeout(timer);
    }, []),
  );

  return ref;
}
