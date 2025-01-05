"use client";
import { usePlayer } from "@/app/providers/PlayerProvider";
import { useEffect, useState } from "react";
import "./Scrubber.css";

const Scrubber = () => {
  const { controller, isPlaying } = usePlayer();
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    let intervalId: string | number | NodeJS.Timeout | undefined;

    if (isPlaying) {
      intervalId = setInterval(async () => {
        const state = await controller?.getCurrentState();
        if (state) {
          setProgress(state.progress_ms);
          setDuration(state.item.duration_ms);
        }
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, controller]);

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const progressPercent = (progress / duration) * 100;

  return (
    <div className="scrubber">
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
      <div className="time-display">
        <span>{formatTime(progress)}</span>
        <span>-{formatTime(duration - progress)}</span>
      </div>
    </div>
  );
};

export default Scrubber;
