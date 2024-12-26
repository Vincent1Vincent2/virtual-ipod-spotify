"use client";

import { PlaybackController } from "@/helpers/PlaybackController";
import { PlayerContextType, PlayerProviderProps } from "@/types/player/player";
import { SpotifyTrack } from "@/types/spotify/track";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

export const PlayerContext = createContext<PlayerContextType>({
  isPlaying: null,
  playPause: async () => {}, // Updated to indicate async functions
  backTrack: async () => {},
  skipTrack: async () => {},
  error: null,
  controller: null,
  currentTrack: null,
});

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  const [controller, setController] = useState<PlaybackController | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const isActionPending = useRef(false); // Prevent overlapping actions
  const initializingRef = useRef(false);
  const [currentTrack, setCurrentTrack] = useState<SpotifyTrack | null>(null);
  const [persistentCurrentTrack, setPersistentCurrentTrack] =
    useState<SpotifyTrack | null>(null);

  useEffect(() => {
    const storedTrack = localStorage.getItem("currentTrack");
    if (storedTrack) {
      setPersistentCurrentTrack(JSON.parse(storedTrack));
    }
  }, []);

  useEffect(() => {
    if (currentTrack) {
      setPersistentCurrentTrack(currentTrack);
      localStorage.setItem("currentTrack", JSON.stringify(currentTrack));
    }
  }, [currentTrack]);

  const initializeSpotifyPlayer = useCallback(async () => {
    if (!accessToken || initializingRef.current) return;

    initializingRef.current = true;

    try {
      const player = await new Promise<Spotify.Player>((resolve) => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          const playerInstance = new window.Spotify.Player({
            name: "Virtual iPod Spotify Player",
            getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
          });
          resolve(playerInstance);
        };

        if (!document.getElementById("spotify-sdk-script")) {
          const script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.id = "spotify-sdk-script";
          document.body.appendChild(script);
        }
      });

      const playbackController = new PlaybackController({
        getValidToken: () => Promise.resolve(accessToken),
      });
      await playbackController.initialize();

      player.addListener("ready", async ({ device_id }) => {
        console.log("Player ready with device ID:", device_id);
        try {
          await playbackController.transferPlayback(device_id);
          const state = await playbackController.getCurrentState();
          setIsPlaying(state?.is_playing ?? false);
        } catch (setupError) {
          console.error("Error setting up playback:", setupError);
          setError("Failed to set up playback");
        }
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device is offline:", device_id);
        setIsPlaying(false);
        setError("Device not ready");
      });

      player.addListener("player_state_changed", async (state) => {
        if (isActionPending.current) return;

        try {
          const currentState = await playbackController.getCurrentState();
          setIsPlaying(currentState?.is_playing ?? false);
          if (currentState?.item) {
            setCurrentTrack(currentState.item as SpotifyTrack);
            playbackController.setCurrentTrack(
              currentState.item as SpotifyTrack
            );
          }
        } catch (stateError) {
          console.error("Error fetching player state:", stateError);
        }
      });

      player.connect();
      setSpotifyPlayer(player);
      setController(playbackController);
    } catch (initError) {
      console.error("Error initializing Spotify player:", initError);
      setError("Initialization failed");
    } finally {
      initializingRef.current = false;
    }
  }, [accessToken]);

  useEffect(() => {
    initializeSpotifyPlayer();

    return () => {
      spotifyPlayer?.disconnect();
    };
  }, [initializeSpotifyPlayer, spotifyPlayer]);

  const handlePlaybackAction = useCallback(
    async (action: () => Promise<void>, errorMessage: string) => {
      if (!controller || isActionPending.current) return; // Prevent overlapping actions
      isActionPending.current = true;

      try {
        await action();
        const state = await controller.getCurrentState();
        setIsPlaying(state?.is_playing ?? null);
      } catch (playbackError) {
        console.error(errorMessage, playbackError);
        setError(errorMessage);
      } finally {
        isActionPending.current = false;
      }
    },
    [controller]
  );

  const playPause = useCallback(
    () =>
      handlePlaybackAction(
        () => controller!.togglePlayback(),
        "Error toggling playback"
      ),
    [controller, handlePlaybackAction]
  );

  const backTrack = useCallback(
    () =>
      handlePlaybackAction(
        () => controller!.previousTrack(),
        "Error going to previous track"
      ),
    [controller, handlePlaybackAction]
  );

  const skipTrack = useCallback(
    () =>
      handlePlaybackAction(
        () => controller!.nextTrack(),
        "Error skipping track"
      ),
    [controller, handlePlaybackAction]
  );

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        playPause,
        backTrack,
        skipTrack,
        error,
        controller,
        currentTrack: persistentCurrentTrack,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
