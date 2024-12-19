"use client";

import { PlaybackController } from "@/services/PlaybackController";
import { PlayerContextType, PlayerProviderProps } from "@/types/player/player";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "./AuthProvider";

export const PlayerContext = createContext<PlayerContextType>({
  isPlaying: null,
  playPause: () => {},
  backTrack: () => {},
  skipTrack: () => {},
  error: null,
  controller: null,
});

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  const [controller, setController] = useState<PlaybackController | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);
  const initializingRef = useRef(false);

  useEffect(() => {
    if (!accessToken || initializingRef.current) return;

    const initializeSystem = async () => {
      initializingRef.current = true;
      try {
        const player = await new Promise<Spotify.Player>((resolve) => {
          window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
              name: "Virtual iPod Spotify Player",
              getOAuthToken: (cb: (token: string) => void) => cb(accessToken),
            });
            resolve(player);
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
          console.log("Ready with Device ID", device_id);
          const currentState = await playbackController.getCurrentState();
          setIsPlaying(currentState.is_playing);

          try {
            const devicesResponse =
              await playbackController.getAvailableDevices();
            console.log("Available devices:", devicesResponse);

            if (devicesResponse?.devices?.length) {
              const browserDevice = devicesResponse.devices.find(
                (device: any) => device.name === "Virtual iPod Spotify Player"
              );

              if (browserDevice) {
                console.log("Found browser device:", browserDevice);
                console.log("Transferring playback...");
                await playbackController.transferPlayback(browserDevice.id);
                console.log("Playback transferred successfully");
              } else {
                console.log("Browser device not found in available devices");
              }
            } else {
              console.log("No devices available");
            }
          } catch (error) {
            console.error("Error setting up device:", error);
            setError("Failed to set up device");
          }
        });

        player.addListener("not_ready", ({ device_id }) => {
          console.log("Device ID is offline", device_id);
          setIsPlaying(false);
          setError("Device not ready");
        });

        player.addListener("player_state_changed", async (state) => {
          if (state) {
            setIsPlaying(!state.paused);
            const currentState = await playbackController.getCurrentState();
            setIsPlaying(currentState.is_playing);
          }
        });

        player.connect();
        setSpotifyPlayer(player);
        setController(playbackController);
      } catch (error) {
        console.error("Failed to initialize system:", error);
        setError("Failed to initialize system");
      } finally {
        initializingRef.current = false;
      }
    };

    initializeSystem();

    return () => {
      if (spotifyPlayer) {
        spotifyPlayer.disconnect();
      }
    };
  }, [accessToken]);

  const playPause = async () => {
    if (!controller) return;
    try {
      await controller.togglePlayback();
      const state = await controller.getCurrentState();
      setIsPlaying(state.is_playing);
    } catch (error) {
      console.error("Error in playPause:", error);
      setError("Playback control failed");
    }
  };

  const backTrack = async () => {
    if (controller) {
      try {
        await controller.previousTrack();
      } catch (error) {
        console.error("Error in backTrack:", error);
      }
    }
  };

  const skipTrack = async () => {
    if (controller) {
      try {
        await controller.nextTrack();
      } catch (error) {
        console.error("Error in skipTrack:", error);
      }
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        isPlaying,
        playPause,
        backTrack,
        skipTrack,
        error,
        controller,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
