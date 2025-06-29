import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Button,
} from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { CONSTANTS } from '@/utils/constants';
import { useAnimations } from '@/hooks/useAnimations';
import { useGestures } from '@/hooks/useGestures';
import { usePlayer, useLoadDeviceTracks } from '@/hooks/usePlayer';
import { usePlaylist } from '@/context/PlaylistContext';
import Header from '@/components/common/Header';
import ExpandedPlayer from '@/components/player/ExpandedPlayer';
import MiniPlayer from '@/components/player/MiniPlayer';
import TrackList from '@/components/playlist/TrackList';
import * as MediaLibrary from 'expo-media-library';

export default function MusicPlayer() {
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  useLoadDeviceTracks(setPermissionStatus);

  // --- Estados de React ---
  const {
    isExpanded,
    setIsExpanded,
    isPlaying,
    currentTrackIndex,
    progress,
    isDarkMode,
    setIsDarkMode,
    likedTracks,
    currentTrack,
    togglePlayPause,
    nextTrack,
    prevTrack,
    toggleLike,
    switchTrack,
  } = usePlayer();

  const { playlistTracks } = usePlaylist();

  // --- Valores Animados de Reanimated ---
  const animations = useAnimations(isPlaying);
  const { panGesture } = useGestures({
    translateY: animations.translateY,
    onExpand: () => setIsExpanded(true),
    onCollapse: () => setIsExpanded(false),
  });
  const animatedPlayerStyle = animations.translateY ? {
    transform: [{ translateY: animations.translateY }],
  } : {};

  // --- Renderizado del Componente Principal ---
  if (permissionStatus === 'unknown') {
    return (
      <View className="flex-1 items-center justify-center bg-slate-100 dark:bg-slate-800">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <SafeAreaView className="flex-1 items-center justify-center">
          <Animated.Text style={{ color: isDarkMode ? '#fff' : '#222', fontSize: 18, marginTop: 32 }}>
            Cargando permisos...
          </Animated.Text>
        </SafeAreaView>
      </View>
    );
  }

  if (permissionStatus === 'denied') {
    const handleRequestPermission = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
    };
    return (
      <View className="flex-1 items-center justify-center bg-gradient-to-b from-rose-400 via-fuchsia-500 to-indigo-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-700">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView className="flex-1 w-full items-center justify-center px-8">
          <View style={{ alignItems: 'center', gap: 24 }}>
            <Animated.Text style={{ color: isDarkMode ? '#fff' : '#222', fontSize: 28, fontWeight: 'bold', marginTop: 32, textAlign: 'center' }}>
              Permiso requerido
            </Animated.Text>
            <Animated.Text style={{ color: isDarkMode ? '#cbd5e1' : '#555', fontSize: 18, textAlign: 'center', marginBottom: 12 }}>
              Para mostrar y reproducir tu música, necesitamos acceso a los archivos de audio del dispositivo.
            </Animated.Text>
            <Button
              title="Conceder permiso"
              color={isDarkMode ? '#6366f1' : '#a21caf'}
              onPress={handleRequestPermission}
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!playlistTracks.length || !currentTrack) {
    return (
      <View className="flex-1">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: CONSTANTS.STATUS_BAR_HEIGHT }}>
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <Animated.Text className="flex-1 items-center justify-center" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
            {playlistTracks.length === 0 ? 'No se encontraron canciones en el dispositivo.' : 'Cargando...'}
          </Animated.Text>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: CONSTANTS.STATUS_BAR_HEIGHT }}>
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <TrackList
          tracks={playlistTracks}
          currentTrackIndex={currentTrackIndex}
          isPlaying={isPlaying}
          isDarkMode={isDarkMode}
          likedTracks={likedTracks}
          onTrackSelect={switchTrack}
          onToggleLike={toggleLike}
        />
      </SafeAreaView>
      <GestureDetector gesture={panGesture}>
        <Animated.View className="bg-white rounded-t-[20px]" style={[animatedPlayerStyle, { position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }]}> 
          {!isExpanded && (
            <MiniPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              animations={animations}
              togglePlayPause={togglePlayPause}
              nextTrack={nextTrack}
              prevTrack={prevTrack}
            />
          )}
          {isExpanded && (
            <ExpandedPlayer
              currentTrack={currentTrack}
              isPlaying={isPlaying}
              progress={progress}
              likedTracks={likedTracks}
              isDarkMode={isDarkMode}
              animations={animations}
              togglePlayPause={togglePlayPause}
              nextTrack={nextTrack}
              prevTrack={prevTrack}
              toggleLike={toggleLike}
              setIsExpanded={setIsExpanded}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}