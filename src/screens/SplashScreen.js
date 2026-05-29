import React, { useEffect } from 'react';
import { View, StyleSheet, Image, StatusBar } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { useTheme } from '../context/ThemeContext';

export default function SplashScreen({ onFinish }) {
  const { theme, darkMode } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    // Brana intro: Background should be parchment or white. Keeping it bright.
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar 
        barStyle={darkMode ? "light-content" : "dark-content"} 
        backgroundColor={theme.background} 
      />
      <Animatable.View animation="zoomIn" duration={1200} style={styles.content}>
        <Image
          source={require('../../assets/images/intro.png')}
          style={styles.image}
          resizeMode="contain"
        />
      </Animatable.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  image: {
    width: 300,
    height: 300,
  },
});
