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

const PDFExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [value, onChangeText] = React.useState("");
  const [signText, setSignText] = useState<string>("");

  const openModal = () => {
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
          uri: "http://res.cloudinary.com/dphakhyuz/image/upload/v1718607314/PDF_ce22df98-54bf-4b93-9ce4-76db8c61f0d9.pdf",
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
        <View style={styles.comment}>
          <Text style={{ textAlign: "center", padding: 10, fontSize: 15 }}>
            Nhận xét
          </Text>
          <ScrollView>
            <TextInput
              editable
              multiline
              numberOfLines={4}
              onChangeText={(text) => onChangeText(text)}
              value={value}
              style={{ padding: 10, backgroundColor: "cyan" }}
            />
          </ScrollView>
          <TouchableOpacity onPress={closeComment}>
            <Text>cancel</Text>
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
          <Sign signText={signText} setSignText={setSignText} />
        </View>
      </Modal>

      <View
        style={styles.signButton}
        // onPress={openComment}
      >
        <MenuView
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
              id: "sign",
              title: "Ký hợp đồng",
              titleColor: "green",
              image: Platform.select({
                ios: "plus",
                android: "ic_menu_edit",
              }),
              imageColor: "green",
            },
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
        >
          <View>
            <Feather name="list" size={24} color="black" />
          </View>
        </MenuView>
      </View>
    </View>
  );
};

export default PDFExample;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 25,
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
    // paddingLeft: 40,
    borderRadius: 10,
    bottom: "20%",
    left: "5%",
  },
});
