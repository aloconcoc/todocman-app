import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const ItemNewContract = ({ data }: any) => {
  return (
    <View style={styles.container} key={data.id}>
      <View style={styles.detailsContainer}>
        <TouchableOpacity>
          <Text style={styles.title}>
            {data.name} | {data.number}
          </Text>
        </TouchableOpacity>
        <Text style={styles.text}>
          Bên A: {data.partyA?.name}; Đại diện bởi {data.partyA?.position}:{" "}
          {data.partyA?.presenter}; Địa chỉ: {data.partyA?.address}
        </Text>
        <Text style={styles.text}>
          Bên B: {data.partyB?.name}; Đại diện bởi {data.partyB?.position}:{" "}
          {data.partyB?.presenter}; Địa chỉ: {data.partyB?.address}
        </Text>
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
  text: {
    color: "black",
    marginBottom: 3,
  },
});

export default ItemNewContract;
