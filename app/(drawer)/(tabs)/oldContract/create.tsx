import React, { useState, useEffect, useRef } from "react";
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

  const [datePickerState, setDatePickerState] = useState({
    birthDate: new Date(),
    registrationDate: new Date(),
    enrollmentDate: new Date(),
    showPicker: null, // null | 'birth' | 'registration' | 'enrollment'
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

  // Save image to file system
  const saveImage = async (uri: string) => {
    await ensureDirExists();
    const filename = new Date().getTime() + ".jpeg";
    const dest = imgDir + filename;
    await FileSystem.copyAsync({ from: uri, to: dest });
    setImages([...images, dest]);
  };

  // Upload image to server
  const uploadImage = async (uri: string) => {
    setUploading(true);
    console.log("uri: " + uri);

    // await FileSystem.uploadAsync("http://192.168.1.52:8888/upload.php", uri, {
    //   httpMethod: "POST",
    //   uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    //   fieldName: "file",
    // });
    alert("Uploaded image to server");

    setUploading(false);
  };

  // Delete image from file system
  const deleteImage = async (uri: string) => {
    await FileSystem.deleteAsync(uri);
    setImages(images.filter((i) => i !== uri));
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
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      const selectedImages = result.assets;
      const tempImages: string[] = [];
      const tmp: any[] = [];
      for (let i = 0; i < selectedImages.length; i++) {
        tempImages.push(selectedImages[i].uri);
        tmp.push(selectedImages[i]);
      }
      setImages([...images, ...tempImages]);
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
      quality: 1,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      // saveImage(result.assets[0].uri);
      setAllImages([...allImages, result.assets[0]]);
      setImages([...images, result.assets[0].uri]);
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
    formData.append("birthDate", formatDate(birthDate));
    formData.append("registrationDate", formatDate(registrationDate));
    formData.append("enrollmentDate", formatDate(enrollmentDate));
    allImages.forEach((image: any) => {
      formData.append("image", image);
    });
    console.log("formdata: ", formData);
    try {
      const response = await createOldContract(formData);
      if (response.code == "00" && response.object) {
        ToastAndroid.show("Tạo hợp đồng thành công!", ToastAndroid.SHORT);
        router.navigate("oldContract");
      } else {
        ToastAndroid.show("Tạo hợp đồng thất bại!", ToastAndroid.SHORT);
        return;
      }
    } catch (error) {
      ToastAndroid.show("Có lỗi xảy ra", ToastAndroid.SHORT);
    }
  };

  // Render image list item
  const renderItem = ({ item }: { item: any }) => {
    const filename = item.split("/").pop();
    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 10,
            alignItems: "center",
            gap: 5,
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
          style={{
            backgroundColor: "lightseagreen",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          onPress={() => selectImage(true)}
        >
          <Text style={{ color: "white" }}>Thư viện ảnh</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            backgroundColor: "lightseagreen",
            padding: 8,
            borderRadius: 5,
            marginHorizontal: 5,
          }}
          onPress={() => selectImage(false)}
        >
          <Text style={{ color: "white" }}>Máy ảnh</Text>
        </TouchableOpacity>
      </View>
      {/* <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>
        Ảnh đính kèm
      </Text> */}

      <FlatList
        data={images}
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
