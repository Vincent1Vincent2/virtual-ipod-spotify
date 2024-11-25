/* {import { ShellProps } from "@/types/iPod/Shell";
import React from "react";
import { ClickWheel } from "../ClickWheel/ClickWheel";
import { Screen } from "../Screen/Screen";
import ClassicShell from "./shells/ClassicShell";

const Shell: React.FC<ShellProps> = ({
  children,
  theme = "classic",
  className = "",
}) => {
  // Validate children to ensure we have Screen and ClickWheel
  const childrenArray = React.Children.toArray(children);

  // Type guard function to check if element is a specific component
  const isComponentType = (
    child: React.ReactNode,
    componentType: React.ComponentType
  ): child is React.ReactElement => {
    return React.isValidElement(child) && child.type === componentType;
  };

  // Find Screen and ClickWheel components
  const screenComponent = childrenArray.find((child) =>
    isComponentType(child, Screen)
  );
  const clickWheelComponent = childrenArray.find((child) =>
    isComponentType(child, ClickWheel)
  );

  if (!screenComponent || !clickWheelComponent) {
    console.warn(
      "Shell requires both Screen and ClickWheel components as children"
    );
    return null;
  }

  return (
    <div className="relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="340"
        height="550"
        viewBox="0 0 340 550"
        fill="none"
        className="absolute top-0 left-0"
      >
        <ClassicShell />
      </svg>




 */
