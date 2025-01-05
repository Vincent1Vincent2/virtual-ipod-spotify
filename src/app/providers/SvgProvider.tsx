"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "./ThemeProvider";

interface Dimensions {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface SvgContextType {
  svgRef: React.RefObject<SVGSVGElement>;
  dimensions: Record<string, Dimensions>;
  isLoading: boolean;
  error: Error | null;
}

const SvgContext = createContext<SvgContextType>({
  svgRef: { current: null },
  dimensions: {},
  isLoading: true,
  error: null,
});

export function SvgProvider({ children }: { children: React.ReactNode }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState<Record<string, Dimensions>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { currentTheme, isLandscape } = useTheme();

  useEffect(() => {
    async function loadSvg() {
      try {
        setIsLoading(true);
        setError(null);

        const svgPath = isLandscape
          ? currentTheme.landscapeSvgPath
          : currentTheme.portraitSvgPath;
        const response = await fetch(svgPath);
        if (!response.ok)
          throw new Error(`Failed to load SVG: ${response.statusText}`);

        const svgText = await response.text();
        if (!svgRef.current) return;

        svgRef.current.innerHTML = svgText;

        // Wait for SVG to be rendered
        await new Promise(requestAnimationFrame);

        const svgBBox = svgRef.current.getBoundingClientRect();
        const viewBox = svgRef.current
          .getAttribute("viewBox")
          ?.split(" ")
          .map(Number) || [0, 0, 340, 550];
        const scale = Math.min(
          svgBBox.width / viewBox[2],
          svgBBox.height / viewBox[3]
        );

        const dimensionsMap: Record<string, Dimensions> = {};
        const elements = {
          iPod: svgRef.current.getElementById(
            isLandscape ? "iPod-landscape" : "iPod"
          ),
          Shell: svgRef.current.getElementById("Shell"),
          ScrollWheel: svgRef.current.getElementById("ScrollWheel"),
          TouchRing: svgRef.current.getElementById("TouchRing"),
          SelectButton: svgRef.current.getElementById("SelectButton"),
          MenuButton: svgRef.current.getElementById("MenuButton"),
          BackButton: svgRef.current.getElementById("BackButton"),
          SkipButton: svgRef.current.getElementById("SkipButton"),
          PlayPauseButton: svgRef.current.getElementById("PlayPauseButton"),
          Screen: svgRef.current.getElementById("Screen"),
          Display: svgRef.current.getElementById("Display"),
          Header: svgRef.current.getElementById("Header"),
        };

        Object.entries(elements).forEach(([key, element]) => {
          if (element instanceof SVGGraphicsElement) {
            const bbox = element.getBBox();
            const headerHeight =
              key === "Screen" ? dimensions.Header?.height || 0 : 0;
            dimensionsMap[key] = {
              width: bbox.width * scale,
              height: bbox.height * scale - headerHeight,
              x:
                bbox.x * scale +
                (key === "Display" || key === "Header" ? 5 : 0),
              y:
                bbox.y * scale +
                (key === "Display" ? 30 : key === "Header" ? 5 : 0),
            };
          }
        });

        setDimensions(dimensionsMap);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load SVG"));
      } finally {
        setIsLoading(false);
      }
    }

    loadSvg();
  }, [currentTheme, isLandscape]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (svgRef.current) {
        const svgBBox = svgRef.current.getBoundingClientRect();
        const viewBox = svgRef.current
          .getAttribute("viewBox")
          ?.split(" ")
          .map(Number) || [0, 0, 340, 550];
        const scale = Math.min(
          svgBBox.width / viewBox[2],
          svgBBox.height / viewBox[3]
        );

        const newDimensions: Record<string, Dimensions> = {};
        const elements = svgRef.current.querySelectorAll("g[id]");

        elements.forEach((element) => {
          if (element instanceof SVGGraphicsElement) {
            const bbox = element.getBBox();
            const id = element.id;

            newDimensions[id] = {
              width: bbox.width * scale,
              height: bbox.height * scale,
              x: bbox.x * scale + (id === "Display" || id === "Header" ? 5 : 0),
              y:
                bbox.y * scale +
                (id === "Display"
                  ? newDimensions.Header?.height || 30
                  : id === "Header"
                  ? 5
                  : 0),
            };
          }
        });
        console.log(newDimensions);

        setDimensions(newDimensions);
      }
    });

    if (svgRef.current) {
      resizeObserver.observe(svgRef.current);
    }

    return () => resizeObserver.disconnect();
  }, [isLandscape]);

  return (
    <SvgContext.Provider value={{ svgRef, dimensions, isLoading, error }}>
      {children}
    </SvgContext.Provider>
  );
}

export const useSvg = () => useContext(SvgContext);
