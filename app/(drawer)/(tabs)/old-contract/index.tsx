import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from "react-native";
import { useQuery } from "@tanstack/react-query";
import LottieView from "lottie-react-native";
import { getOldContract } from "@/services/contract.service";
import WebView from "react-native-webview";
import Pdf from "react-native-pdf";
import Pagination from "@/components/utils/pagination";

const { width, height } = Dimensions.get("window");

const ManageOldContract = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["contract"],
    queryFn: async () => {
      const response = await getOldContract(page, size);
      // console.log("contract", response?.object);

      return response?.object;
    },
  });

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
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedContract(null);
  };
  const formatDate = (dateString: any) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{(index + 1).toString()}</Text>
      <Text style={styles.cell}>{item.contractName}</Text>
      <TouchableOpacity style={styles.cell} onPress={() => openModal(item)}>
        <Text style={styles.linkText}>Tải</Text>
      </TouchableOpacity>
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
          {/* <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback> */}
          <View style={styles.modalContainer}>
            <View>
              {/* <Text style={styles.modalTitle}>Chi tiết hợp đồng</Text>
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
              </Text> */}
              <TouchableOpacity onPress={closeModal}>
                <Text style={styles.closeButton}>Đóng</Text>
              </TouchableOpacity>

              <WebView source={{ uri: selectedContract?.file }} />

              <Pdf
                trustAllCerts={false}
                source={{
                  uri: selectedContract?.file,
                  cache: true,
                }}
                // onLoadComplete={(numberOfPages, filePath) => {
                //   console.log(`Number of pages: ${numberOfPages}`);
                // }}
                // onPageChanged={(page, numberOfPages) => {
                //   console.log(`Current page: ${page}`);
                // }}
                // onError={(error) => {
                //   console.log(error);
                // }}
                // onPressLink={(uri) => {
                //   console.log(`Link pressed: ${uri}`);
                // }}
                style={styles.pdf}
              />
              <View style={{ marginBottom: 10, backgroundColor: "pink" }}>
                <Pagination />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
    maxHeight: "90%",
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
    backgroundColor: "cyan",
    width: 50,
    borderRadius: 50,
    textAlign: "center",
  },
  pdf: {
    // flex: 1,
    width: width * 0.8,
    height: height * 0.8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ManageOldContract;
