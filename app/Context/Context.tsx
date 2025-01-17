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
  const [loadingPopupVisible, setLoadingPopupVisible] = useState(false);
  const [oldName, setOldName] = useState("");
  const [realTime, setRealTime] = useState<any>(null);
  const [profileDrawer, setProfileDrawer] = useState<any>();

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
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <LottieView
          autoPlay
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }

  return (
    <AppContext.Provider
      value={
        {
          userContext,
          setUserContext,
          userInfoC,
          setUserInfoC,
          loadingPopupVisible,
          setLoadingPopupVisible,
          oldName,
          setOldName,
          realTime,
          setRealTime,
          profileDrawer,
          setProfileDrawer,
        } as any
      }
    >
      {children}
    </AppContext.Provider>
  );
};
