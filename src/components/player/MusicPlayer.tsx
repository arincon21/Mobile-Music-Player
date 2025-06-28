import React from 'react';
import { View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import MiniPlayer from './MiniPlayer';
import ExpandedPlayer from './ExpandedPlayer';
import { useAnimations } from '../../hooks/useAnimations';
import { useGestures } from '../../hooks/useGestures';
import { PlayerState } from '../../types';

interface MusicPlayerProps extends PlayerState {
    togglePlayPause: () => void;
    nextTrack: () => void;
    prevTrack: () => void;
    toggleLike: (trackId: number) => void;
    switchTrack: (index: number) => void;
    // Add missing properties
    setIsExpanded: (expanded: boolean) => void;
    currentTrack: any; // Replace 'any' with your actual track type
}

export default function MusicPlayer(props: MusicPlayerProps) {
    const animations = useAnimations(props.isPlaying);

    const { panGesture } = useGestures({
        translateY: animations.translateY,
        onExpand: () => props.setIsExpanded(true),
        onCollapse: () => props.setIsExpanded(false),
    });

    const animatedPlayerStyle = animations.translateY ? {
        transform: [{ translateY: animations.translateY }],
    } : {};

    return (
        <GestureDetector gesture={panGesture}>
            <Animated.View style={animatedPlayerStyle}>
                {!props.isExpanded && (
                    <MiniPlayer {...props} animations={animations} />
                )}
                <ExpandedPlayer {...props} animations={animations} />
            </Animated.View>
        </GestureDetector>
    );
}