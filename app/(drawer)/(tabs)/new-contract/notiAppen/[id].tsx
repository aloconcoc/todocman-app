import Sign from "@/components/sign/signature";
import { Feather } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import { MenuView } from "@react-native-menu/menu";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  ToastAndroid,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Pdf from "react-native-pdf";
import { useLocalSearchParams } from "expo-router";
import { getNotificationByAppenId } from "@/services/notification.service";

const PDFExample = () => {
  const { id } = useLocalSearchParams();
  const idData = JSON.parse(id as string);

  const [notiapen, setNotiapen] = useState<any>();

  useEffect(() => {
    async function fetchData() {
      try {
        if (id) {
          const response = await getNotificationByAppenId(idData);

          setNotiapen(response.object);
        }
      } catch (error) {
        ToastAndroid.show("Không tìm thấy hợp đồng", ToastAndroid.SHORT);
      }
    }
    fetchData();
  }, [id]);

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: notiapen?.file,
          cache: true,
        }}
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}`);
        }}
        onError={(error) => {
          console.log(error);
        }}
        onPressLink={(uri) => {
          console.log(`Link pressed: ${uri}`);
        }}
        style={styles.pdf}
      />
    </View>
  );
};

export default PDFExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  comment: {
    backgroundColor: "pink",
    width: "100%",
    borderColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "rgba(255, 255, 255, 0.5)",
  },
  signButton: {
    position: "absolute",
    right: 20,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    elevation: 1,
    backgroundColor: "mediumturquoise",
    width: 50,
    height: 50,
    zIndex: 1,
    shadowColor: "darkgray",
    borderRadius: 50,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent1: {
    display: "flex",
    position: "absolute",
    alignItems: "baseline",
    justifyContent: "center",
    margin: "auto",
    width: "90%",
    height: "60%",
    backgroundColor: "white",
    borderRadius: 10,
    bottom: "20%",
    left: "5%",
  },
});
