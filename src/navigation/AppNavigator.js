// AppNavigator.js
import React, { useState, useEffect, useRef } from 'react';
import {
  StatusBar,
  Platform,
  BackHandler,
  ToastAndroid,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import SplashScreen from '../screens/SplashScreen';
import ReaderScreen from '../screens/ReaderScreen';
import CategoryScreen from '../screens/CategoryScreen';
import DrawerContent from '../screens/DrawerContent';
import FavoritesScreen from '../screens/FavoritesScreen';
import SearchScreen from '../screens/SearchScreen';
import defaultPoem from '../data/የመስከረም10 መዝሙራት/መድኃኒት.js';
import { useTheme } from '../context/ThemeContext';

const Drawer = createDrawerNavigator();

export default function AppNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { darkMode } = useTheme();
  const backPressCount = useRef(0);

  const navigationRef = useRef();

  // Back button handling (double press to quit from any screen)
  useEffect(() => {
    const backAction = () => {
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show('Press back again to exit', ToastAndroid.SHORT);

        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);

        return true; // prevent default behavior
      } else {
        BackHandler.exitApp();
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar
        barStyle={darkMode ? 'light-content' : 'dark-content'}
        backgroundColor={darkMode ? '#111' : '#fff'}
        translucent={Platform.OS === 'android'}
      />
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          initialRouteName="Reader"
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{ headerShown: true }}
        >
          <Drawer.Screen
            name="Reader"
            component={ReaderScreen}
            initialParams={{ poem: defaultPoem }}
          />
          <Drawer.Screen name="Category" component={CategoryScreen} />
          <Drawer.Screen name="Favorites" component={FavoritesScreen} />
          <Drawer.Screen name="Search" component={SearchScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
