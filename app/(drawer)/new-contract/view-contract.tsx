import React, { useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Button,
  TextInput,
  SafeAreaView,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Pdf from "react-native-pdf";

const PDFExample = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [value, onChangeText] = React.useState("");
  const openModal = () => {
    console.log("1");
    setModalVisible(true);
  };
  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
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

      {/* <Modal
        transparent={true}
        animationType="slide"
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View>
          <Pdf
            trustAllCerts={false}
            source={{
              uri: "http://res.cloudinary.com/dphakhyuz/image/upload/v1718607314/PDF_ce22df98-54bf-4b93-9ce4-76db8c61f0d9.pdf",
              cache: true,
            }}
            onLoadComplete={(numberOfPages: any) => {
              console.log(`Number of pages: ${numberOfPages}`);
            }}
            onPageChanged={(page: number) => {
              console.log(`Current page: ${page}`);
            }}
            onError={(error: any) => {
              console.log(error);
            }}
            onPressLink={(uri: string) => {
              console.log(`Link pressed: ${uri}`);
            }}
            style={styles.pdf}
          />
        </View>
      </Modal> */}
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
      </View>
    </SafeAreaView>
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
});
