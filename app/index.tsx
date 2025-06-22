import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, Dimensions, Platform, StatusBar } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
  runOnJS
} from 'react-native-reanimated';

const { height } = Dimensions.get('window');
const statusBarHeight = Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24;

export default function MusicPlayer() {
  const [showPlayer, setShowPlayer] = useState(false);
  const translateY = useSharedValue(height); // Empieza fuera de pantalla

  const openPlayer = useCallback(() => {
    if (!showPlayer) {
      setShowPlayer(true);
    }
  }, [showPlayer]);

  useEffect(() => {
    if (showPlayer) {
      // Esperar un frame para asegurar que el componente esté montado
      requestAnimationFrame(() => {
        translateY.value = withTiming(0, { duration: 300 });
      });
    }
  }, [showPlayer]);

  const closePlayer = () => {
    translateY.value = withTiming(height, { duration: 300 });
    runOnJS(setShowPlayer)(false);
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startY = translateY.value;
    },
    onActive: (event, ctx) => {
      if (event.translationY > 0) {
        translateY.value = ctx.startY + event.translationY;
      }
    },
    onEnd: () => {
      if (translateY.value > height * 0.15) {
        translateY.value = withTiming(height, { duration: 300 });
        runOnJS(setShowPlayer)(false);
      } else {
        translateY.value = withTiming(0, { duration: 300 });
      }
    },
  });

  const miniGestureHandler = useAnimatedGestureHandler({
    onActive: (event) => {
      if (event.translationY < -30 && !showPlayer) {
        runOnJS(setShowPlayer)(true);
      }
    },
  });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

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
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }}>
          {playlistTracks.map((track) => (
            <TouchableOpacity
              key={track.id}
              onPress={openPlayer}
              activeOpacity={0.7}
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 12 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 8, marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: track.color }}>
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

        {/* Mini Reproductor con gesto hacia arriba */}
        <PanGestureHandler onGestureEvent={miniGestureHandler}>
          <Animated.View>
            <TouchableOpacity
              onPress={openPlayer}
              activeOpacity={0.8}
              style={{
                backgroundColor: 'white',
                marginHorizontal: 0,
                marginBottom: 0,
                padding: 16,
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                borderBottomLeftRadius: 0,
                borderBottomRightRadius: 0,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
                height: 140,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 40, height: 40, borderRadius: 8, marginRight: 12, justifyContent: 'center', alignItems: 'center', backgroundColor: currentTrack.coverColor }}>
                  <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 16 }}>3</Text>
                </View>
                <Text style={{ flex: 1, color: '#1F2937', fontSize: 14, fontWeight: '600' }}>{currentTrack.title}</Text>
                <Ionicons name="pause" size={20} color="#1F2937" style={{ marginHorizontal: 12 }} />
              </View>
              <View style={{ marginTop: 12 }}>
                <View style={{ height: 3, backgroundColor: '#E5E7EB', borderRadius: 2 }}>
                  <View style={{ height: 3, backgroundColor: '#1F2937', borderRadius: 2, width: '35%' }} />
                </View>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </PanGestureHandler>
      </SafeAreaView>

      {/* Reproductor Grande con gesto hacia abajo */}
      {showPlayer && (
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }, animatedStyle]}>
            {/* Dark curved header section */}
            <View style={{ backgroundColor: '#1e293b', paddingBottom: 32, paddingTop: statusBarHeight }}>
              {/* Header */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 }}>
                <TouchableOpacity onPress={closePlayer} style={{ padding: 8 }}>
                  <Ionicons name="chevron-down" size={24} color="white" />
                </TouchableOpacity>
                <View style={{ flex: 1, alignItems: 'center' }}>
                  <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Playing from</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 13 }}>Polk Top Tracks this Week · All Genres</Text>
                    <Ionicons name="chevron-down" size={14} color="white" style={{ marginLeft: 4 }} />
                  </View>
                </View>
                <TouchableOpacity style={{ padding: 8 }}>
                  <MaterialIcons name="more-horiz" size={24} color="white" />
                </TouchableOpacity>
              </View>
            </View>

            {/* White curved content section */}
            <View
              style={{
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 32,
                borderTopRightRadius: 32,
                marginTop: -32,
              }}
            >
              <View style={{ flex: 1 }}>
                {/* Album Cover */}
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, paddingTop: 32 }}>
                  <View style={{ width: 280, height: 280, borderRadius: 24, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 16, elevation: 12, overflow: 'hidden' }}>
                    <View
                      style={{
                        width: '100%',
                        height: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        backgroundColor: currentTrack.coverColor
                      }}
                    >
                      {/* Gradient overlay */}
                      <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.2)' }} />

                      {/* Person silhouette */}
                      <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '65%' }}>
                        <View style={{ width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.6)', borderTopLeftRadius: 24, borderTopRightRadius: 24 }} />
                      </View>

                      {/* Number 3 */}
                      <View style={{ width: 64, height: 64, backgroundColor: '#1e293b', borderRadius: 32, alignItems: 'center', justifyContent: 'center', zIndex: 10 }}>
                        <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>3</Text>
                      </View>
                    </View>
                  </View>

                  {/* Track Info */}
                  <View style={{ alignItems: 'center', marginBottom: 32 }}>
                    <Text style={{ color: '#1F2937', fontSize: 22, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' }}>{currentTrack.title}</Text>
                    <Text style={{ color: '#6B7280', fontSize: 16 }}>{currentTrack.artist}</Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={{ width: '100%', paddingHorizontal: 16, marginBottom: 32 }}>
                    <View style={{ height: 3, backgroundColor: '#E5E7EB', borderRadius: 2, marginBottom: 8 }}>
                      <View style={{ height: 3, backgroundColor: '#1F2937', borderRadius: 2, width: '35%' }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#9CA3AF', fontSize: 12 }}>1:37</Text>
                      <Text style={{ color: '#9CA3AF', fontSize: 12 }}>4:21</Text>
                    </View>
                  </View>

                  {/* Controls */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 32, marginBottom: 32 }}>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="shuffle" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="play-skip-back" size={28} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ width: 64, height: 64, backgroundColor: '#1F2937', borderRadius: 32, alignItems: 'center', justifyContent: 'center' }}>
                      <Ionicons name="pause" size={28} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="play-skip-forward" size={28} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="repeat" size={22} color="#9CA3AF" />
                    </TouchableOpacity>
                  </View>

                  {/* Bottom Controls */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', paddingHorizontal: 32 }}>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="heart-outline" size={22} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="share-outline" size={22} color="#1F2937" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ padding: 8 }}>
                      <Ionicons name="add" size={22} color="#1F2937" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </Animated.View>
        </PanGestureHandler>
      )}
    </View>
  );
}
