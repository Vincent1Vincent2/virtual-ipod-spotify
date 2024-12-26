"use client";
import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { getPlaylistTracks } from "@/api/user/tracks";
import { PlaybackController } from "@/helpers/PlaybackController";
import { MenuItem, MenuState } from "@/types/iPod/Screen";
import { SpotifyPlaylist } from "@/types/spotify/playlist";
import { SpotifyTrack } from "@/types/spotify/track";

export const createMenu = (
  accessToken: string | null,
  controller: PlaybackController | null
): MenuItem[] => {
  const createTrackMenuItem = (
    track: SpotifyTrack,
    playlistContext: { uri: string; id: string; name: string },
    position: number
  ): MenuItem => ({
    type: "action",
    label: `${track.name} - ${formatDuration(track.duration_ms)}`,
    onClick: async () => {
      if (!controller) return;
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

  const createPlaylistMenuItem = (playlist: SpotifyPlaylist): MenuItem => ({
    type: "action",
    label: playlist.name,
    onClick: async () => {
      if (!accessToken) return;
      const tracks = await getPlaylistTracks(accessToken, playlist.id);
      return {
        items: tracks.map((item: any, index: number) =>
          createTrackMenuItem(
            item.track,
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
  });

  const createGlobalPlaylistMenuItem = (): MenuItem => ({
    type: "action",
    label: "Browse Global Playlists",
    requiresAuth: true,
    async onClick(): Promise<MenuState> {
      if (!accessToken) throw new Error("No access token");

      const playlists = await getAllPlaylists();
      return {
        items: playlists.map((playlist) => ({
          type: "action",
          label: playlist.playlist_name,
          onClick: async () => {
            const tracks = await getPlaylistTracks(
              accessToken,
              playlist.playlist_id
            );
            return {
              items: tracks.map((item: any, index: number) =>
                createTrackMenuItem(
                  item.track,
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
              currentPath: ["Browse Global Playlists", playlist.playlist_name],
            };
          },
        })),
        selectedIndex: 0,
        title: "Global Playlists",
        currentPath: ["Browse Global Playlists"],
      };
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

            const playlists = await getUserPlaylists(accessToken);
            return {
              items: playlists.map((playlist) => ({
                type: "action",
                label: playlist.name,
                onClick: async () => {
                  const tracks = await getPlaylistTracks(
                    accessToken,
                    playlist.id
                  );
                  return {
                    items: tracks.map((item: any, index: number) =>
                      createTrackMenuItem(
                        item.track,
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
    createGlobalPlaylistMenuItem(),
    {
      type: "action",
      label: "Photos",
      onClick: (): void => {
        console.log("Photos clicked");
      },
    },
    {
      type: "action",
      label: "Videos",
      onClick: (): void => {
        console.log("Videos clicked");
      },
    },
    {
      type: "action",
      label: "Extras",
      onClick: (): void => {
        console.log("Extras clicked");
      },
    },
    {
      type: "action",
      label: "Settings",
      onClick: (): void => {
        console.log("Settings clicked");
      },
    },
    {
      type: "action",
      label: "Shuffle Songs",
      onClick: (): void => {
        console.log("Shuffle clicked");
      },
    },
    {
      type: "action",
      label: "Sleep",
      onClick: (): void => {
        console.log("Sleep clicked");
      },
    },
  ];

  return menuItems.filter((item) => !(item.requiresAuth && !accessToken));
};
