export type BaseMenuItem = {
  label: string;
  requiresAuth?: boolean; // Add requiresAuth to handle authentication-based menu items
  isLink?: boolean;
  href?: string;
};

export type MusicMenuItem = BaseMenuItem & {
  type: "music";
  onClick: () => void;
  subMenu?: MenuItem[];
};

export type PhotosMenuItem = BaseMenuItem & {
  type: "photos";
  onClick: () => void;
  subMenu?: MenuItem[];
};

export type VideosMenuItem = BaseMenuItem & {
  type: "videos";
  onClick: () => void;
  subMenu?: MenuItem[];
};

export type ExtrasMenuItem = BaseMenuItem & {
  type: "extras";
  onClick: () => void;
  subMenu?: MenuItem[];
};

export type SettingsMenuItem = BaseMenuItem & {
  type: "settings";
  onClick: () => void;
  subMenu?: MenuItem[];
};

export type ShuffleMenuItem = BaseMenuItem & {
  type: "shuffle";
  onClick: () => void;
};

export type SleepMenuItem = BaseMenuItem & {
  type: "sleep";
  onClick: () => void;
};

export type NavigationMenuItem = BaseMenuItem & {
  type: "navigation";
  subMenu: MenuItem[];
};

export type ActionMenuItem = BaseMenuItem & {
  type: "action";
  onClick: () => void;
};

export type MenuItem =
  | ActionMenuItem
  | NavigationMenuItem
  | MusicMenuItem
  | PhotosMenuItem
  | VideosMenuItem
  | ExtrasMenuItem
  | SettingsMenuItem
  | ShuffleMenuItem
  | SleepMenuItem;

export interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  onMenuSelect: (item: MenuItem) => void;
}
