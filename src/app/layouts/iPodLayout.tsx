"use client";
import { MenuState } from "@/types/iPod/Screen";
import { useCallback, useEffect, useState } from "react";
import { ClickWheel } from "../Components/iPod/ClickWheel/ClickWheel";
import { Header } from "../Components/iPod/Header/Header";
import { AuthScreen } from "../Components/iPod/Screen/AuthScreen";
import { Screen } from "../Components/iPod/Screen/Screen";
import { createMenu } from "../Components/Menu/Menu";
import { useAuth } from "../providers/AuthProviderContent";
import { usePlayer } from "../providers/PlayerProvider";
import { useSvg } from "../providers/SvgProvider";
import { useTheme } from "../providers/ThemeProvider";

const IPodLayout: React.FC = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const { controller, playPause, skipTrack, backTrack } = usePlayer();
  const { svgRef, dimensions, isLoading } = useSvg();
  const { isLandscape } = useTheme();
  const [currentView, setCurrentView] = useState<MenuState>({
    items: [],
    selectedIndex: 0,
    title: "Main Menu",
  });
  const [menuStack, setMenuStack] = useState<MenuState[]>([]);
  const [isKeyboardNavigating, setIsKeyboardNavigating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [isTabNavigating, setIsTabNavigating] = useState(false);

  // Verify all required dimensions are present
  const hasAllDimensions =
    dimensions.iPod &&
    dimensions.Shell &&
    dimensions.ScrollWheel &&
    dimensions.Screen &&
    dimensions.Display &&
    dimensions.Header;

  useEffect(() => {
    if (accessToken) {
      const initialMenu = createMenu(accessToken, controller, []);
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
          if (!result.showTrackView) {
            setMenuStack((prev) => [...prev, currentView]);
          }
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
    if (!isAuthenticated) return;
    if (currentView.showTrackView && currentView.parentState) {
      setCurrentView(currentView.parentState);
    } else if (menuStack.length > 0) {
      const previousView = menuStack[menuStack.length - 1];
      setMenuStack((prev) => prev.slice(0, -1));
      setCurrentView(previousView);
    }
  };

  const handleMenuPress = () => {
    if (!isAuthenticated) return;
    handleBackPress();
  };

  const handleKeyboardNavigation = useCallback(
    (event: KeyboardEvent) => {
      if (!isAuthenticated || isTabNavigating) return;
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
          if (!isTabNavigating) {
            handleSelectPress();
          }
          break;
        case "Escape":
        case "Backspace":
          handleBackPress();
          break;
      }
    },
    [isAuthenticated, handleSelectPress, handleBackPress, isTabNavigating]
  );

  const handleTabStart = () => {
    setIsTabNavigating(true);
    setIsKeyboardNavigating(false);
  };

  const handleMouseDown = () => {
    setIsTabNavigating(false);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyboardNavigation);
    window.addEventListener("mousedown", handleMouseDown);
    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
      window.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleKeyboardNavigation]);

  return (
    <article className={`ipod-container ${isLandscape ? "landscape" : ""}`}>
      {isLoading && (
        <aside className="skeleton-loader loading">
          <section className="animate-pulse">
            <section className="screen-area" />
            <section className="wheel-area">
              <section className="wheel" />
            </section>
          </section>
        </aside>
      )}

      <section className="ipod-content-wrapper ipod-shell">
        <svg
          ref={svgRef}
          className="ipod-svg"
          viewBox={isLandscape ? "0 0 550 340" : "0 0 340 550"}
          xmlns="http://www.w3.org/2000/svg"
        />
      </section>

      {!isLoading && hasAllDimensions && (
        <main
          className={`ipod-content-wrapper iPod`}
          style={{
            position: "absolute",
            width: `${dimensions.iPod.width}px`,
            height: `${dimensions.iPod.height}px`,
          }}
        >
          <section
            className="ipod-overlay Shell"
            style={{
              position: "absolute",
              width: `${dimensions.Shell.width}px`,
              height: `${dimensions.Shell.height}px`,
            }}
          >
            <section
              className="screen-container Screen"
              style={{
                position: "absolute",
                width: `${dimensions.Screen.width}px`,
                height: `${dimensions.Screen.height}px`,
                top: `${dimensions.Screen.y}px`,
                left: `${dimensions.Screen.x}px`,
                background: "transparent",
              }}
            >
              <Header dimensions={dimensions.Header} />

              <main
                className="screen-content Display"
                style={{
                  position: "absolute",
                  width: `${dimensions.Display.width}px`,
                  height: `${dimensions.Display.height}px`,
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
                      showTrackView={currentView.showTrackView!}
                    />
                    <section id="screen" className="dynamic-content" />
                  </>
                )}
              </main>
            </section>

            <nav
              className="click-wheel-container"
              style={{
                position: "absolute",
                top: `${dimensions.ScrollWheel.y}px`,
                left: `${dimensions.ScrollWheel.x}px`,
                width: `${dimensions.ScrollWheel.width}px`,
                height: `${dimensions.ScrollWheel.height}px`,
              }}
            >
              <section className="touch-ring" />
              <button className="select-button" />
              <ClickWheel
                onRingTurn={handleWheelTurn}
                onMenuPress={handleMenuPress}
                onSelectPress={handleSelectPress}
                onBackPress={handleBackPress}
                onForwardPress={skipTrack}
                onPlayPausePress={playPause}
                canGoBack={menuStack.length > 0}
                onTabStart={handleTabStart}
                isTabMode={isTabNavigating}
              />
            </nav>
          </section>
        </main>
      )}
    </article>
  );
};

export default IPodLayout;
