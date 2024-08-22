import React, { useContext, useEffect, useRef, useState } from "react";
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
import { AppContext } from "@/app/Context/Context";
import { ADMIN } from "@/components/utils/permissions";
import { getSalaryAll, getSalaryByMail } from "@/services/salary.service";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";

const Salary = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [fakeQuery, setFakeQuery] = useState<string>("");
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const { userInfoC }: any = useContext(AppContext);

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const months = Array.from({ length: currentMonth }, (_, i) => i + 1);
  const years = Array.from({ length: 21 }, (_, i) => currentYear - i);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);

  const handlePageChange = (page: any) => {
    setPage(page - 1);
  };

  const { data, isLoading, refetch, isFetching } = useQuery(
    ["employee-list"],
    () => {
      if (userInfoC?.role == ADMIN) {
        return getSalaryAll({
          page: page,
          size: size,
          month: month,
          year: year,
          type: "SALE",
        });
      }
      return getSalaryByMail({
        page: page,
        size: size,
        month: month,
        year: year,
      });
    },
    {
      onSuccess: (result) => {
        console.log(result);

        setTotalPage(result?.object?.totalPages);
      },
      onError: (error: AxiosError<{ message: string }>) => {
        ToastAndroid.show(
          error.response?.data?.message || "Không tìm thấy nhân viên",
          ToastAndroid.SHORT
        );
      },
    }
  );
  useEffect(() => {
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  const handChangeInputSearch = () => {
    refetch();
  };

  const clearSearch = () => {
    setFakeQuery("");
    setQuery("");
  };
  const closeModal = () => {
    setModalVisible(false);
    setSelectedEmployee(null);
  };
  const handleEmployeePress = (employee: any) => {
    setSelectedEmployee(employee);
    console.log(employee);

    setModalVisible(true);
  };

  const renderItem = ({ item, index }: any) => (
    <TouchableOpacity onPress={() => handleEmployeePress(item)}>
      <View style={styles.row}>
        <Text style={[styles.cell, { flex: 0.1 }]}>
          {(index + 1).toString()}
        </Text>
        <Text style={[styles.cell, { flex: 0.3 }]}>{item?.user.name}</Text>
        <Text style={[styles.cell, { flex: 0.4, textAlign: "left" }]}>
          {item?.email}
        </Text>
        <Text style={[styles.cell, { flex: 0.3 }]}>
          {item?.baseSalary?.toLocaleString() || "0"}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
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
          />
          {query.length > 0 && (
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
          justifyContent: "space-evenly",
        }}
      >
        <Picker
          style={{ height: 50, width: 150 }}
          selectedValue={month}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          <Picker.Item
            label="Chọn tháng"
            value=""
            enabled={false}
            style={{ color: "gray" }}
          />

          <Picker.Item label="Tất cả" value={100} />
          {months.map((m) => (
            <Picker.Item key={m} label={`Tháng ${m}`} value={m} />
          ))}
        </Picker>

        <Picker
          style={{ height: 10, width: 150 }}
          selectedValue={year}
          onValueChange={(itemValue) => setYear(itemValue)}
        >
          <Picker.Item
            label="Chọn năm"
            value=""
            enabled={false}
            style={{ color: "gray" }}
          />
          {years.map((y) => (
            <Picker.Item key={y} label={`${y}`} value={y} />
          ))}
        </Picker>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 0.1 }]}>STT</Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Tên nhân viên</Text>
        <Text style={[styles.headerCell, { flex: 0.4 }]}>Email</Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Lương cứng</Text>
      </View>
      <FlatList
        data={data?.object?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />
      <Modal
        transparent={true}
        visible={isLoading || isFetching}
        animationType="fade"
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
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
            <Text style={styles.modalTitle}>Thông tin phiếu lương</Text>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Tên: </Text>
              <Text style={styles.value}>{selectedEmployee?.user.name}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Email: </Text>
              <Text style={[styles.value]}>{selectedEmployee.email}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Tổng doanh số </Text>
              <Text style={styles.value}>
                {selectedEmployee?.totalValueContract}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Lương cứng </Text>
              <Text style={styles.value}>{selectedEmployee?.baseSalary}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>% Doanh số </Text>
              <Text style={styles.value}>
                {selectedEmployee?.commissionPercentage}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>% Triển khai KH </Text>
              <Text style={styles.value}>
                {selectedEmployee?.clientDeploymentPercentage}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>
                Thưởng đạt ngưỡng{" "}
              </Text>
              <Text style={styles.value}>
                {selectedEmployee?.bonusReachesThreshold}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Trợ cấp ăn </Text>
              <Text style={styles.value}>
                {selectedEmployee?.foodAllowance}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={[styles.bold, styles.label]}>Phụ cấp </Text>
              <Text style={styles.value}>
                {selectedEmployee?.transportationOrPhoneAllowance}
              </Text>
            </View>
            <View style={[styles.detailRow, { borderBottomWidth: 0 }]}>
              <Text style={[styles.bold, styles.label]}>Tiền lương </Text>
              <Text style={styles.value}>{selectedEmployee?.totalSalary}</Text>
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
    borderTopWidth: 1,
    alignItems: "center",
    borderBottomColor: "#000",
  },
  headerCell: {
    flex: 0.2,
    fontWeight: "bold",
    padding: 2,
    fontSize: 12.9,
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

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
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

export default Salary;
