import React, { useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EqualizerBars from '../ui/EqualizerBars';
import { Track } from '../../types';
import { triggerHapticFeedback } from '@/utils/haptics';
import { useAnimations } from '@/hooks/useAnimations';

interface TrackItemProps {
    track: Track;
    index: number;
    isCurrentTrack: boolean;
    isPlaying: boolean;
    isDarkMode: boolean;
    isLiked: boolean;
    onPress: () => void;
    onToggleLike: () => void;
}

const TrackItem = React.memo(function TrackItem({
    track,
    isCurrentTrack,
    isPlaying,
    isDarkMode,
    isLiked,
    onPress,
    onToggleLike,
}: TrackItemProps) {
    const animations = useAnimations(isPlaying);

    const handlePress = useCallback(() => {
        triggerHapticFeedback();
        onPress();
    }, [onPress]);

    const handleToggleLike = useCallback(() => {
        triggerHapticFeedback();
        onToggleLike();
    }, [onToggleLike]);

    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}
            className={`flex-row items-center p-2 rounded-lg mb-2 ${isCurrentTrack ? (isDarkMode ? 'bg-slate-700' : 'bg-gray-200') : ''}`}
            accessibilityRole="button"
            accessibilityLabel={`Play ${track.title} by ${track.artist}`}
            accessibilityState={{ selected: isCurrentTrack }}
        >
            <View
                className="w-12 h-12 mr-4 justify-center items-center rounded-lg"
                style={{ backgroundColor: track.color }}
            >
                <Text className="text-2xl">{track.image}</Text>
            </View>

            <View className="flex-1">
                <Text
                    className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-base ${isCurrentTrack ? 'text-cyan-400' : ''
                        }`}
                >
                    {track.title}
                </Text>
                <Text className={`${isDarkMode ? 'text-white' : 'text-gray-600'} text-sm`}>
                    {track.artist}
                </Text>
            </View>

            {isCurrentTrack && (
                <View className="mr-2">
                    <EqualizerBars
                        isPlaying={isPlaying}
                        eqBar1={animations.eqBar1}
                        eqBar2={animations.eqBar2}
                        eqBar3={animations.eqBar3}
                        eqBar4={animations.eqBar4}
                        color={`${isDarkMode ? 'white' : '#4b5563'}`}
                    />
                </View>
            )}

            <TouchableOpacity
                onPress={handleToggleLike}
                className="p-2"
                accessibilityRole="button"
                accessibilityLabel={isLiked ? `Unlike ${track.title}` : `Like ${track.title}`}
            >
                <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={20}
                    color={isLiked ? "#EF4444" : "#6B7280"}
                />
            </TouchableOpacity>
        </TouchableOpacity>
    );
});
export default TrackItem;