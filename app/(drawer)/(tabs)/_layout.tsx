import React from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Link, Tabs } from "expo-router";
import { Pressable, Text } from "react-native";

import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import {
  FontAwesome5,
  FontAwesome6,
  Ionicons,
  Octicons,
} from "@expo/vector-icons";
import NotifyProvider, { useNotification } from "@/app/Context/NotifyContext";
import NotifyScreen from "./notify";

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={24} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const { totalNotRead, loading } = useNotification();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Trang chủ",
          tabBarIcon: ({ color }: any) => (
            <Ionicons name="home" size={24} color={color} />
          ),
          headerRight: () => (
            <Link href="/modal" asChild>
              <Pressable>
                {({ pressed }: any) => (
                  <FontAwesome
                    name="info-circle"
                    size={25}
                    color={Colors[colorScheme ?? "light"].text}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />
      <Tabs.Screen
        name="notify/index"
        options={{
          title: "Thông báo",
          tabBarIcon: ({ color }: any) => (
            <Octicons name="bell-fill" color={color} size={23} />
          ),
          tabBarBadge: !loading && totalNotRead > 0 ? totalNotRead : undefined,
        }}
      />

      <Tabs.Screen
        name="new-contract"
        options={{
          tabBarButton: () => null,
        }}
      />
      <Tabs.Screen
        name="old-contract"
        options={{
          title: "Hợp đồng cũ",
          headerShown: false,
          tabBarIcon: ({ color }: any) => (
            <TabBarIcon name="folder-open" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Trang cá nhân",
          headerShown: false,
          tabBarIcon: ({ color }: any) => (
            <FontAwesome5 name="user-alt" size={23} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
