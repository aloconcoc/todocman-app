import React, { useState } from "react";

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import DropDownPicker from "react-native-dropdown-picker";

export default function MultiSelect({ value1, setValue1 }: any) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([
    { label: "tu416164@gmail.com", value: "tu416164@gmail.com" },
    { label: "babichaeng820@gmail.com", value: "babichaeng820@gmail.com" },
  ]);
  const removeItem = (item: string) => {
    setValue1(value1.filter((i: any) => i !== item));
  };

  return (
    <View
      style={{
        // flex: 1,
        alignItems: "center",
        // justifyContent: "center",
        paddingHorizontal: 15,
        zIndex: 2,
      }}
    >
      <DropDownPicker
        open={open}
        value={value1}
        searchPlaceholder="Tìm email"
        placeholder="Nhập email"
        items={items}
        setOpen={setOpen}
        setValue={setValue1}
        setItems={setItems}
        multiple={true}
        searchable={true}
        addCustomItem={true}
        mode="BADGE"
        showTickIcon={true}
        hideSelectedItemIcon={true}
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
