export interface ClickWheelProps {
  onRingTurn: (direction: "clockwise" | "counterclockwise") => void;
  onMenuPress?: () => void;
  onSelectPress?: () => void;
  onBackPress?: () => void;
  onForwardPress?: () => void;
  onPlayPausePress?: () => void;
  onTabStart?: () => void;
  isTabMode?: boolean;
}

export interface ClickWheelButtonProps {
  buttonId: string;
  onPress: () => void;
  onRelease: () => void;
  style: React.CSSProperties;
}
