import { useNotification } from "@/app/Context/NotifyContext";
import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import moment from "moment";
import "moment/locale/vi";

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

  const handleReadNotify = (id: any, markRead: boolean) => {
    if (!markRead) {
      setTotalNotRead((totalNotRead: any) => totalNotRead - 1);
      setNotifications(
        notifications?.map((n) => {
          if (n.id == id) return { ...n, markRead: true };
          else return n;
        })
      );
      isReadNotify(id);
    }
  };

  const handleDeleteNotify = (id: any) => {
    isDeleteNotify(id);
  };

  const renderFriend = ({ item }: any) => {
    const timeAgo = moment(item.createdDate).fromNow();
    return (
      <TouchableOpacity
        onPress={() => handleReadNotify(item.id, item.markRead)}
      >
        <View style={styles.card}>
          <Image
            source={{ uri: "https://i.ibb.co/ZXkVtJD/logo-noti.png" }}
            style={styles.image}
          />
          <View style={styles.info}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {!item.markRead ? (
                <>
                  <Text style={styles.name}>{item.title} </Text>
                  <Octicons name="dot-fill" size={24} color="green" />
                </>
              ) : (
                <Text
                  style={{
                    fontSize: 18,
                    opacity: 0.5,
                  }}
                >
                  {item.title}{" "}
                </Text>
              )}
            </View>
            <Text style={styles.details}>{item.message}</Text>
            <Text style={styles.timeAgo}>{timeAgo}</Text>
          </View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDeleteNotify(item.id)}
          >
            <MaterialIcons name="delete" size={24} color="red" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
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
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 20,
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
    width: 30,
    height: 30,
  },
  info: {
    marginLeft: 10,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
  },
  details: {
    fontSize: 14,
    color: "#888",
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
    paddingHorizontal: 20,
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
});

export default NotifyScreen;
