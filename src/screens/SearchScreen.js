import React, { useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { poems } from '../data';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export default function SearchScreen({ navigation }) {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(true); // visible by default
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: {
        backgroundColor: darkMode ? '#111' : '#fff',
      },
      headerTintColor: darkMode ? '#fff' : '#222',
      headerTitleStyle: {
        color: darkMode ? '#fff' : '#222',
      },
    });
  }, [navigation, darkMode]);

  const filteredPoems = poems.filter((poem) =>
    (poem.title + poem.author + poem.content.join(' '))
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#111' }]}> 
      <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.headerRow}>
        <Text style={[styles.header, darkMode && { color: '#fff' }]}>Search All Poems</Text>
        <TouchableOpacity onPress={() => setShowSearch(!showSearch)}>
          <Ionicons name="search" size={24} color={darkMode ? '#fff' : '#333'} />
        </TouchableOpacity>
      </View>

      {showSearch && (
        <TextInput
          placeholder="Search by title, author, or content"
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
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate('Reader', { poem: item })}
          >
            <Text style={[styles.poemTitle, darkMode && { color: '#fff', borderColor: '#444' }]}> 
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={[styles.noResult, darkMode && { color: '#aaa' }]}>No poems found.</Text>}
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
  noResult: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#999',
  },
});
