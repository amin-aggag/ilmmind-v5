import React from "react";

const DEFAULT_IMAGE_WIDTH_PX = 10;
// const MIN_IMAGE_WIDTH_PX = 0;
// const MAX_IMAGE_WIDTH_PX = 500;

type useImageAdjustWidthReturn = {
  isWidthResizing: boolean;
  width: number;
  handleWidthPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleWidthPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageAdjustWidth = (): useImageAdjustWidthReturn => {
  const [isWidthResizing, setIsWidthResizing] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(DEFAULT_IMAGE_WIDTH_PX);

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

      setWidth((prev) => prev + e.movementX);
    },
    [isWidthResizing],
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
    width,
    handleWidthPointerDown,
    handleWidthPointerMove,
    handleWidthPointerUp,
    handleWidthPointerCancel,
  };
};
