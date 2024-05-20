import {
  View,
  Text,
  Image,
  TouchableOpacity,
  useWindowDimensions,
  FlatList,
  Pressable,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { ScrollView } from "react-native-gesture-handler";
// import { SceneMap, TabBar, TabView } from "react-native-tab-view";

// const PhotosRoutes = () => (
//   <View style={{ flex: 1 }}>
//     <FlatList
//       data={photos}
//       numColumns={3}
//       renderItem={({ item, index }) => (
//         <View
//           style={{
//             flex: 1,
//             aspectRatio: 1,
//             margin: 3,
//           }}
//         >
//           <Image
//             key={index}
//             source={item}
//             style={{ width: "100%", height: "100%", borderRadius: 12 }}
//           />
//         </View>
//       )}
//     />
//   </View>
// );

// const LikesRoutes = () => (
//   <View
//     style={{
//       flex: 1,
//       backgroundColor: "blue",
//     }}
//   />
// );

// const renderScene = SceneMap({
//   first: PhotosRoutes,
//   second: LikesRoutes,
// });

const Profile = () => {
  // const layout = useWindowDimensions();
  // const [index, setIndex] = useState(0);

  // const [routes] = useState([
  //   { key: "first", title: "Photos" },
  //   { key: "second", title: "Likes" },
  // ]);

  // const renderTabBar = (props:any) => (
  //   <TabBar
  //     {...props}
  //     indicatorStyle={{
  //       backgroundColor: 'gray',
  //     }}
  //     style={{
  //       backgroundColor: 'white',
  //       height: 44,
  //     }}
  //     renderLabel={({ focused, route }: any) => (
  //       <Text style={[{ color: focused ? 'black' : 'gray' }]}>
  //         {route.title}
  //       </Text>
  //     )}
  //   />
  // );
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
          Tudeptrai
        </Text>
        <Text
          style={{
            color: "black",
            fonstSize: 20,
          }}
        >
          Sale
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
            Ha Noi
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
                fonstSize: 25,
                color: "gray",
              }}
            >
              122
            </Text>
            <Text
              style={{
                fonstSize: 20,
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
                fonstSize: 25,
                color: "gray",
              }}
            >
              67
            </Text>
            <Text
              style={{
                fonstSize: 20,
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
                fonstSize: 25,
                color: "gray",
              }}
            >
              77K
            </Text>
            <Text
              style={{
                fonstSize: 20,
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
                  fonstSize: 20,
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
            <Text
              style={{
                fonstSize: 25,
                color: "white",
              }}
            >
              Service
            </Text>
          </TouchableOpacity>
        </View>

        
      </View>
      {/* --------------------- */}
      <View style={{ marginBottom: 12 }}>
          <Text style={{ fontSize: 20, margin: 10 }}>
            Settings
          </Text>
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
