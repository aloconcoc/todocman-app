import React, { useState, Fragment } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Listbox, Transition } from "@headlessui/react";

const sizeData = [5, 10, 20];

const Pagination = ({
  totalPages,
  currentPage,
  onPageChange,
  size,
  setSize,
  setPage,
}: any) => {
  const [page, setPage_] = useState(currentPage);

  const handlePageChange = (newPage: any) => {
    setPage_(newPage);
    onPageChange(newPage);
  };

  const renderPages = () => {
    const pages = [];
    const pageRange = 2;
    const startPage = Math.max(1, page - pageRange);
    const endPage = Math.min(totalPages, page + pageRange);

    if (startPage > 1) {
      pages.push(
        <TouchableOpacity
          key={1}
          onPress={() => handlePageChange(1)}
          style={styles.button}
        >
          <Text>1</Text>
        </TouchableOpacity>
      );
      if (startPage > 2) {
        pages.push(<Text key="start-ellipsis">...</Text>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={[styles.button, i === page && styles.activeButton]}
        >
          <Text style={i === page && styles.activeText}>{i}</Text>
        </TouchableOpacity>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Text key="end-ellipsis">...</Text>);
      }
      pages.push(
        <TouchableOpacity
          key={totalPages}
          onPress={() => handlePageChange(totalPages)}
          style={styles.button}
        >
          <Text>{totalPages}</Text>
        </TouchableOpacity>
      );
    }

    return pages;
  };

  return (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        onPress={() => handlePageChange(page - 1)}
        disabled={page === 1}
        style={styles.button}
      >
        <Text style={{ fontSize: 12, padding: 3 }}>Previous</Text>
      </TouchableOpacity>
      {renderPages()}
      <TouchableOpacity
        onPress={() => handlePageChange(page + 1)}
        disabled={page === totalPages}
        style={styles.button}
      >
        <Text style={{ fontSize: 12, padding: 3 }}>Next</Text>
      </TouchableOpacity>

      {/* Sử dụng một Listbox tương tự nếu có cho React Native */}
      <Listbox
        value={size}
        onChange={(v: any) => {
          setSize(v);
          setPage(0);
        }}
      >
        <View style={{ flexDirection: "column", alignItems: "center" }}>
          <Listbox.Button style={styles.listboxButton}>
            <Text>{size} / page</Text>
          </Listbox.Button>
          <View style={styles.relative}>
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options style={styles.listboxOptions}>
                {sizeData.map((s, index) => (
                  <Listbox.Option
                    key={index}
                    style={styles.listboxOption}
                    value={s}
                  >
                    <Text>{s + " / page"}</Text>
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </View>
        </View>
      </Listbox>
    </View>
  );
};

const styles = StyleSheet.create({
  paginationContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 50,
    marginTop: 20,
  },
  button: {
    margin: 5,
    padding: 2,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    borderRadius: 50,
  },
  activeButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  activeText: {
    fontWeight: "bold",
    color: "#fff",
  },
  listboxButton: {
    width: 90,
    margin: 0,
    paddingVertical: 12,
    justifyContent: "center",
    backgroundColor: "#fff",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  relative: {
    position: "relative",
    marginLeft: 5,
  },
  listboxOptions: {
    position: "absolute",
    zIndex: 20,
    bottom: 8,
    left: 0,
    maxHeight: 60,
    width: 100,
    overflow: "hidden",
    backgroundColor: "#fff",
    padding: 1,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  listboxOption: {
    paddingVertical: 2,
    paddingHorizontal: 2,
    backgroundColor: "#fff",
    justifyContent: "flex-end",
  },
});

export default Pagination;
