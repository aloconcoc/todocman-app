import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Pressable,
  ToastAndroid,
  ActivityIndicator,
  Modal,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import {
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { getProfile, logout } from "@/services/user.service";
import { clearAll, removeToken, removeUser } from "@/config/tokenUser";
import { getProfile, logout } from "@/services/user.service";
import { clearAll, removeToken, removeUser } from "@/config/tokenUser";
import LottieView from "lottie-react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AppContext } from "@/app/Context/Context";
import { AxiosError } from "axios";

const Profile = () => {
  const { userContext, setUserContext, userInfoC, setUserInfoC }: any =
    useContext(AppContext);
  const { userContext, setUserContext, userInfoC, setUserInfoC }: any =
    useContext(AppContext);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery(
    ["userDetail", userContext],
    () => getProfile(userContext),
    {
      onSuccess: (response) => {},
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          "Không thể lấy thông tin người dùng",
          ToastAndroid.SHORT
        );
      },
    }
  );

  const logoutQuery = useMutation(
    async () => {
      if (data?.object?.email) await logout(data?.object?.email);
    },
    {
      onSuccess: async () => {
        ToastAndroid.show("Đăng xuất thành công!", ToastAndroid.SHORT);
        queryClient.clear();
        await clearAll();
        setUserContext(null);
        setUserInfoC(null);
        router.push("/(auth)/signin");
      },
      onError: (e) => {
        console.log("error up", e);
        ToastAndroid.show("Lỗi đăng xuất", ToastAndroid.SHORT);
        return;
      },
    }
  );

  const handleLogout = async () => {
    logoutQuery.mutate();
  };

  if (isError) {
    ToastAndroid.show("Không thể lấy thông tin người dùng", ToastAndroid.SHORT);
  }

  const navigateChangePassword = () => {
    console.log("1");
    router.navigate("/profile/changePassword");
  };
  const navigateInfo = () => {
    router.navigate("/profile/ruleandservice");
  };
  const navigateRule = () => {
    router.navigate("/profile/secure");
  };

  const cacheAndCellularItems = [
    {
      icon: "cached",
      text: "Sửa mật khẩu",
      action: navigateChangePassword,
    },
    {
      icon: "info-outline",
      text: "Điều khoản sử dụng",
      action: navigateInfo,
    },
    {
      icon: "security",
      text: "Chính sách riêng tư",
      action: navigateRule,
    },
  ];

  const renderSettingsItem = ({ icon, text, action }: any) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginTop: 5,
        paddingVertical: 10,
        paddingLeft: 12,
        backgroundColor: "white",
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 20,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {text}{" "}
      </Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ backgroundColor: "white" }}>
      <View style={{ width: "100%" }}>
        <Text
          style={{
            marginBottom: 20,
            marginTop: 10,
            textAlign: "center",
            fontSize: 25,
          }}
        >
          {" "}
          Thông tin cá nhân
        </Text>
        <View
          style={{
            height: 80,
          }}
        />
      </View>

      <View
        style={{
          flex: 1,
          alignItems: "center",
        }}
      >
        <Image
          resizeMode="cover"
          style={{
            height: 155,
            width: 155,
            borderRadius: 999,
            borderColor: "dimgray",
            borderWidth: 1,
            marginTop: -90,
          }}
          source={
            data?.object?.avatar
              ? { uri: data?.object?.avatar }
              : {
                  uri: "https://via.placeholder.com/150",
                }
          }
        />

        <View
          style={{
            alignItems: "center",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              marginVertical: 8,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="person" size={24} color="black" />
            <Text
              style={{
                fontSize: 24,
                color: "black",
                marginLeft: 4,
                fontWeight: "bold",
              }}
            >
              {data?.object?.name || "name"}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              marginVertical: 6,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="email" size={24} color="black" />
            <Text
              style={{
                color: "black",
                marginLeft: 4,
                fontSize: 16,
              }}
            >
              {data?.object?.email}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 6,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="phone" size={24} color="black" />
            <Text
              style={{
                fontSize: 18,
                marginLeft: 4,
              }}
            >
              {data?.object?.phone}
            </Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 15,
          }}
        >
          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "green",
              borderRadius: 10,
              marginHorizontal: 20,
            }}
            onPress={() => router.navigate("profile/editProfile")}
            disabled={logoutQuery.isLoading}
          >
            <Text
              style={{
                color: "white",
              }}
            >
              <Feather name="edit" size={15} color="white" />
              Chỉnh sửa
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              width: 124,
              height: 36,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "firebrick",
              borderRadius: 10,
              marginHorizontal: 20,
            }}
            onPress={async () => {
              handleLogout();
            }}
          >
            {logoutQuery.isLoading ? (
              <ActivityIndicator size="large" color="white" />
            ) : (
              <Text
                style={{
                  color: "white",
                }}
              >
                <MaterialCommunityIcons
                  name="logout-variant"
                  size={16}
                  color="white"
                />
                Đăng xuất
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "#ccc",
          marginTop: 20,
          marginHorizontal: 10,
        }}
      ></View>
      <View style={{ marginVertical: 20, marginLeft: 15 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="settings" size={24} color="black" />
          <Text style={{ fontSize: 20, marginLeft: 5, fontWeight: "bold" }}>
            Cài đặt
          </Text>
        </View>

        <View
          style={{
            borderRadius: 12,
            marginTop: 10,
          }}
        >
          {cacheAndCellularItems.map((item, index) => (
            <React.Fragment key={index}>
              {renderSettingsItem(item)}
            </React.Fragment>
          ))}
        </View>
      </View>
      <Modal transparent={true} visible={isLoading} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <LottieView
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
            source={require("@/assets/load.json")}
          />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default Profile;
