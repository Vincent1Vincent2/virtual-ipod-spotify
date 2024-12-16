"use client";

import { PlaybackController } from "@/services/PlaybackController";
import { PlayerContextType, PlayerProviderProps } from "@/types/player/player";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthProvider";

export const PlayerContext = createContext<PlayerContextType>({
  isPlaying: null,
  playPause: () => {},
  backTrack: () => {},
  skipTrack: () => {},
  error: null,
});

export const PlayerProvider: React.FC<PlayerProviderProps> = ({ children }) => {
  const { accessToken } = useAuth();
  const [spotifyPlayer, setSpotifyPlayer] = useState<Spotify.Player | null>(
    null
  );
  const [controller, setController] = useState<PlaybackController | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (accessToken) {
      const playbackController = new PlaybackController({
        getValidToken: () => Promise.resolve(accessToken),
      });
      setController(playbackController);
    }
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;

    const loadSpotifySDK = () => {
      if (!window.Spotify && !document.getElementById("spotify-sdk-script")) {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.id = "spotify-sdk-script"; // Prevent duplicate script injections
        script.async = true;
        document.body.appendChild(script);
      }
    };

    loadSpotifySDK();

    window.onSpotifyWebPlaybackSDKReady = async () => {
      setIsPlaying(true); // Set connecting state

      const player = new window.Spotify.Player({
        name: "Virtual iPod Spotify Player",
        getOAuthToken: (cb: (token: string) => void) => {
          cb(accessToken); // Provide the OAuth token
        },
      });

      player.addListener(
        "ready",
        async ({ device_id }: { device_id: string }) => {
          console.log("Ready with Device ID", device_id);
          setIsPlaying(false); // Set connecting state to false once ready

          // Fetch available devices and log the response to inspect its structure
          const devicesResponse = await controller?.getAvailableDevices();
          console.log("Devices response:", devicesResponse); // Log the full response

          if (devicesResponse && Array.isArray(devicesResponse.devices)) {
            // Access devices array properly
            const devices = devicesResponse.devices;
            const browserDevice = devices.find(
              (device: any) => device.name === "Virtual iPod Spotify Player"
            );
            const lastDeviceId = localStorage.getItem("lastDeviceId");

            if (browserDevice && browserDevice.id !== lastDeviceId) {
              console.log("Transferring playback to browser...");
              await controller?.transferPlayback(browserDevice.id);
              localStorage.setItem("lastDeviceId", browserDevice.id); // Store the device_id in localStorage
            }
          } else {
            console.error(
              "The devices response does not contain a valid devices array",
              devicesResponse
            );
            setError("Failed to fetch devices.");
          }
        }
      );

      player.addListener(
        "not_ready",
        ({ device_id }: { device_id: string }) => {
          console.log("Device ID is offline", device_id);
          setIsPlaying(false); // Handle disconnection
          setError("Device not ready.");
        }
      );

      player.addListener(
        "player_state_changed",
        (state: Spotify.PlaybackState | null) => {
          if (state) {
            setIsPlaying(!state.paused); // Update play/pause state
          }
        }
      );

      player.connect();
      setSpotifyPlayer(player);
    };

    return () => {
      if (spotifyPlayer) {
        spotifyPlayer.disconnect();
      }
    };
  }, [accessToken, controller]);

  const playPause = async () => {
    if (!spotifyPlayer) return;

    try {
      const state = await spotifyPlayer.getCurrentState();
      if (state?.paused) {
        await spotifyPlayer.resume();
      } else {
        await spotifyPlayer.pause();
      }
      setIsPlaying(!state?.paused); // Update play/pause state
    } catch (error) {
      console.error("Error in playPause:", error);
    }
  };

  const backTrack = async () => {
    if (spotifyPlayer) {
      try {
        await spotifyPlayer.previousTrack();
      } catch (error) {
        console.error("Error in backTrack:", error);
      }
    }
  };

  const skipTrack = async () => {
    if (spotifyPlayer) {
      try {
        await spotifyPlayer.nextTrack();
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
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => useContext(PlayerContext);
