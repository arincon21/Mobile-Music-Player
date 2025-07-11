import React from 'react';
import {
    View,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Animated, { withTiming } from 'react-native-reanimated';
import { GestureDetector } from 'react-native-gesture-handler';
import { CONSTANTS } from '@/utils/constants';
import { useAnimations } from '@/hooks/useAnimations';
import { useGestures } from '@/hooks/useGestures';
import { usePlayer } from '@/hooks/usePlayer';
import { usePlaylist } from '@/context/PlaylistContext';
import Header from '@/components/common/Header';
import ExpandedPlayer from '@/components/player/ExpandedPlayer';
import MiniPlayer from '@/components/player/MiniPlayer';
import TrackList from '@/components/playlist/TrackList';

export default function MusicPlayer() {
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

    // --- Handler para colapsar el player con animación ---
    const handleCollapsePlayer = () => {
        animations.translateY.value = withTiming(CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT, { duration: 400 });
        setTimeout(() => setIsExpanded(false), 400);
    };

    // --- Obtención de la lista de pistas del contexto ---
    const { playlistTracks } = usePlaylist();

    // --- Renderizado del Componente Principal ---
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
                            setIsExpanded={handleCollapsePlayer}
                        />
                    )}
                </Animated.View>
            </GestureDetector>
        </View>
    );
}