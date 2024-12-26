"use client";
import { MenuState } from "@/types/iPod/Screen";
import { useCallback, useEffect, useState } from "react";
import { ClickWheel } from "../Components/iPod/ClickWheel/ClickWheel";
import { AuthScreen } from "../Components/iPod/Screen/AuthScreen";
import { Screen } from "../Components/iPod/Screen/Screen";
import { createMenu } from "../Components/Menu/Menu";
import { useAuth } from "../providers/AuthProvider";
import { usePlayer } from "../providers/PlayerProvider";
import { useSvg } from "../providers/SvgProvider";

const IPodLayout: React.FC = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const { controller, playPause, skipTrack, backTrack } = usePlayer();
  const { svgRef, dimensions, isLoading } = useSvg();

  const [currentView, setCurrentView] = useState<MenuState>({
    items: [],
    selectedIndex: 0,
    title: "Main Menu",
  });
  const [menuStack, setMenuStack] = useState<MenuState[]>([]);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

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
          setCurrentView({ ...result, selectedIndex: 0 });
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
      setCurrentView((prev) => ({ ...prev, selectedIndex: index }));
      setHoveredIndex(index);
    }
  };

  const handleBackPress = () => {
    if (!isAuthenticated || menuStack.length === 0) return;
    const previousView = menuStack[menuStack.length - 1];
    setMenuStack((prev) => prev.slice(0, -1));
    setCurrentView(previousView);
  };

  const handleMenuPress = () => {
    if (!isAuthenticated) return;
    handleBackPress();
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
          handleBackPress();
          break;
      }
    },
    [isAuthenticated, handleSelectPress, handleBackPress]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardNavigation);
    return () =>
      window.removeEventListener("keydown", handleKeyboardNavigation);
  }, [handleKeyboardNavigation]);

  useEffect(() => {
    const handleKeyUp = () => {
      setTimeout(() => setIsKeyboardNavigating(false), 100);
    };

    window.addEventListener("keyup", handleKeyUp);
    return () => window.removeEventListener("keyup", handleKeyUp);
  }, []);

  const handleForwardPress = () => {
    if (!isAuthenticated) return;
    skipTrack();
  };

  const handlePlayPausePress = () => {
    if (!isAuthenticated) return;
    playPause();
  };

  const handleBackwardPress = () => {
    if (!isAuthenticated) return;
    backTrack();
  };

  return (
    <div className="ipod-container">
      {isLoading && (
        <div className="skeleton-loader loading">
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

      {!isLoading && dimensions.iPod && (
        <div
          className="ipod-content-wrapper iPod"
          style={{
            position: "absolute",
            width: `${dimensions.iPod.width}px`,
            height: `${dimensions.iPod.height}px`,
          }}
        >
          <div
            className="ipod-overlay Shell"
            style={{
              position: "absolute",
              width: `${dimensions.Shell?.width}px`,
              height: `${dimensions.Shell?.height}px`,
            }}
          >
            <div
              className="screen-container Screen"
              style={{
                position: "absolute",
                width: `${dimensions.Screen?.width}px`,
                height: `${dimensions.Screen?.height}px`,
                top: `${dimensions.Screen?.y}px`,
                left: `${dimensions.Screen?.x}px`,
                background: "transparent",
              }}
            >
              <div
                className="screen-header Header"
                style={{
                  position: "absolute",
                  width: `${dimensions.Header?.width}px`,
                  height: `${dimensions.Header?.height}px`,
                  top: "5px",
                  left: "5px",
                  background: "transparent",
                }}
              />
              <div
                className="screen-content Display"
                style={{
                  position: "absolute",
                  width: `${dimensions.Display?.width}px`,
                  height: `${dimensions.Display?.height}px`,
                  top: "30px",
                  left: "5px",
                  background: "transparent",
                }}
              >
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

            <div
              className="click-wheel-container"
              style={{
                position: "absolute",
                top: `${dimensions.ScrollWheel?.y}px`,
                left: `${dimensions.ScrollWheel?.x}px`,
                width: `${dimensions.ScrollWheel?.width}px`,
                height: `${dimensions.ScrollWheel?.height}px`,
              }}
            >
              <div className="touch-ring" />
              <div className="select-button" />
              <ClickWheel
                onRingTurn={handleWheelTurn}
                onMenuPress={handleMenuPress}
                onSelectPress={handleSelectPress}
                onBackPress={handleBackwardPress}
                onForwardPress={handleForwardPress}
                onPlayPausePress={handlePlayPausePress}
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
