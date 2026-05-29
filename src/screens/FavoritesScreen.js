import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useFavorites } from '../context/FavoritesContext';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function FavoritesScreen({ navigation }) {
  const { favorites } = useFavorites();
  const { theme } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Favorites',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, theme]);

  const renderItem = ({ item, index }) => (
    <Animatable.View animation="fadeInRight" delay={index * 30}>
      <TouchableOpacity
        activeOpacity={0.6}
        onPress={() => navigation.navigate('Reader', { poem: item, poems: favorites })}
        style={[styles.itemRow, { borderBottomColor: theme.border }]}
      >
        <Ionicons name="heart" size={20} color="#e91e63" style={styles.rowIcon} />
        <View style={styles.textContainer}>
            <Text style={[styles.poemTitle, { color: theme.text }]}>
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
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.displayId}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyView}>
            <Text style={{ color: theme.textSecondary }}>No favorite hymns yet.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  listContainer: {
    paddingHorizontal: 15,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
  },
  rowIcon: {
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  poemTitle: {
    fontSize: 17,
    fontWeight: '500',
  },
  category: {
    fontSize: 12,
    marginTop: 2,
    opacity: 0.7,
  },
  emptyView: {
    alignItems: 'center',
    marginTop: 100,
  }
});
