"use client";
import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { ActionMenuItem, MenuItem, MenuState } from "@/types/iPod/Screen";

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
            // Handle playlist selection
            console.log("Selected playlist:", playlist);
            return Promise.resolve();
          },
        })),
        selectedIndex: 0,
        title: "Global Playlists",
        isDynamicContent: true,
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
              items: playlists.map(
                (playlist) =>
                  ({
                    type: "action",
                    label: playlist.name,
                    onClick: () => Promise.resolve(),
                  } as ActionMenuItem)
              ),
              selectedIndex: 0,
              title: "Playlists",
              isDynamicContent: true,
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
