export interface Track {
    id: number;
    title: string;
    artist: string;
    genre: string;
    color: string;
    image: string;
}

export interface PlayerState {
    isExpanded: boolean;
    isPlaying: boolean;
    currentTrackIndex: number;
    progress: number;
    isDarkMode: boolean;
    likedTracks: Set<number>;
    playlistTracks: Track[];
}

export interface AnimationValues {
    translateY: any;
    playButtonScale: any;
    heartScale: any;
    eqBar1: any;
    eqBar2: any;
    eqBar3: any;
    eqBar4: any;
}