import React from "react";
import { useImageContext } from "../../useImageContext";
import { ImageWidthSide } from "./ImageWidthDragger";

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

      //   const positionInSVGCoords = clientToSvgUserPoint(e.currentTarget, e.clientX, e.clientY);

      if (side === "left") {
        setLeft((prev) => prev + e.movementX);
        setWidth((prev) => prev - e.movementX);
      } else {
        setWidth((prev) => prev + e.movementX);
      }
    },
    [isWidthResizing, setWidth, setLeft, side],
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

    root.style.cursor = isWidthResizing ? "col-resize" : "";
  }, [isWidthResizing]);

  return {
    isWidthResizing,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  };
};
