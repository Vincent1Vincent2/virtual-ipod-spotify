export type BaseMenuItem = {
  label: string;
  requiresAuth?: boolean;
  isLink?: boolean;
  href?: string;
};

export type ActionMenuItem = BaseMenuItem & {
  type: "action";
  onClick: () => void;
};

export type NavigationMenuItem = BaseMenuItem & {
  type: "navigation";
  subMenu: MenuItem[];
};

export type MenuItem = ActionMenuItem | NavigationMenuItem;

export interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  onMenuSelect: (item: MenuItem) => void;
}
