import MultiSelect2 from "@/components/sign/MultiSelect2";
import MultiSelect from "@/components/sign/MultiSelect";
import React, { useState, useRef, useMemo, useEffect } from "react";
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
  ToastAndroid,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useQuery } from "react-query";
import {
  getUserByPermission,
  sendMail,
} from "../../../../services/user.service";
import {
  getNewContractById,
  getNewContractByIdNotToken,
} from "@/services/contract.service";
import LottieView from "lottie-react-native";
import { statusRequest } from "@/components/utils/statusRequest";

const SendMail = () => {
  const { contract } = useLocalSearchParams();
  console.log("selectedContractWithStatus", contract);

  const contractData = JSON.parse(contract as string);
  console.log("contractData", contractData);

  const [value1, setValue1] = useState<any>();
  const [value2, setValue2] = useState<any>();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const richText = React.useRef(null);
  const [popUp, setPopUp] = useState(false);

  const { isLoading: loadingSALE, data: dataSale } = useQuery(
    "getUserByRoleSale",
    () => getUserByPermission("SALE")
  );
  const { isLoading: loadingAdmin, data: dataAdmin } = useQuery(
    "getUserByRoleAdmin",
    () => getUserByPermission("MANAGER")
  );
  const { isLoading: loadingAO, data: dataAO } = useQuery(
    "getUserByRoleAdminOfficer",
    () => getUserByPermission("OFFICER_ADMIN")
  );
  const { isLoading: loading, data: dataContract } = useQuery(
    "getContractDetail",
    () => getNewContractById(contractData?.id),
    {
      onSuccess: async (response) => {
        // if (type == '1') {
        //   setSelectedTo([{ label: response.object.partyA.email, value: response.object.partyA.email }])
        // } else if (type == '2') {
        //   setSelectedTo([{ label: response.object.partyB.email, value: response.object.partyB.email }])
        // }
      },
    }
  );
  const optionTo = useMemo(() => {
    if (contractData?.status == 1) return dataAO;
    else if (
      contractData?.status == 2 ||
      contractData?.status == 3 ||
      contractData?.status == 5 ||
      contractData?.status == 6
    )
      return dataSale;
    else if (contractData?.status == 4) return dataAdmin;
    else return [];
  }, [contractData?.status, dataAO, dataAdmin, dataSale]);

  const optionCC = useMemo(() => {
    if (
      contractData?.status == 1 ||
      contractData?.status == 5 ||
      contractData?.status == 6
    )
      return dataAO;
    else if (contractData?.status == 2 || contractData?.status == 3)
      return dataSale;
    else if (contractData?.status == 4) return dataAdmin;
    else return [];
  }, [contractData?.status, dataAO, dataAdmin, dataSale]);

  const openModal = (contract: any) => {
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
  };

  const handleSubmit = async () => {
    if (value1?.length === 0) {
      ToastAndroid.show(
        'Trường "Đến" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    if (title.trim() === "") {
      ToastAndroid.show(
        'Trường "Tiêu đề" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    if (content.trim() === "") {
      ToastAndroid.show(
        'Trường "Nội dung" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    const formData = new FormData();
    value1.forEach((email: any) => {
      formData.append("to", email);
    });
    if (value2?.length > 0) {
      value2.forEach((email: any) => {
        formData.append("cc", email);
      });
    }
    formData.append("subject", title);
    formData.append("htmlContent", content);
    formData.append("contractId ", contractData?.id);
    formData.append("attachments", `${dataContract?.object?.name}.pdf`);
    if (contractData?.status)
      formData.append("status", statusRequest[contractData?.status]?.status);
    formData.append("description", content);
    try {
      const response = await sendMail(formData);
      if (response) {
        ToastAndroid.show("Gửi yêu cầu thành công", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Gửi yêu cầu thất bại", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Gửi yêu cầu thất bại!", ToastAndroid.SHORT);
    }
  };
  if (loading || loadingSALE || loadingAO || loadingAdmin)
    return (
      <View style={styles.loader}>
        <LottieView
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container1}>
        <Text style={styles.label}>Đến</Text>
        <MultiSelect
          value1={value1}
          setValue1={setValue1}
          optionTo={optionTo}
        />
        <Text style={styles.label}>CC</Text>
        <MultiSelect2
          value2={value2}
          setValue2={setValue2}
          optionCC={optionCC}
        />
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
          onChangeText={(text) => setContent(text)}
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
          {contractData?.name}.pdf
        </Text>
        <TouchableOpacity style={styles.sendButton} onPress={handleSubmit}>
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
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default SendMail;
