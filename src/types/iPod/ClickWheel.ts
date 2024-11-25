export interface ClickWheelProps {
  onWheelTurn?: (direction: "clockwise" | "counterclockwise") => void;
  onMenuPress?: () => void;
  onSelectPress?: () => void;
  onBackPress?: () => void;
  onForwardPress?: () => void;
  onPlayPausePress?: () => void;
}

export interface ClickWheelButtonProps {
  buttonId: string;
  onPress: () => void;
  onRelease: () => void;
  style: React.CSSProperties;
}
