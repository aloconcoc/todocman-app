import MultiSelect2 from "@/components/sign/Multi2";
import MultiSelect from "@/components/sign/MultiSelect";
import React from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native";

const SendMail = () => {
  return (
    <View style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.label}>Đến</Text>

        <MultiSelect />
        <Text style={styles.label}>CC</Text>
        <MultiSelect2 />
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="Tiêu đề"
        />
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Nội dung</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            placeholder="Nội dung"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Tệp đính kèm</Text>
        </View>
        <TouchableOpacity style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Gửi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
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
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    marginTop: 5,
    marginLeft: 5,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginLeft: 15,
    backgroundColor: "white",
    fontSize: 16,
    marginRight: 15,
  },
  sendButton: {
    backgroundColor: "teal",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginHorizontal: 10,
  },
  sendButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default SendMail;
