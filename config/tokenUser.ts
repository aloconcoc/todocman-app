import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ToastAndroid } from "react-native";
export interface UserData {
  id: string;
  address: string;
  avatar: string;
  department: string;
  dob: string;
  email: string;
  gender: number;
  identification_number: string;
  name: string;
  phone: string;
  position: string;
}
export const getToken = async (): Promise<string | null> => {
  try {
    const tokenDataString = await AsyncStorage.getItem("token");

    if (tokenDataString !== null) {
      const tokenData = JSON.parse(tokenDataString);
      const now = new Date().getTime();

      // Kiểm tra xem token đã hết hạn chưa
      if (now > tokenData.expiry) {
        console.log("Token đã hết hạn");
        ToastAndroid.showWithGravity(
          "Phiên đăng nhập đã hết hạn",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        await clearAll(); // Xóa token hết hạn
        router.navigate("(auth)/signin");

        return null;
      }

      return tokenData.token; // Trả về token nếu còn hợp lệ
    }

    return null; // Không có token nào được lưu
  } catch (e) {
    console.log("Lỗi khi lấy token: ", e);
    return null;
  }
};

export const setToken = async (
  token: string,
  ttl: number = 10 * 24 * 60 * 60 * 1000
) => {
  try {
    const now = new Date().getTime();
    const expiryTime = now + ttl;

    const tokenData = {
      token: token,
      expiry: expiryTime,
    };

    await AsyncStorage.setItem("token", JSON.stringify(tokenData));
  } catch (e) {
    console.log("Lỗi khi lưu token: ", e);
  }
};
export const setUser = async (user: any) => {
  try {
    await AsyncStorage.setItem("user", user);
    // console.log("user: ", JSON.stringify(user));
  } catch (e) {
    console.log(e);
  }
};
export const setUserInfo = async (user: any) => {
  try {
    await AsyncStorage.setItem("userInfo", user);
  } catch (e) {
    console.log(e);
  }
};
export const getUser = async () => {
  try {
    const value = await AsyncStorage.getItem("user");
    if (value !== null) {
      console.log("user: ", value);

      return value;
    }
  } catch (e) {
    console.log(e);
  }
};

export const getUserInfo = async () => {
  try {
    const value = await AsyncStorage.getItem("userInfo");
    const userData = value != null ? JSON.parse(value) : null;
    return userData;
  } catch (e) {
    console.log(e);
  }
};
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("token");
  } catch (e) {
    console.log(e);
  }
};
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem("user");
  } catch (e) {
    console.log(e);
  }
};
export const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log(e);
  }
};
