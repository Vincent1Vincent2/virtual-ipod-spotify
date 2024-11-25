import { MenuItem } from "@/types/iPod/Screen";

interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  onMenuSelect: (item: MenuItem) => void;
}



export const Screen: React.FC<ScreenProps> = ({
  menuItems,
  selectedIndex,
  onMenuSelect,
}) => {
  return (
    <div className="screen">
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <div
            key={item.label}
            className={`menu-item ${
              index === selectedIndex ? "menu-item--selected" : ""
            }`}
            onClick={() => onMenuSelect(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
