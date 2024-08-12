import React from "react";
import { Stack, router } from "expo-router";
import { Button } from "react-native";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Quản lý hợp đồng",
          headerRight: () => (
            <Button
              onPress={() => router.navigate("old-contract/create")}
              title="Tạo"
            />
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: "Tạo hợp đồng",
        }}
      />
    </Stack>
  );
}
