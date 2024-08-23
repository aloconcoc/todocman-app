import { sendMailPublic, signContract } from "@/services/contract.service";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { ForwardedRef, RefObject, useContext, useRef, useState } from "react";
import {
  Button,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
import { AppContext } from "@/app/Context/Context";
import { getProfile } from "@/services/user.service";
import { AxiosError } from "axios";
import {
  getSMSCode,
  verifySMSCode,
} from "@/services/auth-sign-contract.service";

const Sign = ({
  signText,
  setSignText,
  comment,
  contractData,
  setModalVisible,
}: any) => {
  const { userContext }: any = useContext(AppContext);
  const { data: phoneData } = useQuery(["userDetail", userContext], () =>
    getProfile(userContext)
  );

  const ref = useRef<any>(null);
  const client = useQueryClient();
  const [checkOTP, setCheckOTP] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const getSMSQuery = useMutation(getSMSCode);

  const openOTP = () => {
    if (!signText) {
      ToastAndroid.show("Vui lòng ký trước khi xác nhận!", ToastAndroid.SHORT);
      return;
    }
    setCheckOTP(true);
  };
  const closeOTP = () => {
    setCheckOTP(false);
  };

  const handleOK = (signature: string) => {
    console.log("OK");
    setSignText(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    ref?.current.clearSignature();
    setSignText("");
  };

  const handleEnd = () => {
    ref.current?.readSignature();
    console.log("End of stroke");
  };

  const handleData = (data: any) => {
    console.log(data);
    console.log("handle Datas");
  };

  const handleCheck = async () => {
    try {
      const response = await verifySMSCode({
        phone: phoneData?.object?.phone,
        code: otpCode,
      });
      if (response.code == "00") {
        ToastAndroid.show(
          "Xác thực người dùng thành công!",
          ToastAndroid.SHORT
        );
        await handleExport();
        setCheckOTP(false);
        router.navigate(
          "/(drawer)/(tabs)/new-contract/details/" + contractData?.id
        );
      } else {
        ToastAndroid.show("OTP không chính xác", ToastAndroid.SHORT);
        setCheckOTP(false);
      }
    } catch (e) {
      ToastAndroid.show("Có lỗi xảy ra", ToastAndroid.SHORT);
      setCheckOTP(false);
    }
  };

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const signQuery = useMutation(signContract, {
    onSuccess: () => {
      ToastAndroid.show("Ký hợp đồng thành công!", ToastAndroid.SHORT);

      client.invalidateQueries("new-contract");
      setSignText("");
      setTimeout(() => {
        setModalVisible(false);
      }, 1000);
    },
    onError: (error: any) => {
      console.log(error);
      ToastAndroid.show("Xảy ra lỗi trong quá trình ký!", ToastAndroid.SHORT);
      ToastAndroid.show(
        "Xảy ra lỗi trong quá trình ký, Vui lòng kiểm tra lại!",
        ToastAndroid.SHORT
      );
      return;
    },
  });

  const handleExport = async () => {
    const dataRequest = {
      contractId: contractData?.id,
      signImage: signText,
      comment: comment || "Không có nhận xét",
      createdBy: contractData?.createdBy,
      customer: false,
    };
    signQuery.mutate(dataRequest);

    const formData = new FormData();

    formData.append("to", contractData?.createdBy);
    if (contractData?.approvedBy != null)
      formData.append("cc", contractData?.approvedBy);
    formData.append("subject", "Xác nhận ký hợp đồng");
    formData.append("htmlContent", "Xác nhận ký hợp đồng");
    formData.append("contractId ", contractData?.id);
    formData.append("status", "SIGN_A_OK");
    formData.append("createdBy", contractData?.createdBy);
    formData.append("reasonId", "");
    formData.append("description", "Xác nhận ký hợp đồng");
    console.log("form", formData);

    try {
      const response = await sendMailPublic(formData);
    } catch (error) {
      ToastAndroid.show(
        "Xảy ra lỗi trong quá trình gửi mail!",
        ToastAndroid.SHORT
      );
    }
  };

  return (
    <>
      <SignatureScreen
        ref={ref}
        onEnd={handleEnd}
        onOK={handleOK}
        onEmpty={handleEmpty}
        onGetData={handleData}
        descriptionText=""
        webStyle={style}
      />
      <View style={styles.row}>
        <Button title="Xóa" onPress={handleClear} />
        <Button
          title="Xác nhận"
          // onPress={() => {

          //   openOTP();
          //   getSMSQuery.mutate(phoneData?.object?.phone);
          // }}
          onPress={handleExport}
        />
      </View>
      {signQuery.isLoading && (
        <View style={styles.loadingOverlay}>
          <LottieView
            source={require("@/assets/load.json")}
            autoPlay
            loop
            style={styles.loadingAnimation}
          />
        </View>
      )}

      <Modal visible={checkOTP} transparent={true} animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modalContainer}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text></Text>
              <Pressable style={{}} onPress={closeOTP}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  ✘
                </Text>
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              Chúng tôi đã gửi mã xác thực về số điện thoại{" "}
              <Text style={{ fontWeight: "bold" }}>
                {phoneData?.object?.phone}
              </Text>
              . Hãy kiểm tra và xác thực người dùng.
            </Text>
            <View style={styles.otpContainer}>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                placeholder="Nhập mã xác thực"
                value={otpCode}
                onChangeText={(text) => setOtpCode(text)}
              />
              <Pressable
                style={{ backgroundColor: "green", borderRadius: 15 }}
                onPress={handleCheck}
              >
                <Text style={{ fontSize: 12, color: "white", padding: 12 }}>
                  ✓ Xác thực
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  row: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignContent: "center",
    alignSelf: "center",
    width: "100%",
    alignItems: "center",
    marginBottom: 50,
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    paddingTop: 5,
    width: "80%",
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    borderRadius: 15,
    marginBottom: 10,
    alignSelf: "flex-end",
    alignContent: "flex-end",
    textAlign: "right",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  closeText: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalText: {
    marginBottom: 20,
    // textAlign: "center",
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flex: 1,
    marginRight: 10,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingAnimation: {
    width: 100,
    height: 100,
  },
});

export default Sign;
