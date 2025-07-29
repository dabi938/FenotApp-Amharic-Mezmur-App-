// src/screens/FavoritesScreen.js
import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Favorites',
      headerStyle: {
        backgroundColor: darkMode ? '#111' : '#fff',
      },
      headerTintColor: darkMode ? '#fff' : '#222',
      headerTitleStyle: {
        color: darkMode ? '#fff' : '#222',
      },
    });
  }, [navigation, darkMode]);

  return (
    <View style={[styles.container, darkMode && { backgroundColor: '#111' }]}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.row}
            onPress={() => navigation.navigate('Reader', { poem: item, poems: favorites })}
          >
            <Text style={[styles.favoriteIcon, darkMode && { color: '#ffd700' }]}>❤️</Text>
            <Text style={[styles.poemTitle, darkMode && { color: '#fff', borderColor: '#444' }]}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <Text style={[styles.emptyText, darkMode && { color: '#aaa' }]}>No favorite poems yet.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
  },
  favoriteIcon: {
    fontSize: 22,
    marginRight: 12,
  },
  poemTitle: {
    fontSize: 18,
    flex: 1,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginTop: 50,
    textAlign: 'center',
  },
});
