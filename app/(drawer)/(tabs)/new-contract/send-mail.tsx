import MultiSelect from "@/components/sign/MultiSelect";
import React from "react";
import { SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";

const SendMail = () => {
  return (
    <SafeAreaView>
      <Text>Đến</Text>
      <MultiSelect />
      <Text>CC</Text>
      <MultiSelect />
      <Text>Tiêu đề</Text>
      <TextInput multiline={true}>Nội dung</TextInput>
      <Text>Tệp đính kèm</Text>
      <TouchableOpacity
        style={{ backgroundColor: "teal", padding: 10, borderRadius: 20 }}
      >
        <Text>Gửi</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};
export default SendMail;
