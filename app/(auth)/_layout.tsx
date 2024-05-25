import { getToken } from "@/config/tokenUser";
import { Redirect, Stack } from "expo-router";
import { useEffect } from "react";

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen name="signin" options={{ headerShown: false }} />
      <Stack.Screen name="signup" options={{ headerShown: false }} />
    </Stack>
  );
}
