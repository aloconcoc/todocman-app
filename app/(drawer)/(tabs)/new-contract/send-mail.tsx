import MultiSelect2 from "@/components/sign/MultiSelect2";
import MultiSelect from "@/components/sign/MultiSelect";
import React, { useState, useRef, useMemo } from "react";
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
  ActivityIndicator,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery, useQueryClient } from "react-query";
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
import { getParty } from "@/services/party.service";
import { getListReason } from "@/services/reason.service";
import { BASE_URL_FE } from "@/constants";
import { Picker } from "@react-native-picker/picker";

const SendMail = () => {
  const { contract } = useLocalSearchParams();
  const queryClient = useQueryClient();

  const contractData = JSON.parse(contract as string);
  // console.log("contractData", contractData);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const [selectedTo, setSelectedTo] = useState<any[]>([]);
  const [selectedCc, setSelectedCc] = useState<any[]>([]);
  const contractFile = useRef<any>();

  const [reason, setReason] = useState<any>();
  const [subject, setSubject] = useState<string>(
    statusRequest[contractData?.statuss]?.title
  );
  const [editorData, setEditorData] = useState<any>(
    statusRequest[contractData?.statuss]?.description
  );

  const { isLoading: loadingSALE, data: dataSale } = useQuery(
    "getUserByRoleSale",
    () => getUserByPermission("SALE"),
    {
      onSuccess: (data) => console.log("dmSale", data),
    }
  );
  const { isLoading: loadingAdmin, data: dataAdmin } = useQuery(
    "getUserByRoleAdmin",
    () => getUserByPermission("MANAGER"),
    { onSuccess: (data) => console.log("dmAdmin", data) }
  );
  const { isLoading: loadingAO, data: dataAO } = useQuery(
    "getUserByRoleAdminOfficer",
    () => getUserByPermission("OFFICE_ADMIN"),
    { onSuccess: (data) => console.log("dmAO", data) }
  );
  const { data: dataParty } = useQuery("party-data", getParty);
  const { data: dataReason } = useQuery(
    "reason-data",
    () => getListReason(0, 50),
    { onSuccess: (data) => setReason(data.content[0]?.id) }
  );
  const { isLoading: loading, data: dataContract } = useQuery(
    "getContractDetail",
    () => getNewContractById(contractData?.id),
    {
      onSuccess: async (response) => {
        if (contractData?.statuss == 1) {
          contractData?.rejectedBy != null &&
            setSelectedTo([contractData?.rejectedBy]);
        } else if (contractData?.statuss == 2 || contractData?.statuss == 3) {
          response?.object?.createdBy != null &&
            setSelectedTo([response?.object?.createdBy]);
        } else if (contractData?.statuss == 4) {
          setSelectedTo([dataParty?.object?.email]);
          response?.object?.createdBy != null &&
            setSelectedCc([response?.object?.createdBy]);
        } else if (contractData?.statuss == 6) {
          response?.object?.createdBy != null &&
            setSelectedTo([response?.object?.createdBy]);
          response?.object?.approvedBy != null &&
            setSelectedCc([response?.object?.approvedBy]);
        } else if (contractData?.statuss == 7) {
          const mailCC = [];
          response?.object.approvedBy != null &&
            mailCC.push(response?.object?.approvedBy);
          setSelectedCc(mailCC);
          response?.object?.partyB != null &&
            setSelectedTo([response?.object?.partyB.email]);
        }
        const fileUrl = response?.object?.file;
        const fileData = await fetch(fileUrl);
        const blob = await fileData.blob();
        contractFile.current = blob;
      },
    }
  );
  const optionTo = useMemo(() => {
    if (contractData?.statuss == 1) {
      return dataAO;
    } else if (
      contractData?.statuss == 2 ||
      contractData?.statuss == 3 ||
      contractData?.statuss == 5 ||
      contractData?.statuss == 6
    )
      return dataSale;
    else if (contractData?.statuss == 4) {
      console.log("dataParty", dataParty?.object?.email);

      return [
        { label: dataParty?.object?.email, value: dataParty?.object?.email },
      ];
    } else if (contractData?.statuss == 7) {
      return null;
    } else return [];
  }, [contractData?.statuss, dataAO, dataAdmin, dataSale]);

  const optionCC = useMemo(() => {
    if (
      contractData?.statuss == 1 ||
      contractData?.statuss == 5 ||
      contractData?.statuss == 6
    )
      return dataAO;
    else if (contractData?.statuss == 2 || contractData?.statuss == 3)
      return dataSale;
    else if (contractData?.statuss == 4)
      return [
        {
          label: contractData.createdBy,
          value: contractData.createdBy,
        },
      ];
    else if (contractData?.statuss == 7) {
      console.log("dataContractdumacc", dataContract);

      return null;
    } else return [];
  }, [contractData?.statuss, dataAO, dataAdmin, dataSale]);

  const handleSubmit = async () => {
    if (selectedTo?.length === 0) {
      ToastAndroid.show(
        'Trường "Đến" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    if (subject.trim() === "") {
      ToastAndroid.show(
        'Trường "Tiêu đề" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    if (editorData.trim() === "") {
      ToastAndroid.show(
        'Trường "Nội dung" không được để trống!',
        ToastAndroid.SHORT
      );
      return;
    }
    setLoadingSubmit(true);
    const formData = new FormData();
    selectedTo.forEach((email: any) => {
      console.log("email", email);

      formData.append("to", email);
    });
    if (selectedCc?.length > 0) {
      selectedCc.forEach((email: any) => {
        formData.append("cc", email);
      });
    }
    formData.append("subject", subject);
    const htmlContent = editorData;

    formData.append(
      "htmlContent",
      htmlContent +
        (contractData?.statuss == 4
          ? `<a href="${BASE_URL_FE}view/${contractData.id}/sign/1">Ký ngay</a>`
          : contractData?.statuss == 7
          ? `<a href="${BASE_URL_FE}view/${contractData.id}/sign/2">Ký ngay</a>`
          : "")
    );
    formData.append("contractId ", contractData?.id);
    formData.append(
      "reasonId",
      contractData.statuss == 3 ||
        contractData.statuss == 6 ||
        contractData.statuss == 9
        ? reason
        : ""
    );

    formData.append("attachments", `${dataContract?.object?.name}.pdf`);
    if (contractData?.statuss)
      formData.append("status", statusRequest[contractData?.statuss]?.status);
    formData.append("description", htmlContent);
    console.log("formData", formData);

    try {
      const response = await sendMail(formData);
      if (response) {
        ToastAndroid.show("Gửi yêu cầu thành công", ToastAndroid.SHORT);
        queryClient.invalidateQueries("new-contract");
        setLoadingSubmit(false);

        router.push({
          pathname: "(tabs)/new-contract/details/[id]",
          params: {
            id: contractData.id,
          },
        }),
          setSelectedTo([]);
        setSelectedCc([]);
        setSubject("");
        setEditorData("");
        setReason(null);
      } else {
        ToastAndroid.show("Gửi yêu cầu thất bại", ToastAndroid.SHORT);
        setLoadingSubmit(false);
      }
    } catch (error) {
      ToastAndroid.show("Gửi yêu cầu thất bại!", ToastAndroid.SHORT);
      setLoadingSubmit(false);
    }
  };
  if (loading || loadingSALE || loadingAO || loadingAdmin)
    return (
      <View style={styles.loader}>
        <LottieView
          autoPlay
          style={{
            width: "50%",
            height: "50%",
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
          value1={selectedTo}
          setValue1={setSelectedTo}
          optionTo={optionTo}
        />
        <Text style={styles.label}>CC</Text>
        <MultiSelect2
          value2={selectedCc}
          setValue2={setSelectedCc}
          optionCC={optionCC}
        />
        <Text style={styles.label}>Tiêu đề</Text>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder="Tiêu đề"
          onChangeText={(text) => setSubject(text)}
          defaultValue={subject}
        />
        {(contractData?.statuss == 3 ||
          contractData?.statuss == 6 ||
          contractData?.statuss == 9) && (
          <>
            <Text style={styles.label}>Nguyên nhân</Text>
            <Picker
              style={{ marginVertical: -10 }}
              selectedValue={reason}
              onValueChange={(itemValue) => setReason(itemValue)}
            >
              {dataReason?.content.map((reason: any) => (
                <Picker.Item
                  key={reason?.id}
                  label={reason?.title}
                  value={reason?.id}
                />
              ))}
            </Picker>
          </>
        )}

        <Text style={styles.label}>Nội dung</Text>
        <TextInput
          style={styles.textContent}
          multiline={true}
          placeholder="Nhập nhận xét"
          onChangeText={(text) => setEditorData(text)}
          defaultValue={editorData}
        />

        <View style={{ flexDirection: "row" }}>
          <Text style={styles.label}>Tệp đính kèm</Text>
          <Text
            style={{
              fontSize: 12,
              marginBottom: 5,
              marginTop: 10,
              marginLeft: 10,
              borderBottomColor: "gray",
              borderBottomWidth: 1,
            }}
          >
            {contractData?.name?.length > 25
              ? `${contractData.name.substring(0, 25)}...`
              : contractData?.name}
            .pdf
          </Text>
        </View>
        <TouchableOpacity
          style={styles.sendButton}
          onPress={handleSubmit}
          disabled={loadingSubmit}
        >
          {loadingSubmit ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.sendButtonText}>Gửi</Text>
          )}
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
    // borderWidth: 1,
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
    maxHeight: 40,
  },
  textContent: {
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 5,
    height: "15%",
    marginLeft: 10,
    fontSize: 12,
    marginRight: 10,
  },
  sendButton: {
    width: 60,
    backgroundColor: "teal",
    padding: 8,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 1,
    marginHorizontal: "auto",
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
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
});

export default SendMail;
