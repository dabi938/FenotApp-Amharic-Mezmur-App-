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
import * as Animatable from "react-native-animatable";

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const { theme, darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Search',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, theme]);

  const filteredPoems = poems.filter((poem) =>
    (poem.displayId + " " + poem.title + (poem.author || "") + poem.content.join(" "))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 20}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("Reader", { poem: item, poems: filteredPoems })}
        style={[styles.itemRow, { borderBottomColor: theme.border }]}
      >
        <Ionicons name="search" size={18} color={theme.primary} style={styles.rowIcon} />
        <View style={styles.textContainer}>
          <Text style={[styles.itemTitle, { color: theme.text }]}>
            {item.displayId}. {item.title}
          </Text>
          <Text style={[styles.category, { color: theme.textSecondary }]}>{item.category}</Text>
        </View>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />
      
      <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
        <Ionicons name="search" size={20} color={theme.textSecondary} />
        <TextInput
          placeholder="Search Mezmur..."
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: theme.text }]}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={filteredPoems}
        keyExtractor={(item) => item.displayId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={{ color: theme.textSecondary }}>{search ? "No results found." : "Search all mezmurs..."}</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    margin: 15,
    paddingHorizontal: 15,
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
  },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: "500",
  },
  category: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  emptyView: {
    alignItems: "center",
    marginTop: 50,
  },
});
