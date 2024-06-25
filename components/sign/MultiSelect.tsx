import React, { useState } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function MultiSelect({ value1, setValue1 }: any) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(["tu416164@gmail.com"]);
  const [items, setItems] = useState([
    { label: "phantutunao@gmail.com", value: "phantutunao@gmail.com" },
    { label: "tu416164@gmail.com", value: "tu416164@gmail.com" },
  ]);
  const removeItem = (item: string) => {
    setValue(value.filter((i: any) => i !== item));
  };

  return (
    <View
      style={{
        // flex: 1,
        // backgroundColor:'pink',
        // paddingHorizontal: 15,
        // zIndex: 2,
        // elevation: 2,
        paddingHorizontal: 10,
      }}
    >
      <DropDownPicker
        listMode="MODAL"
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        multiple={true}
        searchable={true}
        addCustomItem={true}
        searchPlaceholder="Tìm email"
        placeholder="Nhập email"
        mode="BADGE"
        renderBadgeItem={(selectedItem) => (
          <View style={styles.badgeItem}>
            <Text>{selectedItem.label}</Text>
            <TouchableOpacity
              onPress={() => removeItem(selectedItem.value as string)}
            >
              <MaterialIcons name="close" size={15} color={"gray"} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  badgeItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
    alignSelf: "center",
    backgroundColor: "#e0e0e0",
    padding: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    margin: 2,
  },
});
