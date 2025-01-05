"use client";
import { ClickWheelProps } from "@/types/iPod/ClickWheel";
import React, { useEffect } from "react";
import { ClickWheelControls } from "./ClickWheelControls";
import TouchRing from "./TouchRing";

interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ClickWheelControlsProps {
  onButtonPress: (buttonId: string) => void;
  onButtonRelease: () => void;
  canGoBack: boolean;
  disabled?: boolean;
  onTabStart?: () => void;
  isTabMode?: boolean;
  buttonStyles?: Record<string, React.CSSProperties>;
}
interface ExtendedClickWheelProps extends ClickWheelProps {
  canGoBack?: boolean;
  onTabStart?: () => void;
  isTabMode?: boolean;
  dimensions?:
    | {
        ScrollWheel: Dimensions;
        TouchRing: Dimensions;
        MenuButton: Dimensions;
        SelectButton: Dimensions;
        BackButton: Dimensions;
        SkipButton: Dimensions;
        PlayPauseButton: Dimensions;
      }
    | Record<string, Dimensions>;
}
export const ClickWheel: React.FC<ExtendedClickWheelProps> = ({
  onRingTurn,
  onMenuPress,
  onSelectPress,
  onBackPress,
  onForwardPress,
  onPlayPausePress,
  canGoBack = false,
  onTabStart,
  isTabMode,
  dimensions,
}) => {
  const [activeButton, setActiveButton] = React.useState<string | null>(null);
  const [isTouchScrolling, setIsTouchScrolling] = React.useState(false);
  const [isCtrlPressed, setIsCtrlPressed] = React.useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setIsCtrlPressed(e.ctrlKey);
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setIsCtrlPressed(!e.ctrlKey);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleButtonPress = (buttonId: string) => {
    if (isTouchScrolling) return;

    setActiveButton(buttonId);
    switch (buttonId) {
      case "menu":
        onMenuPress?.();
        break;
      case "select":
        onSelectPress?.();
        break;
      case "back":
        onBackPress?.();
        break;
      case "forward":
        onForwardPress?.();
        break;
      case "play":
        onPlayPausePress?.();
        break;
    }
  };

  const handleTouchScrollStart = () => setIsTouchScrolling(true);
  const handleTouchScrollEnd = () => {
    setTimeout(() => setIsTouchScrolling(false), 100);
  };

  const buttonStyles =
    dimensions && "MenuButton" in dimensions
      ? {
          menu: {
            width: dimensions.MenuButton.width,
            height: dimensions.MenuButton.height,
            top: dimensions.MenuButton.y - dimensions.ScrollWheel.y,
            left: dimensions.MenuButton.x - dimensions.ScrollWheel.x,
            position: "absolute" as const,
          },
          select: {
            width: dimensions.SelectButton.width,
            height: dimensions.SelectButton.height,
            top: dimensions.SelectButton.y - dimensions.ScrollWheel.y,
            left: dimensions.SelectButton.x - dimensions.ScrollWheel.x,
            position: "absolute" as const,
          },
          back: {
            width: dimensions.BackButton.width,
            height: dimensions.BackButton.height,
            top: dimensions.BackButton.y - dimensions.ScrollWheel.y,
            left: dimensions.BackButton.x - dimensions.ScrollWheel.x,
            position: "absolute" as const,
          },
          forward: {
            width: dimensions.SkipButton.width,
            height: dimensions.SkipButton.height,
            top: dimensions.SkipButton.y - dimensions.ScrollWheel.y,
            left: dimensions.SkipButton.x - dimensions.ScrollWheel.x,
            position: "absolute" as const,
          },
          play: {
            width: dimensions.PlayPauseButton.width,
            height: dimensions.PlayPauseButton.height,
            top: dimensions.PlayPauseButton.y - dimensions.ScrollWheel.y,
            left: dimensions.PlayPauseButton.x - dimensions.ScrollWheel.x,
            position: "absolute" as const,
          },
        }
      : undefined;

  return (
    <div
      role="application"
      aria-label="iPod click wheel controller"
      className="relative"
    >
      <TouchRing
        onRingTurn={onRingTurn}
        onBack={onMenuPress}
        onSelect={onSelectPress}
        onTouchScrollStart={handleTouchScrollStart}
        onTouchScrollEnd={handleTouchScrollEnd}
        isTabMode={isTabMode}
        style={
          dimensions && "TouchRing" in dimensions
            ? {
                width: dimensions.TouchRing.width,
                height: dimensions.TouchRing.height,
                top: dimensions.TouchRing.y - dimensions.ScrollWheel.y,
                left: dimensions.TouchRing.x - dimensions.ScrollWheel.x,
                position: "absolute" as const,
              }
            : undefined
        }
      />
      <ClickWheelControls
        onButtonPress={handleButtonPress}
        onButtonRelease={() => setActiveButton(null)}
        canGoBack={canGoBack}
        disabled={isTouchScrolling}
        onTabStart={onTabStart}
        isTabMode={isTabMode}
        buttonStyles={buttonStyles}
      />
    </div>
  );
};
