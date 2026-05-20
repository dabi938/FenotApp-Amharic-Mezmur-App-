import React, { useState, useEffect, memo, useRef } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Audio } from 'expo-av';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';

const PoemViewer = ({ poem, isActive = true }) => {
  const isFocused = useIsFocused();
  const { darkMode } = useTheme();
  const [sound, setSound] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [durationMillis, setDurationMillis] = useState(0);
  const [positionMillis, setPositionMillis] = useState(0);
  const soundRef = useRef(null);

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

  useEffect(() => {
    let isCancelled = false;

    async function loadAudio() {
      // Unload previous sound if any
      if (soundRef.current) {
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.error('Error unloading previous sound', e);
        }
        soundRef.current = null;
        if (!isCancelled) setSound(null);
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
          setSound(newSound);
          if (status.isLoaded) {
            setDurationMillis(status.durationMillis || 0);
          }
        } catch (error) {
          console.error('Error loading audio', error);
        }
      } else {
        if (!isCancelled) {
          setIsPlaying(false);
          setDurationMillis(0);
          setPositionMillis(0);
        }
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

  // Handle auto-pause when not active or not focused
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
        // When starting to play, ensure we are active (optional, usually handled by UI)
        if (positionMillis >= durationMillis && durationMillis > 0) {
          await soundRef.current.replayAsync();
        } else {
          await soundRef.current.playAsync();
        }
      }
    } catch (e) {
      console.error('Error play/pause', e);
    }
  };

  const handleStop = async () => {
    if (!soundRef.current) return;
    try {
      await soundRef.current.stopAsync();
      await soundRef.current.setPositionAsync(0);
    } catch (e) {
      console.error('Error stop', e);
    }
  };

  const handleSliderValueChange = async (value) => {
    if (!soundRef.current) return;
    try {
      const seekPosition = value * durationMillis;
      await soundRef.current.setPositionAsync(seekPosition);
    } catch (e) {
      console.error('Error seeking', e);
    }
  };

  const formatTime = (millis) => {
    if (!millis || millis < 0) return '0:00';
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!poem) {
    return (
      <View style={[styles.emptyContainer, darkMode && { backgroundColor: '#000' }]}>
        <Text style={[styles.emptyText, darkMode && { color: '#aaa' }]}>No poem selected.</Text>
      </View>
    );
  }

  const hasAudio = !!poem.audio;

  return (
    <View style={[styles.container, darkMode ? { backgroundColor: '#111' } : { backgroundColor: '#f9fafc' }]}>
      <LinearGradient
        colors={darkMode ? ['#232526cc', '#414345cc'] : ['#fffbe6', '#e0eafc', '#f7f7fa']}
        style={styles.card}
        start={[0, 0]}
        end={[1, 1]}
      >
        {hasAudio ? (
          <View style={styles.audioContainer}>
            <View style={styles.controlsRow}>
              <TouchableOpacity onPress={handlePlayPause}>
                <Ionicons
                  name={isPlaying ? 'pause' : 'play'}
                  size={28}
                  color={darkMode ? '#ffd700' : '#1a237e'}
                />
              </TouchableOpacity>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={1}
                value={durationMillis ? positionMillis / durationMillis : 0}
                onSlidingComplete={handleSliderValueChange}
                minimumTrackTintColor={darkMode ? '#ffd700' : '#1a237e'}
                maximumTrackTintColor={darkMode ? '#777' : '#ccc'}
                thumbTintColor={darkMode ? '#ffd700' : '#1a237e'}
              />
              <TouchableOpacity onPress={handleStop}>
                <Ionicons
                  name="square"
                  size={24}
                  color={darkMode ? '#ffd700' : '#1a237e'}
                />
              </TouchableOpacity>
            </View>
            <Text style={[styles.timeText, darkMode && { color: '#ffd700' }]}>
              {formatTime(positionMillis)} / {formatTime(durationMillis)}
            </Text>
          </View>
        ) : null}

        <Text style={[styles.title, darkMode ? { color: '#ffd700' } : { color: '#1a237e' }]}>
          {String(poem.title)}
        </Text>

        <ScrollView style={styles.poemScroll} showsVerticalScrollIndicator={false}>
          <View style={styles.poemBody}>
            {(poem.content || []).map((line, index) => (
              <Text
                key={`${poem.id}-line-${index}`}
                style={[styles.line, darkMode ? { color: '#fff' } : { color: '#222' }]}
              >
                {String(line)}
              </Text>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

export default memo(PoemViewer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 16,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
    backgroundColor: '#fff8',
    borderWidth: 1,
    borderColor: '#fff8',
  },
  audioContainer: {
    marginBottom: 15,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  slider: {
    flex: 1,
    height: 40,
    marginHorizontal: 10,
  },
  timeText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#1a237e',
    marginTop: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1,
    textDecorationLine: 'underline',
  },
  poemScroll: {
    flex: 1,
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
