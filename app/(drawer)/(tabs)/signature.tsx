import { ForwardedRef, RefObject, useRef } from "react";
import SignatureScreen, { SignatureViewRef } from "react-native-signature-canvas";
interface Iprops {
  text: string;
  onOK: (signature: string) => void;
}
const Sign = ({ text, onOK }:Iprops) => {
  const ref:RefObject<SignatureViewRef> = useRef<SignatureViewRef>(null);

  // Called after ref.current.readSignature() reads a non-empty base64 string
  const handleOK = (signature:string) => {
    console.log(signature);
    console.log("OK");
    // alert("OK");
    // onOK(signature); // Callback from Component props
  };

  // Called after ref.current.readSignature() reads an empty string
  const handleEmpty = () => {
    console.log("Empty");
  };

  // Called after ref.current.clearSignature()
  const handleClear = () => {
    console.log("clear success!");
  };

  // Called after end of stroke
  const handleEnd = () => {
    ref.current?.readSignature();
    console.log("End of stroke");
    
  };

  // Called after ref.current.getData()
  const handleData = (data:any) => {
    console.log(data);
    console.log("handle Datas");
  };

  return (
    <SignatureScreen
      ref={ref}
      onEnd={handleEnd}
      onOK={handleOK}
      onEmpty={handleEmpty}
      onClear={handleClear}
      onGetData={handleData}
     
      descriptionText={text}
    />
  );
};

export default Sign;