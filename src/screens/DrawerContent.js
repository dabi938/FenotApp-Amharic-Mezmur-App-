import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
} from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { poems, categories } from "../data";
import { useTheme } from "../context/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import profileImg from "../../assets/images/profile.jpg";

const { width } = Dimensions.get("window");

export default function DrawerContent({ navigation }) {
  const [search, setSearch] = useState("");
  const { darkMode, theme, toggleDarkMode } = useTheme();
  const iconRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (iconRef.current) {
      iconRef.current.animate("rotate", 500);
    }
  }, [darkMode]);

  const filteredCategories = categories.filter(cat => 
    cat?.toLowerCase().includes(search.toLowerCase())
  );

  const filteredPoems = poems.filter((poem) => {
    const text = [
      poem.displayId,
      poem.title,
      poem.author || "",
      Array.isArray(poem.content) ? poem.content.join(" ") : "",
    ].join(" ");
    return text.toLowerCase().includes(search.toLowerCase());
  });

  const handleNavigate = (routeName, params) => {
    navigation.navigate(routeName, params);
    navigation.closeDrawer();
  };

  return (
    <View style={[styles.root, { backgroundColor: theme.background }]}>
      {/* Header Section */}
      <LinearGradient
        colors={darkMode ? ["#1a1a1a", "#000"] : ["#8B0000", "#B8860B"]}
        style={[styles.drawerHeader, { paddingTop: (insets.top || StatusBar.currentHeight || 0) + 40 }]}
      >
        <View style={styles.avatarCircle}>
          <Image
            source={profileImg}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.drawerTitle, { color: darkMode ? "#ffd700" : "#fff" }]}>
          እንኳን ደህና መጡ!
        </Text>
      </LinearGradient>

      {/* Basic Search Bar */}
      <View style={[styles.searchRow, { borderBottomColor: theme.border }]}>
        <Ionicons name="search" size={22} color={theme.textSecondary} />
        <TextInput
          style={[styles.searchInput, { color: theme.text }]}
          placeholder="Search Mezmure"
          placeholderTextColor={theme.textSecondary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
          </TouchableOpacity>
        )}
      </View>

      <DrawerContentScrollView 
        contentContainerStyle={styles.container}
        style={styles.scrollView}
      >
        {search.length > 0
          ? filteredPoems.map((poem, index) => (
              <DrawerItem
                key={`poem-${poem.displayId || index}`}
                label={() => (
                  <Text style={[styles.label, { color: theme.text }]}>
                    {poem.displayId}. {poem.title}
                  </Text>
                )}
                onPress={() => handleNavigate("Reader", { poem })}
                icon={() => <Ionicons name="musical-note" size={20} color={theme.primary} />}
              />
            ))
          : filteredCategories.map((cat, index) => (
              <DrawerItem
                key={`cat-${cat}-${index}`}
                label={() => (
                  <Text style={[styles.label, { color: theme.text }]}>
                    {cat}
                  </Text>
                )}
                onPress={() => handleNavigate("Category", { category: cat })}
                icon={() => <Ionicons name="folder-open" size={20} color={theme.primary} />}
              />
            ))}

        <View style={[styles.footerDivider, { backgroundColor: theme.border }]} />
        
        <DrawerItem
          label={() => <Text style={[styles.label, { color: theme.text }]}>Favorites & About</Text>}
          onPress={() => handleNavigate("Library")}
          icon={() => <Ionicons name="grid-outline" size={20} color={theme.primary} />}
        />
      </DrawerContentScrollView>

      {/* Theme Toggle - Original Style */}
      <View style={[styles.themeToggleRow, { top: (insets.top || StatusBar.currentHeight || 0) + 20 }]}>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.themeToggleBtn}>
          <Animatable.View ref={iconRef}>
            <Ionicons
              name={darkMode ? "sunny" : "moon"}
              size={26}
              color={darkMode ? "#ffd700" : "#333"}
            />
          </Animatable.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    paddingBottom: 30,
    paddingTop: 0,
  },
  scrollView: {
    paddingTop: 0,
    marginTop: 0,
  },
  drawerHeader: {
    alignItems: "center",
    paddingBottom: 25,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
    overflow: "hidden",
    marginBottom: 10,
    backgroundColor: "#eee",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  drawerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
  },
  footerDivider: {
    height: 1,
    marginVertical: 10,
    marginHorizontal: 15,
  },
  themeToggleRow: {
    position: "absolute",
    right: 15,
    top: 40,
    zIndex: 10,
  },
  themeToggleBtn: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
});
