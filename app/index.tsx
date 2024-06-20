import React, { useContext, useEffect, useState } from "react";
import { ImageBackground, StyleSheet, View } from "react-native";
import { Redirect } from "expo-router";
import { getToken } from "@/config/tokenUser";
import { AppContext } from "./Context/Context";

export default function HomeScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { userContext, setUserContext }: any = useContext(AppContext);

  useEffect(() => {
    const fetchAPI = async () => {
      const token = await getToken();
      if (token) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setIsLoading(false); // Cập nhật isLoading thành false khi useEffect được gọi
    };
    fetchAPI();
  }, []); // Không cần dependency ở đây

  if (isLoading) {
    return (
      <ImageBackground
        source={require("@/assets/images/load4.jpg")}
        style={styles.background}
      >
        <View style={styles.container}>
          {/* Loading indicator can be placed here */}
        </View>
      </ImageBackground>
    );
  }

  if (!isLoggedIn) {
    return <Redirect href="/(drawer)/(tabs)/home" />;
  } else {
    return <Redirect href={"/(auth)/signin"} />;
  }
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
