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

      // Umbrales separados
      const expandThreshold = height * 0.9;  // Umbral para expandir (40% de la pantalla)
      const collapseThreshold = height * 0.1; // Umbral para colapsar (60% de la pantalla)

      // Determinar si el gesto fue hacia arriba o hacia abajo
      const gestureDirection = event.velocityY;

      if (gestureDirection < 0) {
        // Gesto hacia ARRIBA (expandir)
        if (currentY < expandThreshold) {
          // Expandir
          translateY.value = withTiming(0, { duration: 300 });
          runOnJS(setIsExpanded)(true);
        } else {
          // Volver al mini player
          translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 300 });
          runOnJS(setIsExpanded)(false);
        }
      } else {
        // Gesto hacia ABAJO (colapsar)
        if (currentY > collapseThreshold) {
          // Colapsar
          translateY.value = withTiming(height - MINI_PLAYER_HEIGHT, { duration: 300 });
          runOnJS(setIsExpanded)(false);
        } else {
          // Volver al estado expandido
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

  // Interpolación para opacidad del contenido del mini player
  const miniContentOpacity = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateY.value,
      [height - MINI_PLAYER_HEIGHT - 100, height - MINI_PLAYER_HEIGHT],
      [0, 1],
      Extrapolate.CLAMP
    );
    return { opacity };
  });

  // Interpolación para opacidad del contenido del player expandido
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
    <View style={{ flex: 1 }}>
      {/* Pantalla de lista de canciones */}
      <SafeAreaView style={{ flex: 1, backgroundColor: '#1e293b', paddingTop: statusBarHeight }}>
        {/* Header */}
        <View style={{ alignItems: 'center', padding: 16 }}>
          <Text style={{ color: 'white', fontSize: 13, opacity: 0.7 }}>Playing from</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
            <Text style={{ color: 'white', fontWeight: '600', fontSize: 14 }}>Polk Top Tracks this Week</Text>
            <Ionicons name="chevron-down" size={14} color="white" style={{ marginLeft: 4 }} />
          </View>
        </View>

        {/* Lista de canciones */}
        <ScrollView style={{ flex: 1, paddingHorizontal: 16, marginBottom: MINI_PLAYER_HEIGHT + 20 }}>
          {playlistTracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              onPress={expandPlayer}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            >
              <View style={{
                width: 48,
                height: 48,
                marginRight: 12,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: track.color
              }}>
                <Text style={{ fontSize: 20 }}>{track.image}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: 'white', fontWeight: '500', fontSize: 15 }}>{track.title}</Text>
                <Text style={{ color: '#9CA3AF', fontSize: 13 }}>{track.artist}</Text>
                <Text style={{ color: '#6B7280', fontSize: 11 }}>{track.genre}</Text>
              </View>
              <MaterialIcons name="more-horiz" size={20} color="#6B7280" />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>

      {/* Reproductor Unificado */}
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: height,
          backgroundColor: 'white',
          borderTopLeftRadius: 55,
          borderTopRightRadius: 55,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.15,
          shadowRadius: 8,
          elevation: 10,
        }, animatedStyle]}>

          {/* Contenido del Mini Player */}
          {!isExpanded && (
            <Animated.View style={[{
              height: MINI_PLAYER_HEIGHT,
              paddingHorizontal: 25,
              paddingTop: 15,
              paddingBottom: 8,
              justifyContent: 'space-between',
            }, miniContentOpacity]}>
              <TouchableOpacity onPress={expandPlayer} style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', height: 70, alignItems: 'center' }}>
                  {/* Imagen del álbum */}
                  <View style={{
                    width: 50,
                    height: 50,
                    borderRadius: 30,
                    marginRight: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: currentTrack.coverColor
                  }}>
                    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>3</Text>
                  </View>

                  {/* Información de la canción */}
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#1F2937', fontSize: 17, fontWeight: '600' }} numberOfLines={1}>
                      {currentTrack.title}
                    </Text>
                    <Text style={{ color: '#6B7280', fontSize: 15 }} numberOfLines={1}>
                      {currentTrack.artist}
                    </Text>
                  </View>

                  {/* Controles de música */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                    {/* Botón anterior */}
                    <TouchableOpacity style={{ padding: 8, marginRight: 4 }}>
                      <Ionicons name="play-skip-back" size={22} color="#1F2937" />
                    </TouchableOpacity>

                    {/* Botón play/pause */}
                    <TouchableOpacity style={{ padding: 8, marginRight: 4 }}>
                      <Ionicons name="play" size={26} color="#1F2937" />
                    </TouchableOpacity>

                    {/* Botón siguiente */}
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="play-skip-forward" size={22} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Barra de progreso */}
                <View style={{
                  height: 3,
                  backgroundColor: '#E5E7EB',
                  borderRadius: 1.5,
                  marginTop: 8,
                  marginHorizontal: 4
                }}>
                  <View style={{
                    height: 3,
                    backgroundColor: '#1F2937',
                    borderRadius: 1.5,
                    width: '35%'
                  }} />
                </View>
              </TouchableOpacity>
            </Animated.View>
          )}

          {/* Contenido del Player Expandido */}
          {isExpanded && (
            <Animated.View style={[{ flex: 1 , backgroundColor: '#1e293b'}, fullContentOpacity]}>
              {/* Header del player expandido */}
              <View style={{
                paddingTop: statusBarHeight,
                paddingHorizontal: 16,
                paddingBottom: 16,
              }}>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 8
                }}>
                  <TouchableOpacity onPress={collapsePlayer} style={{ padding: 8 }}>
                    <Ionicons name="chevron-down" size={24} color="white" />
                  </TouchableOpacity>
                  <View style={{ flex: 1, alignItems: 'center' }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Playing from</Text>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>
                      Polk Top Tracks this Week
                    </Text>
                  </View>
                  <TouchableOpacity style={{ padding: 8 }}>
                    <MaterialIcons name="more-horiz" size={24} color="white" />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Contenido principal del player expandido */}
              <View style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 55,
                borderTopRightRadius: 55,
                paddingTop: 40,
                paddingHorizontal: 32,
              }}>

                {/* Album Cover */}
                <View style={{ alignItems: 'center', marginBottom: 40 }}>
                  <View style={{
                    width: 240,
                    height: 240,
                    borderRadius: 50,
                    marginBottom: 60,
                    marginTop:35,
                    backgroundColor: currentTrack.coverColor,
                    shadowColor: '#000',
                    elevation: 12,
                    justifyContent: 'center',
                    alignItems: 'center',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <View style={{
                      width: 64,
                      height: 64,
                      borderRadius: 32,
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 10
                    }}>
                      <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>3</Text>
                    </View>
                  </View>

                  {/* Track Info */}
                  <Text style={{
                    color: '#1F2937',
                    fontSize: 24,
                    fontWeight: 'bold',
                    marginBottom: 8,
                    textAlign: 'center'
                  }}>
                    {currentTrack.title}
                  </Text>
                  <Text style={{ color: '#6B7280', fontSize: 18, textAlign: 'center' }}>
                    {currentTrack.artist}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={{ marginBottom: 40 }}>
                  <View style={{
                    height: 4,
                    backgroundColor: '#E5E7EB',
                    borderRadius: 2,
                    marginBottom: 8
                  }}>
                    <View style={{
                      height: 4,
                      backgroundColor: '#1F2937',
                      borderRadius: 2,
                      width: '35%'
                    }} />
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>1:37</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 12 }}>4:21</Text>
                  </View>
                </View>

                {/* Controls */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 40,
                  paddingHorizontal: 20
                }}>
                  <TouchableOpacity style={{ padding: 8 }}>
                    <Ionicons name="shuffle" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 8 }}>
                    <Ionicons name="play-skip-back" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{
                    width: 72,
                    height: 72,
                    backgroundColor: '#1F2937',
                    borderRadius: 36,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Ionicons name="play" size={32} color="white" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 8 }}>
                    <Ionicons name="play-skip-forward" size={32} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 8 }}>
                    <Ionicons name="repeat" size={24} color="#9CA3AF" />
                  </TouchableOpacity>
                </View>

                {/* Bottom Controls */}
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  paddingBottom: 40
                }}>
                  <TouchableOpacity style={{ padding: 12 }}>
                    <Ionicons name="heart-outline" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 12 }}>
                    <Ionicons name="share-outline" size={24} color="#1F2937" />
                  </TouchableOpacity>
                  <TouchableOpacity style={{ padding: 12 }}>
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