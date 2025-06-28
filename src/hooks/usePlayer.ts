import { useState, useEffect } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { triggerHapticFeedback } from '../utils/haptics';
import { playlistTracks } from '../data/playlistData';
import { CONSTANTS } from '../utils/constants';
import { Track } from '../types';
import * as Haptics from 'expo-haptics';

export const usePlayer = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [likedTracks, setLikedTracks] = useState(new Set([1, 3]));

    const currentTrack = playlistTracks[currentTrackIndex];

    // Auto-progress simulation
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isPlaying) {
            interval = setInterval(() => {
                setProgress(p => {
                    const newProgress = p + 1 / CONSTANTS.TRACK_DURATION_SECONDS;
                    if (newProgress >= 1) {
                        runOnJS(nextTrack)();
                        return 0;
                    }
                    return newProgress;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isPlaying, currentTrackIndex]);

    const togglePlayPause = () => {
        triggerHapticFeedback(Haptics.ImpactFeedbackStyle.Medium);
        setIsPlaying(!isPlaying);
    };

    const toggleLike = (trackId: number) => {
        triggerHapticFeedback();
        setLikedTracks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(trackId)) newSet.delete(trackId);
            else newSet.add(trackId);
            return newSet;
        });
    };

    const switchTrack = (index: number) => {
        if (index === currentTrackIndex) return;
        triggerHapticFeedback();
        setCurrentTrackIndex(index);
        setProgress(0);
        if (!isPlaying) setIsPlaying(true);
    };

    const changeTrack = (direction: 'next' | 'prev') => {
        triggerHapticFeedback();
        let newIndex;
        if (direction === 'next') {
            newIndex = (currentTrackIndex + 1) % playlistTracks.length;
        } else {
            newIndex = (currentTrackIndex - 1 + playlistTracks.length) % playlistTracks.length;
        }
        setCurrentTrackIndex(newIndex);
        setProgress(0);
        if (!isPlaying) setIsPlaying(true);
    };

    const nextTrack = () => changeTrack('next');
    const prevTrack = () => changeTrack('prev');

    return {
        // State
        isExpanded,
        setIsExpanded,
        isPlaying,
        setIsPlaying,
        currentTrackIndex,
        setCurrentTrackIndex,
        progress,
        setProgress,
        isDarkMode,
        setIsDarkMode,
        likedTracks,
        setLikedTracks,
        playlistTracks,
        currentTrack,

        // Actions
        togglePlayPause,
        toggleLike,
        switchTrack,
        nextTrack,
        prevTrack,
    };
};