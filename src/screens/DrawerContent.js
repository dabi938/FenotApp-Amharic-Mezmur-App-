import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image
} from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { poems, categories } from '../data';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import profileImg from '../../assets/images/profile.jpg';

export default function DrawerContent({ navigation }) {
  const [search, setSearch] = useState('');
  const { darkMode, toggleDarkMode } = useTheme();

  const filteredPoems = poems.filter(poem => {
    const text = [
      poem.title,
      poem.author || '',
      Array.isArray(poem.content) ? poem.content.join(' ') : ''
    ].join(' ');
    return text.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <View style={[styles.root, { backgroundColor: darkMode ? '#111' : '#fff' }]}>
      {/* Header Section */}
      <LinearGradient
        colors={darkMode ? ['#232526', '#414345'] : ['#e0eafc', '#cfdef3']}
        style={styles.drawerHeader}
      >
        <View style={styles.avatarCircle}>
          <Image
            source={profileImg}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        </View>
        <Text style={[styles.drawerTitle, darkMode && { color: '#ffd700' }]}>Welcome!</Text>
      </LinearGradient>

      {/* Fixed Search Section */}
      <View style={styles.searchRow}>
        <Ionicons
          name="search"
          size={22}
          color={darkMode ? '#fff' : '#333'}
        />
        <TextInput
          style={[styles.searchInput, darkMode && { color: '#fff' }]}
          placeholder="Search All Poems"
          placeholderTextColor={darkMode ? '#888' : '#999'}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Scrollable Content */}
      <DrawerContentScrollView contentContainerStyle={styles.container}>
        {search.length > 0
          ? filteredPoems.map(poem => (
              <DrawerItem
                key={poem.id}
                label={() => (
                  <Text style={[styles.label, darkMode && { color: '#fff' }]}>
                    {poem.title}
                  </Text>
                )}
                onPress={() => navigation.navigate('Reader', { poem })}
                style={darkMode ? { backgroundColor: 'transparent' } : null}
              />
            ))
          : categories.map(cat => (
              <DrawerItem
                key={cat}
                label={() => (
                  <Text style={[styles.label, darkMode && { color: '#fff' }]}>
                    {cat}
                  </Text>
                )}
                onPress={() => navigation.navigate('Category', { category: cat })}
                style={darkMode ? { backgroundColor: 'transparent' } : null}
              />
            ))}

        {/* Favorites */}
        <DrawerItem
          label={() => (
            <Text style={[styles.label, darkMode && { color: '#fff' }]}>
              Favorites
            </Text>
          )}
          onPress={() => navigation.navigate('Favorites')}
          style={darkMode ? { backgroundColor: 'transparent' } : null}
        />
      </DrawerContentScrollView>

      {/*Theme Toggle */}
      <View style={styles.themeToggleRow}>
        <TouchableOpacity onPress={toggleDarkMode} style={styles.themeToggleBtn}>
          <Ionicons
            name={darkMode ? 'sunny' : 'moon'}
            size={26}
            color={darkMode ? '#ffd700' : '#333'}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  container: {
    paddingBottom: 60,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    backgroundColor: 'transparent',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    marginLeft: 10,
    fontWeight: '500'
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333'
  },
  themeToggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    right: 20,
    top: 122
  },
  themeToggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'transparent'
  },
  themeToggleText: {
    marginLeft: 8,
    fontSize: 10,
    color: '#333'
  },
  drawerHeader: {
    alignItems: 'center',
    paddingVertical: 32,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    marginBottom: 0,
  },
  avatarCircle: {
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: '#fff8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    marginTop: 25,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
  },
  drawerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
  },
});
