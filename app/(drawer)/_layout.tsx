import { View, Text, StyleSheet, Image, ToastAndroid } from "react-native";
import React, { useContext, useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  MaterialIcons,
  Ionicons,
  FontAwesome,
  FontAwesome5,
  FontAwesome6,
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { TouchableOpacity } from "react-native-gesture-handler";
import { getToken, getUserInfo } from "@/config/tokenUser";
import { AppContext } from "../Context/Context";
import NotificationProvider from "@/utils/useNotification";
import NotifyProvider from "../Context/NotifyContext";
import { useQuery } from "react-query";
import { getProfile } from "@/services/user.service";
import { AxiosError } from "axios";

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();
  const { userContext, setUserContext, userInfoC, setUserInfoC }: any =
    useContext(AppContext);
  console.log("ddd", userContext);

  const { data } = useQuery(
    ["userDetail", userContext],
    () => getProfile(userContext),
    {
      onSuccess: (response) => {
        console.log("responseeeee", response);
        setUserInfoC(response?.object);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data?.message || "Lỗi drawer",
          ToastAndroid.SHORT
        );
      },
    }
  );
  useEffect(() => {
    const checkUser = async () => {
      const c = await getToken();
      console.log("aaa", c);

      if (!c) {
        router.navigate("(auth)/signin");
      }
    };
    checkUser();
  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <TouchableOpacity
          onPress={() => {
            router.push("/(drawer)/(tabs)/profile");
          }}
        >
          <Image
            source={{
              uri: data?.object?.avatar || "https://via.placeholder.com/150",
            }}
            resizeMode="cover"
            width={80}
            height={80}
            style={styles.userImg}
          />
        </TouchableOpacity>
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{data?.object?.name}</Text>
          <Text style={styles.userEmail}>
            {data?.object?.email.length > 14
              ? `${data?.object?.email.substring(0, 14)}...`
              : data?.object?.email}
          </Text>
        </View>
      </View>

      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome
            name="search"
            size={24}
            color={pathname == "/search" ? "#fff" : "#000"}
          />
        )}
        label={"Tìm kiếm"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/search" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/search" ? "teal" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/search");
        }}
      />
      {!userInfoC?.permissions?.includes("SALE") && (
        <DrawerItem
          icon={() => (
            <FontAwesome5
              name="user-tie"
              size={24}
              color={pathname == "/employee" ? "#fff" : "#000"}
            />
          )}
          label={" Nhân viên"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/employee" ? "#fff" : "#000" },
          ]}
          style={{
            backgroundColor: pathname == "/employee" ? "teal" : "#fff",
          }}
          onPress={() => {
            router.push("/(drawer)/(tabs)/employee");
          }}
        />
      )}

      <DrawerItem
        icon={() => (
          <FontAwesome6
            name="file-signature"
            size={24}
            color={pathname == "/new-contract" ? "#fff" : "#000"}
          />
        )}
        label={"Hợp đồng mới"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/new-contract" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname == "/new-contract" ? "teal" : "#fff",
        }}
        onPress={() => {
          router.push("/(drawer)/new-contract");
        }}
      />
      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome
            name="folder-open"
            size={size}
            color={pathname == "/old-contract" ? "#fff" : "#000"}
          />
        )}
        label={"Hợp đồng cũ"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/old-contract" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname == "/old-contract" ? "teal" : "#fff",
        }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/old-contract");
        }}
      />
      {!userInfoC?.permissions?.includes("OFFICE_ADMIN") && (
        <DrawerItem
          icon={() => (
            <FontAwesome5
              name="coins"
              size={23}
              color={pathname == "/salary" ? "#fff" : "#000"}
            />
          )}
          label={" Bảng lương"}
          labelStyle={[
            styles.navItemLabel,
            { color: pathname == "/salary" ? "#fff" : "#000" },
          ]}
          style={{
            backgroundColor: pathname == "/salary" ? "teal" : "#fff",
          }}
          onPress={() => {
            router.push("/(drawer)/(tabs)/salary");
          }}
        />
      )}
      <DrawerItem
        icon={() => (
          <MaterialIcons
            name="account-circle"
            size={26}
            color={pathname == "/profile" ? "#fff" : "#000"}
          />
        )}
        label={"Trang cá nhân"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/profile" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/profile" ? "teal" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/profile");
        }}
      />
    </DrawerContentScrollView>
  );
};

export default function Layout() {
  return (
    <NotificationProvider>
      <NotifyProvider>
        <Drawer
          drawerContent={(props: any) => <CustomDrawerContent {...props} />}
          screenOptions={{ headerShown: false }}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{ headerShown: true, title: "" }}
          />
        </Drawer>
      </NotifyProvider>
    </NotificationProvider>
  );
}

const styles = StyleSheet.create({
  navItemLabel: {
    marginLeft: -20,
    fontSize: 18,
  },
  userInfoWrapper: {
    flexDirection: "row",
    paddingHorizontal: 10,
    paddingVertical: 20,
    borderBottomColor: "#ccc",
    borderBottomWidth: 1,
    marginBottom: 10,
  },
  userImg: {
    borderRadius: 40,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  userDetailsWrapper: {
    marginTop: 25,
    marginLeft: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    fontStyle: "italic",
    // textDecorationLine: "underline",
  },
});
