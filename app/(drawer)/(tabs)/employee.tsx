import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Dimensions,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { useQuery } from "react-query";
import LottieView from "lottie-react-native";
import Pagination from "@/components/utils/pagination";

import { AxiosError } from "axios";
import { getListEmployee } from "@/services/employee.service";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { getListDepartment } from "@/services/department.service";
import { Picker } from "@react-native-picker/picker";

export interface DataEmployee {
  id?: string;
  name?: string;
  email?: string;
  password?: string;
  phone?: string;
  position?: string;
  status?: string;
  identificationNumber?: string;
  department?: string;
  permissions?: string;
  address?: string;
  dob?: string;
}

const ManageEmployee = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [query, setQuery] = useState<string>("");
  const [fakeQuery, setFakeQuery] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [status, setStatus] = useState("ACTIVE");
  const [department, setDepartment] = useState("");

  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };
  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    console.log(employee);

    setModalVisible(true);
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["employee-list", query, status, department],
    () =>
      getListEmployee({
        size: size,
        page: page,
        name: query,
        status,
        department,
      }),
    {
      onSuccess: (result) => {
        setTotalPage(result?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data?.message || error.message || "Hệ thống lỗi",
          ToastAndroid.SHORT
        );
      },
    }
  );
  const { data: dataDepartment } = useQuery("list-department", () =>
    getListDepartment(0, 50)
  );

  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  const handChangeInputSearch = () => {
    if (fakeQuery.trim() === "") {
      setSearched(false);
      return;
    }
    setQuery(fakeQuery);
  };
  const clearSearch = () => {
    setFakeQuery("");
    setQuery("");
    setSearched(false);
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
  };

  if (isLoading) {
    return (
      <View style={styles.loader}>
        <LottieView
          autoPlay
          style={{
            width: "80%",
            height: "80%",
            backgroundColor: "transparent",
          }}
          source={require("@/assets/load.json")}
        />
      </View>
    );
  }
  const formatDate = (dateString: any) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity onPress={() => handleEmployeePress(item)}>
      <View style={styles.row}>
        <Text style={[styles.cell, { flex: 0.1 }]}>
          {(index + 1).toString()}
        </Text>
        <Text style={[styles.cell, { flex: 0.3 }]}>{item?.name}</Text>
        <Text style={[styles.cell, { flex: 0.4 }]}>{item?.email}</Text>
        <Text style={[styles.cell, { flex: 0.3 }]}>{item?.phone}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{ flexDirection: "row" }}>
        <View style={styles.searchContainer}>
          <Ionicons
            name="search"
            size={20}
            color="gray"
            style={styles.searchIcon}
          />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Nhập từ khóa tìm kiếm"
            value={fakeQuery}
            onChangeText={(text) => setFakeQuery(text.trim())}
            onSubmitEditing={handChangeInputSearch}
          />

          {fakeQuery.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <AntDesign
                name="closecircle"
                size={20}
                color="gray"
                style={styles.clearIcon}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={{
            backgroundColor: "dodgerblue",
            width: 50,
            height: 40,
            marginLeft: 15,
            borderRadius: 10,
          }}
          onPress={handChangeInputSearch}
        >
          <AntDesign
            name="search1"
            size={20}
            color="white"
            style={{
              position: "absolute",
              right: "30%",
              top: "25%",
            }}
          />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: "row",
          marginTop: -15,
        }}
      >
        <Picker
          selectedValue={"ACTIVE"}
          style={{ height: 50, flex: 1 }}
          onValueChange={(itemValue) => setStatus(itemValue)}
        >
          <Picker.Item
            color={status === "ACTIVE" ? "green" : "black"}
            label="Đang hoạt động"
            value="ACTIVE"
          />
          <Picker.Item
            color={status === "INACTIVE" ? "green" : "black"}
            label="Không hoạt động"
            value="INACTIVE"
          />
        </Picker>

        <Picker
          selectedValue={department === "all" ? "" : department}
          style={{ height: 50, flex: 1, marginLeft: 10 }}
          onValueChange={(itemValue) =>
            setDepartment(itemValue === "all" ? "" : itemValue)
          }
        >
          <Picker.Item
            label="Tất cả"
            value="all"
            color={department === "" ? "green" : "black"}
          />
          {dataDepartment?.object?.content?.map((item: any) => (
            <Picker.Item
              key={item.id}
              label={item.title}
              value={item.id}
              color={department === item.id ? "green" : "black"}
            />
          ))}
        </Picker>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 0.1, fontSize: 12 }]}>
          STT
        </Text>
        <Text style={[styles.headerCell, { flex: 0.3, fontSize: 12 }]}>
          Tên nhân viên
        </Text>
        <Text style={[styles.headerCell, { flex: 0.4, fontSize: 12 }]}>
          Email
        </Text>
        <Text style={[styles.headerCell, { flex: 0.3, fontSize: 12 }]}>
          Số điện thoại
        </Text>
      </View>
      <FlatList
        data={data?.object?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {data?.object?.content ? (
        <Pagination
          totalPages={totalPage}
          currentPage={page + 1}
          size={size}
          setSize={setSize}
          setPage={setPage}
          onPageChange={handlePageChange}
        />
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 18,
              color: "gray",
              opacity: 0.5,
              fontWeight: "bold",
            }}
          >
            Không có nhân viên
          </Text>
        </View>
      )}
      {selectedEmployee && (
        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={closeModal}
        >
          <TouchableWithoutFeedback onPress={closeModal}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>

          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Thông tin nhân viên</Text>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Tên: </Text>
              <Text style={styles.value}>{selectedEmployee.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Email: </Text>
              <Text style={[styles.value]}>{selectedEmployee.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Chức vụ: </Text>
              <Text style={styles.value}>{selectedEmployee.position}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Phòng ban: </Text>
              <Text style={styles.value}>
                {dataDepartment?.object?.content.find(
                  (data: any) => data.id == selectedEmployee.department
                ) != undefined
                  ? dataDepartment?.object?.content.find(
                      (data: any) => data.id == selectedEmployee.department
                    ).title
                  : ""}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>CMND/CCCD: </Text>
              <Text style={styles.value}>
                {selectedEmployee.identificationNumber}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Địa chỉ: </Text>
              <Text style={styles.value}>{selectedEmployee.address}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Giới tính: </Text>
              <Text style={styles.value}>Nam</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Ngày sinh: </Text>
              <Text style={styles.value}>
                {formatDate(selectedEmployee.dob)}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Số điện thoại: </Text>
              <Text style={styles.value}>{selectedEmployee.phone}</Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.bold, styles.label]}>Quyền: </Text>
              <Text style={styles.value}>
                {selectedEmployee.permissions?.slice(1, -1)}
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    paddingBottom: 5,
    backgroundColor: "#fff",
    maxHeight: "99.9%",
  },
  header: {
    flexDirection: "row",
    borderBottomWidth: 1,
    alignItems: "center",
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 0.2,
    fontWeight: "bold",
    padding: 5,
    textAlign: "center",
  },

  textGap: {
    marginVertical: 2,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    textAlign: "center",
    alignItems: "center",
  },
  cell: {
    flex: 0.2,
    padding: 5,
    fontSize: 12,
    textAlign: "center",
  },
  linkText: {
    color: "teal",
    fontWeight: "600",
    textAlign: "center",
  },
  loader: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "100%",
    padding: 16,
    backgroundColor: "white",
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 8,
  },
  closeButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#007bff",
    borderRadius: 4,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
    width: "80%",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 40,
  },
  clearIcon: {
    marginLeft: 8,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  label: {
    flex: 4,
    fontWeight: "bold",
  },
  value: {
    flex: 5,
    paddingVertical: 8,
    paddingLeft: 5,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default ManageEmployee;
