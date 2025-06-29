import React, { memo } from 'react';
import { ScrollView } from 'react-native';
import TrackItem from './TrackItem';
import { Track } from '../../types';
import { CONSTANTS } from '../../utils/constants';

interface TrackListProps {
    tracks: Track[];
    currentTrackIndex: number;
    isPlaying: boolean;
    isDarkMode: boolean;
    likedTracks: Set<number>;
    onTrackSelect: (index: number) => void;
    onToggleLike: (trackId: number) => void;
}

export default memo(function TrackList({
    tracks,
    currentTrackIndex,
    isPlaying,
    isDarkMode,
    likedTracks,
    onTrackSelect,
    onToggleLike,
}: TrackListProps) {
    return (
        <ScrollView
            className="px-4"
            contentContainerStyle={{ paddingBottom: CONSTANTS.MINI_PLAYER_HEIGHT + 40 }}
        >
            {tracks.map((track, index) => (
                <TrackItem
                    key={track.id}
                    track={track}
                    index={index}
                    isCurrentTrack={currentTrackIndex === index}
                    isPlaying={isPlaying}
                    isDarkMode={isDarkMode}
                    isLiked={likedTracks.has(track.id)}
                    onPress={() => onTrackSelect(index)}
                    onToggleLike={() => onToggleLike(track.id)}
                />
            ))}
        </ScrollView>
    );
});