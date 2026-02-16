import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function CharacterLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="create" />
      <Stack.Screen
        name="sheet"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
