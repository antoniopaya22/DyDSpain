import { Stack } from "expo-router";

export default function CampaignDetailLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1a1a2e" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="edit" />
      <Stack.Screen
        name="character"
        options={{
          animation: "slide_from_bottom",
        }}
      />
      <Stack.Screen
        name="master"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
