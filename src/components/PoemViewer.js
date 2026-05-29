import React, { useState, useEffect, memo, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import { useFavorites } from '../context/FavoritesContext';

const { width } = Dimensions.get('window');

const PoemViewer = ({ poem, isActive = true }) => {
  const isFocused = useIsFocused();
  const { darkMode, theme } = useTheme();
  const { toggleFavorite, favorites } = useFavorites();
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const soundRef = useRef(null);
  
  const lastTap = useRef(0);
  const heartRef = useRef(null);
  const isFavorite = favorites.some(f => f.id === poem?.id);

  const onPlaybackStatusUpdate = (status) => {
    if (status.isLoaded) {
      setPositionMillis(status.positionMillis);
      setDurationMillis(status.durationMillis || 0);
      setIsPlaying(status.isPlaying);
      if (status.didJustFinish) {
        setIsPlaying(false);
        setPositionMillis(0);
        soundRef.current?.setPositionAsync(0).catch(() => {});
      }
    }
  };

  const handleDoubleTap = () => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap.current && (now - lastTap.current) < DOUBLE_PRESS_DELAY) {
      toggleFavorite(poem);
      if (heartRef.current) {
        heartRef.current.stopAnimation();
        heartRef.current.animate({
          0: { opacity: 0, scale: 0.5 },
          0.5: { opacity: 0.8, scale: 1.5 },
          1: { opacity: 0, scale: 1 }
        }, 1000);
      }
    } else {
      lastTap.current = now;
    }
  };

  useEffect(() => {
    let isCancelled = false;
    async function loadAudio() {
      if (soundRef.current) {
        try { await soundRef.current.unloadAsync(); } catch (e) {}
        soundRef.current = null;
      }
      if (poem && poem.audio) {
        try {
          const { sound: newSound, status } = await Audio.Sound.createAsync(
            poem.audio,
            { shouldPlay: false },
            onPlaybackStatusUpdate
          );
          if (isCancelled) {
            await newSound.unloadAsync();
            return;
          }
          soundRef.current = newSound;
          if (status.isLoaded) setDurationMillis(status.durationMillis || 0);
        } catch (error) {}
      }
    }
    loadAudio();
    return () => {
      isCancelled = true;
      if (soundRef.current) {
        soundRef.current.unloadAsync().catch(() => {});
        soundRef.current = null;
      }
    };
  }, [poem?.id, poem?.audio]);

  useEffect(() => {
    if ((!isActive || !isFocused) && isPlaying && soundRef.current) {
      soundRef.current.pauseAsync().catch(() => {});
    }
  }, [isActive, isFocused, isPlaying]);

  const handlePlayPause = async () => {
    if (!soundRef.current) return;
    try {
      if (isPlaying) {
        await soundRef.current.pauseAsync();
      } else {
        if (positionMillis >= durationMillis && durationMillis > 0) {
          await soundRef.current.replayAsync();
        } else {
          await soundRef.current.playAsync();
        }
      }
    } catch (e) {}
  };

  const handleSliderValueChange = async (value) => {
    if (!soundRef.current) return;
    try {
      const seekPosition = value * durationMillis;
      await soundRef.current.setPositionAsync(seekPosition);
    } catch (e) {}
  };

  const formatTime = (millis) => {
    if (!millis || millis < 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!poem) return null;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.lyricsScroll} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <TouchableWithoutFeedback onPress={handleDoubleTap}>
          <Animatable.View 
            animation="fadeInUp" 
            duration={800} 
            style={[styles.unifiedCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          >
            {/* Header Title */}
            <View style={styles.cardHeader}>
              <Text style={[styles.title, { color: theme.primary }]}>
                {poem.displayId}. {poem.title}
              </Text>
              <View style={[styles.divider, { backgroundColor: theme.primary }]} />
            </View>

            {/* Audio Player */}
            {poem.audio && (
              <View style={[styles.audioInnerSection, { borderBottomColor: theme.border }]}>
                <View style={styles.controlsRow}>
                  <TouchableOpacity onPress={handlePlayPause} style={[styles.playCircle, { backgroundColor: theme.primary }]}>
                    <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color={theme.background} />
                  </TouchableOpacity>
                  
                  <View style={styles.sliderWrapper}>
                    <Slider
                      style={styles.slider}
                      minimumValue={0}
                      maximumValue={1}
                      value={durationMillis ? positionMillis / durationMillis : 0}
                      onSlidingComplete={handleSliderValueChange}
                      minimumTrackTintColor={theme.primary}
                      maximumTrackTintColor={theme.border}
                      thumbTintColor={theme.primary}
                    />
                    <View style={styles.timeLabels}>
                      <Text style={[styles.timeText, { color: theme.text }]}>{formatTime(positionMillis)}</Text>
                      <Text style={[styles.timeText, { color: theme.text }]}>{formatTime(durationMillis)}</Text>
                    </View>
                  </View>
                </View>
              </View>
            )}

            {/* Lyrics Content */}
            <View style={styles.lyricsBody}>
              {(poem.content || []).map((line, index) => (
                <Text
                  key={`${poem.id}-line-${index}`}
                  style={[styles.lyricLine, { color: theme.text }]}
                >
                  {line}
                </Text>
              ))}
            </View>

            {/* Floating Heart Animation overlay */}
            <Animatable.View 
              ref={heartRef}
              pointerEvents="none"
              style={styles.floatingHeart}
            >
              <Ionicons name="heart" size={100} color="#e91e63" />
            </Animatable.View>
          </Animatable.View>
        </TouchableWithoutFeedback>
        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
};

export default memo(PoemViewer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  lyricsScroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  unifiedCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
    position: 'relative',
  },
  cardHeader: {
    alignItems: 'center',
    paddingTop: 35,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'serif',
  },
  divider: {
    width: 70,
    height: 3,
    borderRadius: 2,
  },
  audioInnerSection: {
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 5,
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    marginBottom: 20,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  playCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderWrapper: {
    flex: 1,
    marginLeft: 15,
  },
  slider: {
    width: '100%',
    height: 30,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: -5,
  },
  timeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  lyricsBody: {
    paddingHorizontal: 25,
    paddingBottom: 20,
    alignItems: 'center',
  },
  lyricLine: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: 'center',
    marginBottom: 16,
    fontWeight: '600',
    fontFamily: 'serif',
  },
  floatingHeart: {
    position: 'absolute',
    top: '40%',
    left: '35%',
    opacity: 0,
    zIndex: 100,
  }
});
