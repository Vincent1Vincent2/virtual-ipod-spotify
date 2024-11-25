import { ClickWheelButton } from "./ClickWheelButton";

interface ClickWheelControlsProps {
  onButtonPress: (buttonId: string) => void;
  onButtonRelease: () => void;
}

export const ClickWheelControls: React.FC<ClickWheelControlsProps> = ({
  onButtonPress,
  onButtonRelease,
}) => {
  return (
    <div className="click-wheel-controls">
      <ClickWheelButton
        buttonId="menu"
        className="click-wheel-button menu-button"
        onPress={() => onButtonPress("menu")}
        onRelease={onButtonRelease}
      />

      <ClickWheelButton
        buttonId="back"
        className="click-wheel-button back-button"
        onPress={() => onButtonPress("back")}
        onRelease={onButtonRelease}
      />

      <ClickWheelButton
        buttonId="select"
        className="click-wheel-button select-button"
        onPress={() => onButtonPress("select")}
        onRelease={onButtonRelease}
      />

      <ClickWheelButton
        buttonId="forward"
        className="click-wheel-button forward-button"
        onPress={() => onButtonPress("forward")}
        onRelease={onButtonRelease}
      />

      <ClickWheelButton
        buttonId="play"
        className="click-wheel-button play-button"
        onPress={() => onButtonPress("play")}
        onRelease={onButtonRelease}
      />
    </div>
  );
};
