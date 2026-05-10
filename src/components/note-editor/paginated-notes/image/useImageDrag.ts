import React from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";
import { ImageContextValue } from "./useImageContext";

type useImageDragReturn = {
  handleImageDragPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleImageDragPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageDrag = (imageContextValue: ImageContextValue): useImageDragReturn => {
  const [isMoving, setIsMoving] = React.useState<boolean>(false);

  const { state: CanvasState } = useCanvasContext();
  const zoomLevel: number = CanvasState.scalingValues.startScale;
  const { setTop, setLeft} = imageContextValue;

  const handleImageDragPointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      setIsMoving(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handleImageDragPointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!isMoving) return;

    setLeft((prev) => prev + e.movementX / zoomLevel);
    setTop((prev) => prev + e.movementY / zoomLevel);
    },
    [isMoving,setLeft, setTop, zoomLevel],
  );

  const handleImageDragPointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsMoving(false);
    },
    [],
  );

  const handleImageDragPointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      setIsMoving(false);
    },
    [],
  );

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.cursor = isMoving ? "move" : "";
  }, [isMoving]);

  return {
    handleImageDragPointerDown,
    handleImageDragPointerMove,
    handleImageDragPointerUp,
    handleImageDragPointerCancel,
  };
};
