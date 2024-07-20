import React, { useState, useEffect } from "react";
import { getUser } from "@/config/tokenUser";
import { Text, View } from "@/components/Themed";
import LottieView from "lottie-react-native";

// Tạo Context
export const AppContext = React.createContext(null);

// Tạo Provider
export const AppProvider = ({ children }: any) => {
  const [loading, setLoading] = useState(true);
  const [userContext, setUserContext] = useState("");
  const [userInfoC, setUserInfoC] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      if (user != null) {
        setUserContext(user);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  if (loading) {
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
        {/* <Image source={require('../../assets/images/load.jpg')} /> */}
        <LottieView
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={{ userContext, setUserContext, userInfoC, setUserInfoC } as any}
    >
      {children}
    </AppContext.Provider>
  );
};
