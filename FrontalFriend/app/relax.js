import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Video, Audio } from 'expo-av';
import { MEDIA_CATEGORIES, AUDIO_TRACKS, THEME_COLORS } from '../constants/media';
import { resolveRemoteUri } from '../constants/mediaUtils';

const { width, height } = Dimensions.get('window');

export default function RelaxScreen() {
  const router = useRouter();
  const videoRef = useRef(null);
  const soundRef = useRef(null);

  const [selectedCategory, setSelectedCategory] = useState(MEDIA_CATEGORIES[0]);
  const [selectedVideo, setSelectedVideo] = useState(MEDIA_CATEGORIES[0].videos[0]);
  const [selectedAudio, setSelectedAudio] = useState(AUDIO_TRACKS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [videoUri, setVideoUri] = useState(MEDIA_CATEGORIES[0].videos[0].uri);
  const [videoUnavailable, setVideoUnavailable] = useState(false);
  const [soundUnavailable, setSoundUnavailable] = useState(false);

  useEffect(() => {
    setupAudio();
    return () => {
      cleanupMedia();
    };
  }, []);

  // Resolve the selectedVideo URI and set a fallback state if unreachable
  useEffect(() => {
    let mounted = true;
    (async () => {
      setIsLoading(true);
      try {
        const resolved = await resolveRemoteUri(selectedVideo.uri, { timeout: 3000, fallback: null });
        if (!mounted) return;
        if (resolved) {
          setVideoUri(resolved);
          setVideoUnavailable(false);
        } else {
          setVideoUri(null);
          setVideoUnavailable(true);
        }
      } catch (e) {
        console.error('Error resolving video URI:', e);
        if (mounted) {
          setVideoUri(null);
          setVideoUnavailable(true);
        }
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [selectedVideo]);

  const setupAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  // Load and manage audio programmatically using Audio.Sound
  useEffect(() => {
    let mounted = true;
    const loadSound = async () => {
      setIsLoading(true);
      try {
        // unload previous
        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
          } catch (e) {
            // ignore
          }
          soundRef.current = null;
        }

        const resolved = await resolveRemoteUri(selectedAudio.uri, { timeout: 3000, fallback: null });
        if (!resolved) {
          // Mark unavailable and skip loading
          setSoundUnavailable(true);
          return;
        }
        setSoundUnavailable(false);

        const result = await Audio.Sound.createAsync(
          { uri: resolved },
          { isLooping: true, shouldPlay: isPlaying }
        );
        if (!mounted) {
          // In case component unmounted while loading
          try {
            result.sound.unloadAsync();
          } catch (e) {}
          return;
        }
        soundRef.current = result.sound;
      } catch (error) {
        console.error('Error loading sound:', error);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    loadSound();

    return () => {
      mounted = false;
      (async () => {
        if (soundRef.current) {
          try {
            await soundRef.current.unloadAsync();
          } catch (e) {
            // ignore
          }
          soundRef.current = null;
        }
      })();
    };
  }, [selectedAudio]);

  // Sync playing state to the loaded sound when only isPlaying changes
  useEffect(() => {
    const syncPlay = async () => {
      if (!soundRef.current) return;
      try {
        if (isPlaying) {
          await soundRef.current.playAsync();
        } else {
          await soundRef.current.pauseAsync();
        }
      } catch (error) {
        console.error('Error syncing sound play state:', error);
      }
    };
    syncPlay();
  }, [isPlaying]);

  const cleanupMedia = async () => {
    try {
      if (videoRef.current) {
        await videoRef.current.stopAsync();
        await videoRef.current.unloadAsync();
      }
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
        } catch (e) {
          // ignore already-stopped
        }
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
    } catch (error) {
      console.error('Error cleaning up media:', error);
    }
  };

  const handlePlayPause = async () => {
    try {
      setIsLoading(true);
      if (isPlaying) {
        // Let Video's shouldPlay control playback; only control audio programmatically
        if (soundRef.current) {
          try {
            await soundRef.current.pauseAsync();
          } catch (e) {
            console.error('Error pausing sound:', e);
          }
        }
        setIsPlaying(false);
      } else {
        if (soundRef.current) {
          try {
            await soundRef.current.playAsync();
          } catch (e) {
            console.error('Error playing sound:', e);
          }
        }
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVideoChange = async (video) => {
    try {
      setIsLoading(true);
      // Clean up existing video first to avoid overlapping load/unload
      if (videoRef.current) {
        try {
          await videoRef.current.stopAsync();
        } catch (e) {
          // ignore if already stopped
        }
        try {
          await videoRef.current.unloadAsync();
        } catch (e) {
          console.error('Error unloading previous video:', e);
        }
      }
      if (isPlaying) {
        setIsPlaying(false);
      }
      // Only set selected after cleanup completes
      setSelectedVideo(video);
    } catch (error) {
      console.error('Error changing video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioChange = async (audio) => {
    try {
      setIsLoading(true);
      // Clean up existing sound first to avoid overlapping load/unload
      if (soundRef.current) {
        try {
          await soundRef.current.stopAsync();
        } catch (e) {
          // ignore
        }
        try {
          await soundRef.current.unloadAsync();
        } catch (e) {
          console.error('Error unloading previous sound:', e);
        }
        soundRef.current = null;
      }
      if (isPlaying) {
        setIsPlaying(false);
      }
      // Only set selected after cleanup completes
      setSelectedAudio(audio);
    } catch (error) {
      console.error('Error changing audio:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category.videos.length > 0) {
      handleVideoChange(category.videos[0]);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.videoContainer}>
        {videoUri && !videoUnavailable ? (
          <Video
            ref={videoRef}
            source={{ uri: videoUri }}
            style={styles.video}
            resizeMode="cover"
            isLooping
            shouldPlay={isPlaying}
            isMuted
          />
        ) : (
          <View style={[styles.video, styles.videoPlaceholder]}>
            <Text style={styles.placeholderText}>
              Scene unavailable — unable to load remote video. Try a different scene.
            </Text>
          </View>
        )}
        <View style={styles.overlay}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
            <Text style={styles.title}>Calm Space</Text>
            <View style={styles.placeholder} />
          </View>
        </View>
      </View>

      <View style={styles.controlsContainer}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Category</Text>
            <View style={styles.buttonRow}>
              {MEDIA_CATEGORIES.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  style={[
                    styles.categoryButton,
                    selectedCategory.id === category.id && styles.categoryButtonActive,
                  ]}
                  onPress={() => handleCategoryChange(category)}
                >
                  <Text
                    style={[
                      styles.categoryButtonText,
                      selectedCategory.id === category.id && styles.categoryButtonTextActive,
                    ]}
                  >
                    {category.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Scene</Text>
            <View style={styles.buttonRow}>
              {selectedCategory.videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={[
                    styles.optionButton,
                    selectedVideo.id === video.id && styles.optionButtonActive,
                  ]}
                  onPress={() => handleVideoChange(video)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedVideo.id === video.id && styles.optionButtonTextActive,
                    ]}
                  >
                    {video.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Music</Text>
            <View style={styles.buttonRow}>
              {AUDIO_TRACKS.map((audio) => (
                <TouchableOpacity
                  key={audio.id}
                  style={[
                    styles.optionButton,
                    selectedAudio.id === audio.id && styles.optionButtonActive,
                  ]}
                  onPress={() => handleAudioChange(audio)}
                >
                  <Text
                    style={[
                      styles.optionButtonText,
                      selectedAudio.id === audio.id && styles.optionButtonTextActive,
                    ]}
                  >
                    {audio.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {soundUnavailable && (
              <Text style={styles.unavailableText}>
                Audio unavailable — unable to load remote track. Try a different
                track.
              </Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.playControlContainer}>
          <TouchableOpacity
            style={styles.playButton}
            onPress={handlePlayPause}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="large" color={THEME_COLORS.text.light} />
            ) : (
              <Text style={styles.playButtonText}>{isPlaying ? 'Pause' : 'Play'}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Audio is loaded and controlled programmatically via Audio.Sound (soundRef) */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  videoContainer: {
    width: width,
    height: height * 0.5,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  videoPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000000',
  },
  placeholderText: {
    color: THEME_COLORS.text.light,
    textAlign: 'center',
    paddingHorizontal: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: THEME_COLORS.text.light,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: THEME_COLORS.text.light,
  },
  placeholder: {
    width: 60,
  },
  controlsContainer: {
    flex: 1,
    backgroundColor: THEME_COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: THEME_COLORS.text.primary,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryButton: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: THEME_COLORS.button.inactive,
  },
  categoryButtonActive: {
    backgroundColor: THEME_COLORS.primary,
    borderColor: THEME_COLORS.primary,
  },
  categoryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME_COLORS.text.secondary,
  },
  categoryButtonTextActive: {
    color: THEME_COLORS.text.light,
  },
  optionButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: THEME_COLORS.button.inactive,
  },
  optionButtonActive: {
    backgroundColor: THEME_COLORS.secondary,
    borderColor: THEME_COLORS.secondary,
  },
  optionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: THEME_COLORS.text.secondary,
  },
  optionButtonTextActive: {
    color: THEME_COLORS.text.light,
  },
  unavailableText: {
    marginTop: 8,
    color: THEME_COLORS.text.primary,
    fontStyle: 'italic',
  },
  playControlContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: THEME_COLORS.background,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  playButton: {
    backgroundColor: THEME_COLORS.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  playButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: THEME_COLORS.text.light,
  },
});
