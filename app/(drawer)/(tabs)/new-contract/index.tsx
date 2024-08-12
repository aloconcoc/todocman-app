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
  const [deleteloading, setDeleteloading] = useState(false);
  const [statusContract, setStatusContract] = useState<any>({
    id: 1,
    title: "Quản lí hợp đồng",
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

  const { data, isLoading, isError, refetch, error } = useQuery(
    ["new-contract", userInfo?.id, statusContract?.status],
    () => getNewContract(page, size, statusContract?.status),
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
    return <Text>Lỗi hệ thống: {error.message}</Text>;
  }

  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setPopUp(true);
  };

  const closeModal = () => {
    setPopUp(false);
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
  const openDeleteModal = (contract: any) => {
    setSelectedContract(contract);
    setPopUp(false);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setStatusModal(false);
    setPopUp(false);
    setDeleteModal(false);
    setSelectedContract(null);
  };

  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };

  const handleDeleteContract = async () => {
    try {
      setDeleteloading(true);
      if (selectedContract?.id) {
        const res = await deleteContract(selectedContract?.id);
        if (res.code == "00") {
          closeDeleteModal();
          ToastAndroid.show("Xoá hợp đồng thành công", ToastAndroid.SHORT);
          setTimeout(() => refetch(), 100);
        } else ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      console.log(error);
    } finally {
      setDeleteloading(false);
    }
  };

  const handleAction = (action: string) => {
    if (action == "Xem") {
      const viewContractRole = {
        ...selectedContract,
        role: permissionUser,
      };
      router.push({
        pathname: "/new-contract/view-contract",
        params: { contract: JSON.stringify(viewContractRole) },
      });
    } else if (action == "Từ chối ký") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 6,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta6");
    } else if (action == "Trình ký") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 4,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta4");
    } else if (action == "Từ chối duyệt") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 3,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta3");
    } else if (action == "Duyệt hợp đồng") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 2,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta2");
    } else if (action == "Gửi cho khách hàng") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 7,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta7");
    } else if (action === "Trình duyệt") {
      const selectedContractWithStatus = {
        ...selectedContract,
        status: 1,
      };
      router.push({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta1");
    }

    closeModal();
  };

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.2, textAlign: "center" }]}>
        {(index + 1).toString()}
      </Text>
      <Text style={[styles.cell, { flex: 0.4, padding: 2 }]}>
        {item.name}
        {item?.status != "SUCCESS" && item?.urgent && (
          <Entypo name="warning" size={20} color="red" />
        )}
      </Text>
      <Text
        style={[
          styles.cell,
          {
            color: item.status === "SUCCESS" ? "green" : "red",
            flex: 0.3,
            textAlign: "center",
            fontWeight: "bold",
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
            <TouchableOpacity onPress={() => handleAction("Xem")}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={[styles.menuOptionText, { color: "forestgreen" }]}>
                  🔎 Xem hợp đồng
                </Text>
              </View>
            </TouchableOpacity>
            <View style={styles.seperator} />
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
                        (!item?.canSign && userInfo?.email != item.createdBy) ||
                        item?.status == "SUCCESS" ||
                        item?.statusCurrent == "SUCCESS"
                      }
                      style={[styles.menuOptionText, { color: "#fcb103" }]}
                    >
                      ✍️ Ký hợp đồng
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.seperator]} />
                <TouchableOpacity onPress={() => handleAction("Từ chối ký")}>
                  <View
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                  >
                    <Text
                      disabled={
                        (!item?.canSign && userInfo?.email == item.createdBy) ||
                        item?.status == "SUCCESS" ||
                        item?.statusCurrent == "SUCCESS"
                      }
                      style={[styles.menuOptionText, { color: "royalblue" }]}
                    >
                      ↩️ Từ chối ký
                    </Text>
                  </View>
                </TouchableOpacity>
                <View style={styles.seperator} />

                <TouchableOpacity onPress={() => openDeleteModal(item)}>
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
                      🚨 Xoá
                    </Text>
                  </View>
                </TouchableOpacity>
              </>
            )}
            {userInfo?.role == "OFFICE_ADMIN" &&
              userInfo?.permissions.includes("OFFICE_ADMIN") && (
                <>
                  <TouchableOpacity
                    onPress={() => handleAction("Duyệt hợp đồng")}
                  >
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
                        style={[styles.menuOptionText, { color: "green" }]}
                      >
                        ✅ Duyệt hợp đồng
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  <TouchableOpacity
                    onPress={() => handleAction("Từ chối duyệt")}
                  >
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
                        style={[styles.menuOptionText, { color: "royalblue" }]}
                      >
                        ↩️ Từ chối duyệt
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
                        style={[styles.menuOptionText, { color: "goldenrod" }]}
                      >
                        ✍️ Trình ký
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openDeleteModal(item)}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <FontAwesome5 name="signature" size={24} color="black" />
                      <Text
                        disabled={false}
                        style={[styles.menuOptionText, { color: "red" }]}
                      >
                        🚨 Xóa
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
                        style={[
                          styles.menuOptionText,
                          { color: "mediumturquoise" },
                        ]}
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
                      <Text
                        style={[styles.menuOptionText, { color: "orchid" }]}
                      >
                        📧 Gửi cho khách
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openDeleteModal(item)}>
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
                        style={[styles.menuOptionText, { color: "red" }]}
                      >
                        🚨 Xóa
                      </Text>
                    </View>
                  </TouchableOpacity>
                </>
              )}
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
                  fontSize: 25,
                  fontStyle: "italic",
                }}
              >
                {selectedContract?.name}
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
    </View>
  );

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
            { flex: 0.2, fontSize: 13.8, textAlign: "center" },
          ]}
        >
          STT
        </Text>
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
                { translateY: -(Dimensions.get("window").height * 0.25) },
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
    fontSize: 20,
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
    borderWidth: 1,
    borderBlockColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    margin: "auto",
    width: 180,
  },
});

export default NewContract;
