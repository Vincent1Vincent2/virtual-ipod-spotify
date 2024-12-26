import React from "react";

export interface ClickWheelButtonProps {
  buttonId: string;
  onPress: () => void;
  onRelease: () => void;
  className?: string;
  tabIndex?: number;
  "aria-label": string;
  onTabStart?: () => void;
  isTabMode?: boolean;
}

export const ClickWheelButton: React.FC<ClickWheelButtonProps> = ({
  buttonId,
  onPress,
  onRelease,
  className,
  tabIndex = 0,
  "aria-label": ariaLabel,
  onTabStart,
  isTabMode,
}) => {
  const handleFocus = (e: React.FocusEvent) => {
    // Only trigger tab start if focus was not from a mouse click
    if (e.target === e.currentTarget && (e as any).detail === 0) {
      onTabStart?.();
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (isTabMode) {
      switch (e.key) {
        case "Tab":
          e.preventDefault();
          break;
        case "Enter":
          // Do nothing or add specific tab mode handling
          break;
      }
    } else {
      // Existing non-tab mode behavior
      switch (e.key) {
        case "Enter":
        case " ":
          e.preventDefault();
          onPress();
          break;
      }
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (!isTabMode && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onRelease();
    }
  };

  const handleClick = () => {
    if (!isTabMode) {
      onPress();
    }
  };

  return (
    <button
      id={buttonId}
      className={className}
      tabIndex={tabIndex}
      aria-label={ariaLabel}
      onFocus={handleFocus}
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
      onClick={handleClick}
    />
  );
};
