"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useTheme } from "../hooks/useTheme";

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
  const { currentTheme } = useTheme();

  useEffect(() => {
    async function loadSvg() {
      try {
        setIsLoading(true);
        setError(null);

        const response = await fetch(currentTheme.svgPath);
        if (!response.ok) {
          throw new Error(`Failed to load SVG: ${response.statusText}`);
        }

        const svgText = await response.text();
        if (!svgRef.current) return;

        svgRef.current.innerHTML = svgText;
        await new Promise(requestAnimationFrame);

        const dimensionsMap: Record<string, Dimensions> = {};
        const elements = {
          iPod: svgRef.current.getElementById("iPod"),
          Shell: svgRef.current.getElementById("Shell"),
          ScrollWheel: svgRef.current.getElementById("ScrollWheel"),
          Screen: svgRef.current.getElementById("Screen"),
          Display: svgRef.current.getElementById("Display"),
          Header: svgRef.current.getElementById("Header"),
          Bezle: svgRef.current.getElementById("Bezle"),
        };

        Object.entries(elements).forEach(([key, element]) => {
          if (element instanceof SVGGraphicsElement) {
            const bbox = element.getBBox();
            dimensionsMap[key] = {
              width: bbox.width,
              height: bbox.height,
              x: bbox.x + (key === "Display" || key === "Header" ? 5 : 0),
              y: bbox.y + (key === "Display" ? 30 : key === "Header" ? 5 : 0),
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
  }, [currentTheme.svgPath]);

  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const elements = svgRef.current.querySelectorAll("g[id]");
        const newDimensions: Record<string, Dimensions> = {};

        elements.forEach((element) => {
          if (element instanceof SVGGraphicsElement) {
            const bbox = element.getBBox();
            newDimensions[element.id] = {
              width: bbox.width,
              height: bbox.height,
              x: bbox.x,
              y: bbox.y,
            };
          }
        });

        setDimensions(newDimensions);
      }
    };

    const debouncedResize = debounce(handleResize, 250);
    window.addEventListener("resize", debouncedResize);
    return () => window.removeEventListener("resize", debouncedResize);
  }, []);

  return (
    <SvgContext.Provider value={{ svgRef, dimensions, isLoading, error }}>
      {children}
    </SvgContext.Provider>
  );
}

export const useSvg = () => useContext(SvgContext);

function debounce(func: Function, wait: number) {
  let timeout: NodeJS.Timeout;
  return function executedFunction(...args: any[]) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
