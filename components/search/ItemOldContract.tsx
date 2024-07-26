import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ItemOldContract = ({ data }: any) => {
  return (
    <View style={styles.container} key={data.id}>
      <View style={styles.detailsContainer}>
        <TouchableOpacity>
          <Text style={styles.title}>{data.contractName}</Text>
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.text}>
            Ngày bắt đầu: {data.contractStartDate}
          </Text>
          <Text style={styles.text}>Ngày kết thúc: {data.contractEndDate}</Text>
          <Text style={styles.text}>Ngày ký: {data.contractSignDate}</Text>
          <Text style={styles.text}>Người tạo: {data.createdBy}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    width: "100%",
    marginVertical: 5,
    borderBottomWidth: 2,
    borderBottomColor: "slategray",
  },
  detailsContainer: {
    paddingHorizontal: 10,
  },
  title: {
    color: "blue",
    textDecorationLine: "underline",
    fontSize: 20,
    marginBottom: 5,
  },
  textContainer: {
    flexDirection: "column",
  },
  text: {
    color: "black",
    fontSize: 14,
    marginBottom: 3,
  },
});

export default ItemOldContract;
