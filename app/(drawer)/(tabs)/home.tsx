import { StyleSheet, Button, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { getToken, removeToken, removeUser } from "@/config/tokenUser";
import { useContext, useEffect } from "react";
import { AppContext } from "@/app/Context/Context";

export default function TabOneScreen() {
  const { setUserContext }: any = useContext(AppContext);

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
});
