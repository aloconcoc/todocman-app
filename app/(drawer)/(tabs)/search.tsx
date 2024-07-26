import React, { useState, useRef, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  Button,
  ActivityIndicator,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useMutation } from "react-query";
import { getSearchContract } from "@/services/contract.service";
import ItemNewContract from "@/components/search/ItemNewContract";
import ItemOldContract from "@/components/search/ItemOldContract";
import Pagination from "@/components/utils/pagination";

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [searched, setSearched] = useState<boolean>(false);
  const [contractType, setContractType] = useState<string>("");
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [data, setData] = useState<any>();
  const inputRef = useRef<TextInput>(null);

  const searchQuery = useMutation(getSearchContract, {
    onSuccess: (result) => {
      setData(result.object);
      setTotalPage(result?.object?.totalPages);
    },
  });

  useEffect(() => {
    if (contractType) {
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

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [query]);

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
            contractType === "old-contract" && styles.buttonSelected,
          ]}
          onPress={() => setContractType("old-contract")}
        >
          <Text style={styles.buttonText}>Hợp đồng cũ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.button,
            contractType === "new-contract" && styles.buttonSelected,
          ]}
          onPress={() => setContractType("new-contract")}
        >
          <Text style={styles.buttonText}>Hợp đồng mới</Text>
        </TouchableOpacity>
      </View>

      {searchQuery.isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : searched && (!data || !data.content || data.content.length === 0) ? (
        <Text style={styles.noResults}>Không có kết quả</Text>
      ) : (
        <>
          <Text style={styles.resultCount}>
            Hiển thị {data?.totalElements} kết quả cho "{query}" của{" "}
            {contractType === "new-contract" ? "Hợp đồng mới" : "Hợp đồng cũ"}
          </Text>
          <FlatList
            data={data?.content || []}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) =>
              contractType === "new-contract" ? (
                <ItemNewContract data={item} />
              ) : (
                <ItemOldContract data={item} />
              )
            }
          />
        </>
      )}

      {data && data?.content?.length != 0 && (
        <Pagination
          totalPages={totalPage}
          currentPage={page + 1}
          size={size}
          setSize={setSize}
          setPage={setPage}
          onPageChange={handlePageChange}
        />
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
    padding: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonSelected: {
    backgroundColor: "lightgray",
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
    marginVertical: 10,
    fontSize: 16,
  },
});

export default SearchScreen;
