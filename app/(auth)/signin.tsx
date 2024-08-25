import {
  ActivityIndicator,
  Button,
  Image,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useEffect, useState } from "react";
import Colors from "@/constants/Colors";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { setToken, setUser, setUserInfo } from "@/config/tokenUser";
import { useForm, Controller } from "react-hook-form";
import { LoginRequest, login } from "@/services/user.service";
import { AppContext } from "../Context/Context";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useMutation } from "react-query";
import regexPatterns from "@/constants/regex.json";

const LoginScreen = () => {
  const [secureEntery, setSecureEntery] = useState(true);
  const { setUserContext, setProfileDrawer }: any = useContext(AppContext);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [emailValidationMessage, setEmailValidationMessage] = useState("");

  const validateEmail = (email: string) => {
    const regex = new RegExp(regexPatterns.REGEX_EMAIL, "i");
    return regex.test(email.trim());
  };

  const handleEmailChange = (value: string) => {
    if (value.trim() === "") {
      setEmailValidationMessage("Trường 'email' để trống");
    } else if (validateEmail(value)) {
      setEmailValidationMessage("Email hợp lệ");
    } else {
      setEmailValidationMessage("Email không hợp lệ");
    }
  };
  const isFormValid = () => {
    console.log(1, emailValidationMessage);

    return emailValidationMessage === "Email hợp lệ";
  };

  function handleRegistrationError(errorMessage: string) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        handleRegistrationError(
          "Permission not granted to get push token for push notification!"
        );
        return;
      }
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        return pushTokenString;
      } catch (e: unknown) {
        handleRegistrationError(`${e}`);
      }
    } else {
      handleRegistrationError(
        "Must use physical device for push notifications"
      );
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error: any) => setExpoPushToken(`${error}`));
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const mutation = useMutation({
    mutationFn: login,
    onSuccess: async (response) => {
      if (response?.code == "00") {
        console.log("user: ", JSON.stringify(response?.object));
        setToken(response?.object?.access_token);
        setUser(response?.object?.user?.id);

        const userInfoWithToken = {
          ...response?.object?.user,
          tokenDevice: expoPushToken,
        };
        setUserInfo(JSON.stringify(userInfoWithToken));
        setProfileDrawer({
          avatar: response?.object?.user?.avatar,
          name: response?.object?.user?.name,
          email: response?.object?.user?.email,
        });
        setUserContext(response?.object?.user.id);
        ToastAndroid.show("Đăng nhập thành công!", ToastAndroid.SHORT);
        router.push("(drawer)/(tabs)/search");
      } else {
        ToastAndroid.show(
          "Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập của bạn",
          ToastAndroid.SHORT
        );
      }
    },
    onError: (error) => {
      ToastAndroid.show("Đăng nhập thất bại!", ToastAndroid.SHORT);
      console.error("Lỗi server");
    },
  });
  const onSubmit = (data: LoginRequest) => {
    if (!isFormValid()) return;
    const dataWithDeviceToken = {
      email: data.email.trim(),
      password: data.password.trim(),
      tokenDevice: expoPushToken,
    };
    mutation.mutate(dataWithDeviceToken);
  };

  return (
    <ImageBackground
      source={require("@/assets/images/loginbg.jpg")}
      resizeMode="cover"
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Chào mừng bạn đến với</Text>
          <Text style={{ fontSize: 30, color: "white", fontWeight: "900" }}>
            Tdocman
          </Text>
        </View>
        <View style={{ marginVertical: 30 }}>
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name={"email-outline"}
                  size={24}
                  color="teal"
                />
                <TextInput
                  aria-disabled={mutation.isLoading}
                  placeholder="Email"
                  onBlur={onBlur}
                  onChangeText={(text) => {
                    onChange(text);
                    handleEmailChange(text);
                  }}
                  value={value}
                  style={styles.textInput}
                  placeholderTextColor="teal"
                  keyboardType="email-address"
                />
              </View>
            )}
            name="email"
          />
          {emailValidationMessage && (
            <Text
              style={{
                opacity: 0.5,
                color:
                  emailValidationMessage === "Email hợp lệ" ? "white" : "red",
                marginLeft: 40,
                marginTop: -15,
              }}
            >
              {emailValidationMessage}
            </Text>
          )}

          <Controller
            control={control}
            rules={{ maxLength: 100 }}
            render={({ field: { onChange, onBlur, value } }) => (
              <View style={styles.inputContainer}>
                <MaterialCommunityIcons
                  name="shield-lock-outline"
                  size={24}
                  color="teal"
                />
                <TextInput
                  aria-disabled={mutation.isLoading}
                  style={styles.textInput}
                  placeholder="Mật khẩu"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholderTextColor="teal"
                  secureTextEntry={secureEntery}
                />
                <TouchableOpacity
                  onPress={() => setSecureEntery((prev) => !prev)}
                >
                  <Feather
                    name={secureEntery ? "eye" : "eye-off"}
                    size={20}
                    color="teal"
                  />
                </TouchableOpacity>
              </View>
            )}
            name="password"
          />
        </View>

        <View
          style={{
            backgroundColor: "teal",
            borderRadius: 100,
            marginTop: 10,
            padding: 10,
            marginHorizontal: 20,
          }}
        >
          <Pressable
            disabled={mutation.isLoading}
            onPress={handleSubmit(onSubmit)}
          >
            {mutation.isLoading ? (
              <ActivityIndicator size="small" color="lightseagreen" />
            ) : (
              <Text style={{ textAlign: "center", color: "white" }}>
                Đăng nhập
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
    margin: "auto",
    shadowColor: "slate",
    borderRadius: 15,
    shadowRadius: 150,
    elevation: 100,
  },

  textContainer: {
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    alignItems: "center",
    backgroundColor: "teal",
    shadowColor: "gray",
    shadowRadius: 10,
  },
  headingText: {
    fontSize: 22,
    color: "white",
    fontWeight: "semibold",
  },
  formContainer: {
    marginTop: 50,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: "teal",
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 20,
    marginHorizontal: 20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: "center",
    color: "dimgrey",
    marginVertical: 10,
  },
  loginButtonWrapper: {
    backgroundColor: "teal",
    borderRadius: 500,
    marginTop: 10,
  },
  loginText: {
    color: Colors.login_color.white,
    fontSize: 20,
    textAlign: "center",
    padding: 10,
  },
  continueText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 14,
    color: Colors.login_color.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    // borderWidth: 2,
    borderColor: "teal",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    gap: 10,
  },
  googleImage: {
    borderRadius: 100,
    height: 140,
    width: 140,
  },
  googleText: {
    fontSize: 20,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: Colors.login_color.primary,
  },
  signupText: {
    color: Colors.login_color.primary,
    fontSize: 15,
    fontWeight: "bold",
  },
});
