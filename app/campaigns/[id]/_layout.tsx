import { Stack } from "expo-router";
import { useTheme } from "@/hooks/useTheme";

export default function CampaignDetailLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.bgPrimary },
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen
        name="character"
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack>
  );
}
