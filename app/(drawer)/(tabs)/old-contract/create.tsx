import React, { useState, useEffect, useContext, useRef } from "react";
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
  TouchableWithoutFeedback,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { Image as CompressorImage } from "react-native-compressor";
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
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getContractType } from "@/services/contract-type.service";
import { Picker } from "@react-native-picker/picker";
import { OCR_URL } from "@/constants";
import { AppContext } from "@/app/Context/Context";
import regexPatterns from "@/constants/regex.json";

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
  const [selectedPdf, setSelectedPdf] = useState<any>(null);
  const queryClient = useQueryClient();
  const [loadingOcr, setLoadingOcr] = useState(false);
  const [contractType, setContractType] = useState("");
  const [openMenu, setOpenMenu] = useState(false);
  const [nameValidationMessage, setnameValidationMessage] = useState("");
  const { setOldName, setLoadingPopupVisible }: any = useContext(AppContext);
  const nameInputRef = useRef<any>(null);

  const {
    data: typeContract,
    isLoading,
    isError,
  } = useQuery(
    "type-contract",
    () => getContractType({ page: 0, size: 100, title: "" }),
    {
      onError: (err) => console.log(err),
    }
  );

  const [datePickerState, setDatePickerState] = useState({
    birthDate: new Date(),
    registrationDate: new Date(),
    enrollmentDate: new Date(),
    showPicker: null,
  });

  const [formattedDates, setFormattedDates] = useState({
    birthDate: new Date().toLocaleDateString(),
    registrationDate: new Date().toLocaleDateString(),
    enrollmentDate: new Date().toLocaleDateString(),
  });

  const openModal = (uri: string) => {
    setSelectedImage(uri);
    setModalVisible(true);
  };

  const closeModal = () => {
    setSelectedImage(null);
    setModalVisible(false);
  };

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

      // console.log("Document selected:", result);

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log("Document selected:", selectedFile);
        setIspdf(true);
        const trimmedURI =
          Platform.OS === "android"
            ? selectedFile.uri
            : selectedFile.uri.replace("file://", "");
        const fileName = trimmedURI.split("/").pop();
        console.log("type: ", mime.getType(trimmedURI));

        setSelectedPdf({
          uri: trimmedURI,
          type: mime.getType(trimmedURI),
          name: fileName,
        });
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };

  // Delete image from file system
  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
    setAllImages(allImages.filter((i: any) => i.uri !== uri));
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

    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "image/*",
      multiple: true,
    });

    if (result.canceled) {
      setLoadingImages(false);
      return;
    }

    if (!result.canceled) {
      console.log("reslib: " + JSON.stringify(result.assets));

      const selectedImages = result.assets;
      const tempImages: string[] = [];
      const tmp: any[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const trimmedURI =
          Platform.OS === "android"
            ? selectedImages[i].uri
            : selectedImages[i].uri.replace("file://", "");

        try {
          const compressedImage = await CompressorImage.compress(trimmedURI, {
            compressionMethod: "auto",
            maxWidth: 900,
            maxHeight: 1600,
            quality: 0.5,
          });

          const fileName = compressedImage.split("/").pop();
          tempImages.push(compressedImage);
          tmp.push({
            uri: compressedImage,
            type: mime.getType(compressedImage),
            name: fileName,
          });
        } catch (error) {
          console.error("Error compressing image:", error);
        }
      }

      setImages([...images, ...tempImages]);
      setIsimg(true);
      setAllImages([...allImages, ...tmp]);
      console.log("tmp images: ", tempImages);
    }

    setLoadingImages(false);
  };

  // Hàm chụp ảnh từ máy ảnh
  const selectImageFromCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync();

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.5,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      // console.log("resdm: ", result.assets[0]);

      setImages([...images, result.assets[0].uri]);
      setIsimg(true);
      const trimmedURI =
        Platform.OS === "android"
          ? result.assets[0].uri
          : result.assets[0].uri.replace("file://", "");
      const fileName = trimmedURI.split("/").pop();

      setAllImages([
        ...allImages,
        {
          uri: trimmedURI,
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
  const validateName = (name: any) => {
    const regex = new RegExp(regexPatterns.REGEX_TEXT);

    return regex.test(name.trim());
  };

  const handleNameCheck = (value: string) => {
    if (value.trim() === "") {
      setnameValidationMessage("Trường 'tên' không được để trống");
    } else if (validateName(value)) {
      setnameValidationMessage("Tên hợp lệ");
    } else {
      setnameValidationMessage("Tên không hợp lệ");
    }
  };
  const isFormValid = () => {
    return nameValidationMessage === "Tên hợp lệ";
  };

  const handleCreateOldContract = useMutation(createOldContract, {
    onSuccess: async (res) => {
      if (res.code === "00" && res.object) {
        ToastAndroid.show("Tạo hợp đồng thành công!", ToastAndroid.SHORT);
        await queryClient.refetchQueries("old-contract-list");
      } else {
        ToastAndroid.show(
          "Xảy ra lỗi trong quá trình tải hợp đồng!",
          ToastAndroid.SHORT
        );
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("Lỗi api: ", error.response?.data.message);
      ToastAndroid.show(
        error.response?.data?.message ||
          "Xảy ra lỗi trong quá trình tạo hợp đồng",
        ToastAndroid.SHORT
      );
    },
  });

  const performOCRAndUpload = async (formData: any) => {
    try {
      setLoadingOcr(true);

      // const response = await fetch("http://ocr.tdocman.id.vn/ocr", {
      const response = await fetch(OCR_URL, {
        method: "POST",
        body: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const result = await response.json();
      formData.append("content", result || "Lỗi scan text");
    } catch (error) {
      console.error("Lỗi OCR", error);
    } finally {
      setLoadingOcr(false);
      handleCreateOldContract.mutate(formData);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      nameInputRef.current.focus();
      return;
    }
    const { birthDate, registrationDate, enrollmentDate } = datePickerState;
    const startDate = new Date(birthDate);
    const endDate = new Date(registrationDate);
    const signDate = new Date(enrollmentDate);

    if (endDate < startDate) {
      ToastAndroid.show(
        "Ngày kết thúc không thể trước ngày bắt đầu",
        ToastAndroid.SHORT
      );
      return;
    }
    if (signDate > startDate) {
      ToastAndroid.show(
        "Ngày ký không thể sau ngày bắt đầu",
        ToastAndroid.SHORT
      );
      return;
    }
    if (signDate > endDate) {
      ToastAndroid.show(
        "Ngày ký không thể sau ngày kết thúc",
        ToastAndroid.SHORT
      );
      return;
    }

    if (contractType === "") {
      ToastAndroid.show("Chọn loại hợp đồng!", ToastAndroid.SHORT);
      return;
    }
    if (images.length === 0 && !selectedPdf) {
      ToastAndroid.show("Hãy chọn ảnh hoặc file pdf!", ToastAndroid.SHORT);
      return;
    }
    setLoadingPopupVisible(true);
    setOldName(contractName);
    setTimeout(() => {
      router.navigate("old-contract");
    }, 1000);

    const formData = new FormData();
    formData.append("contractName", contractName.trim());
    formData.append("contractTypeId", contractType);
    formData.append("contractStartDate", formatDate(birthDate));
    formData.append("contractEndDate", formatDate(registrationDate));
    formData.append("contractSignDate", formatDate(enrollmentDate));

    try {
      if (allImages.length > 0) {
        allImages.forEach((image: any) => {
          formData.append("images", image);
        });
        await performOCRAndUpload(formData);
      } else if (selectedPdf) {
        formData.append("images", selectedPdf);
        formData.append("content", "Hợp đồng tải lên từ file pdf");
        await handleCreateOldContract.mutate(formData);
      }
    } catch (error) {
      console.error("Lỗi old contract", error);
      ToastAndroid.show("Không tải được hợp đồng!", ToastAndroid.SHORT);
    } finally {
      setLoadingPopupVisible(false);
    }
  };

  // Render image list item
  const renderItem = ({ item, drag, isActive }: any) => {
    const filename = item.split("/").pop();

    return (
      // {/* <ScaleDecorator> */}
      // {/* <TouchableOpacity
      //   onLongPress={drag}
      //   onPress={() => openModal(item)}
      //   disabled={isActive}
      //   style={{ overflow: "scroll" }}
      // > */}
      <TouchableOpacity
        onPress={() => openModal(item)}
        style={{
          overflow: "scroll",
          flexDirection: "row",
          marginHorizontal: 10,
          alignItems: "center",
          gap: 5,
          backgroundColor: isActive ? "gainsboro" : "transparent",
        }}
      >
        <Image style={{ width: 80, height: 100 }} source={{ uri: item }} />
        <Text style={{ flex: 1 }}>
          {filename.length > 14
            ? `Ảnh hợp đồng ${filename.substring(0, 5)}...jpeg`
            : filename}
        </Text>

        <Ionicons.Button name="trash" onPress={() => deleteImage(item)} />
      </TouchableOpacity>
      // {/* </TouchableOpacity> */}
      // {/* </ScaleDecorator> */}
    );
  };
  if (isLoading || loadingImages) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <LottieView
          autoPlay
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }
  if (isError) {
    ToastAndroid.show("Không tìm thấy hợp đồng cũ", ToastAndroid.SHORT);
  }

  return (
    <SafeAreaView style={{ flex: 1, gap: 20 }}>
      <View
        style={{
          flexDirection: "row",
          marginTop: 10,
          marginHorizontal: 5,
        }}
      >
        <TextInput
          ref={nameInputRef}
          onChangeText={(text) => {
            setContractName(text);
            handleNameCheck(text);
          }}
          placeholder="Tên hợp đồng"
          editable={!handleCreateOldContract.isLoading && !loadingOcr}
          style={{
            borderColor: "black",
            borderWidth: 1,
            borderRadius: 5,
            paddingHorizontal: 5,
            flex: 1,
            marginHorizontal: 10,
          }}
        ></TextInput>
        {handleCreateOldContract.isLoading || loadingOcr ? (
          <ActivityIndicator size="large" color="lightseagreen" />
        ) : (
          <TouchableOpacity
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              backgroundColor: "dodgerblue",
              borderRadius: 5,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={handleSubmit}
            disabled={handleCreateOldContract.isLoading || loadingOcr}
          >
            <Text style={{ color: "white" }}>LƯU</Text>
          </TouchableOpacity>
        )}
      </View>
      {nameValidationMessage && (
        <Text
          style={{
            marginTop: -20,
            marginLeft: 15,
            opacity: 0.5,
            color: nameValidationMessage === "Tên hợp lệ" ? "white" : "red",
          }}
        >
          {nameValidationMessage}
        </Text>
      )}

      <View>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 15,
            marginBottom: 10,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text>Ngày bắt đầu</Text>
          <TouchableOpacity
            disabled={handleCreateOldContract.isLoading || loadingOcr}
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
            marginBottom: 10,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text>Ngày kết thúc</Text>
          <TouchableOpacity
            disabled={handleCreateOldContract.isLoading || loadingOcr}
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
            marginBottom: 10,
            justifyContent: "flex-start",
            alignItems: "center",
          }}
        >
          <Text>Ngày kí</Text>
          <TouchableOpacity
            disabled={handleCreateOldContract.isLoading || loadingOcr}
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
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <TouchableOpacity
          disabled={ispdf || handleCreateOldContract.isLoading || loadingOcr}
          style={styles.button}
          onPress={() => setOpenMenu(!openMenu)}
        >
          <Text>📤 Tệp đính kèm</Text>
        </TouchableOpacity>

        {openMenu && (
          <View style={styles.menu}>
            <TouchableOpacity
              disabled={
                ispdf || handleCreateOldContract.isLoading || loadingOcr
              }
              style={styles.menuOption}
              onPress={() => {
                console.log("Option 1 selected");
                selectImage(true);
                setOpenMenu(false);
              }}
            >
              <Text style={styles.menuText}>📂 Thư viện</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                ispdf || handleCreateOldContract.isLoading || loadingOcr
              }
              style={styles.menuOption}
              onPress={() => {
                console.log("Option 2 selected");
                selectImage(false);
                setOpenMenu(false);
              }}
            >
              <Text style={styles.menuText}>📷 Máy ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              disabled={
                ispdf ||
                handleCreateOldContract.isLoading ||
                loadingOcr ||
                isimg
              }
              style={styles.menuOption}
              onPress={() => {
                console.log("Option 3 selected");
                pickDocument();
                setOpenMenu(false);
              }}
            >
              <Text style={styles.menuText}>📋 Tệp Pdf</Text>
            </TouchableOpacity>
          </View>
        )}

        <View
          style={{
            width: "46%",
            height: 40,
            borderWidth: 1,
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <Picker
            selectedValue={contractType}
            onValueChange={(itemValue) => setContractType(itemValue as string)}
            enabled={!handleCreateOldContract.isLoading && !loadingOcr}
          >
            <Picker.Item
              style={{ color: "gray" }}
              label="Loại hợp đồng"
              value=""
              key=""
              enabled={false}
            />
            {typeContract?.content.map((d: any) => (
              <Picker.Item
                label={d.title}
                value={d.id}
                key={d.id}
                style={{ color: contractType === d.id ? "green" : "black" }}
              />
            ))}
          </Picker>
        </View>
      </View>
      {selectedPdf?.name && (
        <View>
          <Text
            style={{ fontSize: 20, fontWeight: "bold", marginVertical: 10 }}
          >
            Tệp PDF
          </Text>
          <View
            style={{
              flexDirection: "row",
              marginHorizontal: 15,
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text>
              {"File hợp đồng " + selectedPdf?.name.substring(0, 10) + "...pdf"}
            </Text>
            <Ionicons.Button
              name="trash"
              onPress={() => {
                setIspdf(false);
                setSelectedPdf(null);
              }}
            />
          </View>
        </View>
      )}

      <FlatList
        data={images}
        // onDragEnd={({ data }) => setImages(data)}
        renderItem={renderItem}
        keyExtractor={(item) => item}
      />

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
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          {selectedImage && (
            <>
              <View
                style={{
                  width: "90%",
                  height: "80%",
                }}
              >
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closeModal}
                >
                  <Ionicons
                    name="close"
                    size={35}
                    color="papayawhip"
                    style={{ backgroundColor: "turquoise", borderRadius: 50 }}
                  />
                </TouchableOpacity>
                <Image
                  style={styles.modalImage}
                  source={{ uri: selectedImage }}
                />
              </View>
            </>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalImage: {
    width: "100%",
    height: "95%",
    backgroundColor: "pink",
    resizeMode: "stretch",
  },
  closeButton: {
    width: 36,
    marginBottom: 10,
    marginHorizontal: "auto",
  },
  menu: {
    position: "absolute",
    backgroundColor: "white",
    top: 40,
    left: 28,
    borderRadius: 5,
    zIndex: 100,
    borderColor: "#cccccc",
    shadowColor: "#cccccc",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },
  menuOption: {
    paddingHorizontal: 20,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderColor: "#cccccc",
  },
  menuText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: "#0bbfb9",
    padding: 8,
    height: 40,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
