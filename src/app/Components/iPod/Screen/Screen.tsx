"use client";
import { usePlayer } from "@/app/providers/PlayerProvider";
import { useSvg } from "@/app/providers/SvgProvider";
import { MenuItem } from "@/types/iPod/Screen";
import { SpotifyTrack } from "@/types/spotify/track";
import { formatDuration } from "@/utils/Format";
import React, { useEffect, useRef } from "react";
import "./Screen.css";

const TrackInfo = ({ track }: { track: SpotifyTrack }) => (
  <div className="track-info">
    <img
      src={track.album?.images?.[0]?.url || "/api/placeholder/300/300"}
      alt={track.name}
      className="track-cover"
    />
    <div className="track-details">
      <p className="track-title">{track.name}</p>
      <p className="track-artist">{track.artists?.[0]?.name}</p>
    </div>
  </div>
);

interface ScreenProps {
  menuItems: MenuItem[];
  selectedIndex: number;
  hoveredIndex?: number | null;
  onMenuSelect?: (item: any) => void;
  onMenuItemHover?: (index: number) => void;
  isDynamicContent?: boolean;
  tracks?: SpotifyTrack[];
  showTrackView: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  menuItems,
  selectedIndex,
  hoveredIndex,
  onMenuSelect,
  onMenuItemHover,
  isDynamicContent,
  tracks,
  showTrackView,
}) => {
  const { currentTrack } = usePlayer();
  const { dimensions } = useSvg();
  const scrollContainerRef = useRef<HTMLUListElement | null>(null);

  const isCurrentlyPlaying = (track: SpotifyTrack) =>
    currentTrack && track.id === currentTrack.id;

  useEffect(() => {
    if (scrollContainerRef.current) {
      const selectedElement = scrollContainerRef.current.children[
        selectedIndex
      ] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({
          block: "nearest",
          behavior: "smooth",
        });
      }
    }
  }, [selectedIndex]);

  const handleItemClick = (item: MenuItem) => {
    onMenuSelect?.(item);
  };

  const handleItemHover = (index: number) => {
    if (onMenuItemHover) {
      onMenuItemHover(index);
    }
  };

  /*   if (showTrackView && currentTrack) {
    return (
      <div
        className="screen-content"
        style={{
          height: dimensions.Display.height,
          width: dimensions.Display.width,
        }}
      >
        <TrackInfo track={currentTrack} />
      </div>
    );
  } */

  if (showTrackView && currentTrack) {
    return <TrackInfo track={currentTrack} />;
  }

  return (
    <div className="screen">
      <nav className={isDynamicContent ? "tracks-list" : "menu-list"}>
        <ul ref={scrollContainerRef}>
          {(isDynamicContent ? tracks || [] : menuItems).map((item, index) => (
            <li
              key={"id" in item ? item.id : `label-${index}`}
              className={`menu-item
                ${
                  index === selectedIndex
                    ? isDynamicContent
                      ? "track-item--selected"
                      : "menu-item--selected"
                    : ""
                }
                ${hoveredIndex === index ? "hovered" : ""}
                ${
                  isDynamicContent && isCurrentlyPlaying(item as SpotifyTrack)
                    ? "currently-playing"
                    : ""
                }
              `.trim()}
              onClick={() => handleItemClick(item as MenuItem)}
              onMouseEnter={() => handleItemHover(index)}
              onMouseLeave={() => handleItemHover(selectedIndex)}
            >
              {isDynamicContent ? (
                <div>
                  <span className="track-name">
                    {(item as SpotifyTrack).name}
                  </span>
                  <span className="track-duration">
                    {formatDuration((item as SpotifyTrack).duration_ms)}
                  </span>
                </div>
              ) : (
                (item as MenuItem).label
              )}
            </li>
          ))}
        </ul>
      </nav>
      <footer className="screen-footer">Footer</footer>
    </div>
  );
};
