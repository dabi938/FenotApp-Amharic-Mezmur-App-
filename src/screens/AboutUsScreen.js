import React, { useLayoutEffect } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import * as Animatable from 'react-native-animatable';

export default function AboutUsScreen({ navigation }) {
  const { theme, darkMode } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'About Us',
      headerStyle: {
        backgroundColor: darkMode ? '#000000' : theme.background,
      },
      headerTintColor: darkMode ? '#FFFFFF' : theme.text,
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    });
  }, [navigation, theme, darkMode]);

  const InfoRow = ({ label, value, url }) => (
    <View style={styles.infoRow}>
      <Text style={[styles.infoLabel, { color: darkMode ? '#FFFFFF' : theme.text }]}>{label}:</Text>
      <TouchableOpacity onPress={() => url && Linking.openURL(url)}>
        <Text style={[styles.infoValue, { color: darkMode ? '#FFFFFF' : theme.primary }]}>
          {value}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const SocialIcon = ({ name, color, url }) => (
    <TouchableOpacity
      onPress={() => url && Linking.openURL(url)}
      style={[styles.socialIconContainer, { backgroundColor: color || theme.primary }]}
    >
      <Ionicons name={name} size={18} color="#FFF" />
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: darkMode ? '#000000' : theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <StatusBar barStyle={darkMode ? "light-content" : "dark-content"} />

      {/* Logo Section */}
      <Animatable.View animation="zoomIn" duration={1000} style={styles.logoContainer}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animatable.View>

      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={[styles.appTitle, { color: darkMode ? '#FFFFFF' : theme.text }]}>
          ፍኖተ ብርሃን App
        </Text>
        <Text style={[styles.versionText, { color: darkMode ? '#CCCCCC' : theme.textSecondary }]}>
          Version 1.0.0
        </Text>
      </View>

      {/* Social Section */}
      <View style={styles.joinUsSection}>
        <Text style={[styles.joinUsText, { color: darkMode ? '#FFFFFF' : theme.text }]}>Join us</Text>
        <View style={styles.socialIconsRow}>
          <SocialIcon name="logo-facebook" color="#3b5998" url="https://facebook.com/finotebirhan1021" />
          <SocialIcon name="logo-youtube" color="#FF0000" url="https://youtube.com/@finotebirhan" />
          <SocialIcon name="logo-instagram" color="#E4405F" url="https://instagram.com/finote_birhan10" />
          <SocialIcon name="mail" color="#D44638" url="mailto:finotebirhan1978@gmail.com" />
          <SocialIcon name="call" color="#25D366" url="tel:+251998828281" />
        </View>
      </View>

      {/* Copyright Footer */}
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: darkMode ? '#888888' : theme.textSecondary }]}>
          © Finote Birhan Sunday School. All rights reserved.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
    borderRadius: 90,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'serif',
    marginBottom: 10,
  },
  versionText: {
    fontSize: 16,
    fontFamily: 'serif',
  },
  detailsContainer: {
    width: '100%',
    marginBottom: 40,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'center',
  },
  infoLabel: {
    width: 100,
    fontSize: 16,
    fontFamily: 'serif',
    fontWeight: 'bold',
  },
  infoValue: {
    fontSize: 16,
    fontFamily: 'serif',
    textDecorationLine: 'underline',
  },
  joinUsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 50,
    width: '100%',
  },
  joinUsText: {
    fontSize: 18,
    fontFamily: 'serif',
    marginRight: 15,
  },
  socialIconsRow: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'space-between',
  },
  socialIconContainer: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  footer: {
    marginTop: 20,
  },
  footerText: {
    fontSize: 13,
    fontFamily: 'serif',
  },
});