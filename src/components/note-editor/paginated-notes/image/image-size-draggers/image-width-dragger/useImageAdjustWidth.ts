import React from "react";
import { useImageContext } from "../../useImageContext";
import { ImageWidthSide } from "./ImageWidthDragger";
import { useCanvasContext } from "../../../state-management/useCanvasContext";

type useImageAdjustWidthReturn = {
  isWidthResizing: boolean;
  handleWidthPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageAdjustWidth = (
  side: ImageWidthSide,
): useImageAdjustWidthReturn => {
  const [isWidthResizing, setIsWidthResizing] = React.useState<boolean>(false);
  const { setWidth, setLeft } = useImageContext();

  const { state: CanvasState } = useCanvasContext();
  const zoomLevel: number = CanvasState.scalingValues.startScale;

  const handleWidthPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsWidthResizing(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handleWidthPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isWidthResizing) return;

      if (side === "left") {
        setLeft((prev) => prev + e.movementX / zoomLevel);
        setWidth((prev) => prev - e.movementX / zoomLevel);
      } else {
        setWidth((prev) => prev + e.movementX / zoomLevel);
      }
    },
    [isWidthResizing, setWidth, setLeft, side, zoomLevel],
  );

  const handleWidthPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsWidthResizing(false);
    },
    [],
  );

  const handleWidthPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setIsWidthResizing(false);
    },
    [],
  );

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.cursor = isWidthResizing ? "ew-resize" : "";
  }, [isWidthResizing]);

  return {
    isWidthResizing,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  };
};
