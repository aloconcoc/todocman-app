import Sign from "@/components/sign/signature";
import { Feather } from "@expo/vector-icons";
import React, { useRef, useState } from "react";
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
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Pdf from "react-native-pdf";
import { useLocalSearchParams } from "expo-router";

const PDFExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [value, onChangeText] = React.useState("");
  const [signText, setSignText] = useState<string>("");
  const { contract } = useLocalSearchParams();
  const contractData = JSON.parse(contract as string);

  const openModal = () => {
    setCommentVisible(false);
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
    setCommentVisible(false);
    console.log("signText", signText.substring(0, 20));

    setSignText("");
  };
  const openComment = () => {
    setCommentVisible(true);
    setModalVisible(false);
  };
  const closeComment = () => {
    setCommentVisible(false);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      <Pdf
        trustAllCerts={false}
        source={{
          uri: contractData?.file,
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

      <Modal
        animationType="fade"
        transparent={true}
        visible={commentVisible}
        onRequestClose={closeComment}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent1}>
          <Text
            style={{
              textAlign: "center",
              padding: 10,
              fontSize: 18,
              fontWeight: "500",
            }}
          >
            Nhận xét
          </Text>
          <ScrollView
            style={{
              width: "100%",
              borderBottomWidth: 1,
              borderColor: "#CCCCCC",
              shadowColor: "gray",
            }}
          >
            <TextInput
              placeholder="Đưa ra một số nhận xét về bản hợp đồng"
              editable
              multiline
              numberOfLines={5}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              style={{
                padding: 10,
                width: "100%",
              }}
            />
          </ScrollView>

          {/* <TouchableOpacity
              onPress={closeComment}
              style={{
                padding: 10,
                backgroundColor: "red",
                borderRadius: 10,
                margin: 5,
              }}
            >
              <Text style={{ color: "white" }}>Hủy</Text>
            </TouchableOpacity> */}
          <TouchableOpacity
            onPress={openModal}
            style={{
              padding: 10,
              backgroundColor: "teal",
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
              marginVertical: 5,
              // position: "absolute",
              // left: 200,
            }}
          >
            <Text style={{ color: "white" }}>Ký hợp đồng</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalOverlay} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContent1}>
          <Sign
            setModalVisible={setModalVisible}
            signText={signText}
            setSignText={setSignText}
            comment={value}
            contractData={contractData}
          />
        </View>
      </Modal>

      {contractData?.role == "ADMIN" ? (
        <View
          style={styles.signButton}
          // onPress={openComment}
        >
          {/* <MenuView
          isAnchoredToRight={true}
          onPressAction={({ nativeEvent }) => {
            if (nativeEvent.event === "sign") {
              openModal();
            } else if (nativeEvent.event === "cmt") {
              openComment();
            }
          }}
          actions={[
            {
              id: "cmt",
              title: "Nhận xét",
              titleColor: "#008B8B",
              subtitle: "Share action on SNS",
              image: Platform.select({
                ios: "square.and.arrow.up",
                android: "sym_action_chat",
              }),
              imageColor: "#008B8B",
              state: "on",
            },
          ]}
          shouldOpenOnLongPress={false}
        > */}

          <TouchableOpacity onPress={openComment}>
            <Feather name="list" size={24} color="black" />
          </TouchableOpacity>

          {/* </MenuView> */}
        </View>
      ) : null}
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
