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
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import Ionicons from "@expo/vector-icons/Ionicons";
import LottieView from "lottie-react-native";

const imgDir = FileSystem.documentDirectory + "images/";

const ensureDirExists = async () => {
  const dirInfo = await FileSystem.getInfoAsync(imgDir);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(imgDir, { intermediates: true });
  }
};

export default function App() {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

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

    await FileSystem.uploadAsync("http://192.168.1.52:8888/upload.php", uri, {
      httpMethod: "POST",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
      fieldName: "file",
    });

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
      quality: 0.75,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      const selectedImages = result.assets;
      const tempImages: string[] = []; // Mảng tạm thời để chứa các ảnh đã chọn
      for (let i = 0; i < selectedImages.length; i++) {
        tempImages.push(selectedImages[i].uri);
        console.log("Selected image: ", selectedImages[i].uri);
      }
      setImages([...images, ...tempImages]); // Cập nhật danh sách ảnh sau khi vòng lặp kết thúc
    }
    setLoadingImages(false);
  };

  // Hàm chụp ảnh từ máy ảnh
  const selectImageFromCamera = async () => {
    await ImagePicker.requestCameraPermissionsAsync();

    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.75,
    };

    const result = await ImagePicker.launchCameraAsync(options);

    // Lưu ảnh nếu không bị hủy
    if (!result.canceled) {
      saveImage(result.assets[0].uri);
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

  // Render image list item
  const renderItem = ({ item }: { item: any }) => {
    const filename = item.split("/").pop();
    return (
      <TouchableOpacity onPress={() => openModal(item)}>
        <View
          style={{
            flexDirection: "row",
            margin: 1,
            alignItems: "center",
            gap: 5,
          }}
        >
          <Image style={{ width: 80, height: 80 }} source={{ uri: item }} />
          <Text style={{ flex: 1 }}>{filename}</Text>
          <Ionicons.Button
            name="cloud-upload"
            onPress={() => uploadImage(item)}
          />
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
          justifyContent: "space-evenly",
          marginVertical: 20,
        }}
      >
        <Button title="Photo Library" onPress={() => selectImage(true)} />
        <Button title="Capture Image" onPress={() => selectImage(false)} />
      </View>

      <Text style={{ textAlign: "center", fontSize: 20, fontWeight: "500" }}>
        My Images
      </Text>
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
              size={40}
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
    width: "85%",
    height: "85%",
    resizeMode: "contain",
  },
  closeButton: {
    position: "absolute",
    top: 30,
    right: 160,
  },
});
