import { useState, useEffect, useRef } from "react";
import { Text, View, Button, Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { router } from "expo-router";
import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function sendPushNotification(expoPushToken: string) {
  console.log("123", expoPushToken);

  const noti = [];
  noti.push(expoPushToken);
  const message = {
    to: "ExponentPushToken[JHYq3FF8-w7VHNgEqNpbfQ]",
    sound: "default",
    title: "Thông báo",
    body: "Duyệt hợp đồng thành công",
    data: { screen: "/(tabs)/settings" },
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

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
  throw new Error(errorMessage);
}

async function registerForPushNotificationsAsync() {
  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      handleRegistrationError(
        "Permission not granted to get push token for push notification!"
      );
      return;
    }
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ??
      Constants?.easConfig?.projectId;
    if (!projectId) {
      handleRegistrationError("Project ID not found");
    }
    try {
      const pushTokenString = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log(pushTokenString);
      return pushTokenString;
    } catch (e: unknown) {
      handleRegistrationError(`${e}`);
    }
  } else {
    handleRegistrationError("Must use physical device for push notifications");
  }
}

export default function NotificationProvider({ children }: any) {
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    console.log("abc");

    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? "a"))
      .catch((error: any) => setExpoPushToken(`${error}`));
  });

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
    const socket = new SockJS(`http://192.168.1.31:8080/ws`);
    // const fetchAPI = async () => {
    //   try {
    //     const notificationData = await getNotification()
    //     const total = await getNumberUnreadNotify()
    //     setTotalNotRead(total)
    //     setNotifications(notificationData)
    //   } catch (e) {
    //     console.log(e)
    //   }
    // }

    // fetchAPI()
    const stompClient = Stomp.over(socket);
    stompClient.connect({}, (frame: any) => {
      console.log("Connected: " + frame);
      stompClient.subscribe(
        `/topic/notifications/officeadminsep490@gmail.com`,
        (message) => {
          console.log(message.body);
          try {
            sendPushNotification(expoPushToken);
          } catch (e) {
            console.log(e);
          }

          // if (message.body) {
          //   setTotalNotRead((totalNotRead) => totalNotRead + 1)
          //   setNotifications((prevNotifications) => [JSON.parse(message.body), ...prevNotifications])
          // }
        }
      );
    });
    return () => {
      if (stompClient) {
        stompClient.disconnect();
      }
    };
  }, []);
  useEffect(() => {
    // Check if there's a notification that triggered the app launch
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        const socket = new SockJS(`http://192.168.1.31:8080/ws`);
        const stompClient = Stomp.over(socket);
        stompClient.connect({}, (frame: any) => {
          console.log("Connected: " + frame);
          stompClient.subscribe(
            `/topic/notifications/officeadminsep490@gmail.com`,
            (message) => {
              sendPushNotification(expoPushToken);

              // if (message.body) {
              //   setTotalNotRead((totalNotRead) => totalNotRead + 1)
              //   setNotifications((prevNotifications) => [JSON.parse(message.body), ...prevNotifications])
              // }
            }
          );
        });

        if (stompClient) {
          stompClient.disconnect();
        }

        const dataString = response.notification.request.content.dataString;
        console.log("quit: ", response.notification.request.content);

        if (dataString) {
          const data = JSON.parse(dataString);
          const screen = data.screen;
          if (screen) {
            router.push(screen);
          }
        }
      }
    });
  }, []);

  return children;
}
