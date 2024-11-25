interface ClickWheelButtonProps {
  buttonId: string;
  onPress: () => void;
  onRelease: () => void;
  className?: string;
}

export const ClickWheelButton: React.FC<ClickWheelButtonProps> = ({
  buttonId,
  onPress,
  onRelease,
  className,
}) => {
  return (
    <button
      className={`click-wheel-button ${className}`}
      onMouseDown={onPress}
      onMouseUp={onRelease}
      onMouseLeave={onRelease}
      onTouchStart={onPress}
      onTouchEnd={onRelease}
      aria-label={buttonId}
    />
  );
};
