import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export default function Header({ isDarkMode, onToggleTheme }: HeaderProps) {
    return (
        <View className="flex-row items-center justify-between p-4 mb-2">
            <View className="w-8" />
            <View className="items-center">
                <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} text-xs opacity-70`}>
                    Playing from
                </Text>
                <View className="flex-row items-center mt-0.5">
                    <Text className={`${isDarkMode ? 'text-white' : 'text-gray-800'} font-semibold text-sm`}>
                        Polk Top Tracks this Week
                    </Text>
                    <Ionicons
                        name="chevron-down"
                        size={14}
                        color={isDarkMode ? "white" : "#1F2937"}
                        className="ml-1"
                    />
                </View>
            </View>
            <TouchableOpacity
                onPress={onToggleTheme}
                className="p-2"
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            >
                <Ionicons
                    name={isDarkMode ? "sunny" : "moon"}
                    size={22}
                    color={isDarkMode ? "white" : "#1F2937"}
                />
            </TouchableOpacity>
        </View>
    );
}