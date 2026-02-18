import { Stack } from "expo-router";
import { useTheme } from "@/hooks";

export default function CampaignsLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="new" />
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
