import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);

  // Load favorites from storage on mount
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        const stored = await AsyncStorage.getItem('favorites');
        if (stored) {
          setFavorites(JSON.parse(stored));
        }
      } catch (err) {
        console.error('Failed to load favorites:', err);
      }
    };

    loadFavorites();
  }, []);

  // Save to storage on change
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        await AsyncStorage.setItem('favorites', JSON.stringify(favorites));
      } catch (err) {
        console.error('Failed to save favorites:', err);
      }
    };

    saveFavorites();
  }, [favorites]);

  const toggleFavorite = (poem) => {
    setFavorites((prev) => {
      const exists = prev.find((p) => p.id === poem.id);
      if (exists) return prev.filter((p) => p.id !== poem.id);
      else return [...prev, poem];
    });
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  return useContext(FavoritesContext);
}
