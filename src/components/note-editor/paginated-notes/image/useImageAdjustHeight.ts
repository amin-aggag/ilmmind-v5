import React from "react";

const DEFAULT_IMAGE_WIDTH_PX = 10;
// const MIN_IMAGE_WIDTH_PX = 0;
// const MAX_IMAGE_WIDTH_PX = 500;

type useImageAdjustHeightReturn = {
  isHeightResizing: boolean;
  height: number;
  handleHeightPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageAdjustHeight = (): useImageAdjustHeightReturn => {
  const [isHeightResizing, setIsHeightResizing] =
    React.useState<boolean>(false);
  const [height, setHeight] = React.useState<number>(DEFAULT_IMAGE_WIDTH_PX);

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

      setHeight((prev) => prev + e.movementY);
    },
    [isHeightResizing],
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

    root.style.cursor = isHeightResizing ? "col-resize" : "";
  }, [isHeightResizing]);

  return {
    isHeightResizing,
    height,
    handleHeightPointerDown,
    handleHeightPointerMove,
    handleHeightPointerUp,
    handleHeightPointerCancel,
  };
};
