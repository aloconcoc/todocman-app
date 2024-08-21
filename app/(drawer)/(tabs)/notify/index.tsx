import { NotificationData, useNotification } from "@/app/Context/NotifyContext";
import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
  ToastAndroid,
} from "react-native";
import moment from "moment";
import "moment/locale/vi";
import { useQuery, useQueryClient } from "react-query";
import { getUnreadNotification } from "@/services/notification.service";
import { AxiosError } from "axios";
import { router } from "expo-router";

moment.locale("vi");

const NotifyScreen = () => {
  const {
    notifications,
    totalNotRead,
    isReadNotify,
    isDeleteNotify,
    viewMoreNotify,
    setNotifications,
    setTotalNotRead,
    loading,
    page,
    totalPages,
  } = useNotification();
  const [activeButton, setActiveButton] = useState("all");
  // const { data, isLoading, isError, error } = useQuery(
  //   ["notify"],
  //   () => getUnreadNotification(),
  //   {
  //     onSuccess: (response) => {
  //       console.log("okla: " + response);
  //     },
  //     onError: (error: AxiosError<{ message: string }>) => {
  //       ToastAndroid.show(
  //         error.response?.data?.message || "Lỗi hệ thống",
  //         ToastAndroid.SHORT
  //       );
  //     },
  //   }
  // );

  const handleReadNotify = (noti: any) => {
    if (noti?.typeNotification == "CONTRACT") {
      console.log("noti", noti);

      router.navigate("/(drawer)/new-contract/details/" + noti?.contractId);
    } else if (noti?.typeNotification == "APPENDICES CONTRACT") {
      router.navigate({
        pathname: "/(drawer)/new-contract/appendix",
        params: { appendixId: JSON.stringify(noti?.id) },
      });
    }
    if (!noti?.markRead) {
      setTotalNotRead((totalNotRead: any) => totalNotRead - 1);
      setNotifications(
        notifications?.map((n) => {
          if (n.id == noti.id) return { ...n, markRead: true };
          else return n;
        })
      );
      isReadNotify(noti.id);
    }
  };

  const handleDeleteNotify = (id: any) => {
    setNotifications((prevNotifications: any) =>
      prevNotifications.filter((n: any) => n.id !== id)
    );

    isDeleteNotify(id);
  };

  const handleButtonClick = (type: "all" | "unread") => {
    setActiveButton(type);
  };

  const renderFriend = ({ item }: any) => {
    const timeAgo = moment(item.createdDate).fromNow();
    return (
      <>
        <TouchableOpacity onPress={() => handleReadNotify(item)}>
          <View style={[styles.card, !item.markRead && styles.unreadCard]}>
            <Image
              // source={{ uri: "https://i.ibb.co/ZXkVtJD/logo-noti.png" }}
              source={require("@/assets/images/logo-noti.png")}
              style={styles.image}
            />
            <View style={styles.info}>
              <View>
                {!item.markRead ? (
                  <>
                    <Text style={styles.name}>
                      {item.title.length > 50
                        ? item.title.substring(0, 50) + "..."
                        : item.title}
                    </Text>
                    <Text style={styles.details}>
                      {item.message.length > 70
                        ? item.message.substring(0, 70) + "..."
                        : item.message}
                    </Text>

                    <Text style={styles.timeAgo}>{timeAgo}</Text>
                  </>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 14,
                        opacity: 0.5,
                        fontWeight: "bold",
                      }}
                    >
                      {item.title}
                    </Text>
                    <Text style={[styles.details, { color: "#888" }]}>
                      {item.message}
                    </Text>
                    <Text style={[styles.timeAgo, { color: "#888" }]}>
                      {timeAgo}
                    </Text>
                  </>
                )}
              </View>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => handleDeleteNotify(item.id)}
            >
              <MaterialIcons name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  if (notifications.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={{ fontSize: 20, fontWeight: "bold", color: "gray" }}>
          Không có thông báo
        </Text>
      </View>
    );
  }

  return (
    <>
      <View style={{ flexDirection: "row", backgroundColor: "white" }}>
        {/* <TouchableOpacity
          style={[
            styles.button1,
            activeButton === "all" && styles.activeButton,
          ]}
          onPress={() => handleButtonClick("all")}
        >
          <Text
            style={[
              styles.buttonText1,
              activeButton === "all" && styles.activeButtonText,
            ]}
          >
            Tất cả
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button1,
            activeButton === "unread" && styles.activeButton,
            { marginLeft: 10 },
          ]}
          onPress={() => {
            handleButtonClick("unread");
          }}
        >
          <Text
            style={[
              styles.buttonText1,
              activeButton === "unread" && styles.activeButtonText,
            ]}
          >
            Chưa đọc
          </Text>
        </TouchableOpacity> */}
      </View>
      <FlatList
        data={notifications}
        renderItem={renderFriend}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.container}
        ListFooterComponent={() =>
          page.current + 1 !== totalPages.current && (
            <View style={styles.footer}>
              <TouchableOpacity onPress={viewMoreNotify}>
                <Text style={styles.viewMoreText}>Xem thêm</Text>
              </TouchableOpacity>
            </View>
          )
        }
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
    backgroundColor: "#fff",
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fbfbfb",
    borderWidth: 1,
    borderColor: "#DCDCDC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginTop: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "gainsboro",
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "black",
    marginVertical: 5,
  },
  ratingContainer: {
    flexDirection: "row",
  },
  star: {
    fontSize: 16,
    color: "#FFD700",
  },
  sports: {
    fontSize: 14,
    color: "#888",
    marginVertical: 5,
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 5,
    paddingLeft: 8,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "red",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 20,
  },
  footer: {
    borderTopWidth: 2,
    borderTopColor: "#000",
    paddingVertical: 10,
    alignItems: "center",
  },
  viewMoreText: {
    color: "blue",
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  timeAgo: {
    fontSize: 12,
    color: "dodgerblue",
    fontWeight: "bold",
  },
  button1: {
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "transparent",
    marginLeft: 10,
  },
  activeButton: {
    backgroundColor: "#EBF8FF",
  },
  buttonText1: {
    color: "#000",
    fontWeight: "600",
  },
  activeButtonText: {
    color: "#2563EB",
  },
  unreadCard: {
    backgroundColor: "#EBF8FF",
  },
});

export default NotifyScreen;
