"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

interface TouchRingProps {
  onRingTurn: (direction: "clockwise" | "counterclockwise") => void;
  onBack?: () => void;
  onSelect?: () => void;
  onTouchScrollStart?: () => void;
  onTouchScrollEnd?: () => void;
  isTabMode?: boolean;
}
const TouchRing: React.FC<TouchRingProps> = ({
  onRingTurn,
  onBack,
  onSelect,
  isTabMode,
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const lastAngleRef = useRef<number | null>(null);
  const cumulativeAngleRef = useRef(0);
  const isTouchDevice = useRef(false);
  const angleThreshold = 15;
  const [isCtrlPressed, setIsCtrlPressed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey) setIsCtrlPressed(true);

      if (isCtrlPressed) {
        switch (e.key) {
          case "ArrowUp":
            e.preventDefault();
            onRingTurn("counterclockwise");
            break;
          case "ArrowDown":
            e.preventDefault();
            onRingTurn("clockwise");
            break;
          case "Enter":
            e.preventDefault();
            break;
          case "Escape":
            e.preventDefault();
            onBack?.();
            break;
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!e.ctrlKey) setIsCtrlPressed(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [isTabMode, onRingTurn, onSelect, onBack]);

  const getAngle = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const center = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const clientY = "touches" in e ? e.touches[0].clientY : e.clientY;

    return Math.atan2(clientY - center.y, clientX - center.x) * (180 / Math.PI);
  }, []);

  const handleMove = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // Disable scrolling in tab mode
      if (isTabMode) return;

      if (!isScrolling) return;
      if (isTouchDevice.current && "touches" in e && e.touches.length > 1)
        return;

      const currentAngle = getAngle(e);
      if (lastAngleRef.current === null) {
        lastAngleRef.current = currentAngle;
        return;
      }

      let diff = currentAngle - lastAngleRef.current;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      cumulativeAngleRef.current += diff;

      if (Math.abs(cumulativeAngleRef.current) >= angleThreshold) {
        onRingTurn(
          cumulativeAngleRef.current < 0 ? "clockwise" : "counterclockwise"
        );
        cumulativeAngleRef.current =
          cumulativeAngleRef.current % angleThreshold;
      }

      lastAngleRef.current = currentAngle;
    },
    [isScrolling, isTabMode, getAngle, onRingTurn]
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      // For touch devices, check for swipe
      if ("touches" in e) {
        isTouchDevice.current = true;
        if (e.touches.length > 1) return;
      }

      // In tab mode or without Ctrl pressed in mouse mode
      if (isTabMode || !isCtrlPressed) {
        setIsScrolling(true);
        lastAngleRef.current = getAngle(e);
        cumulativeAngleRef.current = 0;
      }
    },
    [getAngle, isTabMode, isCtrlPressed]
  );

  const handleEnd = useCallback(() => {
    // Disable touch scrolling in tab mode
    if (isTabMode) return;

    setIsScrolling(false);
    lastAngleRef.current = null;
    cumulativeAngleRef.current = 0;
  }, [isTabMode]);

  return (
    <div
      className="touch-ring-area"
      role="slider"
      aria-label="iPod click wheel"
      onMouseDown={handleStart}
      onMouseMove={handleMove}
      onMouseUp={handleEnd}
      onMouseLeave={handleEnd}
      onTouchStart={handleStart}
      onTouchMove={handleMove}
      onTouchEnd={handleEnd}
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        borderRadius: "50%",
        // Disable interactions in tab mode
        cursor: isCtrlPressed ? "pointer" : "default",
        pointerEvents: isCtrlPressed ? "auto" : "none",
        zIndex: isCtrlPressed ? 1 : 0,
      }}
    />
  );
};

export default TouchRing;
