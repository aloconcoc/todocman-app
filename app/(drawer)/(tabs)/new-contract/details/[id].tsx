import { AppContext } from "@/app/Context/Context";
import { useNotification } from "@/app/Context/NotifyContext";
import Pagination from "@/components/utils/pagination";
import { ADMIN, permissionObject } from "@/components/utils/permissions";
import { statusObject } from "@/components/utils/statusRequest";
import { getAppendicesContactAll } from "@/services/contract.service";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import LottieView from "lottie-react-native";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import WebView from "react-native-webview";
import { useQuery } from "react-query";

type STATUS = "ADMIN" | "OFFICE_ADMIN" | "SALE" | "OFFICE_STAFF";
const { width, height } = Dimensions.get("window");

const ContractAppendix = () => {
  const { id } = useLocalSearchParams();
  const appenId = JSON.parse(id as string);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const { realTime } = useNotification();
  const { userInfoC }: any = useContext(AppContext);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [statusModal, setStatusModal] = useState(false);
  const [detail, setDetail] = useState(false);
  const [download, setDownload] = useState(false);

  const [popUp, setPopUp] = useState(false);
  const [statusContract, setStatusContract] = useState<any>({
    id: 1,
    title: "Quản lí hợp đồng",
    status: "MANAGER_CONTRACT",
  });
  const permissionUser: STATUS = useMemo(() => {
    if (
      userInfoC?.role == ADMIN ||
      userInfoC?.permissions.includes(permissionObject.MANAGER)
    )
      return ADMIN;
    else if (userInfoC?.permissions.includes(permissionObject.OFFICE_ADMIN))
      return "OFFICE_ADMIN";
    else if (userInfoC?.permissions.includes(permissionObject.SALE))
      return "SALE";
    else return "OFFICE_STAFF";
  }, [userInfoC]);

  const saleContract = [
    {
      id: 1,
      title: "🗂️ Quản lí hợp đồng",
      status: "MANAGER_CONTRACT",
    },
    {
      id: 2,
      title: "🕒 Đợi duyệt",
      status: "WAIT_APPROVE",
    },
    {
      id: 3,
      title: "🎯 Đã được duyệt",
      status: "APPROVED",
    },
    {
      id: 4,
      title: "✍️ Chờ ký",
      status: "WAIT_SIGN",
    },
    {
      id: 5,
      title: "👌 Đã ký",
      status: "SIGN_OK",
    },

    {
      id: 7,
      title: "✅ Đã Hoàn thành",
      status: "SUCCESS",
    },
  ];
  const adminOfficeContract = [
    {
      id: 1,
      title: "🗂️ Quản lí hợp đồng",
      status: "MANAGER_CONTRACT",
    },
    {
      id: 2,
      title: "🔎 Cần duyệt",
      status: "WAIT_APPROVE",
    },
    {
      id: 3,
      title: "🎯 Đã duyệt",
      status: "APPROVED",
    },
    {
      id: 4,
      title: "✍️ Chờ ký",
      status: "WAIT_SIGN",
    },
    {
      id: 5,
      title: "👌 Đã ký",
      status: "SIGN_OK",
    },
    {
      id: 6,
      title: "✅ Đã Hoàn thành",
      status: "SUCCESS",
    },
  ];
  const adminContract = [
    {
      id: 1,
      title: "🗂️ Quản lí hợp đồng",
      status: "MANAGER_CONTRACT",
    },
    {
      id: 2,
      title: "✍️ Chờ ký",
      status: "WAIT_SIGN",
    },
    {
      id: 3,
      title: "👌 Đã ký",
      status: "SIGN_OK",
    },
    {
      id: 4,
      title: "✅ Đã Hoàn thành",
      status: "SUCCESS",
    },
  ];

  const menuContract = {
    ADMIN: adminContract,
    SALE: saleContract,
    OFFICE_ADMIN: adminOfficeContract,
    OFFICE_STAFF: [],
  };
  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
    setSelectedContract(null);
    setStatusModal(false);
    setDownload(false);
  };

  const openStatus = () => {
    setStatusModal(true);
  };

  const closeStatus = () => {
    setStatusModal(false);
    setPopUp(false);
  };
  const openDetail = () => {
    setDetail(true);
    setPopUp(false);
    setStatusModal(false);
  };
  const closeDetail = () => {
    setDetail(false);
    setPopUp(false);
    setStatusModal(false);
    setSelectedContract(null);
    setDownload(false);
  };
  const downloadModal = () => {
    setDownload(true);
    setTimeout(() => {
      setDownload(false);
      closeModal();
    }, 1000);
  };

  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["contract-appendices", userInfoC?.id, statusContract?.status, realTime],
    () => getAppendicesContactAll(appenId, page, size, statusContract?.status),
    {
      onSuccess: (response) => {
        setTotalPage(response?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show("Không thể lấy dữ liệu", ToastAndroid.SHORT);
      },
    }
  );
  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 10,
        }}
      >
        <TouchableOpacity style={styles.contractStatus} onPress={openStatus}>
          <Text
            style={{
              padding: 5,
            }}
          >
            Trạng thái hợp đồng ▼
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text
          style={[
            styles.headerCell,
            { flex: 0.15, fontSize: 12.5, textAlign: "center" },
          ]}
        >
          STT
        </Text>
        <Text style={[styles.headerCell, { flex: 0.38, paddingRight: 0 }]}>
          Tên hợp đồng
        </Text>
        <Text
          style={[
            styles.headerCell,
            {
              flex: 0.35,
              textAlign: "center",
              paddingHorizontal: 0,
            },
          ]}
        >
          Người tạo
        </Text>
        <Text
          style={[
            styles.headerCell,
            {
              flex: 0.3,
              textAlign: "left",
              paddingLeft: 0,
            },
          ]}
        >
          Trạng thái
        </Text>
        <Text style={[styles.headerCell, { flex: 0.15 }]}>Hành động</Text>
      </View>
      {/* <FlatList
        data={data?.object?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      /> */}
      <ScrollView>
        {data?.object?.content.map((item: any, index: number) => (
          <View style={styles.row} key={item.id}>
            <Text
              style={[
                styles.cell,
                { flex: 0.15, textAlign: "center", padding: 2 },
              ]}
            >
              {(index + 1).toString()}
            </Text>
            <Text style={[styles.cell, { flex: 0.38, paddingRight: 0 }]}>
              {item.name}
              {item?.status != "SUCCESS" && item?.urgent && "❗"}
            </Text>
            <View style={[styles.cell, { flex: 0.35, padding: 2 }]}>
              {/* <Text style={{ fontSize: 12.5 }}>
                {item.user.email.split("").length > 9
                  ? item.user.email.split("").slice(0, 9).join("") + "..."
                  : item.user.email}
              </Text> */}
              <Text
                // selectable
                style={{
                  fontSize: 12.5,
                  paddingRight: 10,
                }}
              >
                {item?.createdBy}
              </Text>
            </View>
            <Text
              style={[
                styles.cell,
                {
                  color: statusObject[item?.statusCurrent]?.color,
                  flex: 0.25,
                  textAlign: "left",
                  fontWeight: "bold",
                  paddingHorizontal: 0,
                },
              ]}
            >
              {item.statusCurrent
                ? statusObject[item?.statusCurrent]?.title?.[permissionUser]
                : ""}
            </Text>
            <TouchableOpacity
              onPress={() => openModal(item)}
              style={[
                styles.cell,
                {
                  flex: 0.15,
                  marginHorizontal: "auto",
                },
              ]}
            >
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
                onRequestClose={closeModal}
              >
                <TouchableWithoutFeedback onPress={closeModal}>
                  <View style={styles.modalOverlay} />
                </TouchableWithoutFeedback>
                <View style={styles.modalContent1}>
                  <TouchableOpacity onPress={() => openDetail()}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[
                          styles.menuOptionText,
                          { color: "forestgreen" },
                        ]}
                      >
                        🔎 Xem hợp đồng
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  <TouchableOpacity onPress={downloadModal}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={[styles.menuOptionText, { color: "dodgerblue" }]}
                      >
                        📥 Tải hợp đồng
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </Modal>
            )}
          </View>
        ))}
      </ScrollView>
      <Modal transparent={true} visible={isLoading} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
      {statusModal && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeStatus}
        >
          <TouchableWithoutFeedback onPress={closeStatus}>
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
                { translateY: -(Dimensions.get("window").height * 0.2) },
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
                    // marginBottom: 5,
                    paddingRight: 15,
                  }}
                >
                  ✘
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 2 }}>
              {menuContract[permissionUser]?.map((item: any) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => {
                    setStatusContract(item);
                    closeStatus();
                  }}
                >
                  <Text
                    key={item.id}
                    style={{
                      fontSize: 20,
                      padding: 5,
                      borderBottomWidth: 1,
                      borderBottomColor: "gainsboro",
                      fontWeight: "bold",
                      marginVertical: 5,
                    }}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Modal>
      )}
      <Modal
        transparent={true}
        animationType="fade"
        visible={detail}
        onRequestClose={closeDetail}
      >
        <View style={styles.modalContainer}>
          <View>
            <TouchableOpacity onPress={closeDetail}>
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
      <Modal transparent={true} visible={download} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
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
      {data && data?.object.content?.length != 0 ? (
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    maxHeight: "99.9%",
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    // borderTopWidth: 1,
    borderBottomColor: "#000",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerCell: {
    flex: 0.2,
    fontWeight: "bold",
    fontSize: 12.5,
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
    fontSize: 12.5,
    padding: 8,
    textAlign: "left",
    alignItems: "center",
  },

  linkText: {
    color: "blue",
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
    backgroundColor: "white",
    paddingLeft: 40,
    borderRadius: 10,
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -(Dimensions.get("window").width * 0.4) },
      { translateY: -(Dimensions.get("window").height * 0.1) },
    ],
  },
  menuOptionText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
  },

  pdf: {
    width: width * 0.99,
    height: height * 0.92,
  },
  seperator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "82%",
  },
  contractStatus: {
    borderRadius: 5,
    borderWidth: 1,
    borderBlockColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: 180,
  },
});
export default ContractAppendix;
