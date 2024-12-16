"use client";
import {
  ActionMenuItem,
  MenuItem,
  NavigationMenuItem,
} from "@/types/iPod/Screen";
import { useEffect, useRef, useState } from "react";
import { ClickWheel } from "../Components/iPod/ClickWheel/ClickWheel";
import { AuthScreen } from "../Components/iPod/Screen/AuthScreen";
import { Screen } from "../Components/iPod/Screen/Screen";
import { createMenu } from "../Components/Menu/Menu";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../providers/AuthProvider";

interface Dimensions {
  width: number;
  height: number;
}

const IPodLayout: React.FC = () => {
  const { isAuthenticated, logout, accessToken } = useAuth();
  const { currentTheme } = useTheme();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [menuHistory, setMenuHistory] = useState<MenuItem[][]>([]);
  const [currentMenuItems, setCurrentMenuItems] = useState<MenuItem[]>([]);

  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const menu = createMenu(accessToken);
    setCurrentMenuItems(menu);
  }, [accessToken]);

  const handleWheelTurn = (direction: "clockwise" | "counterclockwise") => {
    if (!isAuthenticated) return;

    setSelectedIndex((prevIndex) => {
      if (direction === "clockwise") {
        return prevIndex < currentMenuItems.length - 1
          ? prevIndex + 1
          : prevIndex;
      }
      return prevIndex > 0 ? prevIndex - 1 : prevIndex;
    });
  };

  const handleSelectPress = () => {
    if (!isAuthenticated) return;

    const selectedItem = currentMenuItems[selectedIndex];
    if (!selectedItem) return;

    if (isNavigationMenuItem(selectedItem)) {
      setMenuHistory((prev) => [...prev, currentMenuItems]);
      setCurrentMenuItems(selectedItem.subMenu);
      setSelectedIndex(0);
    } else if (isActionMenuItem(selectedItem)) {
      selectedItem.onClick();
    }
  };

  const handleBackPress = () => {
    if (!isAuthenticated) return;

    if (menuHistory.length > 1) {
      const previousMenu = menuHistory[menuHistory.length - 1];
      setMenuHistory((prev) => prev.slice(0, -1));
      setCurrentMenuItems(previousMenu);
      setSelectedIndex(0);
    }
  };

  const handleMenuPress = () => {
    if (!isAuthenticated) return;

    if (menuHistory.length > 1) {
      const rootMenu = menuHistory[0];
      setMenuHistory([rootMenu]);
      setCurrentMenuItems(rootMenu);
      setSelectedIndex(0);
    }
  };

  const handleMenuSelect = async (item: MenuItem) => {
    console.log("Selected:", item.label);

    if (isActionMenuItem(item)) {
      await item.onClick(); // Support async actions
    } else if (isNavigationMenuItem(item)) {
      setMenuHistory((prev) => [...prev, currentMenuItems]);
      setCurrentMenuItems(item.subMenu);
      setSelectedIndex(0);
    }
  };

  // Type guards
  const isActionMenuItem = (item: MenuItem): item is ActionMenuItem => {
    return item.type === "action";
  };

  const isNavigationMenuItem = (item: MenuItem): item is NavigationMenuItem => {
    return item.type === "navigation";
  };

  const getElementStyle = (elementClass: string): React.CSSProperties => {
    const svgId = elementClass.split(" ").pop();
    if (!svgId || !dimensions[svgId]) return {};
    return {
      width: `${dimensions[svgId].width}px`,
      height: `${dimensions[svgId].height}px`,
    };
  };

  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(currentTheme.svgPath);
        const svgText = await response.text();
        if (svgRef.current) {
          svgRef.current.innerHTML = svgText;

          const dimensionsMap: Record<string, Dimensions> = {};
          const elements = svgRef.current.querySelectorAll("g[id]");

          elements.forEach((element) => {
            if (element instanceof SVGGraphicsElement) {
              const bbox = element.getBBox();
              dimensionsMap[element.id] = {
                width: bbox.width,
                height: bbox.height,
              };
            }
          });
          setDimensions(dimensionsMap);
        }
      } catch (error) {
        console.error("Error loading SVG:", error);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    loadSvg();
  }, [currentTheme.svgPath]);

  return (
    <div className="ipod-container">
      {isLoading && (
        <div className={`skeleton-loader${isLoading ? " loading" : ""}`}>
          <div className="animate-pulse">
            <div className="screen-area" />
            <div className="wheel-area">
              <div className="wheel" />
            </div>
          </div>
        </div>
      )}

      <div className="ipod-content-wrapper ipod-shell">
        <svg
          ref={svgRef}
          className="ipod-svg"
          viewBox="0 0 340 550"
          xmlns="http://www.w3.org/2000/svg"
        />
      </div>

      {!isLoading && (
        <div
          className="ipod-content-wrapper iPod"
          style={getElementStyle("iPod")}
        >
          <div className="ipod-overlay Shell" style={getElementStyle("Shell")}>
            <div
              className="screen-container Screen"
              style={getElementStyle("Screen")}
            >
              <div
                className="screen-header Header"
                style={getElementStyle("Header")}
              />
              <div className="screen-content Display">
                {isAuthenticated ? (
                  <>
                    <div className="menu-screen">
                      <Screen
                        menuItems={currentMenuItems}
                        selectedIndex={selectedIndex}
                        onMenuSelect={handleMenuSelect}
                      />
                    </div>
                    <div id="screen" className="dynamic-content"></div>
                  </>
                ) : (
                  <AuthScreen />
                )}
              </div>
            </div>

            <div className="click-wheel-container">
              <div className="touch-ring" />
              <div className="select-button" />
              <ClickWheel
                onWheelTurn={handleWheelTurn}
                onMenuPress={handleMenuPress}
                onSelectPress={handleSelectPress}
                onBackPress={handleBackPress}
                onForwardPress={() => console.log("Forward pressed")}
                onPlayPausePress={() => console.log("Play/Pause pressed")}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPodLayout;
