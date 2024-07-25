import React, { useEffect, useMemo, useRef, useState } from "react";
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
  ToastAndroid,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "react-query";
import LottieView from "lottie-react-native";
import {
  deleteContract,
  getNewContract,
  sendMail,
} from "@/services/contract.service";
import {
  Entypo,
  FontAwesome,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import { router } from "expo-router";
import { getUserInfo } from "@/config/tokenUser";
import { AxiosError } from "axios";
import Pagination from "@/components/utils/pagination";
import { ADMIN, permissionObject } from "@/components/utils/permissions";

type STATUS = "ADMIN" | "OFFICE_ADMIN" | "SALE" | "OFFICE_STAFF";

const NewContract = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [popUp, setPopUp] = useState(false);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [statusContract, setStatusContract] = useState<any>({
    id: 1,
    title: "🗂️ Quản lí hợp đồng",
    status: "MANAGER_CONTRACT",
  });
  const permissionUser: STATUS = useMemo(() => {
    if (
      userInfo?.role == ADMIN ||
      userInfo?.permissions.includes(permissionObject.MANAGER)
    )
      return ADMIN;
    else if (userInfo?.permissions.includes(permissionObject.OFFICE_ADMIN))
      return "OFFICE_ADMIN";
    else if (userInfo?.permissions.includes(permissionObject.SALE))
      return "SALE";
    else return "OFFICE_STAFF";
  }, [userInfo]);

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
      title: "✍️ Chờ sếp ký",
      status: "WAIT_SIGN_A",
    },
    {
      id: 5,
      title: "👌 Sếp ký thành công",
      status: "SIGN_A_OK",
    },
    {
      id: 6,
      title: "⏳ Chờ khách hàng ký",
      status: "WAIT_SIGN_B",
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
      title: "✍️ Chờ sếp ký",
      status: "WAIT_SIGN_A",
    },
    {
      id: 5,
      title: "👌 Đã ký",
      status: "SIGN_A_OK",
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
      status: "WAIT_SIGN_A",
    },
    {
      id: 3,
      title: "👌 Đã ký",
      status: "SIGN_A_OK",
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

  useEffect(() => {
    const checkUser = async () => {
      const c = await getUserInfo();
      if (!c) {
        router.navigate("(auth/signin)");
      }
      setUserInfo(c);
    };
    checkUser();
  }, []);

  const { data, isLoading, isError, refetch, isFetching, error } = useQuery(
    ["new-contract", userInfo?.id],
    () => getNewContract(page, size),
    {
      onSuccess: (response) => {
        setTotalPage(response?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data?.message || "Lỗi hệ thống",
          ToastAndroid.SHORT
        );
      },
    }
  );

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
    return <Text>Lỗi hệ thống: {error.message}</Text>;
  }

  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
    setDeleteModal(false);
    setSelectedContract(null);
    setStatusModal(false);
  };

  const openStatus = () => {
    setStatusModal(true);
  };

  const closeStatus = () => {
    setStatusModal(false);
    setPopUp(false);
    setDeleteModal(false);
  };

  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };

  const handleOfAdReject = async () => {
    const formData = new FormData();
    formData.append("to", selectedContract?.createdBy);
    if (selectedContract?.approvedBy != null)
      formData.append("cc", selectedContract?.approvedBy);
    formData.append("subject", "Từ chối duyệt hợp đồng");
    formData.append("htmlContent", "Từ chối duyệt hợp đồng");
    formData.append("contractId ", selectedContract?.id);
    formData.append("status", "APPROVE_FAIL");
    formData.append("createdBy", selectedContract?.createdBy);
    formData.append("description", "Từ chối duyệt hợp đồng");
    try {
      console.log("formdatar", formData);
      closeModal();

      // const response = await sendMail(formData);
    } catch (error) {
      ToastAndroid.show(
        "Xảy ra lỗi trong quá trình gửi mail!",
        ToastAndroid.SHORT
      );
    }
  };

  const handleOfAdAccept = async () => {
    console.log("selectedContractdm", selectedContract);

    const formData = new FormData();
    formData.append("to", selectedContract?.createdBy);

    formData.append("subject", "Xác nhận duyệt hợp đồng");
    formData.append("htmlContent", "Xác nhận duyệt hợp đồng");
    formData.append("contractId ", selectedContract?.id);
    formData.append("status", "APPROVED");
    formData.append("createdBy", selectedContract?.createdBy);
    formData.append("description", "Xác nhận duyệt hợp đồng");
    try {
      console.log("formdatara", formData);

      const response = await sendMail(formData);
      closeModal();
    } catch (error) {
      ToastAndroid.show(
        "Xảy ra lỗi trong quá trình gửi mail!",
        ToastAndroid.SHORT
      );
    }
  };

  // const deleteNewContract = useMutation(deleteContract, {
  //   onSuccess: () => {
  //     ToastAndroid.show("Xoá hợp đồng thành công", ToastAndroid.SHORT);
  //     closeModal();
  //     setTimeout(() => refetch(), 500);
  //   },
  //   onError: (error: AxiosError<{ message: string }>) => {
  //     ToastAndroid.show(
  //       "Xảy ra lỗi trong quá trình xoá hợp đồng!",
  //       ToastAndroid.SHORT
  //     );
  //   },
  // });

  // const handleDeleteContract = async () => {
  //   try {
  //     if (selectedContract?.id) {
  //       deleteNewContract.mutate(selectedContract?.id);
  //     }
  //   } catch (error) {
  //     ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
  //     console.log(error);
  //   }
  // };

  const handleAction = (action: string) => {
    console.log(`${action}`, selectedContract);
    if (action == "Xem") {
      router.push({
        pathname: "/new-contract/view-contract",
        params: { contract: JSON.stringify(selectedContract) },
      });
    } else if (action == "Từ chối") {
      console.log("ký hợp đồng");
    } else if (action == "Trình ký") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 4,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("trình ký");
    } else if (action == "Từ chối duyệt") {
      // handleOfAdReject();
    } else if (action == "Xóa") {
      setDeleteModal(true);
    } else if (action == "Duyệt hợp đồng") {
      // handleOfAdAccept();
    } else if (action == "Gửi cho khách hàng") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 7,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
    } else if (action === "Trình duyệt") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 1,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
    }
    closeModal();
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.2 }]}>{(index + 1).toString()}</Text>
      <Text style={[styles.cell, { flex: 0.4, padding: 2 }]}>
        {item?.status != "SUCCESS" && item?.urgent && (
          <Entypo name="warning" size={20} color="red" />
        )}
        {item.name}
      </Text>
      <Text
        style={[
          styles.cell,
          {
            color: item.status === "SUCCESS" ? "green" : "red",
            flex: 0.3,
            textAlign: "left",
          },
        ]}
      >
        {item.status === "SUCCESS" ? "Thành công" : "Thất bại"}
      </Text>
      <TouchableOpacity
        onPress={() => openModal(item)}
        style={[
          styles.cell,
          {
            flex: 0.2,
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
            {userInfo?.role == "ADMIN" && (
              <>
                <TouchableOpacity onPress={() => handleAction("Xem")}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      disabled={
                        !item?.canSign && userInfo?.email != item.createdBy
                      }
                      style={[styles.menuOptionText, { color: "forestgreen" }]}
                    >
                      ✍️ Ký hợp đồng
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.seperator} />
                <TouchableOpacity onPress={() => handleAction("Từ chối")}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      disabled={!item?.canSign}
                      style={[styles.menuOptionText, { color: "red" }]}
                    >
                      🚨 Từ chối ký
                    </Text>
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
                    <Text
                      disabled={!item.canDelete}
                      style={[styles.menuOptionText, { color: "red" }]}
                    >
                      ❌ Xoá
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
            {userInfo?.role == "OFFICE_ADMIN" &&
              userInfo?.permissions.includes("OFFICE_ADMIN") && (
                <>
                  <TouchableOpacity onPress={handleOfAdAccept}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Entypo name="check" size={24} color="black" />
                      <Text
                        disabled={!item.canApprove}
                        style={[styles.menuOptionText]}
                      >
                        ✅ Duyệt hợp đồng
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  <TouchableOpacity onPress={handleOfAdReject}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome name="close" size={24} color="black" />
                      <Text
                        disabled={!item.canApprove}
                        style={[styles.menuOptionText]}
                      >
                        🛑 Từ chối duyệt
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  <TouchableOpacity onPress={() => handleAction("Trình ký")}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome5 name="signature" size={24} color="black" />
                      <Text
                        disabled={!item?.canSendForMng}
                        style={[styles.menuOptionText]}
                      >
                        ✍️ Trình ký
                      </Text>
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
                      <FontAwesome5 name="signature" size={24} color="black" />
                      <Text
                        disabled={!item?.canSendForMng}
                        style={[styles.menuOptionText]}
                      >
                        ❌ Xóa
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
            {userInfo?.role == "USER" &&
              userInfo?.permissions.includes("SALE") && (
                <>
                  <TouchableOpacity onPress={() => handleAction("Trình duyệt")}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome5 name="signature" size={24} color="black" />
                      <Text
                        disabled={!item?.canSend}
                        style={[styles.menuOptionText]}
                      >
                        📤 Trình duyệt
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  <TouchableOpacity
                    onPress={() => handleAction("Gửi cho khách hàng")}
                  >
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="send"
                        size={28}
                        color="black"
                      />
                      <Text style={[styles.menuOptionText]}>
                        📧 Gửi cho khách
                      </Text>
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
                      <Text
                        disabled={!item?.canDelete}
                        style={[styles.menuOptionText]}
                      >
                        ❌ Xóa
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
          </View>
        </Modal>
      )}
      {/* {deleteModal && selectedContract === item && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={() => handleDeleteContract}>
              <Text>Xoá hợp đồng</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      )} */}
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginHorizontal: 20,
          marginVertical: 5,
        }}
      >
        <TouchableOpacity style={styles.contractStatus} onPress={openStatus}>
          <Text style={{ padding: 5 }}>Trạng thái▼</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 0.2 }]}>STT</Text>
        <Text style={[styles.headerCell, { flex: 0.4 }]}>Tên hợp đồng</Text>
        <Text style={[styles.headerCell, { flex: 0.3, textAlign: "left" }]}>
          Trạng thái
        </Text>
        <Text style={[styles.headerCell, { flex: 0.2 }]}>Hành động</Text>
      </View>
      <FlatList
        data={data?.object?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      {statusModal && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
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
                { translateY: -(Dimensions.get("window").height * 0.25) },
              ],
            }}
          >
            <TouchableOpacity onPress={closeModal}>
              <Text
                style={{
                  fontSize: 20,
                  marginBottom: 10,
                }}
              >
                ✘
              </Text>
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 2 }}>
              {menuContract["OFFICE_ADMIN"].map((item: any) => (
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
              ))}
            </View>
          </View>
        </Modal>
      )}
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
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    // flex: 1,
    maxHeight: "96%",
    paddingVertical: 5,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    justifyContent: "space-between",
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
    padding: 6,
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
    // height: "45%",
    backgroundColor: "white",
    paddingLeft: 40,
    borderRadius: 10,
    bottom: "40%",
    left: "10%",
  },
  menuOptionText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 10,
    fontSize: 21,
    fontWeight: "bold",
  },

  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  seperator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "82%",
  },
  contractStatus: {
    borderRadius: 5,
    backgroundColor: "darkturquoise",
    justifyContent: "center",
    alignItems: "center",
    width: 120,
  },
});

export default NewContract;
