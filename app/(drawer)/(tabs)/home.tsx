import { StyleSheet, Button, Pressable, Image } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { getToken, removeToken, removeUser } from "@/config/tokenUser";
import { useContext, useEffect } from "react";
import { AppContext } from "@/app/Context/Context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Timeline from "react-native-timeline-flatlist";

export default function TabOneScreen() {
  const { userContext, setUserContext }: any = useContext(AppContext);
  const data = [
    {
      time: "09:00",
      title: "Archery Training",
      description:
        "The Beginner Archery and Beginner Crossbow course does not require you to bring any equipment, since everything you need will be provided for the course. ",
      lineColor: "#009688",
      icon: require("../img/archery.png"),
    },
    {
      time: "10:45",
      title: "Play Badminton",
      description:
        "Badminton is a racquet sport played using racquets to hit a shuttlecock across a net.",
      icon: require("../img/badminton.png"),
    },
    {
      time: "12:00",
      title: "Custom rendered icon",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
    {
      time: "14:00",
      title: "Watch Soccer",
      description:
        "Team sport played between two teams of eleven players with a spherical ball. ",
      lineColor: "#009688",
      icon: require("../img/soccer.png"),
    },
    {
      time: "16:30",
      title: "Go to Fitness center",
      description: "Look out for the Best Gym & Fitness Centers around me :)",
      icon: require("../img/dumbbell.png"),
    },
  ];

  useEffect(() => {
    const checkToken = async () => {
      const c = await getToken();
      if (!c) {
        router.navigate("(auth/signin)");
      }
    };
    checkToken();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>home</Text>
      <Timeline
        style={styles.list}
        data={data}
        circleSize={20}
        circleColor="rgba(0,0,0,0)"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "#ff9797",
          color: "white",
          padding: 5,
          borderRadius: 4,
        }}
        descriptionStyle={{ color: "gray" }}
        // options={{
        //   style:{paddingTop:5}
        // }}
        innerCircle={"icon"}
      />
      {/* <TouchableOpacity
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
            out
          </Text>
        </Pressable>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  list: {
    flex: 1,
    marginTop: 20,
  },
});
