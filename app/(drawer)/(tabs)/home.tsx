import { StyleSheet, Button, Pressable } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { getToken, removeToken, removeUser } from "@/config/tokenUser";
import { useContext, useEffect } from "react";
import { AppContext } from "@/app/Context/Context";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>home</Text>
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
});
