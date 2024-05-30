import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function DetailsScreen() {
  const { id } = useLocalSearchParams();
  const item = JSON.stringify(id);
  console.log("item", item);

  return (
    <View style={styles.container}>
      <Text>1{(id as { contractName?: string }).contractName}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
