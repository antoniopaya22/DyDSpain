import { Stack } from "expo-router";

export default function CharacterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#1a1a2e" },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="create" />
      <Stack.Screen
        name="sheet"
        options={{
          animation: "fade",
        }}
      />
    </Stack>
  );
}
