import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { View, StyleSheet, FlatList, Dimensions, TouchableOpacity, Text } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useFavorites } from '../context/FavoritesContext';
import PoemViewer from '../components/PoemViewer';
import { useTheme } from '../context/ThemeContext';
import { poems } from '../data';

const { width } = Dimensions.get('window');

export default function ReaderScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const poem = route?.params?.poem;
  const passedPoems = route?.params?.poems;
  const { favorites, toggleFavorite } = useFavorites();
  const { darkMode } = useTheme();
  const flatListRef = useRef(null);

  // If passedPoems is favorites, always use the latest favorites from context
  const isFavoritesMode = useMemo(
    () => passedPoems && passedPoems.length === favorites.length && passedPoems.every((p, i) => p.id === favorites[i]?.id),
    [passedPoems, favorites]
  );
  const poemList = isFavoritesMode ? favorites : (passedPoems || poems);

  // Find initial index
  const initialIndex = Math.max(0, poemList.findIndex((p) => p.id === poem?.id));

  // Track the current index as user scrolls
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  // Use FlatList's onViewableItemsChanged for accurate tracking
  const viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  // Update header favorite icon when current poem changes
  const currentPoem = poemList[currentIndex] || poem;
  const isFavorite = favorites.some((p) => p.id === currentPoem?.id);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: currentPoem?.category || 'Poem',
      headerStyle: {
        backgroundColor: darkMode ? '#111' : '#fff',
      },
      headerTintColor: darkMode ? '#fff' : '#222',
      headerTitleStyle: {
        color: darkMode ? '#fff' : '#222',
      },
      headerRight: () =>
        currentPoem ? (
          <TouchableOpacity
            onPress={() => toggleFavorite(currentPoem)}
            style={{ marginRight: 18 }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={{ fontSize: 26, color: isFavorite ? '#ffd700' : (darkMode ? '#fff' : '#222') }}>
              {isFavorite ? '❤️' : '🤍'}
            </Text>
          </TouchableOpacity>
        ) : null,
    });
  }, [navigation, currentPoem, isFavorite, darkMode, toggleFavorite]);

  // Scroll to the initial poem on mount or when poemList changes
  React.useEffect(() => {
    if (flatListRef.current && initialIndex >= 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({ index: initialIndex, animated: false });
      }, 0);
    }
    setCurrentIndex(initialIndex);
    // eslint-disable-next-line
  }, [initialIndex, poemList.length]);

  const renderItem = ({ item }) => (
    <View style={{ width }}>
      <PoemViewer poem={item} />
    </View>
  );

  if (!poem) {
    return (
      <View style={[styles.emptyContainer, darkMode && { backgroundColor: '#000' }]}>
        <Text style={[styles.emptyText, darkMode && { color: '#aaa' }]}>No poem selected.</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={poemList}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
      horizontal
      pagingEnabled
      initialScrollIndex={initialIndex}
      getItemLayout={(_, index) => ({ length: width, offset: width * index, index })}
      showsHorizontalScrollIndicator={false}
      style={{ flex: 1, backgroundColor: darkMode ? '#111' : '#fff' }}
      onViewableItemsChanged={onViewableItemsChanged}
      viewabilityConfig={viewabilityConfig}
      windowSize={3}
      maxToRenderPerBatch={2}
      removeClippedSubviews
      extraData={favorites.length} // <-- ensures FlatList re-renders on favorite change
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
    color: '#888',
    textAlign: 'center',
  },
});
