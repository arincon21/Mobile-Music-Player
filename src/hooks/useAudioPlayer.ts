import { useEffect, useRef, useState } from 'react';
import { Audio, AVPlaybackStatus } from 'expo-av';
import { Track } from '@/types';

export function useAudioPlayer(tracks: Track[], initialIndex = 0) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTrackIndex, setCurrentTrackIndex] = useState(initialIndex);
    const [currentTrack, setCurrentTrack] = useState<Track | null>(tracks[initialIndex] || null);
    const [playbackInstance, setPlaybackInstance] = useState<Audio.Sound | null>(null);
    const [progress, setProgress] = useState(0);

    const isMounted = useRef(true);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
            if (playbackInstance) {
                playbackInstance.unloadAsync();
            }
        };
    }, []);

    useEffect(() => {
        if (tracks.length > 0) {
            setCurrentTrack(tracks[currentTrackIndex]);
        }
    }, [currentTrackIndex, tracks]);

    useEffect(() => {
        let isCancelled = false;
        const shouldPlay = isPlaying; // Recuerda el estado antes de cambiar
        const changeTrack = async () => {
            if (currentTrack && currentTrack.uri) {
                if (playbackInstance) {
                    await playbackInstance.unloadAsync();
                }
                const { sound } = await Audio.Sound.createAsync(
                    { uri: currentTrack.uri },
                    { shouldPlay }, // Solo reproduce si ya estaba sonando
                    onPlaybackStatusUpdate
                );
                if (!isCancelled) {
                    setPlaybackInstance(sound);
                    setProgress(0);
                } else {
                    await sound.unloadAsync();
                }
            }
        };
        changeTrack();
        return () => {
            isCancelled = true;
        };
    }, [currentTrack]);

    const loadTrack = async (uri?: string) => {
        if (!uri) return;
        if (playbackInstance) {
            await playbackInstance.unloadAsync();
        }
        const { sound } = await Audio.Sound.createAsync(
            { uri },
            { shouldPlay: isPlaying },
            onPlaybackStatusUpdate
        );
        setPlaybackInstance(sound);
    };

    const onPlaybackStatusUpdate = (status: AVPlaybackStatus) => {
        if (!status.isLoaded) return;
        if (status.didJustFinish && !status.isLooping) {
            nextTrack();
        }
        if (status.positionMillis && status.durationMillis) {
            setProgress(status.positionMillis / status.durationMillis);
        }
    };

    const play = async () => {
        if (playbackInstance) {
            await playbackInstance.playAsync();
            setIsPlaying(true);
        }
    };

    const pause = async () => {
        if (playbackInstance) {
            await playbackInstance.pauseAsync();
            setIsPlaying(false);
        }
    };

    const togglePlayPause = async () => {
        if (isPlaying) {
            await pause();
        } else {
            await play();
        }
    };

    const nextTrack = async () => {
        let nextIndex = currentTrackIndex + 1;
        if (nextIndex >= tracks.length) nextIndex = 0;
        setCurrentTrackIndex(nextIndex);
    };

    const prevTrack = async () => {
        let prevIndex = currentTrackIndex - 1;
        if (prevIndex < 0) prevIndex = tracks.length - 1;
        setCurrentTrackIndex(prevIndex);
    };

    return {
        isPlaying,
        currentTrack,
        currentTrackIndex,
        progress,
        play,
        pause,
        togglePlayPause,
        nextTrack,
        prevTrack,
        setCurrentTrackIndex, // <-- expone la función para cambiar de track manualmente
    };
}
