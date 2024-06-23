import { ForwardedRef, RefObject, useRef, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import SignatureScreen, {
  SignatureViewRef,
} from "react-native-signature-canvas";
interface Iprops {
  text: string;
  onOK: (signature: string) => void;
}
const Sign = ({ signText, setSignText }: any) => {
  const ref = useRef<any>(null);

  const handleOK = (signature: string) => {
    console.log("OK");
    setSignText(signature);
  };

  const handleEmpty = () => {
    console.log("Empty");
  };

  const handleClear = () => {
    ref?.current.clearSignature();
  };

  const handleEnd = () => {
    ref.current?.readSignature();
    console.log("End of stroke");
  };

  const handleData = (data: any) => {
    console.log(data);
    console.log("handle Datas");
  };

  const handleConfirm = () => {
    console.log("Confirm");
  };
  const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;

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
        <Button title="Xác nhận" onPress={handleConfirm} />
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
