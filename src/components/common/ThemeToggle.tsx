import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThemeToggleProps {
    isDarkMode: boolean;
    onToggle: () => void;
}

export default function ThemeToggle({ isDarkMode, onToggle }: ThemeToggleProps) {
    return (
        <TouchableOpacity
            onPress={onToggle}
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
    );
}