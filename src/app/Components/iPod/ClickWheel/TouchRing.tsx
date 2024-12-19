"use client";
import { useCallback, useRef, useState } from "react";

interface TouchRingProps {
  onRingTurn: (direction: "clockwise" | "counterclockwise") => void;
}

const TouchRing: React.FC<TouchRingProps> = ({ onRingTurn }) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const lastAngleRef = useRef<number | null>(null);
  const cumulativeAngleRef = useRef(0);
  const angleThreshold = 15;

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
      if (!isScrolling) return;

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
        if (cumulativeAngleRef.current < 0) {
          onRingTurn("clockwise");
        } else {
          onRingTurn("counterclockwise");
        }
        cumulativeAngleRef.current =
          cumulativeAngleRef.current % angleThreshold;
      }

      lastAngleRef.current = currentAngle;
    },
    [isScrolling, getAngle, onRingTurn]
  );

  const handleStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent) => {
      setIsScrolling(true);
      lastAngleRef.current = getAngle(e);
      cumulativeAngleRef.current = 0;
    },
    [getAngle]
  );

  const handleEnd = useCallback(() => {
    setIsScrolling(false);
    lastAngleRef.current = null;
    cumulativeAngleRef.current = 0;
  }, []);

  return (
    <div
      className="Ring-ring-area"
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
        cursor: "pointer",
        zIndex: 1,
      }}
    />
  );
};

export default TouchRing;
