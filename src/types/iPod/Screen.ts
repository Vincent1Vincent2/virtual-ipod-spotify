import { SpotifyTrack } from "../spotify/track";

export interface BaseMenuItem {
  label: string;
  requiresAuth?: boolean;
}

export type ActionMenuItem = BaseMenuItem & {
  type: "action";
  onClick: () => Promise<MenuState | null | undefined> | void;
};

export type NavigationMenuItem = BaseMenuItem & {
  type: "navigation";
  subMenu: MenuItem[];
};

export type MenuItem = ActionMenuItem | NavigationMenuItem;

export interface MenuState {
  items: MenuItem[];
  selectedIndex: number;
  title?: string;
  isDynamicContent?: boolean;
  currentPath?: string[];
  parentState?: MenuState;
  tracks?: SpotifyTrack[];
  showTrackView?: boolean;
  currentTrack?: SpotifyTrack;
}
