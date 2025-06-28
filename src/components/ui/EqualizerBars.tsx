import React from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, interpolate } from 'react-native-reanimated';

interface EqualizerBarsProps {
    isPlaying: boolean;
    eqBar1: any;
    eqBar2: any;
    eqBar3: any;
    eqBar4: any;
    color?: string;
}

export default function EqualizerBars({
    isPlaying,
    eqBar1,
    eqBar2,
    eqBar3,
    eqBar4,
    color = '#4b5563'
}: EqualizerBarsProps) {
    const bar1Style = useAnimatedStyle(() => ({
        height: interpolate(eqBar1.value, [0, 1], [4, 16]),
    }));

    const bar2Style = useAnimatedStyle(() => ({
        height: interpolate(eqBar2.value, [0, 1], [4, 16]),
    }));

    const bar3Style = useAnimatedStyle(() => ({
        height: interpolate(eqBar3.value, [0, 1], [4, 16]),
    }));

    const bar4Style = useAnimatedStyle(() => ({
        height: interpolate(eqBar4.value, [0, 1], [4, 16]),
    }));

    if (!isPlaying) return null;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', gap: 4, marginLeft: 8, height: 16 }}>
            <Animated.View style={[bar1Style, {backgroundColor: color, width: 5, borderRadius: 2}]} />
            <Animated.View style={[bar2Style, {backgroundColor: color, width: 5, borderRadius: 2}]} />
            <Animated.View style={[bar3Style, {backgroundColor: color, width: 5, borderRadius: 2}]} />
            <Animated.View style={[bar4Style, {backgroundColor: color, width: 5, borderRadius: 2}]} />
        </View>
    );
}