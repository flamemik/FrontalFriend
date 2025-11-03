import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chat" />
        <Stack.Screen name="relax" />
        <Stack.Screen name="reminders" />
        <Stack.Screen name="physical-health" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
