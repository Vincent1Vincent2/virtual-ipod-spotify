"use client";

import { PlaybackController } from "@/services/PlaybackController";
import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthProvider";

interface PlayerContextType {
  isPlaying: boolean | null;
  playPause: () => void;
  backTrack: () => void;
  skipTrack: () => void;
}

export const PlayerContext = createContext<PlayerContextType>({
  isPlaying: null,
  playPause: () => {},
  backTrack: () => {},
  skipTrack: () => {},
});

export function PlayerProvider({ children }: { children: React.ReactNode }) {
  const { accessToken } = useContext(AuthContext);
  const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
  const [playbackController, setPlaybackController] =
    useState<PlaybackController | null>(null);

  useEffect(() => {
    if (accessToken) {
      const controller = new PlaybackController({
        getValidToken: async () => accessToken,
      });
      setPlaybackController(controller);

      // Fetch initial playback state
      controller.getCurrentState().then((state) => {
        setIsPlaying(state.is_playing);
      });
    }
  }, [accessToken]);

  const playPause = async () => {
    if (!playbackController) return;

    try {
      const state = await playbackController.getCurrentState();
      if (state.is_playing) {
        await playbackController.pause();
        setIsPlaying(false);
      } else {
        await playbackController.play();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error("Failed to toggle play/pause", error);
    }
  };

  const backTrack = async () => {
    if (!playbackController) return;
    try {
      await playbackController.previousTrack();
    } catch (error) {
      console.error("Failed to skip to previous track", error);
    }
  };

  const skipTrack = async () => {
    if (!playbackController) return;
    try {
      await playbackController.nextTrack();
    } catch (error) {
      console.error("Failed to skip to next track", error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{ isPlaying, playPause, backTrack, skipTrack }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
