import React, { useState, useLayoutEffect } from 'react';
import {
  FlatList,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  TextInput,
} from 'react-native';
import { poems } from '../data';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import * as Animatable from 'react-native-animatable';

export default function CategoryScreen({ route, navigation }) {
  const { category } = route.params;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: category, // <-- Set the header title to the category name
      headerStyle: {
        backgroundColor: darkMode ? '#111' : '#fff',
      },
      headerTintColor: darkMode ? '#fff' : '#222',
      headerTitleStyle: {
        color: darkMode ? '#fff' : '#222',
      },
    });
  }, [navigation, darkMode, category]); // <-- add category here

  const filteredPoems = poems
    .filter((poem) => poem.category === category)
    .filter((poem) =>
      poem.title.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#111' }]}> 
      <View style={styles.headerRow}>
        <Text style={[styles.header, darkMode && { color: '#fff' }]}>{category}</Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Ionicons name="search" size={24} color={darkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <TextInput
          placeholder="Search poems..."
          placeholderTextColor={darkMode ? '#ccc' : '#888'}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, darkMode && {
            backgroundColor: '#222',
            color: '#fff',
            borderColor: '#444'
          }]}
        />
      )}

      <FlatList
        data={filteredPoems}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          <Animatable.View animation="fadeInUp" delay={index * 50}>
            <TouchableOpacity
              onPress={() => navigation.navigate('Reader', { poem: item })}
            >
              <Text style={[styles.poemTitle, darkMode && { color: '#fff', borderColor: '#444' }]}>
                {item.title}
              </Text>
            </TouchableOpacity>
          </Animatable.View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, paddingTop: 40 },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderColor: '#aaa',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  poemTitle: {
    fontSize: 18,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
});
