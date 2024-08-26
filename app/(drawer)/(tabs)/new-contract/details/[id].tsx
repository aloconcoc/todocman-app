import React, { useRef, useState, useEffect, useMemo, useContext } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Modal,
  Button,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Platform,
  TouchableWithoutFeedback,
  ActivityIndicator,
  ToastAndroid,
} from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Pdf from "react-native-pdf";
import { Feather, FontAwesome5 } from "@expo/vector-icons";
import Sign from "@/components/sign/signature";
import {
  deleteContract,
  getNewContractByIdNotToken,
} from "@/services/contract.service";
import { useNotification } from "@/app/Context/NotifyContext";
import { AppContext } from "@/app/Context/Context";
import { ADMIN, permissionObject } from "@/components/utils/permissions";
import LottieView from "lottie-react-native";
import WebView from "react-native-webview";

type STATUS = "ADMIN" | "OFFICE_ADMIN" | "SALE" | "OFFICE_STAFF";

const NotiDetail = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [commentVisible, setCommentVisible] = useState(false);
  const [value, onChangeText] = React.useState("");
  const [signText, setSignText] = useState<string>("");
  const [contractData, setContractData] = useState<any>(null);
  const { id } = useLocalSearchParams();
  const [download, setDownload] = useState(false);

  console.log("id", id);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteloading, setDeleteloading] = useState(false);
  const { userInfoC }: any = useContext(AppContext);

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

  useEffect(() => {
    const fetchContractData = async () => {
      try {
        const response = await getNewContractByIdNotToken(id);
        if (response?.object) setContractData(response?.object);
      } catch (error) {
        console.error("Không tìm thấy hợp đồng", error);
      }
    };

    fetchContractData();
  }, [id]);

  const openModal = () => {
    setCommentVisible(false);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setCommentVisible(false);
    setSignText("");
  };

  const openComment = () => {
    setCommentVisible(true);
    setModalVisible(false);
  };

  const closeComment = () => {
    setCommentVisible(false);
    setModalVisible(false);
  };
  const openDeleteModal = (contract: any) => {
    setCommentVisible(false);
    setDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setDeleteModal(false);
    setCommentVisible(false);
  };
  const downloadModal = () => {
    setDownload(true);
    setTimeout(() => {
      setDownload(false);
      closeModal();
    }, 1000);
  };
  const handleAction = (action: string) => {
    if (action == "Xem") {
      const viewContractRole = {
        ...contractData,
        role: permissionUser,
      };
      router.navigate({
        pathname: "/new-contract/view-contract",
        params: { contract: JSON.stringify(viewContractRole) },
      });
    } else if (action == "Từ chối ký") {
      const selectedContractWithStatus = {
        ...contractData,
        statuss: 6,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta6");
    } else if (action == "Trình ký") {
      const selectedContractWithStatus = {
        ...contractData,
        statuss: 4,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta4");
    } else if (action == "Từ chối duyệt") {
      const selectedContractWithStatus = {
        ...contractData,
        statuss: 3,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta3");
    } else if (action == "Duyệt hợp đồng") {
      const selectedContractWithStatus = {
        ...contractData,
        statuss: 2,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta2");
    } else if (action == "Gửi cho khách hàng") {
      const selectedContractWithStatus = {
        ...contractData,
        statuss: 7,
      };
      router.navigate({
        pathname: "/new-contract/send-mail",
        params: { contract: JSON.stringify(selectedContractWithStatus) },
      });
      console.log("sta7");
    } else if (action === "Trình duyệt") {
      const selectedContractWithStatus = {
        ...contractData,
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
        params: { id: JSON.stringify(contractData?.id) },
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
  const handleDeleteContract = async () => {
    try {
      setDeleteloading(true);
      if (contractData?.id) {
        const res = await deleteContract(contractData?.id);
        if (res.code == "00") {
          closeDeleteModal();
          ToastAndroid.show("Xoá hợp đồng thành công", ToastAndroid.SHORT);
          router.navigate("/new-contract");
        } else ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      }
    } catch (error) {
      ToastAndroid.show("Xoá hợp đồng thất bại", ToastAndroid.SHORT);
      console.log(error);
    } finally {
      setDeleteloading(false);
    }
  };

  return (
    <View style={styles.container}>
      {contractData && (
        <Pdf
          trustAllCerts={false}
          source={{
            uri: contractData.file,
            cache: true,
          }}
          onLoadComplete={(numberOfPages, filePath) => {
            console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            console.log(`Current page: ${page}`);
          }}
          onError={(error) => {
            console.log(error);
          }}
          onPressLink={(uri) => {
            console.log(`Link pressed: ${uri}`);
          }}
          style={styles.pdf}
        />
      )}
      {commentVisible && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent1}>
            <View style={styles.seperator} />
            {userInfoC?.role == "ADMIN" && (
              <>
                <TouchableOpacity
                  disabled={adSignDisabled(contractData)}
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
                          color: adSignDisabled(contractData) ? "gray" : "teal",
                        },
                      ]}
                    >
                      ✍🏼 Ký hợp đồng
                    </Text>
                  </View>
                </TouchableOpacity>

                <View style={styles.seperator} />
                <TouchableOpacity
                  disabled={adRejectDisabled(contractData)}
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
                          color: adRejectDisabled(contractData)
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
                  disabled={adSendCustomerDisabled(contractData)}
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
                          color: adSendCustomerDisabled(contractData)
                            ? "gray"
                            : "orchid",
                        },
                      ]}
                    >
                      📧 Gửi khách hàng
                    </Text>
                  </View>
                </TouchableOpacity>

                {(contractData?.status == "SUCCESS" ||
                  contractData?.statusCurrent == "SUCCESS") && (
                  <>
                    <TouchableOpacity onPress={() => handleAction("phụ lục")}>
                      <View
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        <Text
                          style={[styles.menuOptionText, { color: "orange" }]}
                        >
                          🏷️ Phụ lục
                        </Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.seperator} />
                  </>
                )}

                <TouchableOpacity
                  disabled={adDeleteDisabled(contractData)}
                  onPress={() => openDeleteModal(contractData)}
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
                          color: adDeleteDisabled(contractData)
                            ? "gray"
                            : "red",
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
                    disabled={!contractData.canApprove}
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
                            color: !contractData.canApprove ? "gray" : "green",
                          },
                        ]}
                      >
                        ✅ Xác nhận duyệt
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.seperator} />
                  <TouchableOpacity
                    onPress={() => handleAction("Từ chối duyệt")}
                    disabled={!contractData.canApprove}
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
                            color: !contractData.canApprove
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
                    disabled={!contractData?.canSendForMng}
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
                            color: !contractData?.canSendForMng
                              ? "gray"
                              : "goldenrod",
                          },
                        ]}
                      >
                        ✍️ Trình ký
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.seperator} />
                  <TouchableOpacity
                    onPress={() => handleAction("Gửi cho khách hàng")}
                    disabled={!contractData?.canSendForCustomer}
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
                            color: !contractData?.canSendForCustomer
                              ? "gray"
                              : "orchid",
                          },
                        ]}
                      >
                        📧 Gửi khách hàng
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {(contractData?.status == "SUCCESS" ||
                    contractData?.statusCurrent == "SUCCESS") && (
                    <>
                      <TouchableOpacity onPress={() => handleAction("phụ lục")}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[styles.menuOptionText, { color: "orange" }]}
                          >
                            🏷️ Phụ lục
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.seperator} />
                    </>
                  )}

                  <TouchableOpacity
                    disabled={!contractData?.canDelete}
                    onPress={() => openDeleteModal(contractData)}
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
                          { color: !contractData?.canDelete ? "gray" : "red" },
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
                      !contractData?.canSend ||
                      contractData?.status == "SUCCESS" ||
                      contractData?.statusCurrent == "SUCCESS"
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
                              !contractData?.canSend ||
                              contractData?.status == "SUCCESS" ||
                              contractData?.statusCurrent == "SUCCESS"
                                ? "gray"
                                : "mediumturquoise",
                          },
                        ]}
                      >
                        📤 Trình duyệt
                      </Text>
                    </View>
                  </TouchableOpacity>

                  <View style={styles.seperator} />
                  <TouchableOpacity
                    onPress={() => handleAction("Gửi cho khách hàng")}
                    disabled={
                      !contractData?.canSendForCustomer ||
                      contractData?.status == "SUCCESS" ||
                      contractData?.statusCurrent == "SUCCESS"
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
                              !contractData?.canSendForCustomer ||
                              contractData?.status == "SUCCESS" ||
                              contractData?.statusCurrent == "SUCCESS"
                                ? "gray"
                                : "orchid",
                          },
                        ]}
                      >
                        📧 Gửi khách hàng
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {(contractData?.status == "SUCCESS" ||
                    contractData?.statusCurrent == "SUCCESS") && (
                    <>
                      <TouchableOpacity onPress={() => handleAction("phụ lục")}>
                        <View
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={[styles.menuOptionText, { color: "orange" }]}
                          >
                            🏷️ Phụ lục
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.seperator} />
                    </>
                  )}

                  <TouchableOpacity
                    disabled={!contractData?.canDelete}
                    onPress={() => openDeleteModal(contractData)}
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
                          { color: !contractData?.canDelete ? "gray" : "red" },
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
                <Text style={[styles.menuOptionText, { color: "dodgerblue" }]}>
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
            source={{ uri: contractData?.file }}
          />
        </View>
      </Modal>
      {deleteModal && (
        <Modal
          animationType="fade"
          transparent={true}
          onRequestClose={closeDeleteModal}
        >
          <TouchableWithoutFeedback onPress={closeDeleteModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContentDelete}>
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
                {contractData?.name}
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

      <View style={styles.signButton}>
        <TouchableOpacity onPress={openComment}>
          <Feather name="list" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default NotiDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    marginTop: 0,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  signButton: {
    position: "absolute",
    right: 20,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    bottom: 20,
    elevation: 1,
    backgroundColor: "mediumturquoise",
    width: 50,
    height: 50,
    zIndex: 1,
    shadowColor: "darkgray",
    borderRadius: 50,
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
      { translateY: -(Dimensions.get("window").height * 0.2) },
    ],
  },
  menuOptionText: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    marginVertical: 10,
    fontSize: 20,
    fontWeight: "bold",
  },
  seperator: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    width: "82%",
  },
  modalContentDelete: {
    position: "absolute",
    bottom: "38%",
    left: "10%",
    width: "80%",
    padding: 20,
    paddingTop: 0,
    backgroundColor: "red",
    borderRadius: 10,
  },
});
