import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  Button,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "react-query";
import { getSearchContract } from "@/services/contract.service";
import ItemNewContract from "@/components/search/ItemNewContract";
import ItemOldContract from "@/components/search/ItemOldContract";
import Pagination from "@/components/utils/pagination";
import { getContractType } from "@/services/contract-type.service";
import { Picker } from "@react-native-picker/picker";
import Pdf from "react-native-pdf";
import { router } from "expo-router";

const { width, height } = Dimensions.get("window");

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [contractType, setContractType] = useState<string>("contract");
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState<any>();
  const inputRef = useRef<TextInput>(null);
  const [selectedContract, setSelectedContract] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const searchQuery = useMutation(getSearchContract, {
    onSuccess: (result) => {
      setData(result.object);
      setTotalPage(result?.object?.totalPages);
    },
  });

  useEffect(() => {
    if (contractType && searched) {
      searchQuery.mutate({
        fieldSearch: contractType,
        data: { page, size, key: query },
      });
    }
  }, [page, size, contractType]);

  const handleSearch = () => {
    if (query.trim() === "") {
      setSearched(false);
      return;
    }
    searchQuery.mutate({
      fieldSearch: contractType,
      data: { page, size, key: query },
    });
    setSearched(true);
  };

  const clearSearch = () => {
    setQuery("");
    setSearched(false);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage - 1);
  };

  const openModal = (contract: any) => {
    setSelectedContract(contract);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedContract(null);
  };

  return (
    <View style={styles.container}>
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
          onSubmitEditing={handleSearch}
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

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button,
            contractType === "contract" && styles.buttonSelected,
          ]}
          onPress={() => setContractType("contract")}
        >
          <Text style={styles.buttonText}>Hợp đồng mới</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            contractType === "old-contract" && styles.buttonSelected,
          ]}
          onPress={() => setContractType("old-contract")}
        >
          <Text style={styles.buttonText}>Hợp đồng cũ</Text>
        </TouchableOpacity>
      </View>
      {/* <View
        style={{
          width: 200,
          height: 40,
          borderWidth: 1,
          justifyContent: "center",
          marginHorizontal: "auto",
          borderRadius: 5,
        }}
      >
        <Picker
          selectedValue={typeContr}
          onValueChange={(itemValue) => setTypeContr(itemValue as string)}
          enabled={true}
        >
          <Picker.Item
            style={{ color: typeContr === "all" ? "green" : "black" }}
            label="Tất cả"
            value="all"
            key="all"
          />
          {typeData?.content.map((d: any) => (
            <Picker.Item
              label={d.title}
              value={d.id}
              key={d.id}
              style={{ color: typeContr === d.id ? "green" : "black" }}
            />
          ))}
        </Picker>
      </View> */}

      {searchQuery.isLoading ? (
        <ActivityIndicator size="large" color="lightseagreen" />
      ) : searched && (!data || !data.content || data.content.length === 0) ? (
        <Text style={styles.noResults}>Không có kết quả</Text>
      ) : (
        searched && (
          <>
            <Text style={styles.resultCount}>
              Hiển thị {data?.totalElements} kết quả cho "
              <Text style={styles.queryText}>{query}</Text>" của{" "}
              {contractType === "contract" ? "Hợp đồng mới" : "Hợp đồng cũ"}
            </Text>
            <FlatList
              data={data?.content || []}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) =>
                contractType === "contract" ? (
                  <ItemNewContract
                    data={item}
                    setSelectedContract={setSelectedContract}
                    setModalVisible={setModalVisible}
                  />
                ) : (
                  <ItemOldContract
                    data={item}
                    setSelectedContract={setSelectedContract}
                    setModalVisible={setModalVisible}
                  />
                )
              }
              ListFooterComponent={() => (
                <Pagination
                  totalPages={totalPage}
                  currentPage={page + 1}
                  size={size}
                  setSize={setSize}
                  setPage={setPage}
                  onPageChange={handlePageChange}
                />
              )}
            />
          </>
        )
      )}
      {selectedContract && (
        <Modal
          transparent={true}
          animationType="fade"
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View>
              <TouchableOpacity onPress={closeModal}>
                <AntDesign
                  style={styles.closeButton}
                  name="closecircle"
                  size={28}
                  color="black"
                />
              </TouchableOpacity>

              <Pdf
                trustAllCerts={false}
                source={{
                  uri: selectedContract?.file,
                  cache: true,
                }}
                style={styles.pdf}
              />
            </View>
            <View style={{ height: 20 }}></View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 12,
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
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 28,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    borderBottomWidth: 5,
    borderBottomColor: "blue",
  },
  buttonText: {
    color: "black",
  },
  noResults: {
    textAlign: "center",
    color: "gray",
    fontSize: 20,
    marginTop: 20,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  resultCount: {
    textAlign: "center",
    marginBottom: 10,
    paddingHorizontal: 10,
    fontSize: 16,
    color: "gray",
  },
  queryText: {
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
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
});

export default SearchScreen;
