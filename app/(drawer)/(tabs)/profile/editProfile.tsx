import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProfile, updateProfile } from "@/services/user.service";
import { getToken, getUser, setUserInfo } from "@/config/tokenUser";
import { useContext, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Picker } from "@react-native-picker/picker";
import { AppContext } from "@/app/Context/Context";
import LottieView from "lottie-react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import mime from "mime";
import { AxiosError } from "axios";

const EditProfile = () => {
  const client = useQueryClient();
  const [avatar, setAvatar] = useState<any>();
  const [datePickerState, setDatePickerState] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const { userContext }: any = useContext(AppContext);
  const [ocr, setOcr] = useState<any>();
  const [gender, setGender] = useState<string>("");
  const [nameValidationMessage, setnameValidationMessage] = useState("");
  const [phoneValidationMessage, setphoneValidationMessage] = useState("");
  const [addressValidationMessage, setaddressValidationMessage] = useState("");
  const [idCardValidationMessage, setidCardValidationMessage] = useState("");
  const [departmentValidationMessage, setdepartmentValidationMessage] =
    useState("");
  const [positionValidationMessage, setpositionValidationMessage] =
    useState("");
  type FieldType =
    | "name"
    | "phone"
    | "address"
    | "idCard"
    | "department"
    | "position";

  const regexPatterns = {
    name: /^(?!\s)(?!.*\s{2})[A-Za-zÀ-ỹà-ỹ\s]{8,30}(?<!\s)$/,
    phone: /^(03|05|07|08|09)\d{8}$/,
    address: /^(?!\s)(?!.*\s{2})[A-Za-zÀ-ỹà-ỹ0-9.,\s-_]{2,100}(?<!\s)$/,
    idCard: /^\d{12}$/,
    department: /^(?!\s)(?!.*\s{2})[A-Za-zÀ-ỹà-ỹ0-9.,\s-_]{2,100}(?<!\s)$/,
    position: /^(?!\s)(?!.*\s{2})[A-Za-zÀ-ỹà-ỹ0-9.,\s-_]{2,100}(?<!\s)$/,
  };

  const validateField = (value: string, type: FieldType) => {
    const regex = regexPatterns[type];
    return regex.test(value.trim());
  };

  const handleCheck = (
    value: any,
    type: any,
    setMessage: any,
    fieldName: any
  ) => {
    if (value.trim() === "") {
      setMessage(`Trường '${fieldName}' không được để trống`);
    } else if (validateField(value, type)) {
      setMessage(`${fieldName} hợp lệ`);
    } else {
      setMessage(`${fieldName} không hợp lệ`);
    }
  };
  const isFormValid = () => {
    return (
      nameValidationMessage === "Tên hợp lệ" &&
      phoneValidationMessage === "Số điện thoại hợp lệ" &&
      addressValidationMessage === "Địa chỉ hợp lệ" &&
      idCardValidationMessage === "CMND/CCCD hợp lệ" &&
      departmentValidationMessage === "Phòng ban hợp lệ" &&
      positionValidationMessage === "Vị trí hợp lệ"
    );
  };

  type ProfileType = {
    name: string;
    email: string;
    department: string;
    position: string;
    dob: string;
    phone: string;
    address: string;
    identificationNumber: string;
    gender: string;
  };
  const {
    control,
    formState: { errors },
    reset,
  } = useForm<ProfileType>();

  const { data, isLoading, error, refetch } = useQuery(
    ["userDetail", userContext],
    () => getProfile(userContext),
    {
      enabled: !!userContext,
      onSuccess: (response: any) => {
        if (response.object) {
          reset({
            ...response.object,

            address:
              response.object?.address != null ||
              response.object?.address != "null"
                ? response.object?.address
                : "",
            department:
              response.object?.department != null ||
              response.object?.department != "null"
                ? response.object?.department
                : "",
            identificationNumber:
              response.object?.identificationNumber != null ||
              response.object?.identificationNumber != "null"
                ? response.object?.identificationNumber
                : "",
            position:
              response.object?.position != null ||
              response.object?.position != "null"
                ? response.object?.position
                : "",
          });

          setAvatar(
            response.object?.avatar == null ? avatar : response.object?.avatar
          );
          const gender =
            response?.object?.gender === true
              ? "male"
              : response?.object?.gender === false
              ? "female"
              : "";
          setGender(gender);
        }
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data?.message || "Lỗi hệ thống",
          ToastAndroid.SHORT
        );
      },
    }
  );
  useEffect(() => {
    if (data?.object) {
      reset({
        ...data.object,
      });
      setAvatar(data.object?.avatar == null ? avatar : data.object?.avatar);
    }
  }, [data, reset]);

  const onChangeDate = (selectedDate: any) => {
    setDatePickerState(false);
    if (selectedDate) {
      setDate(selectedDate);
    } else {
      setDate(new Date());
    }
  };

  const mutation = useMutation(
    async (data: any) => {
      console.log("u", userContext, data);

      if (userContext) await updateProfile(userContext, data);
    },
    {
      onSuccess: () => {
        ToastAndroid.show("Cập nhật thông tin thành công!", ToastAndroid.SHORT);
        // client.invalidateQueries(["userDetail", userContext]);
        refetch();
        router.navigate("profile");
      },
      onError: (e) => {
        console.log("error up", e);
        ToastAndroid.show("Cập nhật thông tin thất bại!", ToastAndroid.SHORT);
        return;
      },
    }
  );

  const formatDate = (date: any) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const onSubmit = async (data: any) => {
    try {
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        data.dob = `${day}/${month}/${year}`;
      }
      data = {
        gender: gender === "male" ? true : gender === "female" ? false : null,
      };

      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (avatar) {
        formData.append("file", ocr);
      }

      mutation.mutate(formData);
    } catch (error) {
      console.log("error", error);
    }
  };

  const selectImage = async () => {
    let result;
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    };

    result = await ImagePicker.launchImageLibraryAsync();

    // Save image if not cancelled
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
      const trimmedURI =
        Platform.OS === "android"
          ? result.assets[0]?.uri
          : result.assets[0]?.uri.replace("file://", "");
      const fileName = trimmedURI.split("/").pop();

      setOcr({
        uri: trimmedURI,
        type: mime.getType(trimmedURI),
        name: fileName,
      });
    }
  };

  if (isLoading) {
    return (
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        <LottieView
          autoPlay
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "white",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error?.message}</Text>;
  }

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
        <Text style={{ fontSize: 20 }}>Sửa thông tin</Text>
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
                uri: avatar || "https://via.placeholder.com/150",
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
              <Pressable
                onPress={() => {
                  selectImage();
                }}
                disabled={mutation.isLoading}
              >
                <MaterialIcons name="photo-camera" size={32} color={"gray"} />
              </Pressable>
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
                      value={value}
                      editable={!mutation.isLoading}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        handleCheck(
                          text,
                          "name",
                          setnameValidationMessage,
                          "Tên"
                        );
                      }}
                    />
                  </View>
                </>
              )}
              name="name"
            />
            {nameValidationMessage && (
              <Text
                style={{
                  opacity: 0.5,
                  color:
                    nameValidationMessage === "Tên hợp lệ" ? "white" : "red",
                }}
              >
                {nameValidationMessage}
              </Text>
            )}
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
                  <Text>Phòng ban</Text>
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
                      value={value}
                      editable={!mutation.isLoading}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        handleCheck(
                          text,
                          "department",
                          setdepartmentValidationMessage,
                          "Phòng ban"
                        );
                      }}
                    />
                  </View>
                </>
              )}
              name="department"
            />
            {departmentValidationMessage && (
              <Text
                style={{
                  opacity: 0.5,
                  color:
                    departmentValidationMessage === "Phòng ban hợp lệ"
                      ? "white"
                      : "red",
                }}
              >
                {departmentValidationMessage}
              </Text>
            )}
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
                  <Text>Vị trí</Text>
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
                      value={value}
                      editable={!mutation.isLoading}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        handleCheck(
                          text,
                          "position",
                          setpositionValidationMessage,
                          "Vị trí"
                        );
                      }}
                    />
                  </View>
                </>
              )}
              name="position"
            />
            {positionValidationMessage && (
              <Text
                style={{
                  opacity: 0.5,
                  color:
                    positionValidationMessage === "Vị trí hợp lệ"
                      ? "white"
                      : "red",
                }}
              >
                {positionValidationMessage}
              </Text>
            )}
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
                      value={value}
                      editable={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      keyboardType="email-address"
                    />
                  </TouchableOpacity>
                </>
              )}
              name="email"
            />

            <Controller
              control={control}
              rules={{
                required: true,
              }}
              render={({ field: { onChange, onBlur, value } }) => (
                <>
                  <Text>CMND/CCCD</Text>
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
                      value={value}
                      keyboardType="phone-pad"
                      editable={!mutation.isLoading}
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                        handleCheck(
                          text,
                          "idCard",
                          setidCardValidationMessage,
                          "CMND/CCCD"
                        );
                      }}
                    />
                  </TouchableOpacity>
                </>
              )}
              name="identificationNumber"
            />
            {idCardValidationMessage && (
              <Text
                style={{
                  opacity: 0.5,
                  color:
                    idCardValidationMessage === "CMND/CCCD hợp lệ"
                      ? "white"
                      : "red",
                }}
              >
                {idCardValidationMessage}
              </Text>
            )}
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
                <Text>Điện thoại</Text>
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
                    value={value}
                    editable={!mutation.isLoading}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      handleCheck(
                        text,
                        "phone",
                        setphoneValidationMessage,
                        "Số điện thoại"
                      );
                    }}
                    keyboardType="phone-pad"
                  />
                </View>
              </>
            )}
            name="phone"
          />
          {phoneValidationMessage && (
            <Text
              style={{
                opacity: 0.5,
                color:
                  phoneValidationMessage === "Số điện thoại hợp lệ"
                    ? "white"
                    : "red",
              }}
            >
              {phoneValidationMessage}
            </Text>
          )}
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
                <Text>Địa chỉ</Text>
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
                    value={value}
                    editable={!mutation.isLoading}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
                      handleCheck(
                        text,
                        "address",
                        setaddressValidationMessage,
                        "Địa chỉ"
                      );
                    }}
                  />
                </View>
              </>
            )}
            name="address"
          />
          {addressValidationMessage && (
            <Text
              style={{
                opacity: 0.5,
                color:
                  addressValidationMessage === "Địa chỉ hợp lệ"
                    ? "white"
                    : "red",
              }}
            >
              {addressValidationMessage}
            </Text>
          )}
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
                <Text style={{ marginBottom: 8 }}>Ngày sinh</Text>
                <TouchableOpacity
                  onPress={() => setDatePickerState(true)}
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 7,
                  }}
                  disabled={mutation.isLoading}
                >
                  <View pointerEvents="none">
                    <TextInput
                      placeholder="dd/mm/yyyy"
                      value={formatDate(date)}
                      editable={false}
                      style={{ color: "black" }}
                    />
                  </View>
                </TouchableOpacity>
                {datePickerState && (
                  <RNDateTimePicker
                    testID="dateTimePicker"
                    value={date}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate || date;
                      onChangeDate(currentDate);
                    }}
                  />
                )}
              </>
            )}
            name="dob"
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
            rules={{ required: true }}
            render={({ field: { onChange, value } }) => {
              return (
                <View>
                  <Picker
                    selectedValue={gender}
                    onValueChange={(itemValue) => {
                      setGender(itemValue);
                      onChange(itemValue);
                    }}
                  >
                    <Picker.Item label="Chọn giới tính" value="" />
                    <Picker.Item label="Nam" value="male" />
                    <Picker.Item label="Nữ" value="female" />
                  </Picker>
                </View>
              );
            }}
            name="gender"
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
          onPress={() => onSubmit(control._formValues)}
          disabled={mutation.isLoading}
        >
          {mutation.isLoading ? (
            <ActivityIndicator size="large" color="lightseagreen" />
          ) : (
            <Text
              style={{
                color: "white",
              }}
            >
              Lưu
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfile;
