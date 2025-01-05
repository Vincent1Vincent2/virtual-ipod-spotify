import { ClickWheelButton } from "./ClickWheelButton";

interface ClickWheelControlsProps {
  onButtonPress: (buttonId: string) => void;
  onButtonRelease: () => void;
  canGoBack: boolean;
  disabled?: boolean;
  onTabStart?: () => void;
  isTabMode?: boolean;
  buttonStyles?: Record<string, React.CSSProperties>;
}

export const ClickWheelControls: React.FC<ClickWheelControlsProps> = ({
  onButtonPress,
  onButtonRelease,
  canGoBack,
  onTabStart,
  isTabMode,
  buttonStyles,
}) => {
  return (
    <nav
      className="click-wheel-controls"
      role="navigation"
      aria-label="iPod navigation controls"
    >
      <div role="toolbar" aria-label="Primary controls">
        <ClickWheelButton
          buttonId="menu"
          style={buttonStyles?.menu}
          className="click-wheel-button menu-button"
          onPress={() => onButtonPress("menu")}
          onRelease={onButtonRelease}
          aria-label={canGoBack ? "Back to previous menu" : "Menu"}
          onTabStart={onTabStart}
          isTabMode={isTabMode}
        />
        <ClickWheelButton
          buttonId="back"
          style={buttonStyles?.back}
          className="click-wheel-button back-button"
          onPress={() => onButtonPress("back")}
          onRelease={onButtonRelease}
          aria-label="Previous item"
          onTabStart={onTabStart}
          isTabMode={isTabMode}
        />
        <ClickWheelButton
          buttonId="select"
          style={buttonStyles?.select}
          className="click-wheel-button select-button"
          onPress={() => onButtonPress("select")}
          onRelease={onButtonRelease}
          aria-label="Select current item"
          onTabStart={onTabStart}
          isTabMode={isTabMode}
        />
        <ClickWheelButton
          buttonId="forward"
          style={buttonStyles?.forward}
          className="click-wheel-button forward-button"
          onPress={() => onButtonPress("forward")}
          onRelease={onButtonRelease}
          aria-label="Next item"
          onTabStart={onTabStart}
          isTabMode={isTabMode}
        />
      </div>
      <div role="toolbar" aria-label="Playback controls">
        <ClickWheelButton
          buttonId="play"
          style={buttonStyles?.play}
          className="click-wheel-button play-button"
          onPress={() => onButtonPress("play")}
          onRelease={onButtonRelease}
          aria-label="Play or pause"
          onTabStart={onTabStart}
          isTabMode={isTabMode}
        />
      </div>
    </nav>
  );
};
