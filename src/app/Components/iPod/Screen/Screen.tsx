import { MenuItem } from "@/types/iPod/Screen";
import { SpotifyTrack } from "@/types/spotify/track";
import "./Screen.css";

interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  hoveredIndex?: number | null;
  onMenuSelect: (item: MenuItem) => void;
  onMenuItemHover?: (index: number) => void;
  isDynamicContent?: boolean;
  tracks?: SpotifyTrack[];
}
export const Screen: React.FC<ScreenProps> = ({
  menuItems,
  selectedIndex,
  hoveredIndex,
  onMenuSelect,
  onMenuItemHover,
  isDynamicContent,
  tracks,
}) => {
  const handleItemClick = (item: MenuItem) => {
    onMenuSelect(item);
  };

  const handleItemHover = (index: number) => {
    if (onMenuItemHover) {
      onMenuItemHover(index);
    }
  };

  const formatDuration = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  if (isDynamicContent && tracks) {
    return (
      <div className="screen">
        <div className="tracks-list">
          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`track-item ${
                index === selectedIndex ? "track-item--selected" : ""
              } ${hoveredIndex === index ? "track-item--hovered" : ""}`}
            >
              <span className="track-name">{track.name}</span>
              <span className="track-duration">
                {formatDuration(track.duration_ms)}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
