import React, { useState, useLayoutEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from "react-native";
import { poems } from "../data";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import * as Animatable from "react-native-animatable";

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category,
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontWeight: "bold",
      },
      headerRight: () => (
        <TouchableOpacity 
          onPress={() => setShowSearch(!showSearch)}
          style={{ marginRight: 20 }}
        >
          <Ionicons
            name={showSearch ? "close" : "search"}
            size={24}
            color={theme.primary}
          />
        </TouchableOpacity>
      ),
    });
  }, [navigation, theme, category, showSearch]);

  const filteredPoems = poems
    .filter((poem) => poem.category === category)
    .filter((poem) => poem.title.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInUp" delay={index * 30}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate("Reader", { poem: item })}
        style={[styles.itemRow, { borderBottomColor: theme.border }]}
      >
        <Ionicons name="musical-note" size={20} color={theme.primary} style={styles.rowIcon} />
        <Text style={[styles.itemTitle, { color: theme.text }]}>
          {item.displayId}. {item.title}
        </Text>
        <Ionicons name="chevron-forward" size={16} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animatable.View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {showSearch && (
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            placeholder="Search in category..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
            autoFocus
            style={[styles.searchInput, { color: theme.text }]}
          />
        </View>
      )}

      <FlatList
        data={filteredPoems}
        keyExtractor={(item) => item.displayId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
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
    height: 45,
    borderRadius: 10,
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
    paddingVertical: 18,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 15,
  },
  itemTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: "500",
  },
});
