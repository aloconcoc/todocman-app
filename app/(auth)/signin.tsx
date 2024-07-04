import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useContext, useState } from "react";
import Colors from "@/constants/Colors";
import {
  SimpleLineIcons,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { setToken, setUser, setUserInfo } from "@/config/tokenUser";
import { useForm, Controller } from "react-hook-form";
import { LoginRequest, login } from "@/services/user.service";
import { AppContext } from "../Context/Context";
const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntery, setSecureEntery] = useState(true);

  const handleSignup = () => {
    router.navigate("/(auth)/signup");
  };

  const { userContext, setUserContext }: any = useContext(AppContext);

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
  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await login(data);
      if (response) {
        setToken(response?.access_token);
        setUser(response?.user.id);
        setUserInfo(JSON.stringify(response?.user));
        console.log("response", response.user);

        setUserContext(response?.user.id);
        ToastAndroid.show("Đăng nhập thành công!", ToastAndroid.SHORT);
        router.navigate("(drawer)/(tabs)/home");
      } else {
        ToastAndroid.show(
          "Đăng nhập thất bại! Vui lòng kiểm tra thông tin đăng nhập của bạn",
          ToastAndroid.SHORT
        );
      }
    } catch (e) {
      ToastAndroid.show(
        "Lỗi hệ thống! Vui lòng thử lại sau!",
        ToastAndroid.SHORT
      );
      console.log(e);
    }
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/b0/1e/01/b01e01aba4f9c02cc86d7eed6b6c4ca2.jpg",
      }}
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
                placeholder="Email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={styles.textInput}
                placeholderTextColor="teal"
                keyboardType="email-address"
              />
            </View>
          )}
          name="email"
        />
        {errors.email && (
          <Text style={{ color: "red" }}>
            Trường 'email' không được để trống
          </Text>
        )}

        <Controller
          control={control}
          rules={{
            maxLength: 100,
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <View style={styles.inputContainer}>
              <MaterialCommunityIcons
                name={"shield-lock-outline"}
                size={24}
                color="teal"
              />
              <TextInput
                style={styles.textInput}
                placeholder="Mật khẩu"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholderTextColor="teal"
                secureTextEntry={secureEntery}
              />
              <TouchableOpacity
                onPress={() => {
                  setSecureEntery((prev: any) => !prev);
                }}
              >
                <SimpleLineIcons name={"eye"} size={20} color="teal" />
              </TouchableOpacity>
            </View>
          )}
          name="password"
        />
        {/* {errors.password && (
        <Text style={{ color: "red" }}>
          Trường 'mật khẩu' không được để trống
        </Text>
      )} */}

        <TouchableOpacity>
          <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
        </TouchableOpacity>

        <View
          style={{
            backgroundColor: "teal",
            borderRadius: 100,
            marginTop: 10,
            padding: 10,
            marginHorizontal: 20,
          }}
        >
          <Pressable onPress={handleSubmit(onSubmit)}>
            <Text style={{ textAlign: "center", color: "white" }}>
              Đăng nhập
            </Text>
          </Pressable>
          {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
        </View>

        {/* <View style={styles.footerContainer}>
        <Text style={styles.accountText}>Chưa có tài khoản?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View> */}
      </View>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 20,
    // marginVertical: 50,
    // marginHorizontal: 20,
    margin: "auto",
    shadowColor: "slate",
    borderRadius: 15,
    shadowRadius: 150,
    elevation: 100,
  },
  backButtonWrapper: {
    height: 40,
    width: 40,
    backgroundColor: Colors.login_color.gray,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    paddingVertical: 20,
    borderBottomEndRadius: 50,
    borderBottomStartRadius: 50,
    alignItems: "center",
    backgroundColor: "teal",
    shadowColor: "gray",
    shadowRadius: 10,
  },
  headingText: {
    fontSize: 22,
    color: "teal",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderBottomWidth: 1,
    borderColor: "teal",
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    marginVertical: 10,
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
