import { ClickWheelProps } from "@/types/iPod/ClickWheel";
import React from "react";
import { ClickWheelControls } from "./ClickWheelControls";
import TouchRing from "./TouchRing";

export const ClickWheel: React.FC<
  ClickWheelProps & { canGoBack?: boolean }
> = ({
  onRingTurn,
  onMenuPress,
  onSelectPress,
  onBackPress,
  onForwardPress,
  onPlayPausePress,
  canGoBack = false,
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
    <div>
      <TouchRing onRingTurn={onRingTurn} />
      <ClickWheelControls
        onButtonPress={handleButtonPress}
        onButtonRelease={() => setActiveButton(null)}
        canGoBack={canGoBack}
      />
    </div>
  );
};
