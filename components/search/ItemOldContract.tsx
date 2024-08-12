import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const formatDate = (dateString: any) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const ItemOldContract = ({
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
            setSelectedContract(data);
            setModalVisible(true);
          }}
        >
          <Text style={styles.title}>{data.contractName}</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            <Text style={styles.bold}>Ngày bắt đầu:</Text>{" "}
            {formatDate(data.contractStartDate)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Ngày kết thúc:</Text>{" "}
            {formatDate(data.contractEndDate)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Ngày ký:</Text>{" "}
            {formatDate(data.contractSignDate)}
          </Text>
          <Text style={styles.text}>
            <Text style={styles.bold}>Người tạo:</Text> {data.createdBy}
          </Text>
        </View>
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
  textContainer: {
    flexDirection: "column",
  },
  text: {
    color: "#333",
    fontSize: 14,
    marginBottom: 6,
  },
  bold: {
    fontWeight: "bold",
  },
});

export default ItemOldContract;
