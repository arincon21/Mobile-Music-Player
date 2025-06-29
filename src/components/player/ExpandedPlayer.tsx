import React, { memo } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import TrackInfo from './TrackInfo';
import ProgressBar from '../ui/ProgressBar';
import PlayerControls from './PlayerControls';
import { CONSTANTS } from '../../utils/constants';
import { Track, AnimationValues } from '../../types';

interface ExpandedPlayerProps {
    currentTrack: Track;
    isPlaying: boolean;
    progress: number;
    isDarkMode: boolean;
    likedTracks: Set<number>;
    animations: AnimationValues;
    togglePlayPause: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    toggleLike: (trackId: number) => void;
    setIsExpanded: (expanded: boolean) => void;
}

export default memo(function ExpandedPlayer({
    currentTrack,
    isPlaying,
    progress,
    isDarkMode,
    likedTracks,
    animations,
    togglePlayPause,
    nextTrack,
    prevTrack,
    toggleLike,
    setIsExpanded,
}: ExpandedPlayerProps) {
    // --- Animación de opacidad para fade in/out del contenido ---
    const fadeContentStyle = useAnimatedStyle(() => {
        // El fade debe ser 0.5 cuando está colapsado (abajo), 1 cuando está expandido (arriba)
        const min = CONSTANTS.STATUS_BAR_HEIGHT;
        const max = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT;
        return {
            opacity: interpolate(
                animations.translateY.value,
                [min, max],
                [1, 0],
                'clamp'
            ),
        };
    });

    const collapsePlayer = () => {
        setIsExpanded(false);
    };

    return (
        <Animated.View style={fadeContentStyle} className="flex-1">
            <View className={`flex-1 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                {/* Header */}
                <View className="flex-row items-center justify-between py-2">
                    <TouchableOpacity
                        onPress={collapsePlayer}
                        className="p-2"
                        accessibilityRole="button"
                        accessibilityLabel="Collapse player"
                    >
                        <Ionicons name="chevron-down" size={28} color={isDarkMode ? "white" : "#1F2937"} />
                    </TouchableOpacity>
                    <View className="flex-1 items-center">
                        <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-xs opacity-70`}>
                            PLAYING FROM PLAYLIST
                        </Text>
                        <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-sm`}>
                            Polk Top Tracks this Week
                        </Text>
                    </View>
                    <TouchableOpacity className="p-2" accessibilityRole="button" accessibilityLabel="More options">
                        <MaterialIcons name="more-horiz" size={28} color={isDarkMode ? "white" : "#1F2937"} />
                    </TouchableOpacity>
                </View>

                {/* Main Content */}
                <View className="flex-1 bg-white pt-16 px-8 rounded-t-[20px]">
                    <TrackInfo track={currentTrack} />

                    <ProgressBar
                        progress={progress}
                        duration={CONSTANTS.TRACK_DURATION_SECONDS}
                    />

                    <PlayerControls
                        isPlaying={isPlaying}
                        onTogglePlayPause={togglePlayPause}
                        onNextTrack={nextTrack}
                        onPrevTrack={prevTrack}
                        playButtonScale={animations.playButtonScale}
                        size="full"
                    />

                    {/* Bottom Controls */}
                    <View className="flex-row items-center justify-center pb-10">
                        <Animated.View style={likedTracks.has(currentTrack.id) ? { transform: [{ scale: animations.heartScale }] } : {}}>
                            <TouchableOpacity onPress={() => toggleLike(currentTrack.id)} className="p-5">
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
    );
});