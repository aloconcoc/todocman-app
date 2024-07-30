import React, { useEffect, useRef, useState } from "react";
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
  ToastAndroid,
} from "react-native";
import { useQuery } from "react-query";
import LottieView from "lottie-react-native";
import { getOldContract } from "@/services/contract.service";
import WebView from "react-native-webview";
import Pdf from "react-native-pdf";
import Pagination from "@/components/utils/pagination";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { getContractType } from "@/services/contract-type.service";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const ManageOldContract = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [data, setData] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(1);
  const [actionModal, setActionModal] = useState(false);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);

  const { isLoading, refetch } = useQuery(
    ["old-contract-list", page, size],
    () => getOldContract(page, size),
    {
      onSuccess: (response: any) => {
        setData(response?.object);
        setTotalPage(response?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data.message || "Lỗi hệ thống",
          ToastAndroid.SHORT
        );
      },
    }
  );
  const {
    data: typeContract,
    isLoading: typeContractLoading,
    isError,
  } = useQuery(
    "type-contract",
    () => getContractType({ page: 0, size: 100 }),
    {}
  );
  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };
  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  if (isLoading || typeContractLoading) {
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

  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedContract(null);
    setActionModal(false);
  };

  const openActionModal = (contract: any) => {
    setSelectedContract(contract);
    setActionModal(true);
  };
  const closeActionModal = () => {
    setActionModal(false);
    setSelectedContract(null);
    setModalVisible(false);
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.1 }]}>{(index + 1).toString()}</Text>
      <Text style={[styles.cell, { flex: 0.4 }]}>{item?.contractName}</Text>
      <Text style={[styles.cell, { flex: 0.3 }]}>
        {
          typeContract?.content?.find((t: any) => t.id == item?.contractTypeId)
            ?.title
        }
      </Text>
      <TouchableOpacity
        style={styles.cell}
        onPress={() => openActionModal(item)}
      >
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color="black"
          style={{ textAlign: "center", alignItems: "center" }}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 0.1, fontSize: 13.8 }]}>
          STT
        </Text>
        <Text style={[styles.headerCell, { flex: 0.4 }]}>Tên hợp đồng</Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Loại hợp đồng</Text>
        <Text style={[styles.headerCell, { flex: 0.2 }]}>Hành động</Text>
      </View>
      <FlatList
        data={data?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {data && data?.content?.length != 0 && (
        <Pagination
          totalPages={totalPage}
          currentPage={page + 1}
          size={size}
          setSize={setSize}
          setPage={setPage}
          onPageChange={handlePageChange}
        />
      )}

      {actionModal && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeActionModal}
        >
          <TouchableWithoutFeedback onPress={closeActionModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View
            style={{
              alignItems: "center",
              justifyContent: "flex-start",
              backgroundColor: "white",
              position: "absolute",
              width: "80%",
              height: "auto",
              borderRadius: 10,
              top: "50%",
              left: "50%",
              transform: [
                { translateX: -(Dimensions.get("window").width * 0.4) },
                { translateY: -Dimensions.get("window").height * 0.1 },
              ],
            }}
          >
            <View
              style={{
                width: "100%",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <Text></Text>
              <TouchableOpacity onPress={closeModal}>
                <Text
                  style={{
                    fontSize: 20,
                    marginBottom: 5,
                    paddingRight: 15,
                  }}
                >
                  ✘
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 2 }}>
              <TouchableOpacity
                onPress={() => {
                  closeActionModal();
                  openModal(selectedContract);
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    fontWeight: "bold",
                    marginVertical: 5,
                  }}
                >
                  📋 Xem chi tiết
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeActionModal();
                  router.push({
                    pathname: "/(tabs)/download-contract",
                    params: { contract: JSON.stringify(selectedContract) },
                  });
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    padding: 5,
                    borderBottomWidth: 1,
                    borderBottomColor: "gainsboro",
                    fontWeight: "bold",
                    marginVertical: 5,
                  }}
                >
                  📥 Tải về máy
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

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
                <AntDesign
                  style={styles.closeButton}
                  name="closecircle"
                  size={28}
                  color="black"
                />
              </TouchableOpacity>

              <Pdf
                trustAllCerts={false}
                source={{
                  uri: selectedContract?.file,
                  cache: true,
                }}
                style={styles.pdf}
              />
            </View>
            <View style={{ height: 20 }}></View>
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
    maxHeight: "99%",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 0.2,
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
    flex: 0.2,
    padding: 8,
    textAlign: "center",
  },
  linkText: {
    color: "teal",
    fontWeight: "600",
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
    marginBottom: 5,
    color: "aquamarine",
    width: 50,
    borderRadius: 50,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  pdf: {
    width: width * 0.99,
    height: height * 0.9,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ManageOldContract;
