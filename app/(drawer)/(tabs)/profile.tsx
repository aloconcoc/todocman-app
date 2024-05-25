import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Pressable,
} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
import { getProfile } from "@/services/user.service";
import { getToken, removeToken } from "@/config/tokenUser";
import LottieLoad from "@/assets/load.json";
import LottieView from "lottie-react-native";
import { useQuery } from "@tanstack/react-query";

const Profile = () => {
  // const [data, setData] = React.useState(null);
  // useEffect(() => {
  //   const fetchAPI = async () => {
  //     await getToken();
  //     const data = await getProfile("5cd4539c-1563-405e-a3f8-d2a5cf037cea");
  //     if (data) {
  //       setData(data.object);
  //     }
  //   };
  //   fetchAPI();
  // }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await getToken();
      const response = await getProfile("5cd4539c-1563-405e-a3f8-d2a5cf037cea");
      return response.object;
    },
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
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
            Profile
          </Text>
          <Image
            source={require("@/assets/images/image.png")}
            resizeMode="cover"
            style={{
              height: 228,
              width: "100%",
            }}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Image
            source={require("@/assets/images/c.jpg")}
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

          <Text
            style={{
              fontSize: 20,
              color: "gray",
              marginVertical: 8,
            }}
          >
            {(data as { name: string }).name}
          </Text>
          <Text
            style={{
              color: "black",
            }}
          >
            {(data as { role: string }).role}
          </Text>

          <View
            style={{
              flexDirection: "row",
              marginVertical: 6,
              alignItems: "center",
            }}
          >
            <MaterialIcons name="location-on" size={24} color="black" />
            <Text
              style={{
                fontSize: 20,
                marginLeft: 4,
              }}
            >
              {(data as { address: string }).address}
            </Text>
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
                122
              </Text>
              <Text
                style={{
                  color: "gray",
                }}
              >
                Followers
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
                67
              </Text>
              <Text
                style={{
                  color: "gray",
                }}
              >
                Followings
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
                77K
              </Text>
              <Text
                style={{
                  color: "gray",
                }}
              >
                Likes
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row" }}>
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
              <Pressable onPress={() => router.navigate("/editProfile")}>
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
                onPress={() => {
                  removeToken();
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
        <View style={{ marginBottom: 12 }}>
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
