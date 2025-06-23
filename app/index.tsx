import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;
const MINI_PLAYER_HEIGHT = 150;

export default function MusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const translateY = useSharedValue(height - MINI_PLAYER_HEIGHT);

  const playlistTracks = [
    { id: 1, title: "No Problem", artist: "Chance the Rapper", genre: "13d • Hip-Hop", color: "#EF4444", image: "👤" },
    { id: 2, title: "Lonely", artist: "Yung Bans", genre: "21d • Trap", color: "#8B5CF6", image: "🎤" },
    { id: 3, title: "Humility", artist: "Gorillaz", genre: "3d • Alternative", color: "#06B6D4", image: "🎸" },
    { id: 4, title: "Fuck Love", artist: "XXXTENTACION", genre: "29d • Trap", color: "#6B7280", image: "🖤" },
    { id: 5, title: "Old Town Road", artist: "Lil Nas X", genre: "29d • Country Trap", color: "#374151", image: "🤠" },
  ];

  const currentTrack = {
    title: "Bag (feat. Yung Bans)",
    artist: "Chance the Rapper",
    coverColor: "#EF4444"
  };

  const expandPlayer = () => {
    setIsExpanded(true);
    translateY.value = withTiming(0, { duration: 400 });
  };

  const collapsePlayer = () => {
    translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 400 });
    setTimeout(() => setIsExpanded(false), 200);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      const newY = ctx.startY + event.translationY;
      translateY.value = Math.min(Math.max(newY, 0), height - MINI_PLAYER_HEIGHT);
    },
    onEnd: (event) => {
      const currentY = translateY.value;
      const expandThreshold = height * 0.9;
      const collapseThreshold = height * 0.1;
      const gestureDirection = event.velocityY;

      if (gestureDirection < 0) {
        if (currentY < expandThreshold) {
          translateY.value = withTiming(0, { duration: 300 });
          runOnJS(setIsExpanded)(true);
        } else {
          translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 300 });
          runOnJS(setIsExpanded)(false);
        }
      } else {
        if (currentY > collapseThreshold) {
          translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 300 });
          runOnJS(setIsExpanded)(false);
        } else {
          translateY.value = withTiming(0, { duration: 300 });
          runOnJS(setIsExpanded)(true);
        }
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  const miniContentOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [height - MINI_PLAYER_HEIGHT - 100, height - MINI_PLAYER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  const fullContentOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [200, 0],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  return (
    <View className="flex-1">
      {/* Pantalla de lista de canciones */}
      <SafeAreaView className="flex-1 bg-slate-800" style={{ paddingTop: statusBarHeight }}>
        {/* Header */}
        <View className="items-center p-4">
          <Text className="text-white text-xs opacity-70">Playing from</Text>
          <View className="flex-row items-center mt-0.5">
            <Text className="text-white font-semibold text-sm">Polk Top Tracks this Week</Text>
            <Ionicons name="chevron-down" size={14} color="white" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Lista de canciones */}
        <ScrollView
          className="flex-1 px-4"
          style={{ marginBottom: MINI_PLAYER_HEIGHT + 20 }}
          contentContainerStyle={{ paddingBottom: 20 }}
        >
          {playlistTracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              onPress={expandPlayer}
              activeOpacity={0.7}
              className="flex-row items-center py-3"
            >
              <View
                className="w-12 h-12 mr-3 justify-center items-center"
                style={{ backgroundColor: track.color }}
              >
                <Text className="text-xl">{track.image}</Text>
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium text-base">{track.title}</Text>
                <Text className="text-gray-400 text-sm">{track.artist}</Text>
                <Text className="text-gray-500 text-xs">{track.genre}</Text>
              </View>
              <MaterialIcons name="more-horiz" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Reproductor Unificado */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          className="absolute top-0 left-0 right-0 bg-white shadow-lg elevation-10"
          style={[
            {
              height: height,
              borderTopLeftRadius: 55,
              borderTopRightRadius: 55,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
            },
            animatedStyle
          ]}
        >

          {/* Contenido del Mini Player */}
          {!isExpanded && (
            <Animated.View
              className="px-6 pt-4 pb-2 justify-between"
              style={[{ height: MINI_PLAYER_HEIGHT }, miniContentOpacity]}
            >
              <TouchableOpacity onPress={expandPlayer} className="flex-1">
                <View className="flex-row h-16 items-center">
                  {/* Imagen del álbum */}
                  <View
                    className="w-12 h-12 rounded-full mr-2.5 justify-center items-center"
                    style={{ backgroundColor: currentTrack.coverColor }}
                  >
                    <Text className="text-white font-bold text-xl">3</Text>
                  </View>

                  {/* Información de la canción */}
                  <View className="flex-1">
                    <Text
                      className="text-gray-800 text-lg font-semibold"
                      numberOfLines={1}
                    >
                      {currentTrack.title}
                    </Text>
                    <Text
                      className="text-gray-500 text-base"
                      numberOfLines={1}
                    >
                      {currentTrack.artist}
                    </Text>
                  </View>

                  {/* Controles de música */}
                  <View className="flex-row items-center ml-3">
                    <TouchableOpacity className="p-2 mr-1">
                      <Ionicons name="play-skip-back" size={22} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 mr-1">
                      <Ionicons name="play" size={26} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2">
                      <Ionicons name="play-skip-forward" size={22} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Barra de progreso */}
                <View className="h-1 bg-gray-200 rounded-sm mt-2 mx-1">
                  <View className="h-1 bg-gray-800 rounded-sm" style={{ width: '35%' }} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Contenido del Player Expandido */}
          {isExpanded && (
            <Animated.View
              className="flex-1 bg-slate-800"
              style={[fullContentOpacity]}
            >
              {/* Header del player expandido */}
              <View
                className="px-4 pb-4"
                style={{ paddingTop: statusBarHeight }}
              >
                <View className="flex-row items-center justify-between py-2">
                  <TouchableOpacity onPress={collapsePlayer} className="p-2">
                    <Ionicons name="chevron-down" size={24} color="white" />
                  </TouchableOpacity>
                  <View className="flex-1 items-center">
                    <Text className="text-gray-400 text-xs">Playing from</Text>
                    <Text className="text-white font-semibold text-xs">
                      Polk Top Tracks this Week
                    </Text>
                  </View>
                  <TouchableOpacity className="p-2">
                    <MaterialIcons name="more-horiz" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Contenido principal del player expandido */}
              <View className="flex-1 bg-white pt-10 px-8" style={{ borderTopLeftRadius: 55, borderTopRightRadius: 55 }}>

                {/* Album Cover */}
                <View className="items-center mb-10">
                  <View
                    className="w-60 h-60 justify-center items-center relative overflow-hidden shadow-xl"
                    style={{
                      backgroundColor: currentTrack.coverColor,
                      elevation: 12,
                      marginBottom: 60,
                      marginTop: 35,
                      borderRadius: 50
                    }}
                  >
                    <View className="w-16 h-16 rounded-full items-center justify-center z-10">
                      <Text className="text-white text-2xl font-bold">3</Text>
                    </View>
                  </View>

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
                  <View className="h-1 bg-gray-200 rounded-sm mb-2">
                    <View className="h-1 bg-gray-800 rounded-sm" style={{ width: '35%' }} />
                  </View>
                  <View className="flex-row justify-between">
                    <Text className="text-gray-400 text-xs">1:37</Text>
                    <Text className="text-gray-400 text-xs">4:21</Text>
                  </View>
                </View>

                {/* Controls */}
                <View className="flex-row items-center justify-between mb-10 px-5">
                  <TouchableOpacity className="p-2">
                    <Ionicons name="shuffle" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2">
                    <Ionicons name="play-skip-back" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-gray-800 rounded-full items-center justify-center"
                    style={{ width: 72, height: 72 }}
                  >
                    <Ionicons name="play" size={32} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2">
                    <Ionicons name="play-skip-forward" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-2">
                    <Ionicons name="repeat" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View className="flex-row items-center justify-around pb-10">
                  <TouchableOpacity className="p-3">
                    <Ionicons name="heart-outline" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-3">
                    <Ionicons name="share-outline" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity className="p-3">
                    <Ionicons name="add" size={24} color="#1F2937" />
                  </TouchableOpacity>
                </View>
              </View>
            </Animated.View>
          )}
        </Animated.View>
      </PanGestureHandler>
    </View>
  );
}