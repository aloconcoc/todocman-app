import React from "react";
import { Stack } from "expo-router";
import { Button } from "react-native";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: false, title: "Hợp đồng mới" }}
      />
      <Stack.Screen
        name="view-contract"
        options={{
          title: "Xem hợp đồng",
          // headerShown: false,
        }}
      />
      <Stack.Screen
        name="send-mail"
        options={{
          title: "Gửi mail",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
