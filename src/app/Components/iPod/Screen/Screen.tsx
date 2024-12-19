import { MenuItem } from "@/types/iPod/Screen";
import "./Screen.css";

interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  hoveredIndex?: number | null;
  onMenuSelect: (item: MenuItem) => void;
  onMenuItemHover?: (index: number) => void;
}

export const Screen: React.FC<ScreenProps> = ({
  menuItems,
  selectedIndex,
  hoveredIndex,
  onMenuSelect,
  onMenuItemHover,
}) => {
  const handleItemClick = (item: MenuItem) => {
    onMenuSelect(item);
  };

  const handleItemHover = (index: number) => {
    if (onMenuItemHover) {
      onMenuItemHover(index);
    }
  };

  return (
    <div className="screen">
      <div className="menu-list">
        {menuItems.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={`menu-item ${
              index === selectedIndex ? "menu-item--selected" : ""
            } ${hoveredIndex === index ? "menu-item--hovered" : ""}`}
            onClick={() => handleItemClick(item)}
            onMouseEnter={() => handleItemHover(index)}
            onMouseLeave={() => handleItemHover(selectedIndex)}
            role="button"
            tabIndex={0}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
