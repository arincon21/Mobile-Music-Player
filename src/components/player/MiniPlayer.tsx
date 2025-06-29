import React from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';
import EqualizerBars from '../ui/EqualizerBars';
import PlayerControls from './PlayerControls';
import ProgressBar from '../ui/ProgressBar';
import { CONSTANTS } from '../../utils/constants';
import { Track, AnimationValues } from '../../types';

interface MiniPlayerProps {
    currentTrack: Track;
    isPlaying: boolean;
    progress: number;
    animations: AnimationValues;
    togglePlayPause: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
}

export default function MiniPlayer({
    currentTrack,
    isPlaying,
    progress,
    animations,
    togglePlayPause,
    nextTrack,
    prevTrack,
}: MiniPlayerProps) {
    // --- Animación de opacidad para fade in/out del contenido ---
    const fadeContentStyle = useAnimatedStyle(() => {
        // El fade debe ser 1 cuando está colapsado (abajo), 0.5 cuando está expandido (arriba)
        const min = CONSTANTS.STATUS_BAR_HEIGHT;
        const max = CONSTANTS.SCREEN_HEIGHT - CONSTANTS.MINI_PLAYER_HEIGHT;
        return {
            opacity: interpolate(
                animations.translateY.value,
                [min, max],
                [0, 1],
                'clamp'
            ),
        };
    });

    return (
        <Animated.View
            className="absolute top-0 left-0 right-0 shadow-lg"
            style={[
                {
                    height: CONSTANTS.MINI_PLAYER_HEIGHT,
                    shadowColor: '#000',
                    shadowOpacity: 0.12,
                    shadowRadius: 12,
                    shadowOffset: { width: 0, height: -2 },
                },
                fadeContentStyle,
            ]}
        >
            <View className="flex-1 px-6 pt-2 pb-4 justify-center">
                <View className="absolute w-10 h-1 bg-gray-300 rounded-full self-center mb-3 top-1 opacity-80" />

                <View className="flex-row items-center">
                    {/* Album Cover */}
                    <View
                        className="w-14 h-14 rounded-full mr-4 justify-center items-center border-2 border-white shadow-md"
                        style={{ backgroundColor: currentTrack.color }}
                    >
                        <Text className="text-2xl drop-shadow-md">{currentTrack.image}</Text>
                    </View>

                    {/* Track Info */}
                    <View className="flex-1">
                        <Text className="text-gray-900 text-lg font-bold min-w-10" numberOfLines={1} style={{ letterSpacing: 0.2 }}>
                            {currentTrack.title}
                        </Text>
                        <View className="flex-row items-center mt-0.5">
                            <Text className="text-gray-500 text-base mr-1" numberOfLines={1} style={{ fontWeight: '500' }}>
                                {currentTrack.artist}
                            </Text>
                            <EqualizerBars
                                isPlaying={isPlaying}
                                eqBar1={animations.eqBar1}
                                eqBar2={animations.eqBar2}
                                eqBar3={animations.eqBar3}
                                eqBar4={animations.eqBar4}
                            />
                        </View>
                    </View>

                    {/* Controls */}
                    <PlayerControls
                        isPlaying={isPlaying}
                        onTogglePlayPause={togglePlayPause}
                        onNextTrack={nextTrack}
                        onPrevTrack={prevTrack}
                        playButtonScale={animations.playButtonScale}
                        size="mini"
                    />
                </View>

                {/* Progress Bar */}
                <View className="mt-5">
                    <ProgressBar progress={progress} duration={CONSTANTS.TRACK_DURATION_SECONDS} />
                </View>
            </View>
        </Animated.View>
    );
}