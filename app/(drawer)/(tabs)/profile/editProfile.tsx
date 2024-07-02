import { View } from "@/components/Themed";
import { MaterialIcons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
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
import { getToken, getUser } from "@/config/tokenUser";
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
  const [img, setImg] = useState("");
  const [ocr, setOcr] = useState<any>();
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

  // const { data, isLoading, isError, error } = useQuery({
  //   queryKey: ["profile"],
  //   queryFn: async () => {
  //     const response = await getProfile(userContext);
  //     setAvatar(response?.object?.avatar);
  //     console.log("respon", response.object.dob);

  //     const p = new Date(response.object.dob);
  //     setDate(p);

  //     return response.object;
  //   },
  // });
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
        console.log("date", date);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        data.dob = `${day}/${month}/${year}`;
      }

      const formData = new FormData();
      for (const key in data) {
        formData.append(key, data[key]);
      }

      if (avatar) {
        console.log("img: " + JSON.stringify(ocr));

        formData.append("file", ocr);
      }
      console.log("avatar", avatar);
      console.log("data: ", data);

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
      console.log(result.assets[0]);

      setAvatar(result.assets[0]);
      const trimmedURI =
        Platform.OS === "android"
          ? result.assets[0].uri
          : result.assets[0].uri.replace("file://", "");
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
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
        {/* <Image source={require('../../assets/images/load.jpg')} /> */}
        <LottieView
          autoPlay
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "white",
          }}
          // Find more Lottie files at https://lottiefiles.com/featured
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
                uri:
                  avatar?.uri ||
                  data.avatar ||
                  "https://via.placeholder.com/150",
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
                      editable={true}
                      onBlur={onBlur}
                      onChangeText={onChange}
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
                      editable={true}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </View>
                </>
              )}
              name="department"
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
                      editable={true}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </View>
                </>
              )}
              name="position"
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
                  <Text style={{}}>Email</Text>
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
                  <Text style={{}}>CCCD/CMT</Text>
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
                      editable={true}
                      onBlur={onBlur}
                      onChangeText={onChange}
                    />
                  </TouchableOpacity>
                </>
              )}
              name="identificationNumber"
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
                    editable={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    keyboardType="phone-pad"
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
                    editable={true}
                    onBlur={onBlur}
                    onChangeText={onChange}
                  />
                </View>
              </>
            )}
            name="address"
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
                <TouchableOpacity
                  onPress={() => setDatePickerState(true)}
                  style={{
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: 7,
                  }}
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
            render={({ field: { onChange, value } }) => (
              <View>
                <Picker
                  selectedValue={value}
                  onValueChange={(itemValue) => onChange(itemValue)}
                >
                  <Picker.Item label="Chọn giới tính" value="" />
                  <Picker.Item label="Nam" value={true} />
                  <Picker.Item label="Nữ" value={false} />
                </Picker>
              </View>
            )}
            name="gender"
            defaultValue=""
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
        >
          <Text
            style={{
              color: "white",
            }}
          >
            Lưu
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
export default EditProfile;
