import React, { useEffect, useRef } from "react";
import { Text, View } from "react-native";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";
import { router, useLocalSearchParams } from "expo-router";
import WebView from "react-native-webview";

const Download = () => {
  const timerRef = useRef<any>(null);
  const { contract } = useLocalSearchParams();
  const contractData = JSON.parse(contract as string);

  useFocusEffect(
    React.useCallback(() => {
      timerRef.current = setTimeout(() => {
        router.replace("/(tabs)/old-contract");
      }, 200);

      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, [])
  );

  return (
    <>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LottieView
          autoPlay
          loop
          style={{
            width: 250,
            height: 250,
          }}
          source={require("@/assets/load.json")}
        />
      </View>
      <WebView
        style={{ display: "none" }}
        source={{ uri: contractData?.file }}
      />
    </>
  );
};

export default Download;
