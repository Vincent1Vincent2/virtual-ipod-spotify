import React from "react";
import { ShellGradients } from "../ShellGradients";

const ClassicShell: React.FC = () => (
  <>
    <g id="iPod">
      <g id="Shell">
        <g id="Shell_2">
          <rect className="classic-shell" />
          <rect className="classic-shell-border" />
        </g>
      </g>
      <ShellGradients />
    </g>
  </>
);

export default ClassicShell;
