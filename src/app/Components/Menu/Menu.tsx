"use client";
import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { getPlaylistTracks } from "@/api/user/tracks";
import { PlaybackController } from "@/helpers/PlaybackController";
import { MenuItem, MenuState } from "@/types/iPod/Screen";
import { SpotifyPlaylist } from "@/types/spotify/playlist";
import { SpotifyTrack } from "@/types/spotify/track";

const checkTokenExpiry = (): boolean => {
  const expiryTime = localStorage.getItem("token_expiry");
  return !expiryTime || Date.now() > parseInt(expiryTime);
};

export const createMenu = (
  accessToken: string | null,
  controller: PlaybackController | null
): MenuItem[] => {
  const safeApiCall = async (apiCall: () => Promise<any>) => {
    if (checkTokenExpiry()) {
      return null;
    }
    return apiCall();
  };

  const createTrackMenuItem = (
    track: SpotifyTrack,
    playlistContext: { uri: string; id: string; name: string },
    position: number
  ): MenuItem => ({
    type: "action",
    label: `${track.name} - ${formatDuration(track.duration_ms)}`,
    onClick: async () => {
      if (!controller || checkTokenExpiry()) {
        return;
      }
      try {
        await controller.play(null, {
          context_uri: playlistContext.uri,
          offset: { position },
          position_ms: 0,
        });
      } catch (error) {
        console.error("Error playing track:", error);
      }
    },
  });

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const menuItems: MenuItem[] = [
    {
      type: "navigation",
      label: "Music",
      subMenu: [
        {
          type: "action",
          label: "Playlists",
          requiresAuth: true,
          async onClick(): Promise<MenuState> {
            if (!accessToken) throw new Error("No access token");

            const playlists = await safeApiCall(() =>
              getUserPlaylists(accessToken)
            );
            if (!playlists)
              throw new Error("No playlist found, try signing out and in");

            return {
              items: playlists.map((playlist: SpotifyPlaylist) => ({
                type: "action",
                label: playlist.name,
                onClick: async () => {
                  if (!accessToken) return null;
                  const tracks = await safeApiCall(() =>
                    getPlaylistTracks(accessToken, playlist.id)
                  );
                  if (!tracks) return null;

                  return {
                    items: tracks.map(
                      (track: { track: SpotifyTrack }, index: number) =>
                        createTrackMenuItem(
                          track.track,
                          {
                            uri: `spotify:playlist:${playlist.id}`,
                            id: playlist.id,
                            name: playlist.name,
                          },
                          index
                        )
                    ),
                    selectedIndex: 0,
                    title: playlist.name,
                    currentPath: ["Music", "Playlists", playlist.name],
                  };
                },
              })),
              selectedIndex: 0,
              title: "Playlists",
              currentPath: ["Music", "Playlists"],
            };
          },
        },
      ],
    },
    {
      type: "action",
      label: "Browse Global Playlists",
      requiresAuth: true,
      async onClick(): Promise<MenuState> {
        if (!accessToken) throw new Error("No access token");

        const playlists = await safeApiCall(() => getAllPlaylists());
        if (!playlists)
          throw new Error("No playlist found, try signing out and in");

        return {
          items: playlists.map(
            (playlist: { playlist_name: string; playlist_id: string }) => ({
              type: "action",
              label: playlist.playlist_name,
              onClick: async () => {
                if (!accessToken) return null;
                const tracks = await safeApiCall(() =>
                  getPlaylistTracks(accessToken, playlist.playlist_id)
                );
                if (!tracks) return null;

                return {
                  items: tracks.map(
                    (track: { track: SpotifyTrack }, index: number) =>
                      createTrackMenuItem(
                        track.track,
                        {
                          uri: `spotify:playlist:${playlist.playlist_id}`,
                          id: playlist.playlist_id,
                          name: playlist.playlist_name,
                        },
                        index
                      )
                  ),
                  selectedIndex: 0,
                  title: playlist.playlist_name,
                  currentPath: [
                    "Browse Global Playlists",
                    playlist.playlist_name,
                  ],
                };
              },
            })
          ),
          selectedIndex: 0,
          title: "Global Playlists",
          currentPath: ["Browse Global Playlists"],
        };
      },
    },
    {
      type: "action",
      label: "Photos",
      onClick: () => {},
    },
    {
      type: "action",
      label: "Videos",
      onClick: () => {},
    },
    {
      type: "action",
      label: "Extras",
      onClick: () => {},
    },
    {
      type: "action",
      label: "Settings",
      onClick: () => {},
    },
    {
      type: "action",
      label: "Shuffle Songs",
      onClick: () => {},
    },
    {
      type: "action",
      label: "Sleep",
      onClick: () => {},
    },
  ];

  return menuItems.filter((item) => !(item.requiresAuth && !accessToken));
};
