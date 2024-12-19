export interface BaseMenuItem {
  label: string;
  requiresAuth?: boolean;
}

export type ActionMenuItem = BaseMenuItem & {
  type: "action";
  onClick: () => Promise<MenuState | void> | void;
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
}
export interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  hoveredIndex?: number | null;
  onMenuSelect: (item: MenuItem) => void;
  onMenuItemHover?: (index: number) => void;
}
