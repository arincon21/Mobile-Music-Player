import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface PlaylistHeaderProps {
    isDarkMode: boolean;
    title: string;
}

export default function PlaylistHeader({ isDarkMode, title }: PlaylistHeaderProps) {
    return (
        <View className="items-center">
            <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-xs opacity-70`}>
                Playing from
            </Text>
            <View className="flex-row items-center mt-0.5">
                <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-sm`}>
                    {title}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={14}
                    color={isDarkMode ? "white" : "#1F2937"}
                    className="ml-1"
                />
            </View>
        </View>
    );
}