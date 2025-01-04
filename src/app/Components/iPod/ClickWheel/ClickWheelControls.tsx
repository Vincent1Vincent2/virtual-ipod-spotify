import { ClickWheelButton } from "./ClickWheelButton";

interface ClickWheelControlsProps {
  onButtonPress: (buttonId: string) => void;
  onButtonRelease: () => void;
  canGoBack: boolean;
  disabled?: boolean;
  onTabStart?: () => void;
  isTabMode?: boolean;
}

export const ClickWheelControls: React.FC<ClickWheelControlsProps> = ({
  onButtonPress,
  onButtonRelease,
  canGoBack,
  onTabStart,
  isTabMode,
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
          className={`click-wheel-button menu-button ${
            canGoBack ? "back-active" : ""
          }`}
          onPress={() => onButtonPress("menu")}
          onRelease={onButtonRelease}
          aria-label={canGoBack ? "Back to previous menu" : "Menu"}
          onTabStart={onTabStart}
        />
        <ClickWheelButton
          buttonId="back"
          className="click-wheel-button back-button"
          onPress={() => onButtonPress("back")}
          onRelease={onButtonRelease}
          aria-label="Previous item"
          onTabStart={onTabStart}
        />
        <ClickWheelButton
          buttonId="select"
          className="click-wheel-button select-button"
          onPress={() => onButtonPress("select")}
          onRelease={onButtonRelease}
          aria-label="Select current item"
          onTabStart={onTabStart}
        />
        <ClickWheelButton
          buttonId="forward"
          className="click-wheel-button forward-button"
          onPress={() => onButtonPress("forward")}
          onRelease={onButtonRelease}
          aria-label="Next item"
          onTabStart={onTabStart}
        />
      </div>
      <div role="toolbar" aria-label="Playback controls">
        <ClickWheelButton
          buttonId="play"
          className="click-wheel-button play-button"
          onPress={() => onButtonPress("play")}
          onRelease={onButtonRelease}
          aria-label="Play or pause"
          onTabStart={onTabStart}
        />
      </div>
    </nav>
  );
};
