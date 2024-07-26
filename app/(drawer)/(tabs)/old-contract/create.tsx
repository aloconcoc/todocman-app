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
  TouchableWithoutFeedback,
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
import axios, { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { getContractType } from "@/services/contract-type.service";
import { Picker } from "@react-native-picker/picker";

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
  const [extractedText, setExtractedText] = useState<any>();
  const [ocr, setOcr] = useState<any>();
  const queryClient = useQueryClient();
  const [loadingOcr, setLoadingOcr] = useState(false);
  const [contractType, setContractType] = useState("");
  const [openMenu, setOpenMenu] = useState(false);

  const {
    data: typeContract,
    isLoading,
    isError,
  } = useQuery("type-contract", () => getContractType({ page: 0, size: 100 }));

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

    // let result = await ImagePicker.launchImageLibraryAsync({
    //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
    //   allowsMultipleSelection: true,
    //   quality: 1,
    // });
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      type: "image/*",
      multiple: true,
    });
    if (result.canceled === true) {
      setLoadingImages(false);
      return;
    }

    console.log("cmm:", result.assets);

    if (!result.canceled) {
      // console.log("reslib: " + result.assets);

      const selectedImages = result.assets;
      const tempImages: string[] = [];
      const tmp: any[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        const trimmedURI =
          Platform.OS === "android"
            ? selectedImages[i].uri
            : selectedImages[i].uri.replace("file://", "");
        const fileName = trimmedURI.split("/").pop();
        tempImages.push(selectedImages[i].uri);
        tmp.push({
          uri: trimmedURI,
          type: mime.getType(trimmedURI),
          name: fileName,
        });
      }

      setImages([...images, ...tempImages]);
      setIsimg(true);
      // console.log("tmp files: ", tmp);

      setAllImages([...allImages, ...tmp]);
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
      // base64: true,
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
    console.log("date: ", typeof currentDate);
  };
  const showDatepicker = (picker: any) => {
    setDatePickerState((prevState) => ({
      ...prevState,
      showPicker: picker,
    }));
  };

  const handleCreateOldContract = useMutation(createOldContract, {
    onSuccess: async (res) => {
      if (res.code === "00" && res.object) {
        ToastAndroid.show("Tạo hợp đồng thành công!", ToastAndroid.SHORT);
        await queryClient.refetchQueries("old-contract-list");
        router.navigate("old-contract");
      } else {
        ToastAndroid.show("Tạo hợp đồng thất bại!", ToastAndroid.SHORT);
        return;
      }
    },
    onError: (error: AxiosError<{ message: string }>) => {
      console.log("Lỗi api: ", error.response?.data.message);

      ToastAndroid.show(
        error.response?.data?.message || "Lỗi hệ thống",
        ToastAndroid.SHORT
      );
    },
  });

  const handleSubmit = async () => {
    const { birthDate, registrationDate, enrollmentDate } = datePickerState;
    if (!contractName.trim()) {
      ToastAndroid.showWithGravityAndOffset(
        "Tên hợp đồng không được để trống",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        -48,
        1050
      );
      return;
    }
    // Kiểm tra ngày
    const startDate = new Date(birthDate);
    const endDate = new Date(registrationDate);
    const signDate = new Date(enrollmentDate);

    // Kiểm tra ngày kết thúc không trước ngày bắt đầu
    if (endDate < startDate) {
      ToastAndroid.show(
        "Ngày kết thúc không thể trước ngày bắt đầu",
        ToastAndroid.SHORT
      );
      return;
    }

    // Kiểm tra ngày ký không bé hơn ngày bắt đầu
    if (signDate < startDate) {
      ToastAndroid.show(
        "Ngày ký không thể trước ngày bắt đầu",
        ToastAndroid.SHORT
      );
      return;
    }

    // Kiểm tra ngày ký không sau ngày kết thúc
    if (signDate > endDate) {
      ToastAndroid.show(
        "Ngày ký không thể sau ngày kết thúc",
        ToastAndroid.SHORT
      );
      return;
    }

    if (
      images.length === 0 &&
      (selectedPdf === null || selectedPdf === undefined)
    ) {
      ToastAndroid.show("Hãy chọn ảnh hoặc file pdf!", ToastAndroid.SHORT);
      return;
    }
    if (contractType === "") {
      ToastAndroid.show("Chọn loại hợp đồng!", ToastAndroid.SHORT);
      return;
    }

    const formData = new FormData();
    formData.append("contractName", contractName);
    formData.append("contractTypeId", contractType);
    formData.append("contractStartDate", formatDate(birthDate));
    formData.append("contractEndDate", formatDate(registrationDate));
    formData.append("contractSignDate", formatDate(enrollmentDate));
    if (allImages.length > 0) {
      allImages.forEach((image: any) => {
        formData.append("images", image);
      });
      try {
        setLoadingOcr(true);
        const response = await fetch("http://192.168.1.42:2002/ocr", {
          // const response = await fetch("https://ocr-service-kxpc.onrender.com", {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        const result = await response.json();
        console.log("result", typeof result);

        setOcr(result);
        formData.append("content", result || "Lỗi scan text");
      } catch (error) {
        console.error("loi he thong", error);
        setLoadingOcr(false);
      }
    } else if (selectedPdf) {
      formData.append("images", selectedPdf);
      formData.append("content", "Hợp đồng tải lên từ file pdf");
    }
    handleCreateOldContract.mutate(formData);
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
  if (isLoading) {
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
  if (isError) {
    return <Text>Lỗi hệ thống</Text>;
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
          onChangeText={(text) => setContractName(text)}
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
          <Button title="Lưu" onPress={handleSubmit} />
        )}
      </View>
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
