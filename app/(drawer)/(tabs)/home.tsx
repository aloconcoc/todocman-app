import { StyleSheet, Button, Pressable, Image } from "react-native";

import EditScreenInfo from "@/components/EditScreenInfo";
import { Text, View } from "@/components/Themed";
import { router } from "expo-router";
import { getToken, removeToken, removeUser } from "@/config/tokenUser";
import { useContext, useEffect } from "react";
import { AppContext } from "@/app/Context/Context";
import { TouchableOpacity } from "react-native-gesture-handler";
import Timeline from "react-native-timeline-flatlist";

export default function TabOneScreen() {
  const { userContext, setUserContext }: any = useContext(AppContext);
  const data = [
    {
      time: "1",
      title: "Chờ ký",
      description:
        "Đang chờ đợi bên liên quan ký vào văn bản. Quy trình này cần sự xác nhận từ nhiều bên trước khi tiến hành các bước tiếp theo.",
      lineColor: "#009688",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
    {
      time: "2",
      title: "Bên A ký",
      description:
        "Bên A đã hoàn thành việc ký kết văn bản. Điều này đảm bảo rằng các điều khoản và điều kiện đã được đồng ý bởi bên liên quan.",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
    {
      time: "3",
      title: "Bên B ký",
      description:
        "Bên B đã ký kết văn bản, xác nhận các điều khoản và sẵn sàng tiến hành các bước tiếp theo trong quy trình.",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
    {
      time: "4",
      title: "Quản lý ký",
      description:
        "Quản lý đã xem xét và ký vào văn bản, đảm bảo mọi thông tin đều chính xác và đầy đủ trước khi gửi lên cấp cao hơn.",
      lineColor: "#009688",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
    {
      time: "5",
      title: "Giám đốc ký",
      description:
        "Giám đốc đã chính thức ký vào văn bản, hoàn tất quy trình ký kết và chuẩn bị cho các bước triển khai tiếp theo.",
      icon: (
        <Image
          style={{ width: 20, height: 20 }}
          source={{ uri: "https://reactnative.dev/img/tiny_logo.png" }}
        />
      ),
    },
  ];

  useEffect(() => {
    const checkToken = async () => {
      const c = await getToken();
      if (!c) {
        router.navigate("(auth/signin)");
      }
    };
    checkToken();
  }, []);
  return (
    <View style={styles.container}>
      <Timeline
        style={{ flex: 1, marginTop: 20 }}
        data={data}
        circleSize={20}
        circleColor="rgba(0,0,0,0)"
        lineColor="rgb(45,156,219)"
        timeContainerStyle={{ minWidth: 52, marginTop: -5 }}
        timeStyle={{
          textAlign: "center",
          backgroundColor: "teal",
          color: "white",
          padding: 5,
          borderRadius: 4,
        }}
        descriptionStyle={{
          color: "black",
          backgroundColor: "#cccccc",
          borderRadius: 10,
          padding: 5,
        }}
        innerCircle={"icon"}
      />
      {/* <TouchableOpacity
        style={{
          width: 124,
          height: 36,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "green",
          borderRadius: 10,
          marginHorizontal: 20,
        }}
      >
        <Pressable
          onPress={async () => {
            await removeToken();
            await removeUser();
            setUserContext(null);
            router.navigate("/(auth)/signin");
          }}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            out
          </Text>
        </Pressable>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
