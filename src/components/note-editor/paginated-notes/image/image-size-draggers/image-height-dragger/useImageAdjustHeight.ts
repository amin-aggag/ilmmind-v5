import React from "react";
import { useImageContext } from "../../useImageContext";
import { ImageHeightSide } from "./ImageHeightDragger";
import { useCanvasContext } from "../../../state-management/useCanvasContext";

type useImageAdjustHeightReturn = {
  isHeightResizing: boolean;
  handleHeightPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageAdjustHeight = (
  side: ImageHeightSide,
): useImageAdjustHeightReturn => {
  const [isHeightResizing, setIsHeightResizing] =
    React.useState<boolean>(false);
  const { setHeight, setTop } = useImageContext();

  const { state: CanvasState } = useCanvasContext();
  const zoomLevel: number = CanvasState.scalingValues.startScale;

  const handleHeightPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsHeightResizing(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handleHeightPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isHeightResizing) return;

      if (side === "top") {
        setTop((prev) => prev + e.movementY / zoomLevel);
        setHeight((prev) => prev - e.movementY / zoomLevel);
      } else {
        setHeight((prev) => prev + e.movementY / zoomLevel);
      }
    },
    [isHeightResizing, setHeight, setTop, side, zoomLevel],
  );

  const handleHeightPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsHeightResizing(false);
    },
    [],
  );

  const handleHeightPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setIsHeightResizing(false);
    },
    [],
  );

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.cursor = isHeightResizing ? "row-resize" : "";
  }, [isHeightResizing]);

  return {
    isHeightResizing,
    handleHeightPointerDown,
    handleHeightPointerMove,
    handleHeightPointerUp,
    handleHeightPointerCancel,
  };
};
