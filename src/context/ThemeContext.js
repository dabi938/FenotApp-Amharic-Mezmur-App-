import React, { createContext, useContext, useState, useEffect } from 'react';
import { LayoutAnimation, Platform, UIManager } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  // Load theme from storage on mount
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem('darkMode');
        if (stored !== null) {
          // No animation on initial load to avoid flash
          setDarkMode(stored === 'true');
        }
      } catch (e) {
        // ignore
      }
    })();
  }, []);

  // Save theme to storage on change
  useEffect(() => {
    AsyncStorage.setItem('darkMode', darkMode ? 'true' : 'false');
  }, [darkMode]);

  const toggleDarkMode = () => {
    // Configure the animation for the theme change
    LayoutAnimation.configureNext({
      duration: 500,
      create: { type: 'easeInEaseOut', property: 'opacity' },
      update: { type: 'easeInEaseOut' },
      delete: { type: 'easeInEaseOut', property: 'opacity' },
    });
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
