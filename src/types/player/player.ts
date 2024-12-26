import { PlaybackController } from "@/helpers/PlaybackController";
import { SpotifyTrack } from "../spotify/track";

export interface PlayerState {
  isPlaying: boolean;
  error: string | null;
}
export interface PlayerContextType {
  isPlaying: boolean | null;
  playPause: () => Promise<void>;
  backTrack: () => Promise<void>;
  skipTrack: () => Promise<void>;
  error: string | null;
  controller: PlaybackController | null;
  currentTrack: SpotifyTrack | null;
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
