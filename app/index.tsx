import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
  interpolate,
  clamp,
  withRepeat,
  withSequence,
  useAnimatedReaction,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

// --- Constantes y Tipos ---
const { height } = Dimensions.get('window');
const ANDROID_STATUS_BAR_HEIGHT = StatusBar.currentHeight || 24;
const IOS_STATUS_BAR_HEIGHT = 44;
const statusBarHeight = Platform.OS === 'ios' ? IOS_STATUS_BAR_HEIGHT : ANDROID_STATUS_BAR_HEIGHT;

const MINI_PLAYER_HEIGHT = 150;
const TRACK_DURATION_SECONDS = 261; // Duración de ejemplo para la canción (4:21)

// --- Datos de la Playlist ---
const playlistTracks = [
  { id: 1, title: "No Problem", artist: "Chance the Rapper", genre: "13d • Hip-Hop", color: "#EF4444", image: "👤" },
  { id: 2, title: "Lonely", artist: "Yung Bans", genre: "21d • Trap", color: "#8B5CF6", image: "🎤" },
  { id: 3, title: "Humility", artist: "Gorillaz", genre: "3d • Alternative", color: "#06B6D4", image: "🎸" },
  { id: 4, title: "Fuck Love", artist: "XXXTENTACION", genre: "29d • Trap", color: "#6B7280", image: "🖤" },
  { id: 5, title: "Old Town Road", artist: "Lil Nas X", genre: "29d • Country Trap", color: "#374151", image: "🤠" },
];

