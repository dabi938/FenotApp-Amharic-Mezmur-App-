import React, { useState, useEffect, useRef } from "react";
import { StatusBar, Platform, BackHandler, ToastAndroid } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import SplashScreen from "../screens/SplashScreen";
import ReaderScreen from "../screens/ReaderScreen";
import CategoryScreen from "../screens/CategoryScreen";
import DrawerContent from "../screens/DrawerContent";
import FavoritesScreen from "../screens/FavoritesScreen";
import SearchScreen from "../screens/SearchScreen";
import AboutUsScreen from "../screens/AboutUsScreen";
import defaultPoem from "../data/የመስከረም10 መዝሙራት/መድኃኒት.js";
import { useTheme } from "../context/ThemeContext";

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function LibraryTabs() {
  const { theme } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'FavoritesTab') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'AboutUsTab') {
            iconName = focused ? 'information-circle' : 'information-circle-outline';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: theme.background,
          borderTopColor: theme.border,
          height: 60,
          paddingBottom: 10,
        }
      })}
    >
      <Tab.Screen 
        name="FavoritesTab" 
        component={FavoritesScreen} 
        options={{ title: 'Favorites' }} 
      />
      <Tab.Screen 
        name="AboutUsTab" 
        component={AboutUsScreen} 
        options={{ title: 'About Us' }} 
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { darkMode, theme } = useTheme();
  const backPressCount = useRef(0);
  const navigationRef = useRef();

  useEffect(() => {
    const backAction = () => {
      const navigation = navigationRef.current;
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
        return true;
      }
      if (backPressCount.current === 0) {
        backPressCount.current += 1;
        ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
        setTimeout(() => {
          backPressCount.current = 0;
        }, 2000);
        return true;
      } else {
        BackHandler.exitApp();
        return true;
      }
    };
    const backHandler = BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => backHandler.remove();
  }, []);

  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <>
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.background}
        translucent={Platform.OS === "android"}
      />
      <NavigationContainer ref={navigationRef}>
        <Drawer.Navigator
          initialRouteName="Reader"
          defaultStatus="open"
          drawerContent={(props) => <DrawerContent {...props} />}
          screenOptions={{ 
            headerShown: true,
            headerStyle: { backgroundColor: theme.background },
            headerTintColor: theme.text,
          }}
        >
          <Drawer.Screen
            name="Reader"
            component={ReaderScreen}
            initialParams={{ poem: defaultPoem }}
          />
          <Drawer.Screen name="Category" component={CategoryScreen} />
          <Drawer.Screen name="Search" component={SearchScreen} />
          <Drawer.Screen 
            name="Library" 
            component={LibraryTabs} 
            options={{ title: "Favorites & About" }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </>
  );
}
