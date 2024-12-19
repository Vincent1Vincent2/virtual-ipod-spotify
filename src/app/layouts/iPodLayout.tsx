"use client";
import { MenuState } from "@/types/iPod/Screen";
import { useCallback, useEffect, useRef, useState } from "react";
import { ClickWheel } from "../Components/iPod/ClickWheel/ClickWheel";
import { AuthScreen } from "../Components/iPod/Screen/AuthScreen";
import { Screen } from "../Components/iPod/Screen/Screen";
import { createMenu } from "../Components/Menu/Menu";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../providers/AuthProvider";
import { usePlayer } from "../providers/PlayerProvider";

interface Dimensions {
  width: number;
  height: number;
}

const IPodLayout: React.FC = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const { controller } = usePlayer();
  const { currentTheme } = useTheme();
  const svgRef = useRef<SVGSVGElement>(null);

  const [currentView, setCurrentView] = useState<MenuState>({
    items: [],
    selectedIndex: 0,
    title: "Main Menu",
  });
  const [menuStack, setMenuStack] = useState<MenuState[]>([]);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});

  useEffect(() => {
    if (accessToken) {
      const initialMenu = createMenu(accessToken, controller);
      setCurrentView({
        items: initialMenu,
        selectedIndex: 0,
        title: "Main Menu",
      });
    }
  }, [accessToken, controller]);

  const handleWheelTurn = (direction: "clockwise" | "counterclockwise") => {
    if (!isAuthenticated) return;

    setCurrentView((prev) => ({
      ...prev,
      selectedIndex:
        direction === "clockwise"
          ? Math.min(
              prev.selectedIndex + 1,
              (prev.tracks?.length || prev.items.length) - 1
            )
          : Math.max(prev.selectedIndex - 1, 0),
    }));
  };

  const handleSelectPress = async () => {
    if (!isAuthenticated) return;

    const selectedItem = currentView.items[currentView.selectedIndex];
    if (!selectedItem) return;

    if (selectedItem.type === "action" && selectedItem.onClick) {
      try {
        const result = await selectedItem.onClick();
        if (result) {
          setMenuStack((prev) => [...prev, currentView]);
          setCurrentView({
            ...result,
            selectedIndex: 0,
          });
        }
      } catch (error) {
        console.error("Action failed:", error);
      }
    } else if (selectedItem.type === "navigation") {
      setMenuStack((prev) => [...prev, currentView]);
      setCurrentView({
        items: selectedItem.subMenu,
        selectedIndex: 0,
        title: selectedItem.label,
        currentPath: [...(currentView.currentPath || []), selectedItem.label],
      });
    }
  };

  const handleMenuItemHover = (index: number) => {
    if (!isKeyboardNavigating) {
      setCurrentView((prev) => ({
        ...prev,
        selectedIndex: index,
      }));
      setHoveredIndex(index);
    }
  };

  useEffect(() => {
    const handleKeyUp = () => {
      setTimeout(() => setIsKeyboardNavigating(false), 100);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  const handleBackPress = () => {
    if (!isAuthenticated || menuStack.length === 0) return;
    const previousView = menuStack[menuStack.length - 1];
    setMenuStack((prev) => prev.slice(0, -1));
    setCurrentView(previousView);
  };

  const handleMenuPress = () => {
    if (!isAuthenticated) return;
    if (menuStack.length > 0) handleBackPress();
  };

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!isAuthenticated) return;
      setIsKeyboardNavigating(true);

      switch (event.key) {
        case "ArrowDown":
        case "ArrowUp":
          setCurrentView((prev) => ({
            ...prev,
            selectedIndex:
              event.key === "ArrowDown"
                ? Math.min(prev.selectedIndex + 1, prev.items.length - 1)
                : Math.max(prev.selectedIndex - 1, 0),
          }));
          setHoveredIndex(null);
          break;
        case "Enter":
          handleSelectPress();
          break;
        case "Backspace":
          handleBackPress(); // Changed from handleMenuPress to handleBackPress
          break;
      }
    },
    [isAuthenticated, handleSelectPress, handleBackPress] // Added necessary dependencies
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

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

  const getElementStyle = (elementClass: string): React.CSSProperties => {
    const svgId = elementClass.split(" ").pop();
    if (!svgId || !dimensions[svgId]) return {};
    return {
      width: `${dimensions[svgId].width}px`,
      height: `${dimensions[svgId].height}px`,
    };
  };

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
                {!isAuthenticated ? (
                  <AuthScreen />
                ) : (
                  <>
                    <Screen
                      menuItems={currentView.items}
                      selectedIndex={currentView.selectedIndex}
                      hoveredIndex={hoveredIndex}
                      onMenuSelect={handleSelectPress}
                      onMenuItemHover={handleMenuItemHover}
                      isDynamicContent={currentView.isDynamicContent}
                      tracks={currentView.tracks}
                    />
                    <div id="screen" className="dynamic-content" />
                  </>
                )}
              </div>
            </div>

            <div className="click-wheel-container">
              <div className="touch-ring" />
              <div className="select-button" />
              <ClickWheel
                onRingTurn={handleWheelTurn}
                onMenuPress={handleMenuPress}
                onSelectPress={handleSelectPress}
                onBackPress={handleBackPress}
                onForwardPress={() => console.log("Forward pressed")}
                onPlayPausePress={() => console.log("Play/Pause pressed")}
                canGoBack={menuStack.length > 0}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPodLayout;
