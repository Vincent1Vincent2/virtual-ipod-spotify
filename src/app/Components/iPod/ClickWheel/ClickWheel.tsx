import { ClickWheelProps } from "@/types/iPod/ClickWheel";
import React, { useEffect } from "react";
import { ClickWheelControls } from "./ClickWheelControls";
import TouchRing from "./TouchRing";

export const ClickWheel: React.FC<
  ClickWheelProps & {
    canGoBack?: boolean;
    onTabStart?: () => void;
    isTabMode?: boolean;
  }
> = ({
  onRingTurn,
  onMenuPress,
  onSelectPress,
  onBackPress,
  onForwardPress,
  onPlayPausePress,
  canGoBack = false,
  onTabStart,
  isTabMode,
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

  return (
    <div role="application" aria-label="iPod click wheel controller">
      <TouchRing
        onRingTurn={onRingTurn}
        onBack={onMenuPress}
        onSelect={onSelectPress}
        onTouchScrollStart={handleTouchScrollStart}
        onTouchScrollEnd={handleTouchScrollEnd}
        isTabMode={isTabMode}
      />
      <ClickWheelControls
        onButtonPress={handleButtonPress}
        onButtonRelease={() => setActiveButton(null)}
        canGoBack={canGoBack}
        disabled={isTouchScrolling}
        onTabStart={onTabStart}
        isTabMode={isTabMode}
      />
    </div>
  );
};
