import React from "react";
import { Stack } from "expo-router";

export default function _layout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: "Trang cá nhân",
        }}
      />
      <Stack.Screen
        name="changePassword"
        options={{
          title: "Đổi mật khẩu",
        }}
      />
      <Stack.Screen
        name="ruleandservice"
        options={{
          title: "Điều khoản và dịch vụ",
        }}
      />
      <Stack.Screen
        name="secure"
        options={{
          title: "Chính sách riêng tư",
        }}
      />
    </Stack>
  );
}
