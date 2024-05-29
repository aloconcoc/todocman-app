import {
  Button,
  Image,
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
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { setToken, setUser } from "@/config/tokenUser";
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
        setUserContext(response?.user.id);
        ToastAndroid.show("Request sent successfully!", ToastAndroid.SHORT);
        router.navigate("(drawer)/(tabs)/home");
      } else {
        ToastAndroid.show(
          "Login failed! Please check your credencial",
          ToastAndroid.SHORT
        );
      }
    } catch (e) {
      ToastAndroid.show(
        "Login failed! Please check your credencial",
        ToastAndroid.SHORT
      );
      console.log(e);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.headingText}>Hey,</Text>
        <Text style={styles.headingText}>Welcome Back</Text>
      </View>
      <Controller
        control={control}
        rules={{
          required: true,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <Ionicons name={"mail-outline"} size={30} color="teal" />
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
      {errors.email && <Text style={{ color: "red" }}>This is required.</Text>}

      <Controller
        control={control}
        rules={{
          maxLength: 100,
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={30} color="teal" />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
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

      <TouchableOpacity>
        <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
      </TouchableOpacity>

      <View
        style={{
          backgroundColor: "teal",
          borderRadius: 100,
          marginTop: 10,
          padding: 10,
        }}
      >
        <Pressable onPress={handleSubmit(onSubmit)}>
          <Text style={{ textAlign: "center", color: "white" }}>Login</Text>
        </Pressable>
        {/* <Button title="Submit" onPress={handleSubmit(onSubmit)} /> */}
      </View>

      <View style={styles.footerContainer}>
        <Text style={styles.accountText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupText}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    margin: 20,
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
    marginVertical: 20,
  },
  headingText: {
    fontSize: 32,
    color: "teal",
    fontWeight: "bold",
  },
  formContainer: {
    marginTop: 20,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: "teal",
    borderRadius: 100,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  forgotPasswordText: {
    textAlign: "right",
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
