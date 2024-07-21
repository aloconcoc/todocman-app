import { Entypo, MaterialIcons, Octicons } from "@expo/vector-icons";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";

const friends = [
  {
    id: "1",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "2",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 4,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "3",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "4",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "5",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "6",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "7",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "8",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "9",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
  {
    id: "10",
    name: "Duyệt hợp đồng",
    country: "Hợp đồng buôn lậu",
    age: "2 năm",
    rating: 3.5,
    sports: ["Football", "Baseball", "Basketball", "Soccer"],
    imageUrl: "https://i.ibb.co/ZXkVtJD/logo-noti.png",
  },
];

const FriendListScreen = () => {
  const renderFriend = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.info}>
          <View style={{ flexDirection: "row" }}>
            <Text style={styles.name}>{item.name} </Text>
            <Octicons name="dot-fill" size={24} color="green" />
          </View>
          <Text style={styles.details}>
            {item.country} - {item.age}
          </Text>
          {/* <View style={styles.ratingContainer}>
            {Array.from({ length: 5 }).map((_, index) => (
              <Text key={index} style={styles.star}>
                {index < Math.floor(item.rating) ? "★" : "☆"}
              </Text>
            ))}
          </View> */}
          {/* <Text style={styles.sports}>{item.sports.join(" | ")}</Text> */}
        </View>
        <TouchableOpacity style={styles.button}>
          <MaterialIcons name="delete" size={24} color="red" />
          {/* <Text style={styles.buttonText}>Xoá</Text> */}
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={friends}
      renderItem={renderFriend}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingTop: 40,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fbfbfb",
    borderWidth: 2,
    borderColor: "#DCDCDC",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
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
    // backgroundColor: "#fff",
    // borderWidth: 1,
    // borderColor: "red",
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
});

export default FriendListScreen;
