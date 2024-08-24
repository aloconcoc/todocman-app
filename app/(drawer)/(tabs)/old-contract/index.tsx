import React, { useContext, useEffect, useRef, useState } from "react";
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
import { deleteOldContract, getOldContract } from "@/services/contract.service";
import Pdf from "react-native-pdf";
import Pagination from "@/components/utils/pagination";
import {
  AntDesign,
  FontAwesome5,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { AxiosError } from "axios";
import { getContractType } from "@/services/contract-type.service";
import { router } from "expo-router";
import LoadingPopup from "@/components/contract/loadingOldContract";
import { AppContext } from "@/app/Context/Context";
import WebView from "react-native-webview";

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
  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteloading, setDeleteloading] = useState(false);
  const [download, setDownload] = useState(false);
  const { loadingPopupVisible, setLoadingPopupVisible, oldName }: any =
    useContext(AppContext);

  const { isLoading, refetch } = useQuery(
    ["old-contract-list", page, size],
    () => getOldContract(page, size),
    {
      onSuccess: (response: any) => {
        setData(response?.object);
        setTotalPage(response?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show("Không tìm thấy hợp đồng nào", ToastAndroid.SHORT);
      },
    }
  );
  const {
    data: typeContract,
    isLoading: typeContractLoading,
    isError,
  } = useQuery(
    "type-contract",
    () => getContractType({ page: 0, size: 100, title: "" }),
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
    // setSelectedContract(null);
    setModalVisible(false);
  };

  const openDeleteModal = () => {
    setActionModal(false);
    setModalVisible(false);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setActionModal(false);
    setModalVisible(false);
    setDeleteModal(false);
    setSelectedContract(null);
  };
  const downloadModal = () => {
    setDownload(true);
    setTimeout(() => {
      setDownload(false);
      closeModal();
    }, 1000);
  };
  const handleDeleteContract = async () => {
    try {
      if (selectedContract?.id) {
        setDeleteloading(true);
        const res = await deleteOldContract(selectedContract?.id);
        if (res) {
          ToastAndroid.show("Xoá hợp đồng thành công", ToastAndroid.SHORT);
          refetch();
          setTimeout(() => closeDeleteModal(), 1000);
        } else ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      console.log(error);
    } finally {
      setDeleteloading(false);
    }
  };
  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.1, textAlign: "center" }]}>
        {(index + 1).toString()}
      </Text>
      <Text style={[styles.cell, { flex: 0.4 }]}>{item?.contractName}</Text>
      <Text style={[styles.cell, { flex: 0.3, paddingLeft: 0 }]}>
        {
          typeContract?.content?.find((t: any) => t.id == item?.contractTypeId)
            ?.title
        }
      </Text>
      <TouchableOpacity
        style={[styles.cell, { flex: 0.2 }]}
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
        <Text style={[styles.headerCell, { flex: 0.6, fontSize: 13.8 }]}>
          STT
        </Text>
        <Text style={[styles.headerCell, { flex: 2 }]}>Tên hợp đồng</Text>
        <Text style={[styles.headerCell, { flex: 1.5 }]}>Loại hợp đồng</Text>
        <Text style={[styles.headerCell, { flex: 1, textAlign: "center" }]}>
          Hành động
        </Text>
      </View>
      <FlatList
        data={data?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        transparent={true}
        visible={isLoading || typeContractLoading}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <LottieView
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
            source={require("@/assets/load.json")}
          />
        </View>
      </Modal>

      {data && data?.content?.length != 0 ? (
        <Pagination
          totalPages={totalPage}
          currentPage={page + 1}
          size={size}
          setSize={setSize}
          setPage={setPage}
          onPageChange={handlePageChange}
        />
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              color: "gray",
              opacity: 0.5,
              fontWeight: "bold",
            }}
          >
            Không có hợp đồng
          </Text>
        </View>
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
              width: "70%",
              height: "auto",
              borderRadius: 10,
              top: "50%",
              left: "50%",
              transform: [
                { translateX: -(Dimensions.get("window").width * 0.35) },
                { translateY: -Dimensions.get("window").height * 0.15 },
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
                    color: "green",
                  }}
                >
                  🔎 Xem chi tiết
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  closeActionModal();
                  downloadModal();
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
                    color: "dodgerblue",
                  }}
                >
                  📥 Tải hợp đồng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={openDeleteModal}
                style={{
                  padding: 5,
                  borderBottomColor: "gainsboro",
                  marginVertical: 5,
                }}
              >
                <Text
                  style={{
                    fontSize: 20,
                    fontWeight: "bold",
                    color: "red",
                  }}
                >
                  🚨 Xoá
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
          <View style={styles.modalContainer}>
            <View>
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
      {deleteModal && selectedContract && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeDeleteModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={closeDeleteModal}>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 10,
                  alignSelf: "flex-end",
                }}
              >
                ✘
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                textAlign: "center",
                fontSize: 20,
                marginBottom: 20,
              }}
            >
              Xác nhận xoá hợp đồng{" "}
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 22,
                  fontStyle: "italic",
                }}
              >
                {selectedContract?.contractName}
              </Text>
            </Text>
            <TouchableOpacity
              style={{
                backgroundColor: "crimson",
                padding: 10,
                borderRadius: 20,
                width: 80,
                alignSelf: "flex-end",
              }}
              onPress={handleDeleteContract}
              disabled={deleteloading}
            >
              {deleteloading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <Text style={{ color: "white", textAlign: "center" }}>
                  <FontAwesome5 name="trash" size={14} />
                  <Text> </Text>
                  Xoá
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      <Modal transparent={true} visible={download} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginVertical: "auto",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <LottieView
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
            source={require("@/assets/load.json")}
          />

          <WebView
            style={{ display: "none" }}
            source={{ uri: selectedContract?.file }}
          />
        </View>
      </Modal>
      <LoadingPopup
        visible={loadingPopupVisible}
        setVisible={setLoadingPopupVisible}
        oldName={oldName}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    maxHeight: "99.9%",
    paddingBottom: 5,
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
    textAlign: "left",
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
    textAlign: "left",
  },
  linkText: {
    color: "teal",
    fontWeight: "600",
    textAlign: "center",
  },
  loader: {
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
    position: "absolute",
    bottom: "38%",
    left: "10%",
    width: "80%",
    padding: 20,
    paddingTop: 0,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    marginBottom: 5,
    color: "#03ecfc",
    width: 50,
    borderRadius: 50,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  pdf: {
    width: width * 0.99,
    height: height * 0.92,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default ManageOldContract;
