import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  StatusBar,
  Button,
  ActivityIndicator, // <-- importado
} from 'react-native';
import Animated from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { CONSTANTS } from '@/utils/constants';
import { useAnimations } from '@/hooks/useAnimations';
import { useGestures } from '@/hooks/useGestures';
import { usePlayer, useLoadDeviceTracks } from '@/hooks/usePlayer';
import { usePlaylist } from '@/context/PlaylistContext';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import Header from '@/components/common/Header';
import ExpandedPlayer from '@/components/player/ExpandedPlayer';
import MiniPlayer from '@/components/player/MiniPlayer';
import TrackList from '@/components/playlist/TrackList';
import * as MediaLibrary from 'expo-media-library';

export default function MusicPlayer() {
  const [permissionStatus, setPermissionStatus] = useState<'unknown' | 'granted' | 'denied'>('unknown');
  const [isLoadingTracks, setIsLoadingTracks] = useState(true);
  useLoadDeviceTracks(setPermissionStatus, setIsLoadingTracks);

  // --- Estados de React ---
  const {
    isExpanded,
    setIsExpanded,
    isDarkMode,
    setIsDarkMode,
    likedTracks,
    toggleLike,
  } = usePlayer();

  const { playlistTracks } = usePlaylist();

  // --- Integración del reproductor de audio real ---
  const audioPlayer = useAudioPlayer(playlistTracks, 0);

  // --- Valores Animados de Reanimated ---
  const animations = useAnimations(audioPlayer.isPlaying);
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

  if (isLoadingTracks) {
    return (
      <View className="flex-1">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: CONSTANTS.STATUS_BAR_HEIGHT }}>
          <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <ActivityIndicator size="large" color={isDarkMode ? '#6366f1' : '#a21caf'} style={{ marginBottom: 16 }} />
            <Animated.Text className="items-center justify-center" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              Cargando canciones...
            </Animated.Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (!playlistTracks.length) {
    return (
      <View className="flex-1">
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: CONSTANTS.STATUS_BAR_HEIGHT }}>
          <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Animated.Text className="items-center justify-center" style={{ color: isDarkMode ? '#ffffff' : '#000000' }}>
              No se encontraron canciones en el dispositivo.
            </Animated.Text>
          </View>
        </SafeAreaView>
      </View>

    );
  }

  if (!audioPlayer.currentTrack) {
    return null;
  }

  return (
    <View className="flex-1">
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <SafeAreaView className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`} style={{ paddingTop: CONSTANTS.STATUS_BAR_HEIGHT }}>
        <Header isDarkMode={isDarkMode} onToggleTheme={() => setIsDarkMode(!isDarkMode)} />
        <TrackList
          tracks={playlistTracks}
          currentTrackIndex={audioPlayer.currentTrackIndex}
          isPlaying={audioPlayer.isPlaying}
          isDarkMode={isDarkMode}
          likedTracks={likedTracks}
          onTrackSelect={audioPlayer.setCurrentTrackIndex}
          onToggleLike={toggleLike}
        />
      </SafeAreaView>
      <GestureDetector gesture={panGesture}>
        <Animated.View className="bg-white rounded-t-[20px]" style={[animatedPlayerStyle, { position: 'absolute', top: 0, left: 0, right: 0, height: '100%' }]}> 
          {!isExpanded && (
            <MiniPlayer
              currentTrack={audioPlayer.currentTrack}
              isPlaying={audioPlayer.isPlaying}
              progress={audioPlayer.progress}
              animations={animations}
              togglePlayPause={audioPlayer.togglePlayPause}
              nextTrack={audioPlayer.nextTrack}
              prevTrack={audioPlayer.prevTrack}
            />
          )}
          {isExpanded && (
            <ExpandedPlayer
              currentTrack={audioPlayer.currentTrack}
              isPlaying={audioPlayer.isPlaying}
              progress={audioPlayer.progress}
              likedTracks={likedTracks}
              isDarkMode={isDarkMode}
              animations={animations}
              togglePlayPause={audioPlayer.togglePlayPause}
              nextTrack={audioPlayer.nextTrack}
              prevTrack={audioPlayer.prevTrack}
              toggleLike={toggleLike}
              setIsExpanded={setIsExpanded}
            />
          )}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}