import React from "react";
import ClassicShell from "./shells/ClassicShell";

interface ShellSVGProps {
  type?: "classic" | "modern";
  children?: React.ReactNode;
}

const ShellSVG: React.FC<ShellSVGProps> = ({ type = "classic", children }) => {
  const isComponentOfType = (
    child: React.ReactNode,
    displayName: string
  ): boolean => {
    return (
      React.isValidElement(child) &&
      typeof child.type !== "string" &&
      "displayName" in child.type &&
      child.type.displayName === displayName
    );
  };

  const childrenArray = React.Children.toArray(children);
  const screenElement = childrenArray.find((child) =>
    isComponentOfType(child, "Screen")
  );
  const clickWheelElement = childrenArray.find((child) =>
    isComponentOfType(child, "ClickWheel")
  );

  return (
    <div className="relative ipod-shell-container">
      {/* Base Shell SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 320 500"
        fill="none"
        className="absolute top-0 left-0 ipod-shell-svg"
      >
        <ClassicShell />
        <defs>
          <linearGradient
            id="paint0_linear_13_68"
            x1="270"
            y1="313.5"
            x2="83.5"
            y2="447.5"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#CED5DF" />
            <stop offset="0.0844788" stopColor="#E1E1E1" />
            <stop offset="0.349197" stopColor="#CCCCCC" />
            <stop offset="0.982874" stopColor="#A8A8A8" />
          </linearGradient>
          <radialGradient
            id="paint1_radial_13_68"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(170 439) rotate(-90) scale(111.5)"
          >
            <stop stopColor="#FCFCFE" />
            <stop offset="0.372432" stopColor="#DCDCDD" />
            <stop offset="0.548973" stopColor="#B3B3B5" />
            <stop offset="1" stopColor="#979798" />
          </radialGradient>
        </defs>
      </svg>

      {/* Screen */}
      {screenElement}

      {/* Click Wheel */}
      {clickWheelElement}
    </div>
  );
};

export default ShellSVG;
