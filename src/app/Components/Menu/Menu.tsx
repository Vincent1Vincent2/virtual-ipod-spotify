import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { getPlaylistTracks, getUserSavedTracks } from "@/api/user/tracks";
import { PlaybackController } from "@/helpers/PlaybackController";
import { MenuItem, MenuState } from "@/types/iPod/Screen";
import { SpotifyPlaylist } from "@/types/spotify/playlist";
import { SpotifyTrack } from "@/types/spotify/track";
import { formatDuration } from "@/utils/Format";

const checkTokenExpiry = (): boolean => {
  const expiryTime = localStorage.getItem("token_expiry");
  return !expiryTime || Date.now() > parseInt(expiryTime);
};

export const createMenu = (
  accessToken: string | null,
  controller: PlaybackController | null,
  currentPath: string[] = []
): MenuItem[] => {
  const safeApiCall = async <T,>(
    apiCall: () => Promise<T>
  ): Promise<T | null> => {
    if (checkTokenExpiry()) return null;
    return apiCall();
  };

  interface PlaybackContext {
    type?: "playlist" | "album" | "track" | "saved_tracks";
    tracks?: { track: SpotifyTrack }[];
    id?: string;
    name?: string;
    contextUri?: string;
  }

  const createTrackMenuItem = (
    track: SpotifyTrack,
    context: PlaybackContext,
    position?: number,
    playlistState?: MenuState,
    trackListState?: MenuState
  ): MenuItem => ({
    type: "action",
    label: `${track.name} - ${formatDuration(track.duration_ms)}`,
    onClick: async () => {
      if (!controller || checkTokenExpiry()) return;
      try {
        controller.setCurrentTrack(track);
        const playOptions: any = { position_ms: 0 };

        if (context.contextUri || context.id) {
          playOptions.context_uri = context.contextUri;
          playOptions.offset = { position };
        } else if (context.type === "saved_tracks" && context.tracks) {
          const savedTrackUris = context.tracks.map((item) => item.track.uri);
          playOptions.uris = savedTrackUris;
          playOptions.offset = { position };
        } else {
          playOptions.uris = [track.uri];
        }

        await controller.play(null, playOptions);
        return {
          items: [],
          selectedIndex: 0,
          title: track.name,
          parentState: trackListState || playlistState, // Use track list state if available
          showTrackView: true,
          currentTrack: track,
          currentPath: [
            ...(trackListState?.currentPath ||
              playlistState?.currentPath ||
              []),
            track.name,
          ],
        };
      } catch (error) {
        console.error("Error playing track:", error);
      }
    },
  });

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

            const playlistState: MenuState = {
              items: [],
              selectedIndex: 0,
              title: "Playlists",
              currentPath: [...(currentPath || []), "Music", "Playlists"],
            };

            playlistState.items = playlists.map(
              (playlist: SpotifyPlaylist) => ({
                type: "action",
                label: playlist.name,
                onClick: async () => {
                  if (!accessToken) return;
                  const tracks = await safeApiCall(() =>
                    getPlaylistTracks(accessToken, playlist.id)
                  );
                  if (!tracks) return;

                  const trackListState: MenuState = {
                    items: [],
                    selectedIndex: 0,
                    title: playlist.name,
                    currentPath: [
                      ...(playlistState.currentPath || []),
                      playlist.name,
                    ],
                    parentState: playlistState,
                  };

                  trackListState.items = tracks.map(
                    (track: { track: SpotifyTrack }, index: number) =>
                      createTrackMenuItem(
                        track.track,
                        {
                          contextUri: `${playlist.uri}`,
                          name: playlist.name,
                        },
                        index,
                        playlistState,
                        trackListState
                      )
                  );

                  return trackListState;
                },
              })
            );

            return playlistState;
          },
        },
        {
          type: "action",
          label: "Saved Tracks",
          requiresAuth: true,
          async onClick(): Promise<MenuState> {
            if (!accessToken) throw new Error("No access token");

            const savedTracks = await safeApiCall(() =>
              getUserSavedTracks(accessToken)
            );
            if (!savedTracks)
              throw new Error("No saved tracks found, try signing out and in");

            const savedTracksState: MenuState = {
              items: [],
              selectedIndex: 0,
              title: "Saved Tracks",
              currentPath: [...(currentPath || []), "Music", "Saved Tracks"],
            };

            savedTracksState.items = savedTracks.map(
              (item: { track: SpotifyTrack }, index: number) =>
                createTrackMenuItem(
                  item.track,
                  {
                    type: "saved_tracks",
                    tracks: savedTracks,
                  },
                  savedTracks.findIndex(
                    (t: { track: { id: string } }) =>
                      t.track.id === item.track.id
                  ),
                  savedTracksState
                )
            );

            return savedTracksState;
          },
        },
      ],
    },
    {
      type: "action",
      label: "Browse Global Playlists",
      requiresAuth: true,
      async onClick(): Promise<MenuState> {
        const playlists = await safeApiCall(() => getAllPlaylists());
        if (!playlists)
          throw new Error("No playlist found, try signing out and in");

        const globalPlaylistState: MenuState = {
          items: [],
          selectedIndex: 0,
          title: "Global Playlists",
          currentPath: [...(currentPath || []), "Browse Global Playlists"],
        };

        globalPlaylistState.items = playlists.map(
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
                        contextUri: `spotify:playlist:${playlist.playlist_id}`,
                        name: playlist.playlist_name,
                      },
                      index,
                      globalPlaylistState
                    )
                ),
                selectedIndex: 0,
                title: playlist.playlist_name,
                currentPath: [
                  ...(globalPlaylistState.currentPath || []),
                  playlist.playlist_name,
                ],
                parentState: globalPlaylistState,
              };
            },
          })
        );

        return globalPlaylistState;
      },
    },
  ];

  return menuItems.filter((item) => !(item.requiresAuth && !accessToken));
};
