import { useCallback, useState, useEffect } from 'react';
import { runOnJS } from 'react-native-reanimated';
import { triggerHapticFeedback } from '../utils/haptics';
import { usePlaylist } from '../context/PlaylistContext';
import { CONSTANTS } from '../utils/constants';
import * as Haptics from 'expo-haptics';
import * as MediaLibrary from 'expo-media-library';

export const usePlayer = () => {
    const { playlistTracks } = usePlaylist();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [likedTracks, setLikedTracks] = useState(new Set([1, 3]));

    const currentTrack = playlistTracks[currentTrackIndex];

    const changeTrack = useCallback((direction: 'next' | 'prev') => {
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
    }, [currentTrackIndex, isPlaying, playlistTracks.length]);

    const nextTrack = useCallback(() => changeTrack('next'), [changeTrack]);
    const prevTrack = useCallback(() => changeTrack('prev'), [changeTrack]);

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
    }, [isPlaying, currentTrackIndex, nextTrack]);

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

export const useLoadDeviceTracks = (setPermissionStatus?: (status: 'unknown' | 'granted' | 'denied') => void) => {
  const { setPlaylistTracks } = usePlaylist();

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (setPermissionStatus) setPermissionStatus(status === 'granted' ? 'granted' : 'denied');
      if (status !== 'granted') return;
      const media = await MediaLibrary.getAssetsAsync({ mediaType: 'audio', first: 9999 });
      const mp3s = media.assets.filter(asset => asset.filename.endsWith('.mp3'));
      setPlaylistTracks(mp3s.map((asset, idx) => ({
        id: idx + 1,
        title: asset.filename.replace('.mp3', ''),
        artist: 'Desconocido',
        genre: '',
        color: '#374151',
        image: '🎵',
        uri: asset.uri,
      })));
    })();
  }, [setPlaylistTracks, setPermissionStatus]);
};