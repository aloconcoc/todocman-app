import { useState, useEffect, useRef } from "react";
import * as Notifications from "expo-notifications";
import { router } from "expo-router";
// import SockJS from "sockjs-client";
// import { Stomp } from "@stomp/stompjs";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function sendPushNotification(expoPushToken: string) {
  console.log("123", expoPushToken);

  const noti = [];
  noti.push(expoPushToken);
  const message = {
    to: "ExponentPushToken[JHYq3FF8-w7VHNgEqNpbfQ]",
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

  // await fetch("http://192.168.1.31:2002/send-notification", {
  //   method: "POST",
  //   headers: {
  //     Accept: "application/json",
  //     "Accept-encoding": "gzip, deflate",
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(message),
  // });
}

export default function NotificationProvider({ children }: any) {
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log("forground: ", notification.request.content.data);
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("background: ", response.notification.request.content.data);
        const screen = response.notification.request.content.data.screen;
        if (screen) {
          router.push(screen);
        }
      });

    return () => {
      notificationListener.current &&
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      responseListener.current &&
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    // Check if there's a notification that triggered the app launch
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const dataString = response.notification.request.content;
        console.log("quit: ", response.notification.request.content);

        if (dataString) {
          const screen = response.notification.request.content.data.screen;
          if (screen) {
            console.log("screen: ", screen);

            router.push("(drawer)/(tabs)/search");
          }
        }
      }
    });
  }, []);

  return children;
}
