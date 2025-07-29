import React from 'react';
import { Text, View, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

export default function PoemViewer({ poem }) {
  const { darkMode } = useTheme();
  if (!poem) {
    return (
      <View style={[styles.emptyContainer, darkMode && { backgroundColor: '#000' }]}>
        <Text style={[styles.emptyText, darkMode && { color: '#aaa' }]}>No poem selected.</Text>
      </View>
    );
  }
  return (
    <ScrollView contentContainerStyle={[
      styles.container,
      darkMode ? { backgroundColor: '#111' } : { backgroundColor: '#f9fafc' }
    ]}>
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
          {poem.title}
        </Text>
        <View style={styles.poemBody}>
          {(poem.content || []).map((line, index) => (
            <Text
              key={index}
              style={[
                styles.line,
                darkMode ? { color: '#fff' } : { color: '#222' }
              ]}
            >
              {line}
            </Text>
          ))}
        </View>
      </LinearGradient>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    paddingBottom: 100,
    paddingHorizontal: 16,
    minHeight: '100%',
  },
  card: {
    borderRadius: 24,
    padding: 24,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    backgroundColor: '#fff8',
    borderWidth: 1,
    borderColor: '#fff8',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  poemBody: {
    marginTop: 10,
  },
  line: {
    fontSize: 17,
    lineHeight: 25,
    marginBottom: 8,
    textAlign: 'center',

  },
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
