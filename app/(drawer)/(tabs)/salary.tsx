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

const { width, height } = Dimensions.get("window");

const Salary = () => {
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPage, setTotalPage] = useState(1);
  const prevPageRef = useRef(page);
  const prevSizeRef = useRef(size);
  const [searchData, setSearchData] = useState("");
  const [query, setQuery] = useState<string>("");
  const inputRef = useRef<TextInput>(null);
  const [searched, setSearched] = useState<boolean>(false);
  const [month, setMonth] = useState(0);
  const [year, setYear] = useState(0);

  const { userInfoC }: any = useContext(AppContext);

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
          month: 8,
          year: 2024,
          type: "SALE",
        });
      }
      return getSalaryByMail({
        page: page,
        size: size,
        month: 8,
        year: 2024,
      });
    },
    {
      onSuccess: (result) => {
        setTotalPage(result?.object?.totalPages);
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
    if (prevPageRef.current !== page || prevSizeRef.current !== size) {
      prevPageRef.current = page;
      prevSizeRef.current = size;
      refetch();
    }
  }, [page, refetch, size]);

  const handChangeInputSearch = () => {
    if (query.trim() === "") {
      setSearched(false);
      return;
    }
  };

  const clearSearch = () => {
    setQuery("");
    setSearched(false);
  };

  if (isLoading || isFetching) {
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

  const renderItem = ({ item, index }: any) => (
    <View style={styles.row}>
      <Text style={[styles.cell, { flex: 0.1 }]}>{(index + 1).toString()}</Text>
      <Text style={[styles.cell, { flex: 0.3 }]}>{item?.email}</Text>
      <Text style={[styles.cell, { flex: 0.4 }]}>
        {item?.baseSalary?.toLocaleString() || "0"}
      </Text>
      <Text style={[styles.cell, { flex: 0.3 }]}>
        {item?.totalValueContract?.toLocaleString() || "0"}
      </Text>
      <Text style={[styles.cell, { flex: 0.3 }]}>
        {item?.totalSalary?.toLocaleString() || "0"}
      </Text>
    </View>
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
            value={query}
            onChangeText={(text) => setQuery(text)}
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
            marginLeft: 10,
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
        }}
      >
        <Picker
          style={{ width: "36%" }}
          selectedValue={month}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          <Picker.Item label="Chọn tháng" value={8} enabled={false} />
          <Picker.Item label="8" value={8} />
          <Picker.Item label="1" value={1} />
          <Picker.Item label="2" value={2} />
        </Picker>

        <Picker
          style={{ width: "36%" }}
          selectedValue={month}
          onValueChange={(itemValue) => setMonth(itemValue)}
        >
          <Picker.Item label="Chọn năm" value={0} enabled={false} />
          <Picker.Item label="2024" value={2024} />
          <Picker.Item label="2023" value={2023} />
          <Picker.Item label="2022" value={2022} />
        </Picker>
      </View>
      <View style={styles.header}>
        <Text style={[styles.headerCell, { flex: 0.1 }]}>Stt</Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Email</Text>
        <Text style={[styles.headerCell, { flex: 0.4 }]}>
          Lương cơ bản(VND)
        </Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>
          Tổng doanh số(VND)
        </Text>
        <Text style={[styles.headerCell, { flex: 0.3 }]}>Tiền lương(VND)</Text>
      </View>
      <FlatList
        data={data?.object?.content}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
      />

      {data && data?.object?.content?.length != 0 ? (
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "#fff",
    maxHeight: "99%",
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
    padding: 2,
    fontSize: 12,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    position: "absolute",
    bottom: "38%",
    left: "10%",
    width: "80%",
    padding: 20,
    paddingTop: 0,
    backgroundColor: "white",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    marginBottom: 5,
    color: "#03ecfc",
    width: 50,
    borderRadius: 50,
    textAlign: "center",
    alignContent: "center",
    alignItems: "center",
    alignSelf: "center",
  },
  pdf: {
    width: width * 0.99,
    height: height * 0.92,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});

export default Salary;
