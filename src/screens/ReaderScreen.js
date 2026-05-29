import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Text, Platform } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import PoemViewer from '../components/PoemViewer';
import { useTheme } from '../context/ThemeContext';
import { poems } from '../data';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function ReaderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const poem = route?.params?.poem;
  const passedPoems = route?.params?.poems;
  const { favorites, toggleFavorite } = useFavorites();
  const { darkMode, theme } = useTheme();
  const flatListRef = useRef(null);

  const isFavoritesMode = useMemo(
    () => passedPoems && passedPoems.length === favorites.length && passedPoems.every((p, i) => p.id === favorites[i]?.id),
    [passedPoems, favorites]
  );
  const poemList = isFavoritesMode ? favorites : (passedPoems || poems);

  const initialIndex = Math.max(0, poemList.findIndex((p) => p.id === poem?.id));
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const currentPoem = poemList[currentIndex] || poem;
  const isFavorite = favorites.some((p) => p.id === currentPoem?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentPoem?.category || 'Reader',
      headerStyle: {
        backgroundColor: theme.background,
      },
      headerTintColor: theme.text,
      headerLeft: () => (
        <TouchableOpacity 
          onPress={() => navigation.openDrawer()}
          style={{ marginLeft: 15 }}
        >
          <Ionicons name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
      ),
      headerRight: () =>
        currentPoem ? (
          <TouchableOpacity
            onPress={() => toggleFavorite(currentPoem)}
            style={{ marginRight: 15 }}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={26} 
              color={isFavorite ? "#e91e63" : theme.text} 
            />
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, currentPoem, isFavorite, theme, toggleFavorite]);

  React.useEffect(() => {
    if (flatListRef.current && initialIndex >= 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
      }, 0);
    }
    setCurrentIndex(initialIndex);
  }, [initialIndex, poemList.length]);

  const renderItem = ({ item, index }) => (
    <View style={{ width }}>
      <PoemViewer poem={item} isActive={index === currentIndex} />
    </View>
  );

  if (!poem) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.background }]}>
        <Ionicons name="musical-note-outline" size={64} color={theme.textSecondary} />
        <Text style={[styles.emptyText, { color: theme.textSecondary }]}>No poem selected.</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={poemList}
      renderItem={renderItem}
      keyExtractor={(item) => item.displayId}
      horizontal
      pagingEnabled
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: theme.background }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      windowSize={3}
      maxToRenderPerBatch={2}
      removeClippedSubviews
      extraData={favorites.length}
    />
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    marginTop: 20,
    textAlign: 'center',
  },
  headerBtn: {
    marginLeft: 15,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
      android: { elevation: 4 },
    }),
  },
});
