import MultiSelect2 from "@/components/sign/MultiSelect2";
import MultiSelect from "@/components/sign/MultiSelect";
import React, { useState, useRef } from "react";
import {
  actions,
  RichEditor,
  RichToolbar,
} from "react-native-pell-rich-editor";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Button,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";

const SendMail = () => {
  const [value1, setValue1] = useState([
    "tu416164@gmail.com",
    "babichaeng820@gmail.com",
  ]);
  const [value2, setValue2] = useState([
    "tu416164@gmail.com",
    "babichaeng820@gmail.com",
  ]);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const richText = React.useRef(null);
  const [popUp, setPopUp] = useState(false);

  const openModal = (contract: any) => {
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
  };
  const handleHead = ({ tintColor }: any) => (
    <Text style={{ color: tintColor }}>H1</Text>
  );

  const handleSendMail = () => {
    console.log(value1, value2, title, content);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.label}>Đến</Text>
        <MultiSelect value1={value1} setValue1={setValue1} />
        <Text style={styles.label}>CC</Text>
        <MultiSelect2 value1={value1} setValue1={setValue1} />
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="Tiêu đề"
          onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.textContent}
          multiline={true}
          placeholder="Nhập nhận xét"
          onChangeText={(text) => setTitle(text)}
        />

        <Text style={styles.label}>Tệp đính kèm</Text>
        <Text
          style={{
            fontSize: 12,
            marginBottom: 5,
            marginTop: 10,
            marginLeft: 10,
          }}
        >
          Hợp đồng hôn nhân tổng thống.pdf
        </Text>
        <TouchableOpacity style={styles.sendButton} onPress={handleSendMail}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    justifyContent: "center",
    // alignItems: 'center',
    backgroundColor: "whitesmoke",
  },
  container1: {
    justifyContent: "center",
    marginHorizontal: 5,
    borderRadius: 20,
    borderColor: "gray",
    borderWidth: 1,
    backgroundColor: "white",
    shadowOffset: { width: -2, height: 4 },
    shadowColor: "#171717",
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 10,
    marginLeft: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginLeft: 10,
    backgroundColor: "white",
    fontSize: 12,
    marginRight: 10,
    maxHeight: 50,
  },
  textContent: {
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    height: "35%",
    maxHeight: "35%",
    marginLeft: 10,
    fontSize: 12,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "teal",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 15,
    marginHorizontal: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  content: {
    height: "10%",
    maxHeight: "50%",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default SendMail;
