/* "use client";

import { MenuItem } from "@/types/iPod/Screen";
import React from "react";
import { Menu } from "../Menu/Menu";
import { ClickWheel } from "./ClickWheel/ClickWheel";
import { Screen } from "./Screen/Screen";
import Shell from "./Shell/Shell";

interface iPodProps {
  accessToken?: string;
  onTokenExpired?: () => void;
}

const iPod: React.FC<iPodProps> = ({ accessToken, onTokenExpired }) => {
  // State
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [menuHistory, setMenuHistory] = React.useState<MenuItem[][]>([]);

  // Initialize menu items
  const menuItems = Menu({}); // Get default menu items
  const [currentMenuItems, setCurrentMenuItems] =
    React.useState<MenuItem[]>(menuItems);

  React.useEffect(() => {
    // Set initial menu items when component mounts
    setMenuHistory([[...menuItems]]);
  }, []);

  // Navigation handlers
  const handleWheelTurn = (direction: "clockwise" | "counterclockwise") => {
    setSelectedIndex((prevIndex) => {
      if (direction === "clockwise") {
        return prevIndex < currentMenuItems.length - 1
          ? prevIndex + 1
          : prevIndex;
      } else {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      }
    });
  };

  const handleSelectPress = () => {
    const selectedItem = currentMenuItems[selectedIndex];
    if (selectedItem?.subMenu) {
      setMenuHistory((prev) => [...prev, currentMenuItems]);
      setCurrentMenuItems(selectedItem.subMenu);
      setSelectedIndex(0);
    } else if (selectedItem?.isLink && selectedItem?.href) {
      console.log("Navigating to:", selectedItem.href);
      // Handle navigation here
    } else {
      console.log("Selected item:", selectedItem);
    }
  };

  const handleBackPress = () => {
    if (menuHistory.length > 1) {
      // Changed from > 0 to > 1 to keep initial menu
      const previousMenu = menuHistory[menuHistory.length - 1];
      setMenuHistory((prev) => prev.slice(0, -1));
      setCurrentMenuItems(previousMenu);
      setSelectedIndex(0);
    }
  };

  const handleMenuPress = () => {
    // Return to root menu
    if (menuHistory.length > 1) {
      const rootMenu = menuHistory[0];
      setMenuHistory([rootMenu]);
      setCurrentMenuItems(rootMenu);
      setSelectedIndex(0);
    }
  };

  return (
    <div className="relative iPod-container">
      <Shell theme="classic">
        <Screen
          menuItems={currentMenuItems}
          selectedIndex={selectedIndex}
          onMenuSelect={(item) => console.log("Selected:", item.label)}
        />
        <ClickWheel
          onWheelTurn={handleWheelTurn}
          onMenuPress={handleMenuPress}
          onSelectPress={handleSelectPress}
          onBackPress={handleBackPress}
          onForwardPress={() => console.log("Forward pressed")}
          onPlayPausePress={() => console.log("Play/Pause pressed")}
        />
      </Shell>
    </div>
  );
};

export default iPod;
 */
