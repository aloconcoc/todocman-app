import { sendMailPublic, signContract } from "@/services/contract.service";
import { useMutation, useQueryClient } from "react-query";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import { ForwardedRef, RefObject, useRef, useState } from "react";
import { Button, StyleSheet, Text, ToastAndroid, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";

const Sign = ({ signText, setSignText, comment, contractData }: any) => {
  // console.log("cmt: ", comment);

  const ref = useRef<any>(null);
  const client = useQueryClient();

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

  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

  const signQuery = useMutation(signContract, {
    onSuccess: () => {
      ToastAndroid.show("Ký hợp đồng thành công!", ToastAndroid.SHORT);

      client.invalidateQueries({ queryKey: ["contract"] });
      setSignText("");
      setTimeout(() => {
        router.navigate("/new-contract");
      });
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
    if (!signText) {
      ToastAndroid.show("Vui lòng ký trước khi xác nhận!", ToastAndroid.SHORT);
      return;
    }
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
    formData.append("description", "Xác nhận ký hợp đồng");
    try {
      const response = await sendMailPublic(formData);
    } catch (error) {
      ToastAndroid.show(
        "Xảy ra lỗi trong quá trình gửi mail!",
        ToastAndroid.SHORT
      );
    }
  };

  if (signQuery.isLoading) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
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
  }

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
        <Button title="Xác nhận" onPress={handleExport} />
      </View>
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
});

export default Sign;
