/**
 * Master section layout — simple Stack for master mode screens
 */

import { Stack } from "expo-router";

export default function MasterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "transparent" },
        animation: "slide_from_right",
        animationDuration: 250,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[campaignId]" />
      <Stack.Screen name="character-view" />
    </Stack>
  );
}
