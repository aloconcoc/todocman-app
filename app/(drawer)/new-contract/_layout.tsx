import React from "react";
import { Stack } from "expo-router";
import { Button } from "react-native";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Hợp đồng mới" }}
      />
      <Stack.Screen
        name="view-contract"
        options={{
          title: "Quản lý hợp đồng",
          headerRight: () => <Button title="Ký" />,
        }}
      />
    </Stack>
  );
}
