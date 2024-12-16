"use client";
import { getAllPlaylists } from "@/api/database/playlist";
import { getUserPlaylists } from "@/api/user/playlists";
import { dynamicScreen } from "@/helpers/dynamicScreen";
import { MenuItem } from "@/types/iPod/Screen";

export const createMenu = (accessToken: string | null): MenuItem[] => {
  console.log("Creating menu with token:", accessToken);

  // Define the menu items
  const menuItems: MenuItem[] = [
    {
      type: "navigation",
      label: "Music",
      subMenu: [
        {
          type: "action",
          label: "Playlists",
          requiresAuth: true, // Requires authentication
          onClick: () => {
            if (!accessToken) {
              console.error("Access token is missing.");
              return;
            }
            getUserPlaylists(accessToken, (playlist) => {
              const content = document.querySelector("#screen");
              if (content) {
                content.innerHTML = `<h2>${playlist.name}</h2>`;
              }
            });
          },
        },
        {
          type: "music",
          label: "Artists",
          onClick: () => console.log("Artists clicked"),
        },
        {
          type: "music",
          label: "Albums",
          onClick: () => console.log("Albums clicked"),
        },
        {
          type: "music",
          label: "Songs",
          onClick: () => console.log("Songs clicked"),
        },
      ],
    },
    {
      type: "action",
      label: "Browse Global Playlists",
      requiresAuth: true,
      async onClick() {
        if (!accessToken) {
          console.error("Access token is missing.");
          return;
        }
        const playlists = await getAllPlaylists();
        dynamicScreen(playlists);
      },
    },
    {
      type: "photos",
      label: "Photos",
      onClick: () => console.log("Photos clicked"),
    },
    {
      type: "videos",
      label: "Videos",
      onClick: () => console.log("Videos clicked"),
    },
    {
      type: "extras",
      label: "Extras",
      onClick: () => console.log("Extras clicked"),
    },
    {
      type: "settings",
      label: "Settings",
      onClick: () => console.log("Settings clicked"),
    },
    {
      type: "shuffle",
      label: "Shuffle Songs",
      onClick: () => console.log("Shuffle clicked"),
    },
    {
      type: "sleep",
      label: "Sleep",
      onClick: () => console.log("Sleep clicked"),
    },
  ];

  // Filter out items that require authentication but are not authenticated
  return menuItems.filter((item) => !(item.requiresAuth && !accessToken));
};
