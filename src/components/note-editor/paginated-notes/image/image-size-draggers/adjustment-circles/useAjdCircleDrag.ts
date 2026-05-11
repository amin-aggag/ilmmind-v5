import React from "react";
import { useCanvasContext } from "../../../state-management/useCanvasContext";
import { useImageContext } from "../../useImageContext";
import { AdjCircleCorner } from "./AdjCircle";

type useAdjCircleBottomLeftReturn = {
  isResizing: boolean;
  handleAdjPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleAdjPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleAdjPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleAdjPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useAdjCircleDrag = (
  corner: AdjCircleCorner,
): useAdjCircleBottomLeftReturn => {
  const [isResizing, setIsResizing] = React.useState<boolean>(false);
  const { setHeight, setWidth, setTop, setLeft } = useImageContext();

  const { state: CanvasState } = useCanvasContext();
  const zoomLevel: number = CanvasState.scalingValues.startScale;

  const handleAdjPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsResizing(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handleAdjPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isResizing) return;

      switch (corner) {
        case "top-left":
          setLeft((prev) => prev + e.movementX / zoomLevel);
          setWidth((prev) => prev - e.movementX / zoomLevel);
          setTop((prev) => prev + e.movementY / zoomLevel);
          setHeight((prev) => prev - e.movementY / zoomLevel);
          break;
        case "top-right":
          setWidth((prev) => prev + e.movementX / zoomLevel);
          setTop((prev) => prev + e.movementY / zoomLevel);
          setHeight((prev) => prev - e.movementY / zoomLevel);
          break;
        case "bottom-left":
          setLeft((prev) => prev + e.movementX / zoomLevel);
          setWidth((prev) => prev - e.movementX / zoomLevel);
          setHeight((prev) => prev + e.movementY / zoomLevel);
          break;
        case "bottom-right":
          setWidth((prev) => prev + e.movementX / zoomLevel);
          setHeight((prev) => prev + e.movementY / zoomLevel);
          break;
      }
    },
    [zoomLevel, corner, setLeft, setWidth, isResizing, setTop, setHeight],
  );

  const handleAdjPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsResizing(false);
    },
    [],
  );

  const handleAdjPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setIsResizing(false);
    },
    [],
  );

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    switch (corner) {
      case "top-left":
        root.style.cursor = isResizing ? "nwse-resize" : "";
        break;
      case "top-right":
        root.style.cursor = isResizing ? "nesw-resize" : "";
        break;
      case "bottom-left":
        root.style.cursor = isResizing ? "nesw-resize" : "";
        break;
      case "bottom-right":
        root.style.cursor = isResizing ? "nwse-resize" : "";
        break;
    }
  }, [isResizing, corner]);

  return {
    isResizing,
    handleAdjPointerDown,
    handleAdjPointerMove,
    handleAdjPointerUp,
    handleAdjPointerCancel,
  };
};
