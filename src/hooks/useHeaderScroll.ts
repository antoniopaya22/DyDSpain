/**
 * useHeaderScroll — Context to share scroll position between
 * the character sheet header and its tab content ScrollViews.
 *
 * The parent screen creates the Animated.Value + onScroll handler
 * and wraps the tab area with HeaderScrollProvider.
 * Each tab consumes it via useHeaderScroll() and binds its
 * Animated.ScrollView to the shared handler.
 */

import { createContext, useContext } from "react";
import { Animated } from "react-native";

interface HeaderScrollContextValue {
  /** Shared Animated.Value tracking vertical scroll offset */
  scrollY: Animated.Value;
  /** Pre-built onScroll handler — attach to Animated.ScrollView */
  onScroll: (...args: any[]) => void;
}

const fallbackScrollY = new Animated.Value(0);

const HeaderScrollContext = createContext<HeaderScrollContextValue>({
  scrollY: fallbackScrollY,
  onScroll: () => {},
});

export const HeaderScrollProvider = HeaderScrollContext.Provider;

export function useHeaderScroll(): HeaderScrollContextValue {
  return useContext(HeaderScrollContext);
}