export default function MusicPlayer() {
  // --- Estados de React ---
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [likedTracks, setLikedTracks] = useState(new Set([1, 3]));

  // --- Valores Animados de Reanimated ---
  const translateY = useSharedValue(height);
  const playButtonScale = useSharedValue(1);
  const heartScale = useSharedValue(1);

  // Valores para las barras del ecualizador
  const eqBar1 = useSharedValue(0.3);
  const eqBar2 = useSharedValue(0.6);
  const eqBar3 = useSharedValue(0.4);
  const eqBar4 = useSharedValue(0.8);

  const currentTrack = playlistTracks[currentTrackIndex];

  // --- Efectos de React (useEffect) ---

  // Efecto para la animación de entrada inicial del reproductor
  useEffect(() => {
    translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 500 });
  }, []);

  // Efecto para simular el progreso de la canción
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress(p => {
          const newProgress = p + 1 / TRACK_DURATION_SECONDS;
          if (newProgress >= 1) {
            runOnJS(nextTrack)();
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrackIndex]);

  // Efecto para controlar las animaciones del ecualizador
  useEffect(() => {
    const createEqAnimation = () =>
      withRepeat(
        withSequence(
          withTiming(Math.random() * 0.7 + 0.3, { duration: 250 }),
          withTiming(Math.random() * 0.7 + 0.3, { duration: 300 })
        ), -1, true
      );

    if (isPlaying) {
      eqBar1.value = createEqAnimation();
      eqBar2.value = createEqAnimation();
      eqBar3.value = createEqAnimation();
      eqBar4.value = createEqAnimation();
    } else {
      [eqBar1, eqBar2, eqBar3, eqBar4].forEach(bar => bar.value = withTiming(bar.value, { duration: 200 }));
    }
  }, [isPlaying]);

  // --- Funciones y Handlers ---
  const triggerHapticFeedback = (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light) => {
    Haptics.impactAsync(style);
  };

  const togglePlayPause = () => {
    triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
    playButtonScale.value = withSequence(withTiming(0.85, { duration: 100 }), withTiming(1, { duration: 100 }));
    setIsPlaying(!isPlaying);
  };

  const toggleLike = (trackId: number) => {
    triggerHapticFeedback();
    const isLiked = likedTracks.has(trackId);
    if (!isLiked) {
      heartScale.value = withSequence(withTiming(1.3, { duration: 150 }), withTiming(1, { duration: 150 }));
    }
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) newSet.delete(trackId);
      else newSet.add(trackId);
      return newSet;
    });
  };

  const switchTrack = (index: number) => {
    if (index === currentTrackIndex) {
      expandPlayer();
      return;
    }
    triggerHapticFeedback();
    setCurrentTrackIndex(index);
    setProgress(0);
    if (!isPlaying) {
      setIsPlaying(true);
    }
  };

  const changeTrack = (direction: 'next' | 'prev') => {
    triggerHapticFeedback();
    let newIndex;
    if (direction === 'next') {
      newIndex = (currentTrackIndex + 1) % playlistTracks.length;
    } else {
      newIndex = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
    }
    setCurrentTrackIndex(newIndex);
    setProgress(0);
    if (!isPlaying) setIsPlaying(true);
  };

  const nextTrack = () => changeTrack('next');
  const prevTrack = () => changeTrack('prev');

  const expandPlayer = () => {
    translateY.value = withTiming(statusBarHeight, { duration: 400 });
  };

  const collapsePlayer = () => {
    translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 400 });
  };

  // Sincroniza el estado de React `isExpanded` con el valor animado `translateY`
  useAnimatedReaction(
    () => translateY.value,
    (currentValue) => {
      const isPlayerExpanded = currentValue < height - MINI_PLAYER_HEIGHT;
      if (isPlayerExpanded !== isExpanded) {
        runOnJS(setIsExpanded)(isPlayerExpanded);
      }
    },
    [isExpanded]
  );

  // Nuevo Gesture Handler usando la API moderna con arrastre suave
  const startY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      startY.value = translateY.value;
    })
    .onUpdate((event) => {
      // Permite arrastrar desde cualquier posición actual
      const newY = startY.value + event.translationY;
      translateY.value = clamp(newY, statusBarHeight, height - MINI_PLAYER_HEIGHT);
    })
    .onEnd((event) => {
      const goDown = event.velocityY > 500;
      const goUp = event.velocityY < -500;
      const shouldCollapse = translateY.value > height * 0.4;

      if (goUp) {
        translateY.value = withTiming(statusBarHeight, { duration: 400 });
      } else if (goDown) {
        translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 400 });
      } else {
        if (shouldCollapse) {
          translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 400 });
        } else {
          translateY.value = withTiming(statusBarHeight, { duration: 400 });
        }
      }
    });

  // --- Componentes Renderizados Anidados ---

  const EqualizerBars = ({ color = 'bg-gray-600' }) => {
    const bar1Style = useAnimatedStyle(() => ({
      height: interpolate(eqBar1.value, [0, 1], [4, 16]),
    }));
    const bar2Style = useAnimatedStyle(() => ({
      height: interpolate(eqBar2.value, [0, 1], [4, 16]),
    }));
    const bar3Style = useAnimatedStyle(() => ({
      height: interpolate(eqBar3.value, [0, 1], [4, 16]),
    }));
    const bar4Style = useAnimatedStyle(() => ({
      height: interpolate(eqBar4.value, [0, 1], [4, 16]),
    }));

    if (!isPlaying) return null;

    return (
      <View className="flex-row items-end justify-center space-x-1 ml-2 h-4">
        <Animated.View className={`w-1 ${color} rounded-full`} style={bar1Style} />
        <Animated.View className={`w-1 ${color} rounded-full`} style={bar2Style} />
        <Animated.View className={`w-1 ${color} rounded-full`} style={bar3Style} />
        <Animated.View className={`w-1 ${color} rounded-full`} style={bar4Style} />
      </View>
    );
  };

  const formatTime = (timeInSeconds: number) => {
    const mins = Math.floor(timeInSeconds / 60);
    const secs = Math.floor(timeInSeconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // --- Estilos Animados ---
  const animatedPlayerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const miniContentOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [height - MINI_PLAYER_HEIGHT - 50, height - MINI_PLAYER_HEIGHT],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ),
  }));

  const fullContentOpacity = useAnimatedStyle(() => ({
    opacity: interpolate(
      translateY.value,
      [statusBarHeight + 100, statusBarHeight],
      [0, 1],
      { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
    ),
  }));

  const playButtonAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: playButtonScale.value }],
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  // --- Renderizado del Componente Principal ---
  return (
    <View className="flex-1">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />

      {/* --- Fondo de la App y Lista de Canciones --- */}
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: statusBarHeight }}>
        <View className="flex-row items-center justify-between p-4 mb-2">
          <View className="w-8" />
          <View className="items-center">
            <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-xs opacity-70`}>Playing from</Text>
            <View className="flex-row items-center mt-0.5">
              <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-sm`}>Polk Top Tracks this Week</Text>
              <Ionicons name="chevron-down" size={14} color={isDarkMode ? "white" : "#1F2937"} className="ml-1" />
            </View>
          </View>
          <TouchableOpacity onPress={() => setIsDarkMode(!isDarkMode)} className="p-2" accessibilityRole="button" accessibilityLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}>
            <Ionicons name={isDarkMode ? "sunny" : "moon"} size={22} color={isDarkMode ? "white" : "#1F2937"} />
          </TouchableOpacity>
        </View>

        <ScrollView className="px-4" contentContainerStyle={{ paddingBottom: MINI_PLAYER_HEIGHT + 40 }}>
          {playlistTracks.map((track, index) => (
            <TouchableOpacity
              key={track.id}
              onPress={() => switchTrack(index)}
              activeOpacity={0.7}
              className={`flex-row items-center p-2 rounded-lg mb-2 ${currentTrackIndex === index ? (isDarkMode ? 'bg-slate-700' : 'bg-gray-200') : ''}`}
              accessibilityRole="button"
              accessibilityLabel={`Play ${track.title} by ${track.artist}`}
              accessibilityState={{ selected: currentTrackIndex === index }}
            >
              <View className="w-12 h-12 mr-4 justify-center items-center rounded-lg relative" style={{ backgroundColor: track.color }}>
                <Text className="text-2xl">{track.image}</Text>
              </View>
              <View className="flex-1">
                <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-base ${currentTrackIndex === index ? 'text-cyan-400' : ''}`}>{track.title}</Text>
                <Text className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'} text-sm`}>{track.artist}</Text>
              </View>
              {currentTrackIndex === index && (
                <View className="mr-2">
                  <EqualizerBars color={`${isDarkMode ? 'bg-white/70' : 'bg-gray-800'}`} />
                </View>
              )}
              <TouchableOpacity onPress={() => toggleLike(track.id)} className="p-2" accessibilityRole="button" accessibilityLabel={likedTracks.has(track.id) ? `Unlike ${track.title}` : `Like ${track.title}`}>
                <Ionicons name={likedTracks.has(track.id) ? "heart" : "heart-outline"} size={20} color={likedTracks.has(track.id) ? "#EF4444" : "#6B7280"} />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* --- Reproductor Unificado (Mini y Expandido) --- */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          className={`flex-1 bg-white absolute top-0 h-screen left-0 right-0 rounded-t-[20px]`}
          style={[animatedPlayerStyle]}
        >
          {/* --- Contenedor del Player Expandido --- */}
          <Animated.View className={'flex-1'} style={fullContentOpacity}>
            <View className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
              <View className="flex-row items-center justify-between py-2">
                <TouchableOpacity onPress={collapsePlayer} className="p-2" accessibilityRole="button" accessibilityLabel="Collapse player">
                  <Ionicons name="chevron-down" size={28} color={isDarkMode ? "white" : "#1F2937"} />
                </TouchableOpacity>
                <View className="flex-1 items-center">
                  <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-xs opacity-70`}>PLAYING FROM PLAYLIST</Text>
                  <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-sm`}>Polk Top Tracks this Week</Text>
                </View>
                <TouchableOpacity className="p-2" accessibilityRole="button" accessibilityLabel="More options">
                  <MaterialIcons name="more-horiz" size={28} color={isDarkMode ? "white" : "#1F2937"} />
                </TouchableOpacity>
              </View>

              {/* Contenido principal del player expandido */}
              <View className="flex-1 bg-white pt-16 px-8 rounded-t-[20px]">
                {/* Album Cover */}
                <View className="items-center mb-10">
                  <Animated.View className="w-80 h-80 self-center justify-center items-center rounded-[50px] mb-12 mt-4" style={[{ backgroundColor: currentTrack.color, shadowColor: currentTrack.color, shadowRadius: 20, shadowOpacity: 0.5 }]}>
                    <Text className="text-white text-5xl font-bold">{currentTrack.image}</Text>
                  </Animated.View>

                  {/* Track Info */}
                  <Text className="text-gray-800 text-2xl font-bold mb-2 text-center">
                    {currentTrack.title}
                  </Text>
                  <Text className="text-gray-500 text-lg text-center">
                    {currentTrack.artist}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View className="mb-10">
                  <View className="h-2 bg-gray-200 rounded-full mb-2">
                    <View
                      className="h-2 bg-gray-800 rounded-full transition-all duration-300"
                      style={{ width: `${progress * 100}%` }}
                    />
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-xs">
                      {formatTime(progress * 261)}
                    </Text>
                    <Text className="text-gray-400 text-xs">4:21</Text>
                  </View>
                </View>

                {/* Controls */}
                <View className="flex-row items-center justify-between mb-10 px-5">
                  <TouchableOpacity className="p-2">
                    <Ionicons name="shuffle" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={prevTrack} className="p-2">
                    <Ionicons name="play-skip-back" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <Animated.View style={playButtonAnimatedStyle}>
                    <TouchableOpacity
                      onPress={togglePlayPause}
                      className="bg-gray-100 rounded-full items-center justify-center w-[75px] h-[75px]"
                    >
                      <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={32}
                        color="1F2937"
                        className={isPlaying ? "" : "pl-1.5"}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                  <TouchableOpacity onPress={nextTrack} className="p-2">
                    <Ionicons name="play-skip-forward" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2">
                    <Ionicons name="repeat" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View className="flex-row items-center justify-center pb-10">
                  <Animated.View style={likedTracks.has(currentTrack.id) ? heartAnimatedStyle : {}}>
                    <TouchableOpacity
                      onPress={() => toggleLike(currentTrack.id)}
                      className="p-5"
                    >
                      <Ionicons
                        name={likedTracks.has(currentTrack.id) ? "heart" : "heart-outline"}
                        size={24}
                        color={likedTracks.has(currentTrack.id) ? "#EF4444" : "#1F2937"}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                  <TouchableOpacity className="p-5">
                    <Ionicons name="share-outline" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-5">
                    <Ionicons name="add" size={24} color="#1F2937" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Animated.View>

          {/* --- Contenido del Mini Player --- */}
          {!isExpanded && (
            <Animated.View
              className="absolute top-0 left-0 right-0 backdrop-blur-md rounded-t-[20px] pb-10 pt-1"
              style={[{ height: MINI_PLAYER_HEIGHT }, miniContentOpacity]}
            >
              <View className="flex-1 px-6 pt-2 pb-4 justify-center">
                <View className="absolute w-10 h-1 bg-gray-300 rounded-full self-center mb-3 top-1" />

                <View className="flex-row items-center">
                  {/* Imagen del álbum */}
                  <View
                    className="w-12 h-12 rounded-full mr-4 justify-center items-center"
                    style={{ backgroundColor: currentTrack.color }}
                  >
                    <Text className="text-xl">{currentTrack.image}</Text>
                  </View>

                  {/* Información de la canción */}
                  <View className="flex-1">
                    <Text
                      className="text-gray-800 text-lg font-semibold min-w-10"
                      numberOfLines={1}
                    >
                      {currentTrack.title}
                    </Text>
                    <View className="flex-row items-center">
                      <Text
                        className="text-gray-500 text-base mr-1"
                        numberOfLines={1}
                      >
                        {currentTrack.artist}
                      </Text>
                      <EqualizerBars />
                    </View>
                  </View>

                  {/* Controles de música */}
                  <View className="flex-row items-center ml-3">
                    <TouchableOpacity onPress={prevTrack} className="p-3 mr-1">
                      <Ionicons name="play-skip-back" size={22} color="#1F2937" />
                    </TouchableOpacity>

                    <Animated.View style={playButtonAnimatedStyle}>
                      <TouchableOpacity
                        onPress={togglePlayPause}
                        className="bg-gray-100 rounded-full items-center justify-center w-[55px] h-[55px]"
                      >
                        <Ionicons
                          name={isPlaying ? "pause" : "play"}
                          size={26}
                          color="1F2937"
                          className={isPlaying ? "" : "pl-1.5"}
                        />
                      </TouchableOpacity>
                    </Animated.View>
                    <TouchableOpacity onPress={nextTrack} className="p-3">
                      <Ionicons name="play-skip-forward" size={22} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="h-1 bg-gray-200 rounded-sm mt-4 mx-1 absolute bottom-4 left-6 right-6">
                  <View className="h-1 bg-gray-800 rounded-sm" style={{ width: `${progress * 100}%` }} />
                </View>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}