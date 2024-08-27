import { router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { View, Pressable, Text } from "react-native";
import DraggableGrid from "react-native-draggable-grid";

export const Arrange = ({ imageData, setImageData }: any) => {
  const [data, setData] = useState(imageData);
  console.log("data", imageData);

  //   const handleSave = () => {
  //     if (imageData) {
  //       setImageData(data);
  //     }
  //     router.back();
  //   };

  //   const renderItem = (item: any) => (
  //     <View style={{ padding: 10 }}>
  //       <Text>{item.name}</Text>
  //     </View>
  //   );

  //   return (
  //     <View>
  //       <DraggableGrid
  //         data={data}
  //         renderItem={(item) => renderItem(item)}
  //         onDragRelease={(newData) => setData(newData)}
  //         numColumns={3}
  //       />
  //       <Pressable onPress={handleSave}>
  //         <Text>Lưu sắp xếp</Text>
  //       </Pressable>
  //     </View>
  //   );
  return <Text>ok</Text>;
};

export default Arrange;
