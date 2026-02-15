import { Stack } from "expo-router";

export default function CampaignsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1a1a2e" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
