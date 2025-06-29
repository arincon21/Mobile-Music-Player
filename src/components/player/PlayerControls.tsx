import React, { memo } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated from 'react-native-reanimated';

interface PlayerControlsProps {
    isPlaying: boolean;
    onTogglePlayPause: () => void;
    onNextTrack: () => void;
    onPrevTrack: () => void;
    playButtonScale: any;
    size: 'mini' | 'full';
}

export default memo(function PlayerControls({
    isPlaying,
    onTogglePlayPause,
    onNextTrack,
    onPrevTrack,
    playButtonScale,
    size,
}: PlayerControlsProps) {
    const isMini = size === 'mini';
    const buttonSize = isMini ? 22 : 32;
    const playButtonSize = isMini ? 55 : 75;
    const playIconSize = isMini ? 26 : 32;

    if (isMini) {
        return (
            <View className="flex-row items-center ml-3">
                <TouchableOpacity onPress={onPrevTrack} className="p-3 mr-1">
                    <Ionicons name="play-skip-back" size={buttonSize} color="#1F2937" />
                </TouchableOpacity>

                <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
                    <TouchableOpacity
                        onPress={onTogglePlayPause}
                        className="bg-gray-100 rounded-full items-center justify-center"
                        style={{ width: playButtonSize, height: playButtonSize }}
                    >
                        <Ionicons
                            name={isPlaying ? "pause" : "play"}
                            size={playIconSize}
                            color="#1F2937"
                            style={{ paddingLeft: isPlaying ? 0 : 3 }}
                        />
                    </TouchableOpacity>
                </Animated.View>

                <TouchableOpacity onPress={onNextTrack} className="p-3">
                    <Ionicons name="play-skip-forward" size={buttonSize} color="#1F2937" />
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View className="flex-row items-center justify-between mb-10 px-5">
            <TouchableOpacity className="p-2">
                <Ionicons name="shuffle" size={24} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity onPress={onPrevTrack} className="p-2">
                <Ionicons name="play-skip-back" size={buttonSize} color="#1F2937" />
            </TouchableOpacity>

            <Animated.View style={{ transform: [{ scale: playButtonScale }] }}>
                <TouchableOpacity
                    onPress={onTogglePlayPause}
                    className="bg-gray-100 rounded-full items-center justify-center"
                    style={{ width: playButtonSize, height: playButtonSize }}
                >
                    <Ionicons
                        name={isPlaying ? "pause" : "play"}
                        size={playIconSize}
                        color="#1F2937"
                        style={{ paddingLeft: isPlaying ? 0 : 3 }}
                    />
                </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity onPress={onNextTrack} className="p-2">
                <Ionicons name="play-skip-forward" size={buttonSize} color="#1F2937" />
            </TouchableOpacity>

            <TouchableOpacity className="p-2">
                <Ionicons name="repeat" size={24} color="#9CA3AF" />
            </TouchableOpacity>
        </View>
    );
});