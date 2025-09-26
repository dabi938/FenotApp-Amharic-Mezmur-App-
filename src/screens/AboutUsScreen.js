import React, { useState, useLayoutEffect } from 'react';
import {
  Text,
} from 'react-native';
export default function AboutUsScreen({navigation}) {

 const { Aboutus } = useFavorites();
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Aboutus',
      headerStyle: {
        backgroundColor: darkMode ? '#111' : '#fff',
      },
      headerTintColor: darkMode ? '#fff' : '#222',
      headerTitleStyle: {
        color: darkMode ? '#fff' : '#222',
      },
    });
  }, [navigation, darkMode]);

    return (
      <LinearGradient
        colors={
          darkMode
            ? ['#232526cc', '#414345cc']
            : ['#fffbe6', '#e0eafc', '#f7f7fa']
        }
        style={styles.card}
        start={[0, 0]}
        end={[1, 1]}
      >
        <Text style={[
          styles.title,
          darkMode ? { color: '#ffd700' } : { color: '#1a237e' }
        ]}>
          Hi This is Dabi Haile
        </Text>
      </LinearGradient>
 )  
}
 