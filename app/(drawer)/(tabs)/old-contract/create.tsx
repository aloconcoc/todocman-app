import React, { useState, useEffect } from "react";
import {
  Button,
  Image,
  View,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Text,
  FlatList,
  Modal,
  TouchableOpacity,
  Alert,
  TextInput,
  Pressable,
  Platform,
  ToastAndroid,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { createOldContract } from "@/services/contract.service";
import { router } from "expo-router";
import mime from "mime";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import * as DocumentPicker from "expo-document-picker";
import axios from "axios";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function UploadOldContract() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [allImages, setAllImages] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [contractName, setContractName] = useState("");
  const [ispdf, setIspdf] = useState(false);
  const [isimg, setIsimg] = useState(false);
  const [selectedPdf, setSelectedPdf] = useState("");
  const [pdf, setPdf] = useState("");
  const [viewpdf, setViewpdf] = useState("");
  const [extractedText, setExtractedText] = useState<any>();
  const [ocr, setOcr] = useState<any>();

  const [datePickerState, setDatePickerState] = useState({
    birthDate: new Date(),
    registrationDate: new Date(),
    enrollmentDate: new Date(),
    showPicker: null,
  });

  const [formattedDates, setFormattedDates] = useState({
    birthDate: "",
    registrationDate: "",
    enrollmentDate: "",
  });

  // Function to open the modal and display the selected image
  const openModal = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

  // Load images on startup
  useEffect(() => {
    loadImages();
    console.log("Loading images");
  }, []);

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        type: "application/pdf",
      });
      if (result.canceled === true) return;

      console.log("Document selected:", result);

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log("Document selected:", selectedFile);

        const base64String = await FileSystem.readAsStringAsync(
          selectedFile.uri,
          {
            encoding: FileSystem.EncodingType.Base64,
          }
        );
        setIspdf(true);
        setSelectedPdf(base64String);
        setPdf(selectedFile.name);
        setViewpdf(selectedFile.uri);
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Delete image from file system
  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
    setIsimg(false);
  };

  // Load images from file system
  const loadImages = async () => {
    await ensureDirExists();
    const files = await FileSystem.readDirectoryAsync(imgDir);
    if (files.length > 0) {
      setImages(files.map((f) => imgDir + f));
    }
  };

  // Hàm chọn ảnh từ thư viện
  const selectImageFromLibrary = async () => {
    setLoadingImages(true);
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
      base64: true,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      console.log("resu: " + result.assets[0]);

      const selectedImages = result.assets;
      const tempImages: string[] = [];
      const tmp: any[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        tempImages.push(selectedImages[i].uri);
        tmp.push(selectedImages[i]);
      }

      setImages([...images, ...tempImages]);
      setIsimg(true);
      const trimmedURI =
        Platform.OS === "android"
          ? result.assets[0].uri
          : result.assets[0].uri.replace("file://", "");
      const fileName = trimmedURI.split("/").pop();
      performOCR({
        uri: trimmedURI,
        height: result.assets[0].height,
        width: result.assets[0].width,
        type: mime.getType(trimmedURI),
        name: fileName,
      });
      // setAllImages([...allImages, ...tmp]);
      setAllImages([
        ...allImages,
        {
          uri: trimmedURI,
          height: result.assets[0].height,
          width: result.assets[0].width,
          type: mime.getType(trimmedURI),
          name: fileName,
        },
      ]);
    }
    setLoadingImages(false);
  };

  // Hàm chụp ảnh từ máy ảnh
  const selectImageFromCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync();

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      // base64: true,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      console.log("resdm: ", result.assets[0]);

      setImages([...images, result.assets[0].uri]);
      setIsimg(true);
      const trimmedURI =
        Platform.OS === "android"
          ? result.assets[0].uri
          : result.assets[0].uri.replace("file://", "");
      const fileName = trimmedURI.split("/").pop();
      performOCR({
        uri: trimmedURI,
        height: result.assets[0].height,
        width: result.assets[0].width,
        type: mime.getType(trimmedURI),
        name: fileName,
      });
      setAllImages([
        ...allImages,
        {
          uri: trimmedURI,
          height: result.assets[0].height,
          width: result.assets[0].width,
          type: mime.getType(trimmedURI),
          name: fileName,
        },
      ]);
    }
  };

  // Hàm chọn ảnh
  const selectImage = async (useLibrary: boolean) => {
    if (useLibrary) {
      await selectImageFromLibrary();
    } else {
      await selectImageFromCamera();
    }
  };

  const formatDate = (date: any) => {
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
  };

  const onChangeDate = (
    selectedDate: Date | undefined,
    field: keyof typeof datePickerState
  ) => {
    const currentDate = selectedDate || datePickerState[field];
    setDatePickerState((prevState) => ({
      ...prevState,
      [field]: currentDate,
      showPicker: null,
    }));
    setFormattedDates((prevState) => ({
      ...prevState,
      [field]: formatDate(currentDate),
    }));
  };
  const showDatepicker = (picker: any) => {
    setDatePickerState((prevState) => ({
      ...prevState,
      showPicker: picker,
    }));
  };

  const handleSubmit = async () => {
    const { birthDate, registrationDate, enrollmentDate } = datePickerState;
    if (!contractName.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        "Tên hợp đồng không được để trống",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        -48,
        1040
      );
      return;
    }
    if (images.length === 0) {
      ToastAndroid.show("Hãy chọn ảnh hợp đồng!", ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append("contractName", contractName);
    formData.append("contractStartDate", formatDate(birthDate));
    formData.append("contractEndDate", formatDate(registrationDate));
    formData.append("contractSignDate", formatDate(enrollmentDate));
    formData.append("content", extractedText);
    allImages.forEach((image: any) => {
      formData.append("images", image);
    });
    try {
      console.log("Form data", formData);

      const response = await createOldContract(formData);
      if (response.code == "00" && response.object) {
        ToastAndroid.show("Tạo hợp đồng thành công!", ToastAndroid.SHORT);
        router.navigate("old-contract");
      } else {
        ToastAndroid.show("Tạo hợp đồng thất bại!", ToastAndroid.SHORT);
        return;
      }
    } catch (error) {
      ToastAndroid.show("Có lỗi xảy ra", ToastAndroid.SHORT);
    }
  };

  const performOCR = async (file: any) => {
    console.log("Performing OCR", file);

    const url = "https://ocr-extract-text.p.rapidapi.com/ocr";
    const data = new FormData();
    data.append("image", file);

    const options = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        "x-rapidapi-key": "92021f1393msh4f4728412cc8162p1e117fjsn22b568c8183d",
        "x-rapidapi-host": "ocr-extract-text.p.rapidapi.com",
      },
      body: data,
    };
    setLoadingImages(true);

    try {
      console.log("123");

      const response = await fetch(url, options);
      console.log("456", response);

      const result = await response.json();
      console.log("789", result);

      const text = result.text || "";
      setExtractedText(text);
      console.log(typeof text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingImages(false);
    }
  };

  // Render image list item
  const renderItem = ({ item, drag, isActive }: RenderItemParams<any>) => {
    const filename = item.split("/").pop();
    // return (
    //   <TouchableOpacity onPress={() => openModal(item)}>
    //     <View
    //       style={{
    //         flexDirection: "row",
    //         marginHorizontal: 10,
    //         alignItems: "center",
    //         gap: 5,
    //       }}
    //     >
    //       <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
    //       <Text style={{ flex: 1 }}>
    //         {filename.length > 14
    //           ? `Ảnh hợp đồng ${filename.substring(0, 5)}.jpeg`
    //           : filename}
    //       </Text>
    //       {/* <Ionicons.Button
    //         name="cloud-upload"
    //         onPress={() => uploadImage(item)}
    //       /> */}
    //       <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
    //     </View>
    //   </TouchableOpacity>
    // );
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => openModal(item)}
          disabled={isActive}
        >
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 10,
              alignItems: "center",
              gap: 5,
              backgroundColor: isActive ? "gainsboro" : "transparent",
            }}
          >
            <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
            <Text style={{ flex: 1 }}>
              {filename.length > 14
                ? `Ảnh hợp đồng ${filename.substring(0, 5)}.jpeg`
                : filename}
            </Text>
            {/* <Ionicons.Button
            name="cloud-upload"
            onPress={() => uploadImage(item)}
          /> */}
            <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          marginVertical: 20,
          marginHorizontal: 5,
        }}
      >
        <TextInput
          onChangeText={(text) => setContractName(text)}
          placeholder="Tên hợp đồng"
          editable
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 5,
            padding: 5,
            flex: 1,
            marginHorizontal: 10,
          }}
        ></TextInput>
        <Button title="Lưu" onPress={() => handleSubmit()}></Button>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text>Ngày bắt đầu</Text>
        <TouchableOpacity
          onPress={() => showDatepicker("birthDate")}
          style={{
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 5,
            paddingHorizontal: 50,
            marginLeft: 12,
          }}
        >
          <View pointerEvents="none">
            <TextInput
              placeholder="dd/mm/yyyy"
              value={formattedDates.birthDate}
              editable={false}
              style={{ color: "black" }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text>Ngày kết thúc</Text>
        <TouchableOpacity
          onPress={() => showDatepicker("registrationDate")}
          style={{
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 5,
            paddingHorizontal: 50,
            marginHorizontal: 10,
          }}
        >
          <View pointerEvents="none">
            <TextInput
              placeholder="dd/mm/yyyy"
              value={formattedDates.registrationDate}
              editable={false}
              style={{ color: "black" }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 15,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Text>Ngày kí</Text>
        <TouchableOpacity
          onPress={() => showDatepicker("enrollmentDate")}
          style={{
            borderWidth: 1,
            alignItems: "center",
            borderRadius: 5,
            marginLeft: 56,
            paddingHorizontal: 50,
          }}
        >
          <View pointerEvents="none">
            <TextInput
              placeholder="dd/mm/yyyy"
              value={formattedDates.enrollmentDate}
              editable={false}
              style={{ color: "black" }}
            />
          </View>
        </TouchableOpacity>
        {datePickerState.showPicker && (
          <RNDateTimePicker
            minimumDate={new Date()}
            testID="dateTimePicker"
            value={datePickerState[datePickerState.showPicker]}
            mode="date"
            display="default"
            onChange={(event, selectedDate) =>
              selectedDate !== null &&
              datePickerState.showPicker !== null &&
              onChangeDate(selectedDate, datePickerState.showPicker)
            }
          />
        )}
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 15,
        }}
      >
        <TouchableOpacity
          disabled={ispdf}
          style={{
            backgroundColor: ispdf ? "gray" : "lightseagreen",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          onPress={() => selectImage(true)}
        >
          <Text style={{ color: "white" }}>Thư viện ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={ispdf}
          style={{
            backgroundColor: ispdf ? "gray" : "lightseagreen",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          onPress={() => selectImage(false)}
        >
          <Text style={{ color: "white" }}>Máy ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          disabled={isimg}
          style={{
            backgroundColor: isimg ? "gray" : "lightseagreen",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          onPress={pickDocument}
        >
          <Text style={{ color: "white" }}>Tải PDF</Text>
        </TouchableOpacity>
      </View>

      <DraggableFlatList
        data={images}
        onDragEnd={({ data }) => setImages(data)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />
      {/* <Text style={{ backgroundColor: "pink" }}>a{extractedText}</Text> */}

      {pdf && (
        <View>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}
          >
            File PDF
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>{pdf}</Text>
            <Ionicons.Button
              name="trash"
              onPress={() => {
                setIspdf(false);
                setSelectedPdf("");
                setPdf("");
                setViewpdf("");
              }}
            />
          </View>
        </View>
      )}
      {loadingImages && (
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
          {/* <Image source={require('../../assets/images/load.jpg')} /> */}
          <LottieView
            autoPlay
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "white",
            }}
            // Find more Lottie files at https://lottiefiles.com/featured
            source={require("@/assets/load.json")}
          />
        </View>
      )}

      {uploading && (
        <View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: "rgba(0,0,0,0.4)",
              alignItems: "center",
              justifyContent: "center",
            },
          ]}
        >
          <ActivityIndicator color="#fff" animating size="large" />
        </View>
      )}
      {/* Modal to display selected image */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
            <Ionicons
              name="close"
              size={35}
              color="papayawhip"
              style={{ backgroundColor: "turquoise", borderRadius: 50 }}
            />
          </TouchableOpacity>
          {selectedImage && (
            <Image style={styles.modalImage} source={{ uri: selectedImage }} />
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 160,
  },
});
