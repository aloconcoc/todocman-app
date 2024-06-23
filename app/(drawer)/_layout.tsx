import { View, Text, StyleSheet, Image } from "react-native";
import React, { useEffect } from "react";
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
} from "@expo/vector-icons";
import { router, usePathname } from "expo-router";

const CustomDrawerContent = (props: any) => {
  const pathname = usePathname();

  useEffect(() => {
    console.log(pathname);
  }, [pathname]);

  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.userInfoWrapper}>
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/7b/a7/39/7ba739ba094efcae41c155a262d3eb5d.jpg",
          }}
          width={80}
          height={80}
          style={styles.userImg}
        />
        <View style={styles.userDetailsWrapper}>
          <Text style={styles.userName}>YuJinniea</Text>
          <Text style={styles.userEmail}>ahnyujin@email.com</Text>
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
        style={{ backgroundColor: pathname == "/home" ? "#333" : "#fff" }}
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
        style={{ backgroundColor: pathname == "/signature" ? "#333" : "#fff" }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/signature");
        }}
      /> */}

      <DrawerItem
        icon={({ color, size }) => (
          <FontAwesome6
            name="file-contract"
            size={26}
            color={pathname == "/new-contract" ? "#fff" : "#000"}
          />
        )}
        label={"Hợp đồng mới"}
        labelStyle={[
          styles.navItemLabel,
          { color: pathname == "/new-contract" ? "#fff" : "#000" },
        ]}
        style={{
          backgroundColor: pathname == "/new-contract" ? "#333" : "#fff",
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
          backgroundColor: pathname == "/old-contract" ? "#333" : "#fff",
        }}
        onPress={() => {
          router.push("/(drawer)/(tabs)/old-contract");
        }}
      />
      <DrawerItem
        icon={() => (
          <MaterialCommunityIcons
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
        style={{ backgroundColor: pathname == "/profile" ? "#333" : "#fff" }}
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
    textDecorationLine: "underline",
  },
});
