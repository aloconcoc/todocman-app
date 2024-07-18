import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

async function sendPushNotification(expoPushToken: string) {
  const noti = [];
  noti.push(expoPushToken);
  const message = {
    to: expoPushToken,
    sound: "default",
    title: "title",
    body: "body",
    data: { screen: "/(tabs)/explore" },
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
}

export default function App() {
  const [expoPushToken, setExpoPushToken] = useState(
    "ExponentPushToken[JHYq3FF8-w7VHNgEqNpbfQ]"
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);

  return (
    <View
      style={{ flex: 1, alignItems: "center", justifyContent: "space-around" }}
    >
      <Text>Your Expo push token: {expoPushToken}</Text>
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <Text>
          Title: {notification && notification.request.content.title}{" "}
        </Text>
        <Text>Body: {notification && notification.request.content.body}</Text>
        <Text>
          Data:{" "}
          {notification && JSON.stringify(notification.request.content.data)}
        </Text>
      </View>
      <Button
        title="Send"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
      <Button
        title="target"
        onPress={() => router.navigate("/(tabs)/settings")}
      ></Button>
    </View>
  );
}
