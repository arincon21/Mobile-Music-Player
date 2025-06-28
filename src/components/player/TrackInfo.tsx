import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Track } from '../../types';

interface TrackInfoProps {
    track: Track;
}

export default function TrackInfo({ track }: TrackInfoProps) {
    return (
        <View className="items-center mb-10">
            <Animated.View
                className="w-80 h-80 self-center justify-center items-center rounded-[50px] mb-12 mt-4"
                style={{
                    backgroundColor: track.color,
                    shadowColor: track.color,
                    shadowRadius: 20,
                    shadowOpacity: 0.5,
                }}
            >
                <Text className="text-white text-5xl font-bold">{track.image}</Text>
            </Animated.View>

            <Text className="text-gray-800 text-2xl font-bold mb-2 text-center">
                {track.title}
            </Text>
            <Text className="text-gray-500 text-lg text-center">
                {track.artist}
            </Text>
        </View>
    );
}