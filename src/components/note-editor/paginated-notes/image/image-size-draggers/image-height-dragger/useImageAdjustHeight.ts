import React from "react";
import { useImageContext } from "../../useImageContext";

type useImageAdjustHeightReturn = {
  isHeightResizing: boolean;
  handleHeightPointerDown: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerMove: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerUp: (e: React.PointerEvent<HTMLDivElement>) => void;
  handleHeightPointerCancel: (e: React.PointerEvent<HTMLDivElement>) => void;
};

export const useImageAdjustHeight = (): useImageAdjustHeightReturn => {
  const [isHeightResizing, setIsHeightResizing] =
    React.useState<boolean>(false);
  const { setHeight } = useImageContext();

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
    [isHeightResizing, setHeight],
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
