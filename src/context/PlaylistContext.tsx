import React, { createContext, useContext, useState, ReactNode } from 'react';
import { playlistTracks as initialTracks } from '../data/playlistData';
import { Track } from '../types';

interface PlaylistContextType {
  playlistTracks: Track[];
  setPlaylistTracks: React.Dispatch<React.SetStateAction<Track[]>>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider = ({ children }: { children: ReactNode }) => {
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>(initialTracks);

  return (
    <PlaylistContext.Provider value={{ playlistTracks, setPlaylistTracks }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (!context) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};
