export interface PlayerState {
  isPlaying: boolean;
  error: string | null;
}
export interface PlayerContextType {
  isPlaying: boolean | null;
  playPause: () => void;
  backTrack: () => void;
  skipTrack: () => void;
  error: string | null;
}

export interface PlayerProviderProps {
  children: React.ReactNode;
}

export interface SpotifyDeviceResponse {
  device_id: string;
}

export interface SpotifyPlaybackState {
  progress_ms: any;
  item: any;
  is_playing: any;
  paused: boolean;
}
