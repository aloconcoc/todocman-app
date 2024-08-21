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

  useEffect(() => {
    const checkToken = async () => {
      const c = await getToken();
      if (!c) {
        router.navigate("(auth/signin)");
      }
    };
    checkToken();
  }, []);
  return <View style={styles.container}></View>;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
