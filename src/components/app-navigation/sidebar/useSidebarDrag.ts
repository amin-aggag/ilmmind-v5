import React from "react";

const MIN_SIDEBAR_WIDTH_PX = 180;
const MAX_SIDEBAR_WIDTH_PX = 400;

export const useSidebarDrag = () => {
  const [isResizing, setIsResizing] = React.useState<boolean>(false);
  const [width, setWidth] = React.useState<number>(200);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      setIsResizing(true);
      e.currentTarget.setPointerCapture(e.pointerId);
    },
    [],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      if (
        e.clientX >= MIN_SIDEBAR_WIDTH_PX &&
        e.clientX <= MAX_SIDEBAR_WIDTH_PX
      ) {
        setWidth(e.clientX);
      }
    },
    [],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

      e.currentTarget.releasePointerCapture(e.pointerId);
      setIsResizing(false);
    },
    [],
  );

  const handlePointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();

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

    root.style.cursor = isResizing ? "col-resize" : "";
  }, [isResizing]);

  return {
    isResizing,
    width,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
};
