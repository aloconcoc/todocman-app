import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile, updateProfile } from "@/services/user.service";
import { getToken } from "@/config/tokenUser";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dob: "",
    phone: "",
    address: "",
  });
  type profileType = {
    name: string;
    email: string;
    password: string;
    dob: string;
    phone: string;
    address: string;
    role: string;
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<profileType>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      dob: "",
      phone: "",
      address: "",
    },
  });
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      await getToken();
      const response = await getProfile("5cd4539c-1563-405e-a3f8-d2a5cf037cea");
      return response.object;
    },
  });

  const mutation = useMutation({
    mutationFn: async (formData) => {
      const response = await updateProfile(data?.id, formData);
      return response;
    },
  });

  const handleChange = (key: any, value: any) => {
    setFormData({
      ...formData,
      [key]: value,
    });
  };

  const handleSaveChanges = () => {
    mutation.mutate();
  };

  const onSubmit = async (data: profileType) => {
    try {
      const response = await updateProfile("", data);
      if (response) {
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
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
        paddingHorizontal: 22,
      }}
    >
      <View
        style={{
          marginHorizontal: 12,
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Text style={{ fontSize: 20 }}>Edit Profile</Text>
      </View>

      <ScrollView>
        <View
          style={{
            alignItems: "center",
            marginVertical: 22,
          }}
        >
          <TouchableOpacity>
            <Image
              source={{
                uri: data?.avatar || "https://via.placeholder.com/150",
              }}
              style={{
                height: 170,
                width: 170,
                borderRadius: 85,
                borderWidth: 1,
                borderColor: "gray",
              }}
            />

            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 10,
                zIndex: 9999,
              }}
            >
              <MaterialIcons name="photo-camera" size={32} color={"gray"} />
            </View>
          </TouchableOpacity>
        </View>

        <View>
          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={{ fontSize: 10 }}>Tên</Text>
                  <View
                    style={{
                      height: 44,
                      width: "100%",
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginVertical: 6,
                      justifyContent: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <TextInput
                      value={data?.name}
                      editable={true}
                      onChangeText={(value) => handleChange("name", value)}
                    />
                  </View>
                </>
              )}
              name="name"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text>Email</Text>
                  <View
                    style={{
                      height: 44,
                      width: "100%",
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginVertical: 6,
                      justifyContent: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <TextInput
                      value={data?.email}
                      editable={true}
                      onChangeText={(value) => handleChange("email", value)}
                    />
                  </View>
                </>
              )}
              name="email"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={{}}>Mật khẩu</Text>
                  <View
                    style={{
                      height: 44,
                      width: "100%",
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginVertical: 6,
                      justifyContent: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <TextInput
                      value={"password"}
                      editable={true}
                      secureTextEntry
                      onChangeText={(value) => handleChange("password", value)}
                    />
                  </View>
                </>
              )}
              name="password"
            />
          </View>

          <View
            style={{
              flexDirection: "column",
              marginBottom: 6,
            }}
          >
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={{}}>Ngày sinh</Text>
                  <TouchableOpacity
                    style={{
                      height: 44,
                      width: "100%",
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginVertical: 6,
                      justifyContent: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <TextInput
                      value={data?.dob}
                      editable={true}
                      onChangeText={(value) => handleChange("dob", value)}
                    />
                  </TouchableOpacity>
                </>
              )}
              name="dob"
            />
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text style={{}}>Vai trò</Text>
                  <TouchableOpacity
                    style={{
                      height: 44,
                      width: "100%",
                      borderColor: "gray",
                      borderWidth: 1,
                      borderRadius: 4,
                      marginVertical: 6,
                      justifyContent: "center",
                      paddingLeft: 8,
                    }}
                  >
                    <TextInput
                      value={data?.role}
                      editable={true}
                      onChangeText={(value) => handleChange("role", value)}
                    />
                  </TouchableOpacity>
                </>
              )}
              name="role"
            />
          </View>
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={{}}>Điện thoại</Text>
                <View
                  style={{
                    height: 44,
                    width: "100%",
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 4,
                    marginVertical: 6,
                    justifyContent: "center",
                    paddingLeft: 8,
                  }}
                >
                  <TextInput
                    value={data?.phone}
                    editable={true}
                    onChangeText={(value) => handleChange("phone", value)}
                  />
                </View>
              </>
            )}
            name="phone"
          />
        </View>

        <View
          style={{
            flexDirection: "column",
            marginBottom: 6,
          }}
        >
          <Controller
            control={control}
            rules={{
              required: true,
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <>
                <Text style={{}}>Địa chỉ</Text>
                <View
                  style={{
                    height: 44,
                    width: "100%",
                    borderColor: "gray",
                    borderWidth: 1,
                    borderRadius: 4,
                    marginVertical: 6,
                    justifyContent: "center",
                    paddingLeft: 8,
                  }}
                >
                  <TextInput
                    value={data?.address}
                    editable={true}
                    onChangeText={(value) => handleChange("address", value)}
                  />
                </View>
              </>
            )}
            name="address"
          />
        </View>

        <TouchableOpacity
          style={{
            backgroundColor: "green",
            height: 44,
            borderRadius: 6,
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={handleSubmit(onSubmit)}
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Save Change
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfile;
