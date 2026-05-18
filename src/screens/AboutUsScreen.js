import React, { useLayoutEffect } from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutUsScreen({ navigation }) {
  const { darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'ስለ እኛ',
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
    <ScrollView 
      style={[styles.container, darkMode && { backgroundColor: '#111' }]}
      contentContainerStyle={styles.contentContainer}
    >
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
          ሰላም! እኔ ዳቢ ኃይሌ ነኝ
        </Text>
        
        <View style={styles.descriptionBox}>
          <Text style={[styles.description, darkMode && { color: '#fff' }]}>
            ይህ መተግበሪያ የተሰራው የኢትዮጵያ ኦርቶዶክስ ተዋሕዶ ቤተክርስቲያን መዝሙራትን በቀላሉ ለማግኘት እና ለመጠቀም ታስቦ የተዘጋጀ ነው።
          </Text>
          
          <Text style={[styles.description, darkMode && { color: '#fff' }]}>
            ጥያቄ ወይም አስተያየት ካላችሁ በደስታ እቀበላለሁ። ስላነበባችሁ አመሰግናለሁ!
          </Text>
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingTop: 40,
  },
  card: {
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    minHeight: 300,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  descriptionBox: {
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 15,
    color: '#333',
  },
});
 