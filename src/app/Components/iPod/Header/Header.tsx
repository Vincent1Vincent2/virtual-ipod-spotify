"use client";
import { useAuth } from "@/app/providers/AuthProvider";
import { usePlayer } from "@/app/providers/PlayerProvider";
import { useEffect, useState } from "react";
import "./Header.css";

interface HeaderProps {
  dimensions?: {
    width?: number;
    height?: number;
  };
}

export const Header: React.FC<HeaderProps> = ({ dimensions }) => {
  const { logout } = useAuth();
  const { controller } = usePlayer();
  const [currentTrackName, setCurrentTrackName] = useState<string>("");

  useEffect(() => {
    const updateCurrentTrack = async () => {
      if (controller) {
        const state = await controller.getCurrentState();
        setCurrentTrackName(state?.item?.name || "Nothing playing");
      }
    };

    updateCurrentTrack();
    const interval = setInterval(updateCurrentTrack, 1000);
    return () => clearInterval(interval);
  }, [controller]);

  return (
    <header
      className="screen-header Header"
      style={{
        position: "absolute",
        width: `${dimensions?.width}px`,
        height: `${dimensions?.height}px`,
        background: "transparent",
        top: "5px",
        left: "5px",
      }}
    >
      <nav className="header-nav">
        <ul className="header-list">
          <li className="header-item"></li>
          <li className="header-item header-track">{currentTrackName}</li>
          <li className="battery-status">100%</li>
        </ul>
      </nav>
    </header>
  );
};
