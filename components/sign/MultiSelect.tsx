import React, { useState } from "react";

import { View } from "react-native";

import DropDownPicker from "react-native-dropdown-picker";

export default function MultiSelect() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState([
    "italy",
    "spain",
    "barcelona",
    "finland",
  ]);
  const [items, setItems] = useState([
    { label: "Spain", value: "spain" },
    { label: "Madrid", value: "madrid", parent: "spain" },
    { label: "Barcelona", value: "barcelona", parent: "spain" },

    { label: "Italy", value: "italy" },
    { label: "Rome", value: "rome", parent: "italy" },

    { label: "Finland", value: "finland" },
  ]);

  return (
    <View
      style={{
        backgroundColor: "#171717",
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 15,
      }}
    >
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        theme="DARK"
        multiple={true}
        searchable={true}
        addCustomItem={true}
        mode="BADGE"
        badgeDotColors={[
          "#e76f51",
          "#00b4d8",
          "#e9c46a",
          "#e76f51",
          "#8ac926",
          "#00b4d8",
          "#e9c46a",
        ]}
      />
    </View>
  );
}