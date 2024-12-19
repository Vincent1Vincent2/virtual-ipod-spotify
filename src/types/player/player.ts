import { PlaybackController } from "@/services/PlaybackController";

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
  controller: PlaybackController | null;
}

export interface SpotifyPlaybackState {
  is_playing: boolean;
  item: {
    uri: string;
    name: string;
    duration_ms: number;
  } | null;
  progress_ms: number;
  device: {
    id: string;
    name: string;
  };
}

export interface PlayerProviderProps {
  children: React.ReactNode;
}

export interface SpotifyDeviceResponse {
  device_id: string;
}
