import React, { useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useMutation } from "react-query";
import { changePassword } from "@/services/user.service";
import { ToastAndroid } from "react-native";
import { AxiosError } from "axios";
import { AppContext } from "@/app/Context/Context";
import { router } from "expo-router";

const ChangePasswordScreen = () => {
  const { userInfoC }: any = useContext(AppContext);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: userInfoC.email,
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  const changePasswordQuery = useMutation(changePassword, {
    onError: (error: AxiosError<{ message: string }>) => {
      ToastAndroid.show("Đổi mật khẩu thất bại", ToastAndroid.SHORT);
    },
    onSuccess: (response) => {
      if (response.code == "03") {
        ToastAndroid.show("Không tìm thấy người dùng", ToastAndroid.SHORT);
      } else if (response.code == "01") {
        ToastAndroid.show("Mật khẩu cũ không chính xác", ToastAndroid.SHORT);
      } else {
        ToastAndroid.show("Đổi mật khẩu thành công", ToastAndroid.SHORT);
        router.push("/profile");
      }
    },
  });
  const onSubmit = (data: any) => {
    changePasswordQuery.mutate(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Đổi mật khẩu</Text>

      <Controller
        control={control}
        name="email"
        render={({ field: { value } }) => (
          <TextInput
            style={[styles.input, { backgroundColor: "#ccc" }]}
            value={value}
            editable={false}
          />
        )}
      />

      <Controller
        control={control}
        name="oldPassword"
        rules={{ required: "Mật khẩu cũ không được để trống" }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.oldPassword && { borderColor: "red" }]}
            placeholder="Mật khẩu cũ"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.oldPassword && (
        <Text style={styles.error}>{errors.oldPassword.message}</Text>
      )}

      <Controller
        control={control}
        name="newPassword"
        rules={{
          required: "Mật khẩu mới không được để trống",
          pattern: {
            value: new RegExp("^\\d{6,30}$"),
            message: "Mật khẩu không đúng định dạng",
          },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[styles.input, errors.newPassword && { borderColor: "red" }]}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.newPassword && (
        <Text style={styles.error}>{errors.newPassword.message}</Text>
      )}

      <Controller
        control={control}
        name="confirmNewPassword"
        rules={{
          required: "Xác nhận mật khẩu mới không được để trống",
          validate: (value) =>
            value === watch("newPassword") || "Xác thực mật khẩu không đúng",
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={[
              styles.input,
              errors.confirmNewPassword && { borderColor: "red" },
            ]}
            placeholder="Nhập lại mật khẩu mới"
            secureTextEntry
            value={value}
            onChangeText={onChange}
          />
        )}
      />
      {errors.confirmNewPassword && (
        <Text style={styles.error}>{errors.confirmNewPassword.message}</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={handleSubmit(onSubmit)}>
        {changePasswordQuery.isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Lưu</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  error: {
    color: "red",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ChangePasswordScreen;
