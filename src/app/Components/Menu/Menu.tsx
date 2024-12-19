"use client";
import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { getPlaylistTracks } from "@/api/user/tracks";
import { MenuItem, MenuState } from "@/types/iPod/Screen";

export const createMenu = (accessToken: string | null): MenuItem[] => {
  const createGlobalPlaylistMenuItem = (): MenuItem => ({
    type: "action",
    label: "Browse Global Playlists",
    requiresAuth: true,
    async onClick(): Promise<MenuState> {
      if (!accessToken) {
        return {
          items: [],
          selectedIndex: 0,
          title: "Error",
          isDynamicContent: false,
          currentPath: ["Error"],
        };
      }

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
              items: [],
              selectedIndex: 0,
              title: playlist.playlist_name,
              isDynamicContent: true,
              currentPath: ["Browse Global Playlists", playlist.playlist_name],
              tracks: tracks.map((item: any) => item.track),
            };
          },
        })),
        selectedIndex: 0,
        title: "Global Playlists",
        isDynamicContent: false,
        currentPath: ["Browse Global Playlists"],
      };
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
                    items: [],
                    selectedIndex: 0,
                    title: playlist.name,
                    isDynamicContent: true,
                    currentPath: ["Music", "Playlists", playlist.name],
                    tracks: tracks.map((item: any) => item.track),
                  };
                },
              })),
              selectedIndex: 0,
              title: "Playlists",
              isDynamicContent: false,
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
