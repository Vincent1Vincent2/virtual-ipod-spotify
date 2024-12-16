declare global {
  interface Window {
    Spotify: typeof Spotify;
    onSpotifyWebPlaybackSDKReady?: () => void;
  }

  namespace Spotify {
    interface PlaybackState {
      paused: boolean;
      position: number;
      duration: number;
      track_window: {
        current_track: {
          uri: string;
          name: string;
          artists: Array<{ name: string }>;
        };
      };
    }

    interface Player {
      new (options: PlayerOptions): Player;

      connect(): Promise<boolean>;
      disconnect(): void;
      addListener(
        event: string,
        callback: (event: any) => void
      ): boolean | void;
      removeListener(event: string): void;
      getCurrentState(): Promise<PlaybackState | null>;
      resume(): Promise<void>;
      pause(): Promise<void>;
      nextTrack(): Promise<void>;
      previousTrack(): Promise<void>;
    }

    interface PlayerOptions {
      name: string;
      getOAuthToken: (cb: (token: string) => void) => void;
      volume?: number;
    }
  }
}

export {};
