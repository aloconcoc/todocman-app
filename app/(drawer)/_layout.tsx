import { View, Text, StyleSheet, Image } from "react-native";
import React, { useContext, useEffect } from "react";
import { Drawer } from "expo-router/drawer";
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import {
  Feather,
  AntDesign,
  MaterialIcons,
  Ionicons,
  FontAwesome6,
  FontAwesome,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import LottieView from "lottie-react-native";
import { getProfile } from "@/services/user.service";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "../Context/Context";
import { TouchableOpacity } from "react-native-gesture-handler";

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();

  // useEffect(() => {
  //   console.log(pathname);
  // }, [pathname]);

  const { userContext, setUserContext }: any = useContext(AppContext);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getProfile(userContext);
      return response.object;
    },
  });

  if (isLoading) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <LottieView
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }

  if (isError) {
    return <Text>Error: {error.message}</Text>;
  }

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
              uri: data?.avatar || "https://via.placeholder.com/150",
            }}
            width={80}
            height={80}
            style={styles.userImg}
          />
        </TouchableOpacity>
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>{data?.name}</Text>
          <Text style={styles.userEmail}>{data?.email}</Text>
        </View>
      </View>
      <DrawerItem
        icon={() => (
          <Ionicons
            name="home"
            size={24}
            color={pathname == "/home" ? "#fff" : "#000"}
          />
        )}
        label={"Trang chủ"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/home" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/home" ? "teal" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/home");
        }}
      />
      {/* <DrawerItem
        icon={({ color, size }) => (
          <MaterialIcons
            name="favorite-outline"
            size={size}
            color={pathname == "/signature" ? "#fff" : "#000"}
          />
        )}
        label={"Signature"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/signature" ? "#fff" : "#000" },
        ]}
        style={{ backgroundColor: pathname == "/signature" ? "teal" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/signature");
        }}
      /> */}

      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome5
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
    <Drawer
      drawerContent={(props: any) => <CustomDrawerContent {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Drawer.Screen name="(tabs)" options={{ headerShown: true, title: "" }} />
      <Drawer.Screen
        name="settings"
        options={
          {
            //  headerShown: true,
            // title: '',
          }
        }
      />
    </Drawer>
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
