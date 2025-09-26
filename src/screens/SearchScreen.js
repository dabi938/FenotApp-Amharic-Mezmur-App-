import React, { useState, useLayoutEffect } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from "react-native";
import { poems } from "../data";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(true); // visible by default
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: darkMode ? "#111" : "#fff",
      },
      headerTintColor: darkMode ? "#fff" : "#222",
      headerTitleStyle: {
        color: darkMode ? "#fff" : "#222",
      },
    });
  }, [navigation, darkMode]);

  const filteredPoems = poems.filter((poem) =>
    (poem.title + poem.author + poem.content.join(" "))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const clearSearch = () => {
    setSearch("");
  };

  return (
    <View style={[styles.container, darkMode && { backgroundColor: "#111" }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      <View style={styles.headerRow}>
        <Text style={[styles.header, darkMode && { color: "#fff" }]}>
          Search All Poem
        </Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Ionicons
            name="search"
            size={24}
            color={darkMode ? "#fff" : "#333"}
          />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <View style={styles.searchContainer}>
          <TextInput
            placeholder="Search by title, author, or content"
            placeholderTextColor={darkMode ? "#ccc" : "#888"}
            value={search}
            onChangeText={setSearch}
            style={[
              styles.searchInput,
              darkMode && {
                backgroundColor: "#222",
                color: "#fff",
                borderColor: "#444",
              },
            ]}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={clearSearch} style={styles.clearButton}>
              <Ionicons
                name="close-circle"
                size={20}
                color={darkMode ? "#ccc" : "#888"}
              />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={filteredPoems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Reader", {
                poem: item,
                poems,
                poemIndex: poems.indexOf(item),
              })
            }
          >
            <Text
              style={[
                styles.poemTitle,
                darkMode && { color: "#fff", borderColor: "#444" },
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.noResult, darkMode && { color: "#aaa" }]}>
            No poems found.
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 40 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
  },
  searchContainer: {
    position: "relative",
    marginBottom: 15,
  },
  searchInput: {
    height: 40,
    borderColor: "#aaa",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingRight: 40, // Space for clear button
  },
  clearButton: {
    position: "absolute",
    right: 10,
    top: "50%",
    transform: [{ translateY: -10 }],
  },
  poemTitle: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: "#ccc",
  },
  noResult: {
    textAlign: "center",
    marginTop: 40,
    fontSize: 16,
    color: "#999",
  },
});
