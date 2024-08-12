import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ItemNewContract = ({
  data,
  setModalVisible,
  setSelectedContract,
}: any) => {
  return (
    <View style={styles.container} key={data.id}>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.touchable}
          onPress={() => {
            console.log("dau: ", data.file);
            setSelectedContract(data);
            setModalVisible(true);
          }}
        >
          <Text style={styles.title}>
            {data.name} | {data.number}
          </Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Bên A: <Text style={styles.bold}>{data.partyA?.name}</Text>; Đại diện
          bởi <Text style={styles.bold}>{data.partyA?.position}</Text>:{" "}
          <Text style={styles.bold}>{data.partyA?.presenter}</Text>; Địa chỉ:{" "}
          <Text style={styles.bold}>{data.partyA?.address}</Text>
        </Text>
        <Text style={styles.text}>
          Bên B: <Text style={styles.bold}>{data.partyB?.name}</Text>; Đại diện
          bởi <Text style={styles.bold}>{data.partyB?.position}</Text>:{" "}
          <Text style={styles.bold}>{data.partyB?.presenter}</Text>; Địa chỉ:{" "}
          <Text style={styles.bold}>{data.partyB?.address}</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  touchable: {
    marginBottom: 12,
  },
  title: {
    color: "#007BFF", // Primary color
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textDecorationLine: "underline",
  },
  text: {
    color: "#333",
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default ItemNewContract;
