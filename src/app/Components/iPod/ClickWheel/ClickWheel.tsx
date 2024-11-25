import { ClickWheelProps } from "@/types/iPod/ClickWheel";
import React from "react";
import { ClickWheelControls } from "./ClickWheelControls";

export const ClickWheel: React.FC<ClickWheelProps> = ({
  onWheelTurn,
  onMenuPress,
  onSelectPress,
  onBackPress,
  onForwardPress,
  onPlayPausePress,
}) => {
  const [activeButton, setActiveButton] = React.useState<string | null>(null);

  const handleButtonPress = (buttonId: string) => {
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

  return (
    <div className="absolute" style={{ width: "200px", height: "200px" }}>
      <ClickWheelControls
        onButtonPress={handleButtonPress}
        onButtonRelease={() => setActiveButton(null)}
      />
    </div>
  );
};
