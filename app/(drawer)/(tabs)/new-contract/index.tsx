import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
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
  Pressable,
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
import { useNotification } from "@/app/Context/NotifyContext";
import { ScrollView } from "react-native-gesture-handler";
import { statusObject } from "@/components/utils/statusRequest";
import { AppContext } from "@/app/Context/Context";
import WebView from "react-native-webview";

type STATUS = "ADMIN" | "OFFICE_ADMIN" | "SALE" | "OFFICE_STAFF";

const NewContract = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [popUp, setPopUp] = useState(false);
  const { userInfoC, realTime }: any = useContext(AppContext);
  const [deleteModal, setDeleteModal] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [deleteloading, setDeleteloading] = useState(false);
  const [download, setDownload] = useState(false);

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

  const { data, isLoading, isFetching, refetch, error } = useQuery(
    ["new-contract", statusContract?.status],
    () => getNewContract(page, size, statusContract?.status),
    {
      onSuccess: (response) => {
        console.log("1");

        setTotalPage(response?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        console.log("loi contract");

        // ToastAndroid.show("Không tìm thấy hợp đồng!", ToastAndroid.SHORT);
      },
    }
  );
  useEffect(() => {
    refetch();
  }, [realTime]);
  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

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
          setTimeout(() => closeDeleteModal(), 1000);
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
        action: "xem",
      };
      router.navigate({
        pathname: "/new-contract/view-contract",
        params: { contract: JSON.stringify(viewContractRole) },
      });
    } else if (action == "Từ chối ký") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 6,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta6");
    } else if (action == "Trình ký") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 4,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta4");
    } else if (action == "Từ chối duyệt") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 3,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta3");
    } else if (action == "Duyệt hợp đồng") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 2,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta2");
    } else if (action == "Gửi cho khách hàng") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 7,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta7");
    } else if (action === "Trình duyệt") {
      const selectedContractWithStatus = {
        ...selectedContract,
        statuss: 1,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta1");
    } else if (action == "phụ lục") {
      router.navigate({
        pathname: "/new-contract/appendix/[id]",
        params: { id: JSON.stringify(selectedContract?.id) },
      });
    }

    closeModal();
  };
  const adSignDisabled = (d: any) => {
    const statusPL =
      userInfoC?.email === d.createdBy ? ["NEW"] : ["WAIT_SIGN_A"];
    return !statusPL.includes(d?.statusCurrent);
  };

  const adRejectDisabled = (d: any) => {
    const statusPL = userInfoC?.email == d.createdBy ? [] : ["WAIT_SIGN_A"];
    return !statusPL.includes(d?.statusCurrent);
  };
  const adSendCustomerDisabled = (d: any) => {
    const statusPL = userInfoC?.email == d.createdBy ? ["SIGN_A_OK"] : [""];
    return !statusPL.includes(d?.statusCurrent);
  };
  const adDeleteDisabled = (d: any) => {
    const statusPL =
      userInfoC?.email == d.createdBy
        ? ["NEW", "SIGN_B_FAIL"]
        : ["SIGN_A_FAIL"];
    return !statusPL.includes(d?.statusCurrent);
  };
  const downloadModal = () => {
    setDownload(true);
    setTimeout(() => {
      setDownload(false);
      closeModal();
    }, 1000);
  };

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
            { flex: 0.35, textAlign: "center", paddingHorizontal: 0 },
          ]}
        >
          Người tạo
        </Text>
        <Text
          style={[
            styles.headerCell,
            { flex: 0.3, textAlign: "center", paddingLeft: 0 },
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
        {data?.object?.content?.map((item: any, index: number) => (
          <View style={styles.row} key={item.id}>
            <Text
              style={[
                styles.cell,
                { flex: 0.15, textAlign: "center", padding: 2 },
              ]}
            >
              {page * size + index + 1 < 10
                ? `0${page * size + index + 1}`
                : page * size + index + 1}
            </Text>
            <Text style={[styles.cell, { flex: 0.38, paddingRight: 0 }]}>
              {item.draft ? `${item.name} (Bản nháp)` : item.name}
              {item?.status != "SUCCESS" && item?.urgent && "❗"}
            </Text>
            <View style={[styles.cell, { flex: 0.35, padding: 2 }]}>
              <Text style={{ fontSize: 12.5 }}>
                {item.user.name.split("").length > 20
                  ? item.user.name.split("").slice(0, 20).join("") + "..."
                  : item.user.name}
              </Text>
              <Text
                selectable
                style={{ fontSize: 12.5, color: "green", fontWeight: "bold" }}
              >
                {item.user.phone}
              </Text>
            </View>
            <Text
              style={[
                styles.cell,
                {
                  color: statusObject[item?.statusCurrent]?.color,
                  flex: 0.25,
                  textAlign: "center",
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
                  <TouchableOpacity onPress={() => handleAction("Xem")}>
                    <View
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.menuOptionText, { color: "teal" }]}>
                        🔎 Xem hợp đồng
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <View style={styles.seperator} />
                  {userInfoC?.role == "ADMIN" && (
                    <>
                      <TouchableOpacity
                        disabled={adSignDisabled(item)}
                        onPress={() => handleAction("Xem")}
                      >
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
                              {
                                color: adSignDisabled(item) ? "gray" : "green",
                              },
                            ]}
                          >
                            ✅ Ký hợp đồng
                          </Text>
                        </View>
                      </TouchableOpacity>

                      <View style={[styles.seperator]} />
                      <TouchableOpacity
                        disabled={adRejectDisabled(item)}
                        onPress={() => handleAction("Từ chối ký")}
                      >
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
                              {
                                color: adRejectDisabled(item)
                                  ? "gray"
                                  : "royalblue",
                              },
                            ]}
                          >
                            ↩️ Từ chối ký
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.seperator} />
                      <TouchableOpacity
                        onPress={() => handleAction("Gửi cho khách hàng")}
                        disabled={adSendCustomerDisabled(item)}
                      >
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
                              {
                                color: adSendCustomerDisabled(item)
                                  ? "gray"
                                  : "orange",
                              },
                            ]}
                          >
                            📧 Gửi khách hàng
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.seperator} />
                      {(item?.status == "SUCCESS" ||
                        item?.statusCurrent == "SUCCESS") && (
                        <>
                          <TouchableOpacity
                            onPress={() => handleAction("phụ lục")}
                          >
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
                                  { color: "orange" },
                                ]}
                              >
                                🏷️ Phụ lục
                              </Text>
                            </View>
                          </TouchableOpacity>
                          <View style={styles.seperator} />
                        </>
                      )}

                      <TouchableOpacity
                        disabled={adDeleteDisabled(item)}
                        onPress={() => openDeleteModal(item)}
                      >
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
                              {
                                color: adDeleteDisabled(item) ? "gray" : "red",
                              },
                            ]}
                          >
                            🚨 Xoá
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </>
                  )}

                  {userInfoC?.role == "USER" &&
                    userInfoC?.permissions.includes("OFFICE_ADMIN") && (
                      <>
                        <TouchableOpacity
                          onPress={() => handleAction("Duyệt hợp đồng")}
                          disabled={!item.canApprove}
                        >
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
                                { color: !item.canApprove ? "gray" : "green" },
                              ]}
                            >
                              ✅ Xác nhận duyệt
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        <TouchableOpacity
                          onPress={() => handleAction("Từ chối duyệt")}
                          disabled={!item.canApprove}
                        >
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
                                {
                                  color: !item.canApprove
                                    ? "gray"
                                    : "royalblue",
                                },
                              ]}
                            >
                              ↩️ Từ chối duyệt
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        <TouchableOpacity
                          onPress={() => handleAction("Trình ký")}
                          disabled={!item?.canSendForMng}
                        >
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
                                {
                                  color: !item?.canSendForMng
                                    ? "gray"
                                    : "orchid",
                                },
                              ]}
                            >
                              📝 Trình ký
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        <TouchableOpacity
                          onPress={() => handleAction("Gửi cho khách hàng")}
                          disabled={!item?.canSendForCustomer}
                        >
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
                                {
                                  color: !item?.canSendForCustomer
                                    ? "gray"
                                    : "orange",
                                },
                              ]}
                            >
                              📧 Gửi khách hàng
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        {(item?.status == "SUCCESS" ||
                          item?.statusCurrent == "SUCCESS") && (
                          <>
                            <TouchableOpacity
                              onPress={() => handleAction("phụ lục")}
                            >
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
                                    { color: "orange" },
                                  ]}
                                >
                                  🏷️ Phụ lục
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View style={styles.seperator} />
                          </>
                        )}
                        <TouchableOpacity
                          disabled={!item?.canDelete}
                          onPress={() => openDeleteModal(item)}
                        >
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
                                { color: !item?.canDelete ? "gray" : "red" },
                              ]}
                            >
                              🚨 Xóa
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}

                  {userInfoC?.role == "USER" &&
                    userInfoC?.permissions.includes("SALE") && (
                      <>
                        <TouchableOpacity
                          disabled={
                            !item?.canSend ||
                            item?.status == "SUCCESS" ||
                            item?.statusCurrent == "SUCCESS"
                          }
                          onPress={() => handleAction("Trình duyệt")}
                        >
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
                                {
                                  color:
                                    !item?.canSend ||
                                    item?.status == "SUCCESS" ||
                                    item?.statusCurrent == "SUCCESS"
                                      ? "gray"
                                      : "dodgerblue",
                                },
                              ]}
                            >
                              ↪️ Trình duyệt
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        <TouchableOpacity
                          onPress={() => handleAction("Gửi cho khách hàng")}
                          disabled={
                            !item?.canSendForCustomer ||
                            item?.status == "SUCCESS" ||
                            item?.statusCurrent == "SUCCESS"
                          }
                        >
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
                                {
                                  color:
                                    !item?.canSendForCustomer ||
                                    item?.status == "SUCCESS" ||
                                    item?.statusCurrent == "SUCCESS"
                                      ? "gray"
                                      : "orange",
                                },
                              ]}
                            >
                              📧 Gửi khách hàng
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View style={styles.seperator} />
                        {(item?.status == "SUCCESS" ||
                          item?.statusCurrent == "SUCCESS") && (
                          <>
                            <TouchableOpacity
                              onPress={() => handleAction("phụ lục")}
                            >
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
                                    { color: "orange" },
                                  ]}
                                >
                                  🏷️ Phụ lục
                                </Text>
                              </View>
                            </TouchableOpacity>
                            <View style={styles.seperator} />
                          </>
                        )}
                        <TouchableOpacity
                          disabled={!item?.canDelete}
                          onPress={() => openDeleteModal(item)}
                        >
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
                                { color: !item?.canDelete ? "gray" : "red" },
                              ]}
                            >
                              🚨 Xóa
                            </Text>
                          </View>
                        </TouchableOpacity>
                      </>
                    )}

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
            {deleteModal && selectedContract && (
              <Modal
                animationType="fade"
                transparent={true}
                onRequestClose={closeDeleteModal}
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
        ))}
      </ScrollView>
      {/* <Modal transparent={true} visible={isLoading} animationType="fade">
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
      </Modal> */}
      <Modal transparent={true} visible={isFetching} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <ActivityIndicator size="large" color="#ccc" />
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
      {data && data?.object?.content?.length != 0 ? (
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
    top: "50%",
    left: "50%",
    transform: [
      { translateX: -(Dimensions.get("window").width * 0.4) },
      { translateY: -(Dimensions.get("window").height * 0.25) },
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
