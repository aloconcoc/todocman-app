import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Pressable,
} from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { getProfile } from "@/services/user.service";
import { removeToken, removeUser } from "@/config/tokenUser";
import LottieView from "lottie-react-native";
import { useQuery } from "@tanstack/react-query";
import { AppContext } from "@/app/Context/Context";

const Profile = () => {
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

  const navigateToFreeSpace = () => {
    console.log("Free Space function");
  };
  const navigateToDateSaver = () => {
    console.log("Date saver");
  };

  const cacheAndCellularItems = [
    {
      icon: "rule",
      text: "Privacy Policy",
      action: navigateToFreeSpace,
    },
    { icon: "update", text: "About", action: navigateToDateSaver },
    { icon: "crop", text: "Service", action: navigateToDateSaver },
    { icon: "list", text: "Help & Support", action: navigateToDateSaver },
  ];

  const renderSettingsItem = ({ icon, text, action }: any) => (
    <TouchableOpacity
      onPress={action}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 8,
        paddingLeft: 12,
        backgroundColor: "white",
      }}
    >
      <MaterialIcons name={icon} size={24} color="black" />
      <Text
        style={{
          marginLeft: 36,
          fontWeight: 600,
          fontSize: 16,
        }}
      >
        {text}{" "}
      </Text>
    </TouchableOpacity>
  );

  if (!data) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
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
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <StatusBar backgroundColor={"white"} />
      <ScrollView>
        <View style={{ width: "100%" }}>
          <Text
            style={{
              marginBottom: 20,
              marginTop: -5,
              textAlign: "center",
              fontSize: 25,
            }}
          >
            {" "}
            Thông tin cá nhân
          </Text>
          <Image
            resizeMode="cover"
            style={{
              height: 100,
              width: "100%",
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
            source={{
              uri: data?.avatar || "https://via.placeholder.com/150",
            }}
            resizeMode="contain"
            style={{
              height: 155,
              width: 155,
              borderRadius: 999,
              borderColor: "gray",
              borderWidth: 2,
              marginTop: -90,
            }}
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
                {(data as { name: string }).name}
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
                {(data as { email: string }).email}
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
                {(data as { phone: string }).phone}
              </Text>
            </View>
          </View>

          <View
            style={{
              paddingVertical: 8,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: "gray",
                }}
              >
                Phòng ban
              </Text>
              <Text
                style={{
                  color: "black",
                }}
              >
                {(data as { department: string }).department}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: "gray",
                }}
              >
                Vị trí
              </Text>
              <Text
                style={{
                  color: "black",
                }}
              >
                {(data as { position: string }).position}
              </Text>
            </View>

            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
                marginHorizontal: 10,
              }}
            >
              <Text
                style={{
                  color: "gray",
                }}
              >
                Giới tính
              </Text>
              <Text
                style={{
                  color: "black",
                }}
              >
                {data.gender ? "Nam" : "Nữ"}
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
            >
              <Pressable onPress={() => router.navigate("profile/editProfile")}>
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Edit Profile
                </Text>
              </Pressable>
            </TouchableOpacity>

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
            >
              <Pressable
                onPress={async () => {
                  await removeToken();
                  await removeUser();
                  setUserContext(null);
                  router.navigate("/(auth)/signin");
                }}
              >
                <Text
                  style={{
                    color: "white",
                  }}
                >
                  Logout
                </Text>
              </Pressable>
            </TouchableOpacity>
          </View>
        </View>
        {/* --------------------- */}
        <View style={{ marginVertical: 12 }}>
          <Text style={{ fontSize: 20, margin: 10 }}>Settings</Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: "gray",
            }}
          >
            {cacheAndCellularItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderSettingsItem(item)}
              </React.Fragment>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
