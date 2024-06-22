import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { getNewContract } from "@/services/contract.service";
import WebView from "react-native-webview";
import {
  FontAwesome5,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import Pdf from "react-native-pdf";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  MenuProvider,
} from "react-native-popup-menu";
import { router } from "expo-router";

const NewContract = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [popUp, setPopUp] = useState(false);

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["contract", page, size],
    queryFn: async () => {
      const response = await getNewContract(page, size);
      // console.log("new contract", response?.object);

      return response?.object;
    },
  });

  useEffect(() => {
    if (data) {
      setTotalPage(data.totalPages || 1);
    }
  }, [data]);

  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  if (isLoading) {
    return (
      <View style={styles.loader}>
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
    return <Text>Error: {error.message}</Text>;
  }

  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
    setSelectedContract(null);
  };

  const handleAction = (action: string) => {
    console.log(`${action}`, selectedContract);
    if (action == "Xem") {
      console.log("xem trước");
      router.navigate("/new-contract/view-contract");
    } else if (action == "Ký") {
      console.log("ký hợp đồng");
    } else if (action == "Trình ký") {
      console.log("trình ký");
    } else if (action == "Gửi ký") {
      console.log("gửi ký");
    } else if (action == "Xóa") {
      console.log("xóa");
    }
    closeModal();
  };
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{(index + 1).toString()}</Text>
      <Text style={styles.cell}>{item.name}</Text>
      <TouchableOpacity style={styles.cell} onPress={() => openModal(item)}>
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color="black"
          style={{ textAlign: "center", alignItems: "center" }}
        />
      </TouchableOpacity>

      {popUp && selectedContract === item && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={popUp}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent1}>
            <TouchableOpacity onPress={() => handleAction("Xem")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="preview" size={28} color="black" />
                <Text style={styles.menuOptionText}>Xem trước</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction("Ký")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <FontAwesome5 name="signature" size={24} color="black" />
                <Text style={styles.menuOptionText}>Ký hợp đồng</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction("Trình ký")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="outgoing-mail" size={28} color="black" />
                <Text style={styles.menuOptionText}>Trình ký</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction("Gửi ký")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name="email-edit"
                  size={24}
                  color="black"
                />
                <Text style={styles.menuOptionText}>Gửi ký</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleAction("Xóa")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="delete" size={24} color="black" />
                <Text style={styles.menuOptionText}>Xóa</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerCell}>STT</Text>
        <Text style={styles.headerCell}>Tên hợp đồng</Text>
        <Text style={styles.headerCell}>Hành động</Text>
      </View>
      <FlatList
        data={data.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {selectedContract && (
        <Modal
          transparent={true}
          animationType="slide"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            {/* <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chi tiết hợp đồng</Text>
              <Text style={styles.textGap}>
                Tên hợp đồng:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {selectedContract.contractName}
                </Text>
              </Text>
              <Text style={styles.textGap}>
                Ngày bắt đầu:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formatDate(selectedContract.contractStartDate)}
                </Text>
              </Text>
              <Text style={styles.textGap}>
                Ngày hết hạn:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formatDate(selectedContract.contractEndDate)}
                </Text>
              </Text>
              <Text style={styles.textGap}>
                Ngày kí:{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {formatDate(selectedContract.contractSignDate)}
                </Text>
              </Text>
              <Text style={{ marginTop: 10, opacity: 0.5 }}>
                --Kiểm tra mục tải xuống trên máy--
              </Text>

              <View style={{ height: 1, width: 1 }}>
                <WebView source={{ uri: selectedContract?.file }} />
              </View>
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>
            </View> */}
            <Pdf
              trustAllCerts={false}
              source={{
                uri: "http://res.cloudinary.com/dphakhyuz/image/upload/v1718607314/PDF_ce22df98-54bf-4b93-9ce4-76db8c61f0d9.pdf",
                cache: true,
              }}
              onLoadComplete={(numberOfPages: any) => {
                console.log(`Number of pages: ${numberOfPages}`);
              }}
              onPageChanged={(page: number) => {
                console.log(`Current page: ${page}`);
              }}
              onError={(error: any) => {
                console.log(error);
              }}
              onPressLink={(uri: string) => {
                console.log(`Link pressed: ${uri}`);
              }}
              style={styles.pdf}
            />
          </View>
        </Modal>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 1,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },
  textGap: {
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
    alignItems: "center",
  },
  cell: {
    flex: 1,
    padding: 8,
    textAlign: "center",
    alignItems: "center",
  },
  linkText: {
    color: "blue",
    textAlign: "center",
  },
  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    color: "blue",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent1: {
    display: "flex",
    position: "absolute",
    alignItems: "baseline",
    justifyContent: "center",
    margin: "auto",
    width: "80%",
    height: "45%",
    backgroundColor: "white",
    paddingLeft: 40,
    borderRadius: 10,
    bottom: "26%",
    left: "10%",
  },
  menuOptionText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 10,
    fontSize: 26,
  },

  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
});

export default NewContract;
