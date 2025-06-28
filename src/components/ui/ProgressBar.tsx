import React from 'react';
import { View, Text } from 'react-native';
import { formatTime } from '../../utils/formatTime';

interface ProgressBarProps {
    progress: number;
    duration: number;
    isDarkMode?: boolean;
}

export default function ProgressBar({ progress, duration, isDarkMode = false }: ProgressBarProps) {
    return (
        <View className="mb-10">
            <View className="h-1 bg-gray-300 rounded-full mb-2">
                <View
                
                    className="h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress * 100}%`, backgroundColor: "#1f2937" }}
                />
            </View>
            <View className="flex-row justify-between">
                <Text className="text-gray-400 text-xs">
                    {formatTime(progress * duration)}
                </Text>
                <Text className="text-gray-400 text-xs">
                    {formatTime(duration)}
                </Text>
            </View>
        </View>
    );
}