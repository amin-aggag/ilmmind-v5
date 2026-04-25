import React from "react";
import { useCanvasContext } from "../state-management/useCanvasContext";

type UseTextboxDragArgs = {
  pageIndex: number;
  textboxIndex: number;
};

export const useTextboxDrag = ({
  pageIndex,
  textboxIndex,
}: UseTextboxDragArgs) => {
  const { dispatch } = useCanvasContext();
  const [isDragging, setIsDragging] = React.useState(false);

  const endDrag = React.useCallback(() => {
    setIsDragging(false);
  }, [dispatch]);

  const handlePointerDown = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.currentTarget.setPointerCapture(e.pointerId);
      setIsDragging(true);
    },
    [dispatch],
  );

  const handlePointerMove = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (!isDragging) return;

      dispatch({
        type: "DRAG_TEXTBOX_MOUSE_MOVE",
        payload: {
          pageIndex,
          textboxIndex,
          delta: {
            x: e.movementX,
            y: e.movementY,
          },
        },
      });
    },
    [dispatch, isDragging, pageIndex, textboxIndex],
  );

  const handlePointerUp = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (isDragging) {
        endDrag();
      }
    },
    [endDrag, isDragging],
  );

  const handlePointerCancel = React.useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if (e.currentTarget.hasPointerCapture(e.pointerId)) {
        e.currentTarget.releasePointerCapture(e.pointerId);
      }

      if (isDragging) {
        endDrag();
      }
    },
    [endDrag, isDragging],
  );

  React.useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    root.style.cursor = isDragging ? "move" : "";
    return () => {
      root.style.cursor = "";
    };
  }, [isDragging]);

  return {
    isDragging,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePointerCancel,
  };
};
