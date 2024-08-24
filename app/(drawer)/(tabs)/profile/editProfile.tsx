import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  ActivityIndicator,
  Image,
  Modal,
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
import regexPatterns from "@/constants/regex.json";
import moment from "moment";

const EditProfile = () => {
  const client = useQueryClient();
  const [avatar, setAvatar] = useState<any>();
  const [datePickerState, setDatePickerState] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  console.log("1date", date);

  const { userContext }: any = useContext(AppContext);
  const [ocr, setOcr] = useState<any>();
  const [gender, setGender] = useState<string>("");
  const [nameValidationMessage, setNameValidationMessage] =
    useState("Tên hợp lệ");
  const [phoneValidationMessage, setphoneValidationMessage] = useState("");
  const [addressValidationMessage, setAddressValidationMessage] =
    useState("Địa chỉ hợp lệ");
  const [idCardValidationMessage, setidCardValidationMessage] = useState("");
  const [departmentValidationMessage, setdepartmentValidationMessage] =
    useState("");
  const [positionValidationMessage, setpositionValidationMessage] =
    useState("");

  const validateName = (name: string) => {
    const regex = new RegExp(regexPatterns.REGEX_NAME);
    return regex.test(name.trim());
  };

  const handleNameChange = (value: string) => {
    if (value.trim() === "") {
      setNameValidationMessage("Trường 'Tên' để trống");
    } else if (validateName(value)) {
      setNameValidationMessage("Tên hợp lệ");
    } else {
      setNameValidationMessage("Tên không hợp lệ");
    }
  };
  const validateAddress = (address: string) => {
    const regex = new RegExp(regexPatterns.REGEX_ADDRESS);
    return regex.test(address.trim());
  };

  const handleAddressChange = (value: string) => {
    if (value.trim() === "") {
      setAddressValidationMessage("Trường 'Địa chỉ' để trống");
    } else if (validateAddress(value)) {
      setAddressValidationMessage("Địa chỉ hợp lệ");
    } else {
      setAddressValidationMessage("Địa chỉ không hợp lệ");
    }
  };
  const isFormValid = () => {
    return (
      nameValidationMessage === "Tên hợp lệ" &&
      addressValidationMessage === "Địa chỉ hợp lệ"
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
            dob:
              response.object?.dob != null || response.object?.dob != "null"
                ? moment(response.object?.dob).format("YYYY-MM-DD")
                : response.object?.dob,
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
          "Không tìm thấy thông tin người dùng",
          ToastAndroid.SHORT
        );
      },
    }
  );
  useEffect(() => {
    if (data?.object) {
      console.log("dumalala: ", data?.object);

      reset({
        ...data.object,
        dob:
          data.object?.dob != null
            ? moment(data.object?.dob).format("YYYY-MM-DD")
            : data.object?.dob,
      });
      console.log("dddd:", data.object?.dob);

      setDate(new Date(data.object?.dob));

      setAvatar(data.object?.avatar == null ? avatar : data.object?.avatar);
    }
  }, [data, reset]);

  const onChangeDate = (selectedDate: any) => {
    setDatePickerState(false);
    if (selectedDate) {
      console.log("chon ngay", selectedDate);

      setDate(selectedDate);
    } else {
      setDate(new Date());
    }
  };

  const mutation = useMutation(
    async (data: any) => {
      console.log("data", data);

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
      if (!isFormValid()) {
        return;
      }
      if (date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        data.dob = `${day}/${month}/${year}`;
      }
      if (data.gender === "male") {
        data.gender = true;
      } else if (data.gender === "female") {
        data.gender = false;
      }
      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (avatar) {
        formData.append("file", ocr);
      }

      mutation.mutate(formData);
      console.log("Mutation", formData);
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
                        handleNameChange(text);
                      }}
                    />
                  </View>
                </>
              )}
              name="name"
            />
            {nameValidationMessage != "Tên hợp lệ" && (
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
                      value={value}
                      onBlur={onBlur}
                      editable={false}
                      onChangeText={onChange}
                      keyboardType="email-address"
                    />
                  </View>
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
                      editable={false}
                      keyboardType="phone-pad"
                      onBlur={onBlur}
                      onChangeText={(text) => {
                        onChange(text);
                      }}
                    />
                  </View>
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
                    editable={false}
                    onBlur={onBlur}
                    onChangeText={(text) => {
                      onChange(text);
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
                      handleAddressChange(text);
                    }}
                  />
                </View>
              </>
            )}
            name="address"
          />
          {addressValidationMessage != "Địa chỉ hợp lệ" && (
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
      <Modal transparent={true} visible={isLoading} animationType="fade">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "transparent",
          }}
        >
          <LottieView
            autoPlay
            loop
            style={{ width: 150, height: 150 }}
            source={require("@/assets/load.json")}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default EditProfile;
