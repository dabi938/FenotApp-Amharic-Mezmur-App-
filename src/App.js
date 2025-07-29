import React from 'react';
import { FavoritesProvider } from './context/FavoritesContext';
import { ThemeProvider } from './context/ThemeContext'; // <-- import ThemeProvider
import AppNavigator from './navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider> {/* <-- wrap everything in ThemeProvider */}
        <FavoritesProvider>
          <AppNavigator />
        </FavoritesProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
