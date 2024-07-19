import AsyncStorage from "@react-native-async-storage/async-storage";
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
export const getToken = async () => {
  try {
    const value = await AsyncStorage.getItem("token");
    if (value !== null) {
      // console.log("token: ", value);

      return value;
    }
  } catch (e) {
    console.log(e);
  }
};
export const setToken = async (token: string) => {
  try {
    await AsyncStorage.setItem("token", token);
  } catch (e) {
    console.log(e);
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
