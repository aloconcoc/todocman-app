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
  const [value2, setValue2] = useState([""]);

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
    <View style={styles.container}>
      <Text style={styles.label}>Đến</Text>
      <MultiSelect value1={value1} setValue1={setValue1} />
      <MultiSelect2 value1={value1} setValue1={setValue1} />
      <Text style={styles.label}>Tiêu đề</Text>
      <TextInput
        style={styles.textInput}
        multiline={true}
        placeholder="Tiêu đề"
        onChangeText={(text) => setTitle(text)}
      />
      <View style={[styles.inputGroup, { maxHeight: "80%" }]}>
        <Text style={styles.label}>Nội dung</Text>
        <RichToolbar
          editor={richText}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
            actions.insertLink,
            actions.keyboard,
            actions.setStrikethrough,
            actions.setUnderline,
            actions.removeFormat,
            actions.undo,
            actions.redo,
          ]}
          iconMap={{ [actions.heading1]: handleHead }}
        />
        <ScrollView style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1, maxHeight: "100%", height: "100%" }}
          >
            <RichEditor
              placeholder="Điền nhận xét"
              ref={richText}
              onChange={(descriptionText) => {
                console.log("descriptionText:", descriptionText);
                setContent(descriptionText);
              }}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
      <View style={{}}>
        <Text style={styles.label}>Tệp đính kèm: </Text>
      </View>
      <TouchableOpacity style={styles.sendButton} onPress={handleSendMail}>
        <Text style={styles.sendButtonText}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    // alignItems: 'center',
    backgroundColor: "whitesmoke",
  },
  container1: {
    justifyContent: "center",
    paddingVertical: 15,
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
    marginTop: 8,
    marginLeft: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    marginLeft: 15,
    backgroundColor: "white",
    fontSize: 12,
    marginRight: 15,
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
    height: "50%",
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
